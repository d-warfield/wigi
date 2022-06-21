import { gql } from "@apollo/client";
export default gql`
  mutation sendMessage($chatId: String!, $message: String!) {
    sendMessage(input: { chatId: $chatId, message: $message }) {
      chatId
      createdAt
      image
      message
      sender
      messageId
      recipientId
      url
    }
  }
`;
