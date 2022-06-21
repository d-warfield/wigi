//
//  conversation_widget.swift
//  conversation-widget
//
//  Created by Viljami Vastamäki on 24.6.2021.
//

import WidgetKit
import SwiftUI
import Intents

struct Shared:Decodable {
  let imageUrl: String
}

struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), data: WidgetData(username: "", image: UIImage(), imageAvailable: false, userId: "", profileImage: UIImage(), profileImageAvailable: false))
    } 

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
      let entry = SimpleEntry(date: Date(), data: WidgetData(username: "", image: UIImage(), imageAvailable: false, userId: "", profileImage: UIImage(), profileImageAvailable: false))
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
      var username = ""
      var image = UIImage()
      var imageAvailable = false
      var userId = ""
      var profileImage = UIImage()
      var profileImageAvailable = false
      
      let sharedDefaults = UserDefaults(suiteName: "group.com.trippyllc.widgetsapp")
      if sharedDefaults != nil {
        if (configuration.user != nil) {
          userId = configuration.user!.identifier!
          username = configuration.user!.displayString
          if let config = sharedDefaults?.object(forKey: configuration.user!.identifier!) as? Data {
              let decoder = JSONDecoder()
              if let storedData = try? decoder.decode(Shared.self, from: config) {
            let url = URL(string: storedData.imageUrl)!
            if let data = try? Data(contentsOf: url) {
              image = UIImage(data: data) ?? UIImage()
              imageAvailable = true
            }
            let profileImageUrl = URL(string: "https://public.wigi.chat/\(configuration.user!.identifier!)/profile.jpeg")!
            if let data = try? Data(contentsOf: profileImageUrl) {
              profileImage = UIImage(data: data) ?? UIImage()
              profileImageAvailable = true
            }
          }
          }
        }
      }
      let entry = SimpleEntry(date: Date(), data: WidgetData(username: username, image: image, imageAvailable: imageAvailable, userId: userId, profileImage: profileImage, profileImageAvailable: profileImageAvailable))
      let timeline = Timeline(entries: [entry], policy: .never)
      completion(timeline)
    }
}

struct WidgetData {
    let username: String
    let image: UIImage
    let imageAvailable: Bool
    let userId: String
    let profileImage: UIImage
    let profileImageAvailable: Bool
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let data: WidgetData
}

struct TextView: View {
  let entry: Provider.Entry
  
  var body: some View {
      HStack {
        if (entry.data.profileImageAvailable) {
          Image(uiImage: entry.data.profileImage)
              .resizable()
              .frame(width: 20, height: 20, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
              .cornerRadius(10)
              .overlay(RoundedRectangle(cornerRadius: 10)
              .stroke(Color.white, lineWidth: 1.5))
        } else {
          Text(entry.data.username.prefix(1))
            .foregroundColor(.white)
            .font(.custom("ProximaNova-Black", size: 12))
            .frame(width: 20, height: 20, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
            .cornerRadius(10)
            .overlay(RoundedRectangle(cornerRadius: 10)
                      .stroke(Color.white, lineWidth: 1.5))
            .shadow(radius: 2, y:  1)

        }
        Text(entry.data.username)
          .foregroundColor(.white)
          .font(.custom("ProximaNova-Black", size: 12))
          .shadow(radius: 2, y:  1)


          
      }
      .padding(5)
      .cornerRadius(5)
  }
}

struct conversation_widgetEntryView : View {
    var entry: Provider.Entry
  
    var body: some View {
      Link(destination: URL(string: "com.widgetsapp://user/\(entry.data.userId)")!) {
      ZStack {
        if (entry.data.username.isEmpty) {
          Image("Select")
            .resizable()
        }
        else {
          if (!entry.data.imageAvailable) {
            Image("Added")
              .resizable()
          } else {
            VStack {}
              .frame(maxWidth: .infinity, maxHeight: .infinity)
              

              .background(
                Image(uiImage: entry.data.image)
                  .resizable()
                  .scaledToFill()

)
                
              .overlay(TextView(entry: entry).padding([.top, .leading], 8.0), alignment: .topLeading)
              

          }
        }
      }.widgetURL(URL(string: "com.widgetsapp://user/\(entry.data.userId)"))
    }
    }
}

@main
struct conversation_widget: Widget {
  let kind: String = String(NSDate().timeIntervalSince1970)

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
            conversation_widgetEntryView(entry: entry)
        }
        .configurationDisplayName("Friend widget")
        .description("This is a widget for receiving posts from your friends. Press \"Choose\" to select friend. Be sure to have added one friend in the app iteself, otherwise you won't see them in the list.")
        .supportedFamilies([.systemSmall, .systemLarge])
    }
}

struct conversation_widget_Previews: PreviewProvider {
    static var previews: some View {
      conversation_widgetEntryView(entry: SimpleEntry(date: Date(), data: WidgetData(username: "dennis", image: UIImage(), imageAvailable: true, userId: "", profileImage: UIImage(), profileImageAvailable: false)))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
