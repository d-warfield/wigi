//
//  NotificationService.swift
//  notification-middleware
//
//  Created by Viljami Vastamäki on 12.7.2021.
//

import UserNotifications
import WidgetKit

struct NewData: Codable {
  let name: String,
      imageUrl: String
}

func convertIntoJSONString(arrayObject: [Any]) -> String? {
  do {
    let jsonData: Data = try JSONSerialization.data(withJSONObject: arrayObject, options: [])
    if  let jsonString = NSString(data: jsonData, encoding: String.Encoding.utf8.rawValue) {
      return jsonString as String
    }
  } catch let error as NSError {
    print("Array convertIntoJSON - \(error.description)")
  }
  return nil
}

class NotificationService: UNNotificationServiceExtension {

  // Storage for the completion handler and content.
  var contentHandler: ((UNNotificationContent) -> Void)?
  var bestAttemptContent: UNMutableNotificationContent?
  
  override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    self.contentHandler = contentHandler
    self.bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)

    let userId = bestAttemptContent?.userInfo["userId"] as? String
    let username = bestAttemptContent?.userInfo["username"] as? String
    let imageUrl = bestAttemptContent?.userInfo["imageUrl"] as? String
    
    let defaults = UserDefaults(suiteName: "group.com.trippyllc.widgetsapp")
    
    if let bestAttemptContent = bestAttemptContent {
      var count: Int = defaults?.integer(forKey: "count") as! Int
      count = count + 1
      bestAttemptContent.badge = count as NSNumber
      defaults?.set(count, forKey: "count")
        
      var newMessages = defaults?.object(forKey: "newMessages") as? [String] ?? []
      
      newMessages.append(userId!)
      
      let jsonString = convertIntoJSONString(arrayObject: newMessages)
      
      defaults?.set(jsonString, forKey: "newMessages")
      
      if (userId != nil && username != nil && imageUrl != nil) {
        let value = NewData(name: username!, imageUrl: imageUrl!)
        
        if let data = try? JSONEncoder().encode(value) {
          defaults?.set(data, forKey: userId!)

          WidgetCenter.shared.getCurrentConfigurations { result in
          guard case .success(let widgets) = result else { return }

            if let widget = widgets.first(
                where: { widget in
                  let intent = widget.configuration as? ConfigurationIntent
                  return intent!.user?.identifier == userId
                }
            ) {
                WidgetCenter.shared.reloadTimelines(ofKind: widget.kind)
            }
          }
        }
      }

      // Always call the completion handler when done.
      contentHandler(bestAttemptContent)
    }
  }
      
  // Return something before time expires.
  override func serviceExtensionTimeWillExpire() {
     if let contentHandler = contentHandler,
        let bestAttemptContent = bestAttemptContent {
           
        // Mark the message as still encrypted.
        bestAttemptContent.title = "Failed to update friend widget. Learn more from our FAQ."
        contentHandler(bestAttemptContent)
     }
  }
}
