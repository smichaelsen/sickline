import Foundation

extension Date {
    /// Parses an ISO 8601 date string (e.g. "2024-03-28" or "2024-03-28T10:00:00Z").
    init?(iso8601 string: String) {
        let full = ISO8601DateFormatter()
        full.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = full.date(from: string) { self = date; return }

        let fullNoFraction = ISO8601DateFormatter()
        fullNoFraction.formatOptions = [.withInternetDateTime]
        if let date = fullNoFraction.date(from: string) { self = date; return }

        let dateOnly = ISO8601DateFormatter()
        dateOnly.formatOptions = [.withFullDate]
        if let date = dateOnly.date(from: string) { self = date; return }

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
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.locale = Locale(identifier: "en_US_POSIX")
        return f.string(from: self)
    }
}

extension String {
    /// Convenience: parses the receiver as an ISO 8601 date string.
    var iso8601Date: Date? { Date(iso8601: self) }
}
