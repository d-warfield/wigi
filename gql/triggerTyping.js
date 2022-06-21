import { gql } from "@apollo/client";
export default gql`
  mutation TriggerTyping($typing: Boolean = false, $recipientId: String = "") {
    triggerTyping(typing: $typing, recipientId: $recipientId) {
      recipientId
      isTyping
      sender
    }
  }
`;
