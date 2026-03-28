import SwiftUI

struct DailyCheckView: View {
    @Environment(\.apiClient) private var apiClient
    @State private var viewModel: DailyCheckViewModel?

    var body: some View {
        Group {
            if let vm = viewModel {
                DailyCheckContent(vm: vm)
            } else {
                ProgressView()
            }
        }
        .task {
            // Create VM here so DailyCheckContent's .task(id: selectedDate) handles the actual load.
            // Attaching to the outer Group keeps this task alive when the inner branch switches,
            // avoiding a URLError.cancelled from the ProgressView being removed mid-flight.
            let vm = DailyCheckViewModel(apiClient: apiClient)
            viewModel = vm
        }
    }
}

// MARK: - Content view (owns the ViewModel)

private struct DailyCheckContent: View {
    @Bindable var vm: DailyCheckViewModel

    var body: some View {
        NavigationStack {
            ZStack {
                form
                if vm.isLoading {
                    loadingOverlay
                }
            }
            .navigationTitle(vm.navigationTitle)
            .toolbar { toolbarItems }
            .alert("Error", isPresented: Binding(
                get: { vm.errorMessage != nil },
                set: { if !$0 { vm.errorMessage = nil } }
            )) {
                Button("OK") { vm.errorMessage = nil }
            } message: {
                Text(vm.errorMessage ?? "")
            }
        }
        .task(id: vm.selectedDate) {
            await vm.load()
        }
    }

    // MARK: - Form

    private var form: some View {
        Form {
            ForEach(vm.members) { member in
                MemberSection(member: member, entry: entryBinding(for: member.id))
            }
        }
    }

    private func entryBinding(for memberId: String) -> Binding<DailyCheckViewModel.MemberEntry> {
        Binding(
            get: { vm.entries[memberId] ?? .init() },
            set: { vm.entries[memberId] = $0 }
        )
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
        ToolbarItem(placement: .navigationBarLeading) {
            dateNavigation
        }
        ToolbarItem(placement: .navigationBarTrailing) {
            saveButton
        }
    }

    private var dateNavigation: some View {
        HStack(spacing: 4) {
            Button {
                vm.stepDate(by: -1)
            } label: {
                Image(systemName: "chevron.left")
            }
            Button {
                vm.stepDate(by: 1)
            } label: {
                Image(systemName: "chevron.right")
            }
            .disabled(Calendar.current.isDateInToday(vm.selectedDate))
        }
    }

    private var saveButton: some View {
        Button {
            Task { await vm.saveAll() }
        } label: {
            if vm.isSaving {
                ProgressView()
                    .controlSize(.small)
            } else {
                Text("Save")
                    .bold()
            }
        }
        .disabled(vm.isSaving || vm.isLoading || vm.members.isEmpty)
    }
}

// MARK: - Member Section

private struct MemberSection: View {
    let member: Member
    @Binding var entry: DailyCheckViewModel.MemberEntry

    private var memberColor: Color {
        member.color.map { Color(hex: $0) } ?? .primary
    }

    var body: some View {
        Section {
            statusPicker
            TextField("Title (optional)", text: $entry.title)
            commentEditor
        } header: {
            Text(member.name)
                .foregroundStyle(memberColor)
                .fontWeight(.semibold)
        }
    }

    // MARK: - Status picker

    private var statusPicker: some View {
        HStack(spacing: 0) {
            ForEach(HealthStatus.allCases, id: \.self) { status in
                statusButton(status)
            }
        }
        .listRowInsets(.init(top: 8, leading: 0, bottom: 8, trailing: 0))
        .listRowBackground(Color.clear)
    }

    private func statusButton(_ status: HealthStatus) -> some View {
        let isSelected = entry.status == status
        return Button {
            entry.status = status
        } label: {
            VStack(spacing: 6) {
                Image(systemName: isSelected ? "circle.fill" : "circle")
                    .font(.system(size: 32))
                    .foregroundStyle(color(for: status))
                Text(status.rawValue.capitalized)
                    .font(.caption)
                    .foregroundStyle(isSelected ? color(for: status) : .secondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(isSelected ? color(for: status).opacity(0.12) : Color.clear)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .strokeBorder(isSelected ? color(for: status) : Color.clear, lineWidth: 1.5)
            )
        }
        .buttonStyle(.plain)
        .padding(.horizontal, 4)
    }

    // MARK: - Comment editor

    private var commentEditor: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Comment")
                .font(.caption)
                .foregroundStyle(.secondary)
            TextEditor(text: $entry.comment)
                .frame(minHeight: 60)
        }
    }

    // MARK: - Helpers

    private func color(for status: HealthStatus) -> Color {
        switch status {
        case .green:  .green
        case .yellow: .yellow
        case .red:    .red
        }
    }
}
