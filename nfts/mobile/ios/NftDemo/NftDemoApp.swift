//
//  NftDemoApp.swift
//  NftDemo
//

import MetaKeep
import SwiftUI

@main
struct NftDemoApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView().onOpenURL { url in  // Add onOpenURL handler.
                MetaKeep.companion.resume(url: url.description)  // Send callback to MetaKeep SDK
            }
        }
    }
}
