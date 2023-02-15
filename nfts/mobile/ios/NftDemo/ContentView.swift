//
//  ContentView.swift
//  NftDemo
//
//  Created by Datacenter SV on 2/10/23.
//

import SwiftUI
import AlertToast
import MetaKeep

struct Token: Codable {
    let collection: String
    let name: String
    let symbol: String
    let token: String
    let tokenMetadata: TokenMetadata
}

struct TokenMetadata: Codable {
    let image: String
}

struct Response: Codable {
    let status: String
    let tokens: [Token]
    let totalCount: String
}

struct ContentView: View {
    @State private var name = ""
    @State private var tokens: [Token] = []
    @State private var showToast = false
    @State private var toastMessage = ""
    @State private var toastStatus = ""
    @State private var shouldShowNextScreen = false
    
    var body: some View {
        NavigationStack {
            VStack {
                Text("Metakeep").bold(true).padding(.bottom, 100)
                    .font(.system(size: 70, design: .default))
                Text("Get Nfts of the User").font(.system(size: 30)).fixedSize()
                    .padding(.bottom, 70)
                TextField("Enter your email", text: $name)
                    .padding()
                    .background(Color(.lightGray))
                    .cornerRadius(5.0)
                    .padding(.bottom, 20)
                Button(action: {
                    
                    if !isValidEmail(self.name) {
                        showToast = true
                        toastMessage = "Email is invalid"
                    } else if isValidEmail(self.name) {
                        self.getNftList()
                    } else if tokens.isEmpty {
                        showToast = true
                        toastMessage = "No Tokens Found"
                    } else {
                        showToast = true
                        toastMessage = "Something went wrong"}
                })
                // swiftlint:disable:next multiple_closures_with_trailing_closure
                { Text("Submit")
                }.padding()
                    .background(Color(.black))
                    .cornerRadius(5.0)
                    .foregroundColor(Color(.white))
            }
            .navigationDestination(isPresented: $shouldShowNextScreen) {
                TokenListView(tokens: self.tokens, owner: self.name)
            }
            .toast(isPresenting: $showToast) {
                AlertToast(type: .regular, title: toastMessage)
            }
        }
    }
    
    private func getNftList() {
        // Make the API Call Here.
        let url = URL(string: "http://localhost:3001/getNftTokenList")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // swiftlint:disable force_try
        let jsonData = try! JSONEncoder().encode(["of": ["email": self.name]])
        
        request.httpBody = jsonData
        
        URLSession.shared.dataTask(with: request) {   (data, response, error) in
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
                    let decodedResponse = try JSONDecoder().decode(Response.self, from: data
                    )
                    tokens = decodedResponse.tokens
                    shouldShowNextScreen = true
                } catch {
                    print("failed")
                }
                
            } else {
                print("Unsuccessful")
                toastMessage = "UnSuccessful"
                showToast = true
            }
        }.resume()
    }
}

func isValidEmail(_ email: String) -> Bool {
    let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
    let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
    return emailPredicate.evaluate(with: email)
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
