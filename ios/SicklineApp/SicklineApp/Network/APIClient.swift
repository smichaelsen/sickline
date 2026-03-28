import Foundation

actor APIClient {
    private let baseURL: String
    private let authHeader: String
    private let session: URLSession
    private let decoder: JSONDecoder

    init(baseURL: String, authHeader: String, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.authHeader = authHeader
        self.session = session
        // API already returns camelCase keys (memberId, startDate, etc.) — no
        // convertFromSnakeCase strategy needed; plain JSONDecoder matches Swift properties directly.
        self.decoder = JSONDecoder()
    }

    func get<T: Decodable>(_ path: String) async throws -> T {
        let request = makeRequest(path: path, method: "GET")
        return try await perform(request)
    }

    func put<Body: Encodable, T: Decodable>(_ path: String, body: Body) async throws -> T {
        var request = makeRequest(path: path, method: "PUT")
        request.httpBody = try JSONEncoder().encode(body)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        return try await perform(request)
    }

    // MARK: - Private

    private func makeRequest(path: String, method: String) -> URLRequest {
        let url = URL(string: baseURL + path)!
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue(authHeader, forHTTPHeaderField: "Authorization")
        return request
    }

    private func perform<T: Decodable>(_ request: URLRequest) async throws -> T {
        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw APIError.unknown(URLError(.badServerResponse))
        }
        guard (200..<300).contains(http.statusCode) else {
            throw APIError.httpError(http.statusCode)
        }
        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw APIError.decodingError(error)
        }
    }
}
