import { gql } from "@apollo/client";
export default gql`
  query MyQuery(
    $messageId: String = ""
    $friendId: String = ""
    $chatId: String = ""
  ) {
    getMoreMessages(
      input: { chatId: $chatId, friendId: $friendId, messageId: $messageId }
    ) {
      LastEvaluatedKey {
        chatId
        messageId
      }
      messages {
        chatId
        image
        message
        sender
        url
        recipientId
        messageId
        createdAt
      }
    }
  }
`;
