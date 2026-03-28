import Foundation

struct StatusResponse: Codable {
    let date: String
    let entries: [StatusEntry]
}
