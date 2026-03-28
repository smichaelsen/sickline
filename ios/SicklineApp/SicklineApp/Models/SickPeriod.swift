import Foundation

struct SeverityPeriod: Codable {
    let startDate: String
    let endDate: String
    let status: HealthStatus
}

struct PeriodComment: Codable {
    let date: String
    let comment: String
}

struct SickPeriod: Codable, Identifiable {
    let memberId: String
    let startDate: String
    let endDate: String?
    let status: HealthStatus
    let title: String?
    let severityPeriods: [SeverityPeriod]
    let comments: [PeriodComment]

    // Stable identity: no server-provided id, so derive one from member + start date.
    var id: String { "\(memberId)-\(startDate)" }
}
