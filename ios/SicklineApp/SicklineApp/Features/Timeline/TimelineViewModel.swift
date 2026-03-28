import Foundation
import Observation

@Observable
final class TimelineViewModel {
    var members: [Member] = []
    var periods: [SickPeriod] = []
    var dayRange: Int = 30
    var isLoading = false
    var errorMessage: String?
    var selectedPeriod: SickPeriod?

    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    // MARK: - Public

    /// Color for a given member id — falls back to .primary if member not found or has no color.
    func color(for memberId: String) -> String? {
        members.first(where: { $0.id == memberId })?.color
    }

    func memberName(for memberId: String) -> String {
        members.first(where: { $0.id == memberId })?.name ?? memberId
    }

    func load() async {
        guard !isLoading else { return }
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            if members.isEmpty {
                members = try await apiClient.get("/api/members")
            }
            let today = Date()
            let from = Calendar.current.date(byAdding: .day, value: -(dayRange - 1), to: today) ?? today
            let path = "/api/sick-periods?from=\(from.apiDateString)&to=\(today.apiDateString)"
            let response: SickPeriodsResponse = try await apiClient.get(path)
            periods = response.periods
        } catch {
            errorMessage = errorDescription(error)
        }
    }

    // MARK: - Private

    private func errorDescription(_ error: Error) -> String {
        switch error as? APIError {
        case .httpError(let code): return "Server error \(code)"
        case .decodingError(let e): return "Unexpected response: \(e.localizedDescription)"
        case .unknown(let e): return e.localizedDescription
        case nil: return error.localizedDescription
        }
    }
}

// MARK: - Response shape

struct SickPeriodsResponse: Decodable {
    let periods: [SickPeriod]
}
