import SwiftUI

// MARK: - Environment key

private struct APIClientKey: EnvironmentKey {
    static let defaultValue = APIClient()
}

extension EnvironmentValues {
    var apiClient: APIClient {
        get { self[APIClientKey.self] }
        set { self[APIClientKey.self] = newValue }
    }
}

// MARK: - App entry point

@main
struct SicklineApp: App {
    private let apiClient = APIClient()

    var body: some Scene {
        WindowGroup {
            TabView {
                DailyCheckView()
                    .tabItem {
                        Label("Daily Check", systemImage: "person.fill")
                    }
                Text("Timeline")
                    .tabItem {
                        Label("Timeline", systemImage: "chart.bar.xaxis")
                    }
            }
            .environment(\.apiClient, apiClient)
        }
    }
}
