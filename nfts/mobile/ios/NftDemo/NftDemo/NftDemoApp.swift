//
//  NftDemoApp.swift
//  NftDemo
//
//  Created by Datacenter SV on 2/10/23.
//

import SwiftUI

import MetaKeep

@main
struct NftDemoApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView().onOpenURL { url in // Add onOpenURL handler.
                MetaKeep.companion.resume(url: url.description) // Send callback to MetaKeep SDK
            }
        }
    }
}
