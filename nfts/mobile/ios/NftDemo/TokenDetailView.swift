//
//  TokenDetailView.swift
//  NftDemo
//
//  Created by Datacenter SV on 2/11/23.
//

import Foundation

import SwiftUI

import URLImage

import AlertToast

import MetaKeep

func getSDK(email: String) -> MetaKeep {
    // Initialize the SDK
    let sdk = MetaKeep(appId: "2452849e-d6e9-40ef-bbfd-5dfdc7ce1728", appContext: AppContext())
    sdk.environment = Environment.production
    
    if email != "" {
        sdk.user = User(email: email)
    }
    return sdk
}

struct ConsentTokenResponse: Codable {
    let consentToken: String
    let status: String
}

struct ConsentTokenRequest: Encodable {
    let token: String
    let from: [String: String]
    let to: [String: String] // swiftlint:disable:this identifier_name
    
    enum CodingKeys: String, CodingKey {
        case token
        case from
        case to // swiftlint:disable:this identifier_name
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(token, forKey: .token)
        try container.encode(from, forKey: .from)
        try container.encode(to, forKey: .to)
    }
}

struct MyView: View {
    var imageUrl: URL
    
    var body: some View {
        URLImage(imageUrl) { image in
            // show the image when it is loaded
            image
                .resizable()
                .aspectRatio(contentMode: .fit)
        }
        .padding()
    }
}

struct TokenDetailView: View {
    @State var shouldGoBackToMainScreen = false
    @State private var email = ""
    @State private var toastMessage = ""
    @State private var showToast = false
    @State var status: String = "UNKNOWN"
    let token: Token
    let owner: String
    var body: some View {
        VStack {
            Text("\(token.name) (\(token.symbol))").padding()
                .fontDesign(.serif)
                .fontWidth(.standard)
                .fontWeight(.heavy)
            MyView(imageUrl: URL(string: token.tokenMetadata.image)!)
            Text(token.token).padding()
                .frame(alignment: .center)
            TextField("Enter reciever email", text: $email)
                .padding()
                .background(Color(.lightGray))
                .foregroundColor(Color.black)
                .frame(width: 370)
                .cornerRadius(5.0)
                .padding(.bottom, 20)
            Button(action: {
                if !isValidEmail(self.email) {
                    showToast = true
                    toastMessage = "Invalid Email"
                }
                self.transferNft()})
            // swiftlint:disable:next multiple_closures_with_trailing_closure
            {    Text("Transfer")
            }.padding()
                .frame(width: 170)
                .background(Color.black)
                .foregroundColor(Color.white)
                .cornerRadius(20)
            
        }.navigationTitle("")
            .toast(isPresenting: $showToast) {
                AlertToast(type: .regular, title: toastMessage)
            }
            .navigationDestination(isPresented: $shouldGoBackToMainScreen) {
                ContentView()
            }  }
    
    private func transferNft() {
        // Make the API Call Here.
        let url = URL(string: "http://localhost:3001/getConsentToken")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // swiftlint:disable:next force_try
        let jsonData = try! JSONEncoder().encode(ConsentTokenRequest(token: self.token.token, from: ["email": self.owner], to: ["email": self.email])) // swiftlint:disable:this line_length
        
        request.httpBody = jsonData
        
        URLSession.shared.dataTask(with: request) { (data, response, error) in
            if let error = error {
                toastMessage = "Error: \(error)"
                showToast = true
                return
            }
            guard let data = data, let httpResponse = response as? HTTPURLResponse else {
                return
            }
            
            if httpResponse.statusCode == 200 {
                do {
                    let decodedResponse = try JSONDecoder().decode(ConsentTokenResponse.self, from: data
                    )
                    let sdk = getSDK(email: "")
                    let consentToken: String = decodedResponse.consentToken
                    sdk.getConsent(
                        consentToken: consentToken,
                        callback: Callback(
                            onSuccess: { (_: JsonResponse) in
                                toastMessage = "SUCCESS"
                                showToast = true
                                
                                self.shouldGoBackToMainScreen = true
                            },
                            onFailure: { (error: JsonResponse) in
                                
                                toastMessage = error.description
                                showToast = true
                                self.shouldGoBackToMainScreen = false
                            }
                            
                        )
                        
                    )
                } catch {
                    print("failed")
                }
                
            } else {
                print("Unsuccessful")
                toastMessage = "UnSuccessful While transferring"
                showToast = true
            }
        }.resume()
    }}

struct TokenDetailView_Previews: PreviewProvider {
    static var previews: some View {
        // swiftlint:disable line_length
        TokenDetailView(token: Token(collection: "0x8adfbd3fb44baafb8e55db0ba4d5811450651b5f", name: "Hello", symbol: "MTKP", token: "48921598017819282871051754605790182343529368677935464088860073070808968327529", tokenMetadata: TokenMetadata(image: "https://cdn.pixabay.com/photo/2022/02/19/17/59/nft-7023209_960_720.jpg") ), owner: "adityadhir97@gmail.com")
    }
}
