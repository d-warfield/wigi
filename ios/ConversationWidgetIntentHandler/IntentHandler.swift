//
//  IntentHandler.swift
//  ConversationWidgetIntentHandler
//
//  Created by Viljami Vastamäki on 1.7.2021.
//

import Intents

struct Shared:Decodable {
  let identifier: String,
      name: String
}

class IntentHandler: INExtension, ConfigurationIntentHandling {
  func provideUserOptionsCollection(for intent: ConfigurationIntent, with completion: @escaping (INObjectCollection<User>?, Error?) -> Void) {
    let sharedDefaults = UserDefaults.init(suiteName: "group.com.trippyllc.widgetsapp")
    if sharedDefaults != nil {
      do{
        let shared = sharedDefaults?.string(forKey: "availableUsers")
        if(shared != nil){
        let data = try JSONDecoder().decode([Shared].self, from: shared!.data(using: .utf8)!)
          let listOfUsers = data.map { (user) -> User in
            return User(identifier: user.identifier, display: user.name)
          }
          let collection = INObjectCollection(items: listOfUsers)
          completion(collection, nil)
        }
      }catch{
        print(error)
      }
    }
  }
}
