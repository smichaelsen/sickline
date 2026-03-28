import Foundation

private enum ISO8601Formatters {
    static let withFractionalSeconds: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()
    static let withoutFractionalSeconds: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()
    static let dateOnly: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withFullDate]
        return f
    }()
    static let apiDate: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.locale = Locale(identifier: "en_US_POSIX")
        return f
    }()
}

extension Date {
    /// Parses an ISO 8601 date string (e.g. "2024-03-28" or "2024-03-28T10:00:00Z").
    init?(iso8601 string: String) {
        if let date = ISO8601Formatters.withFractionalSeconds.date(from: string) { self = date; return }
        if let date = ISO8601Formatters.withoutFractionalSeconds.date(from: string) { self = date; return }
        if let date = ISO8601Formatters.dateOnly.date(from: string) { self = date; return }
        return nil
    }

    /// Returns "Today", "Yesterday", or a short weekday+date string (e.g. "Mon, 24 Mar").
    var relativeDisplayString: String {
        let calendar = Calendar.current
        if calendar.isDateInToday(self) { return "Today" }
        if calendar.isDateInYesterday(self) { return "Yesterday" }
        return formatted(.dateTime.weekday(.abbreviated).day().month(.abbreviated))
    }

    /// Returns the date formatted as "yyyy-MM-dd" for API requests.
    var apiDateString: String {
        ISO8601Formatters.apiDate.string(from: self)
    }
}

extension String {
    /// Convenience: parses the receiver as an ISO 8601 date string.
    var iso8601Date: Date? { Date(iso8601: self) }
}
