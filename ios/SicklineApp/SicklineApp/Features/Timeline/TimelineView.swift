import Charts
import SwiftUI

// MARK: - Outer shell (lazy VM creation, same pattern as DailyCheckView)

struct TimelineView: View {
    @Environment(\.apiClient) private var apiClient
    @State private var viewModel: TimelineViewModel?

    var body: some View {
        Group {
            if let vm = viewModel {
                TimelineContent(vm: vm)
            } else {
                ProgressView()
            }
        }
        .task {
            let vm = TimelineViewModel(apiClient: apiClient)
            viewModel = vm
        }
    }
}

// MARK: - Content

private struct TimelineContent: View {
    @Bindable var vm: TimelineViewModel
    var body: some View {
        NavigationStack {
            ZStack {
                chartArea
                if vm.isLoading {
                    loadingOverlay
                }
            }
            .navigationTitle("Timeline")
            .toolbar { toolbarItems }
            .sheet(item: $vm.selectedPeriod) { period in
                PeriodDetailSheet(period: period, vm: vm)
            }
            .alert("Error", isPresented: Binding(
                get: { vm.errorMessage != nil },
                set: { if !$0 { vm.errorMessage = nil } }
            )) {
                Button("OK") { vm.errorMessage = nil }
            } message: {
                Text(vm.errorMessage ?? "")
            }
        }
        .task(id: vm.dayRange) {
            await vm.load()
        }
    }

    // MARK: - Chart area

    @ViewBuilder
    private var chartArea: some View {
        if vm.members.isEmpty {
            // Don't render the chart until members have loaded — an empty chart with
            // chartScrollPosition can cause Metal rendering errors in the simulator.
            Color.clear
        } else if !vm.isLoading && vm.periods.isEmpty {
            ContentUnavailableView(
                "No sick periods",
                systemImage: "checkmark.seal",
                description: Text("No illness recorded in the last \(vm.dayRange) days.")
            )
        } else {
            // No outer ScrollView — chartScrollableAxes handles horizontal scrolling natively.
            ganttChart
                .padding()
                // Force chart recreation on range change so chartScrollPosition(initialX:) re-applies.
                .id(vm.dayRange)
        }
    }

    private var ganttChart: some View {
        let today = Date()
        let rangeStart = Calendar.current.date(byAdding: .day, value: -(vm.dayRange - 1), to: today) ?? today
        // Show 14 days at a time; chartScrollableAxes lets the user pan through the full range.
        let visibleSeconds: TimeInterval = 60 * 60 * 24 * 14

        return Chart {
            // Anchor every member on the y-axis so all rows show even if they have no sick periods.
            ForEach(vm.members) { member in
                RuleMark(y: .value("Member", member.name))
                    .opacity(0)
            }

            ForEach(vm.periods) { period in
                let memberName = vm.memberName(for: period.memberId)
                // Skip periods whose startDate can't be parsed — rendering them at a
                // fallback date would silently corrupt the chart.
                if let start = period.startDate.iso8601Date {
                    let end = period.endDate?.iso8601Date ?? today

                    // Use severity sub-periods for color-coded segments when present.
                    if period.severityPeriods.isEmpty {
                        BarMark(
                            xStart: .value("Start", start),
                            xEnd: .value("End", end),
                            y: .value("Member", memberName)
                        )
                        .foregroundStyle(statusColor(period.status))
                        .cornerRadius(4)
                    } else {
                        ForEach(period.severityPeriods, id: \.startDate) { sub in
                            if let subStart = sub.startDate.iso8601Date,
                               let subEnd = sub.endDate.iso8601Date {
                                BarMark(
                                    xStart: .value("Start", subStart),
                                    xEnd: .value("End", subEnd),
                                    y: .value("Member", memberName)
                                )
                                .foregroundStyle(statusColor(sub.status))
                                .cornerRadius(4)
                            }
                        }
                    }
                }
            }
        }
        .chartXScale(domain: rangeStart...today)
        .chartScrollableAxes(.horizontal)
        .chartXVisibleDomain(length: visibleSeconds)
        // One-shot initial position: start the view showing the most recent 14 days.
        // Using initialX avoids the live-binding conflict that caused Metal rendering errors.
        .chartScrollPosition(initialX: today.addingTimeInterval(-visibleSeconds))
        .chartXAxis {
            AxisMarks(values: .stride(by: .day, count: 2)) { value in
                AxisGridLine()
                AxisTick()
                AxisValueLabel(format: .dateTime.day().month(.abbreviated))
            }
        }
        .chartYAxis {
            AxisMarks { value in
                AxisGridLine()
                AxisValueLabel {
                    if let name = value.as(String.self) {
                        let color = vm.members
                            .first(where: { $0.name == name })
                            .flatMap { $0.color }
                            .map { Color(hex: $0) } ?? Color.primary
                        Text(name)
                            .foregroundStyle(color)
                            .fontWeight(.semibold)
                    }
                }
            }
        }
        .chartOverlay { proxy in
            GeometryReader { geo in
                Color.clear
                    .contentShape(Rectangle())
                    // simultaneousGesture lets the chart's internal scroll gesture coexist
                    // with our tap detection; onTapGesture would block the pan gesture.
                    .simultaneousGesture(
                        DragGesture(minimumDistance: 0)
                            .onEnded { value in
                                handleChartTap(at: value.location, proxy: proxy, geo: geo)
                            }
                    )
            }
        }
        .frame(height: max(80, CGFloat(vm.members.count) * 60))
    }

    // MARK: - Tap detection

    private func handleChartTap(at location: CGPoint, proxy: ChartProxy, geo: GeometryProxy) {
        let origin = geo[proxy.plotFrame!].origin
        let relativeLocation = CGPoint(
            x: location.x - origin.x,
            y: location.y - origin.y
        )

        guard
            let tappedDate: Date = proxy.value(atX: relativeLocation.x),
            let tappedName: String = proxy.value(atY: relativeLocation.y)
        else { return }

        let today = Date()
        let tapped = vm.periods.first { period in
            guard vm.memberName(for: period.memberId) == tappedName,
                  let start = period.startDate.iso8601Date else { return false }
            let end = period.endDate?.iso8601Date ?? today
            return tappedDate >= start && tappedDate <= end
        }
        vm.selectedPeriod = tapped
    }

    // MARK: - Loading overlay

    private var loadingOverlay: some View {
        ZStack {
            Color(.systemBackground).opacity(0.6)
            ProgressView()
        }
        .ignoresSafeArea()
    }

    // MARK: - Toolbar

    @ToolbarContentBuilder
    private var toolbarItems: some ToolbarContent {
        ToolbarItem(placement: .navigationBarTrailing) {
            Picker("Range", selection: $vm.dayRange) {
                Text("30d").tag(30)
                Text("60d").tag(60)
                Text("90d").tag(90)
            }
            .pickerStyle(.segmented)
            .fixedSize()
        }
    }

    // MARK: - Helpers

    private func statusColor(_ status: HealthStatus) -> Color {
        switch status {
        case .green:  .green
        case .yellow: .yellow
        case .red:    .red
        }
    }
}

// MARK: - Period Detail Sheet

private struct PeriodDetailSheet: View {
    let period: SickPeriod
    let vm: TimelineViewModel

    @Environment(\.dismiss) private var dismiss

    private var memberColor: Color {
        vm.color(for: period.memberId).map { Color(hex: $0) } ?? .primary
    }

    private var dateRangeText: String {
        let start = period.startDate.iso8601Date.map { formatted($0) } ?? period.startDate
        if let end = period.endDate, let endDate = end.iso8601Date {
            return "\(start) – \(formatted(endDate))"
        }
        return "\(start) – ongoing"
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    LabeledContent("Member") {
                        Text(vm.memberName(for: period.memberId))
                            .foregroundStyle(memberColor)
                            .fontWeight(.semibold)
                    }
                    LabeledContent("Period", value: dateRangeText)
                    LabeledContent("Status", value: period.status.rawValue.capitalized)
                    if let title = period.title, !title.isEmpty {
                        LabeledContent("Title", value: title)
                    }
                }

                if !period.comments.isEmpty {
                    Section("Comments") {
                        ForEach(period.comments, id: \.date) { entry in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(entry.date.iso8601Date.map { formatted($0) } ?? entry.date)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                Text(entry.comment)
                                    .font(.body)
                            }
                            .padding(.vertical, 2)
                        }
                    }
                }
            }
            .navigationTitle("Sick Period")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private func formatted(_ date: Date) -> String {
        date.formatted(.dateTime.day().month(.abbreviated).year())
    }
}
