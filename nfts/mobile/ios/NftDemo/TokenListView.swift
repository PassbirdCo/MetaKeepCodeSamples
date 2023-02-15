//
//  TokenListView.swift
//  NftDemo
//
//  Created by Datacenter SV on 2/11/23.
//

import Foundation

import SwiftUI
import URLImage

struct TokenListView: View {
    let tokens: [Token]
    let owner: String
    var body: some View {
        NavigationStack {
            List(tokens, id: \.token ) { token in
                NavigationLink(destination: TokenDetailView(token: token, owner: self.owner)) {
                    CardView(token: token)
                }
            }
        }
    }
}

struct CardView: View {
    let token: Token
    
    var body: some View {
        VStack {
            let imageURL = URL(string: self.token.tokenMetadata.image)!
            URLImage(imageURL) { image in image.resizable()
                    .aspectRatio(contentMode: .fit)
            }.frame(width: 400, height: 200)
            
            Text(formatTokenId(tokenID: token.token)).padding()
        }
    }
}

func formatTokenId(tokenID: String) -> String {
    let firstFive = String(tokenID.prefix(5))
    let lastFive = String(tokenID.suffix(5))
    return("\(firstFive)...\(lastFive)")
}
struct CardView_Previews: PreviewProvider {
    // swiftlint:disable:next line_length
    static var previews: some View { CardView(token: Token(collection: "0x8adfbd3fb44baafb8e55db0ba4d5811450651b5f", name: "Hello", symbol: "MTKP", token: "48921598017819282871051754605790182343529368677935464088860073070808968327529", tokenMetadata: TokenMetadata(image: "https://cdn.pixabay.com/photo/2022/02/19/17/59/nft-7023209_960_720.jpg") ))
    }
}
