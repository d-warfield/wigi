import { gql } from "@apollo/client";
export default gql`
  subscription messageReceived($recipientId: ID!) {
    messageReceived(recipientId: $recipientId) {
      chatId
      createdAt
      image
      message
      sender
      url
      messageId
      recipientId
    }
  }
`;
