import Foundation

struct StatusEntry: Codable, Identifiable {
    let id: String
    let memberId: String
    let status: HealthStatus
    let title: String?
    let comment: String?
}
