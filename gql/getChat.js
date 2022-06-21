import { gql } from "@apollo/client";
export default gql`
  query GetChat($friendId: String = "") {
    getChat(friendId: $friendId) {
      chatId
      friendId
      userId
      chatData {
        messages {
          chatId
          image
          message
          messageId
          url
          sender
          recipientId
          createdAt
        }
        LastEvaluatedKey {
          chatId
          messageId
        }
      }
    }
  }
`;
