import { gql } from "@apollo/client";
export default gql`
  query GetOwnProfile {
    me {
      userId
      notificationToken
      createdAt
      displayName
      username
      invites
      pending
      inviterId
      inviteCode
    }
  }
`;
