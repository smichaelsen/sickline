import Foundation
import Observation

@Observable
final class DailyCheckViewModel {
    struct MemberEntry {
        var status: HealthStatus = .green
        var title: String = ""
        var comment: String = ""
    }

    private(set) var members: [Member] = []
    var entries: [String: MemberEntry] = [:]  // keyed by memberId
    var selectedDate: Date = Calendar.current.startOfDay(for: .now)
    var isLoading = false
    var isSaving = false
    var errorMessage: String?

    private let apiClient: APIClient
    private var prefillLoadedForDate: Date?

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    // MARK: - Public

    var navigationTitle: String {
        selectedDate.relativeDisplayString
    }

    func stepDate(by days: Int) {
        selectedDate = Calendar.current.date(byAdding: .day, value: days, to: selectedDate) ?? selectedDate
    }

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let fetched: [Member] = try await apiClient.get("/api/members")
            members = fetched
            // Ensure every member has an entry slot (preserves existing user input)
            for member in members where entries[member.id] == nil {
                entries[member.id] = MemberEntry()
            }
            // Prefill status + title from the day before selectedDate; comments always empty.
            // Skip if we already prefilled for this date — avoids overwriting unsaved user input
            // when the view reloads without the date changing.
            if prefillLoadedForDate != selectedDate {
                let prefillDate = Calendar.current.date(byAdding: .day, value: -1, to: selectedDate) ?? selectedDate
                let response: StatusResponse = try await apiClient.get("/api/status?date=\(prefillDate.apiDateString)")
                for entry in response.entries {
                    var slot = entries[entry.memberId] ?? MemberEntry()
                    slot.status = entry.status
                    slot.title = entry.title ?? ""
                    slot.comment = ""   // always start empty per spec
                    entries[entry.memberId] = slot
                }
                prefillLoadedForDate = selectedDate
            }
        } catch is CancellationError {
            // Task was cancelled by SwiftUI when the date changed — discard silently.
        } catch {
            errorMessage = errorDescription(error)
        }
    }

    func saveAll() async {
        isSaving = true
        errorMessage = nil
        defer { isSaving = false }

        let payload = StatusPayload(
            date: selectedDate.apiDateString,
            entries: members.map { member in
                let slot = entries[member.id] ?? MemberEntry()
                return StatusPayload.Entry(
                    memberId: member.id,
                    status: slot.status,
                    title: slot.title.isEmpty ? nil : slot.title,
                    comment: slot.comment.isEmpty ? nil : slot.comment
                )
            }
        )

        do {
            let _: SaveResponse = try await apiClient.put("/api/status", body: payload)
        } catch {
            errorMessage = errorDescription(error)
        }
    }

    // MARK: - Private

    private func errorDescription(_ error: Error) -> String {
        switch error as? APIError {
        case .httpError(let code): return "Server error \(code)"
        case .decodingError: return "Unexpected response from server"
        case .unknown(let underlying): return underlying.localizedDescription
        case nil: return error.localizedDescription
        }
    }
}

// MARK: - Request / response shapes

private struct StatusPayload: Encodable {
    struct Entry: Encodable {
        let memberId: String
        let status: HealthStatus
        let title: String?
        let comment: String?
    }
    let date: String
    let entries: [Entry]
}

private struct SaveResponse: Decodable {
    let updated: Int
}
