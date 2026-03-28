import Foundation

enum Config {
    static let baseURL = "https://sickline.michaelsen.io"

    /// Base64-encoded "user:password" for HTTP Basic Auth.
    /// Replace with the actual credentials before running on device.
    private static let rawCredentials = "michaelsen:$2y$05$LbZkMhVPCBSZJTZ0PPWmo.ekRuNajDKdXr8LPSF50GrXF8SI0AF32"

    static let basicAuthHeader: String = {
        let data = Data(rawCredentials.utf8)
        return "Basic \(data.base64EncodedString())"
    }()
}
