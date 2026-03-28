import SwiftUI

@main
struct SicklineApp: App {
    var body: some Scene {
      WindowGroup {
          TabView {
              Text("Daily Check")
                  .tabItem {
                      Label("Daily Check", systemImage: "person.fill")
                  }
              Text("Timeline")
                  .tabItem {
                      Label("Timeline", systemImage: "chart.bar.xaxis")
                  }
          }
      }
  }
}
