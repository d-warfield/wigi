import { gql } from "@apollo/client";
export default gql`
  mutation SendInvite($phoneNumber: String = "") {
    sendInvite(phoneNumber: $phoneNumber) {
      phoneNumber
    }
  }
`;
