import Foundation

struct Member: Codable, Identifiable {
    let id: String
    let name: String
    let color: String?
}
