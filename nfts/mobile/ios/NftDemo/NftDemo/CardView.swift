//
//  CardView.swift
//  NftDemo
//
//  Created by Datacenter SV on 2/11/23.
//

import Foundation

import SwiftUI

struct CardView: View {
    let token: Token
    
    var body: some View {
        VStack {
            Text("hello")
             
        }
    }
}

struct CardView_Preview_Poreviews: PreviewProvider {
    static var previews: some View {
        CardView(token: token1)
            .previewLayout(.sizeThatFits)
    }
}
