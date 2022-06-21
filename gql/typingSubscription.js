import { gql } from "@apollo/client";

export default gql`
  subscription TypingSubscription($recipientId: ID = "") {
    isUserTyping(recipientId: $recipientId) {
      isTyping
      recipientId
      sender
    }
  }
`;
