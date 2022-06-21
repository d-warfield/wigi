import { gql } from "@apollo/client";
export default gql`
  mutation ApplyInviteCode($inviteCode: String = "") {
    applyInviteCode(inviteCode: $inviteCode) {
      valid
      expired
      inviterId
    }
  }
`;
