import Foundation

enum APIError: Error {
    case httpError(Int)
    case decodingError(Error)
    case unknown(Error)
}
