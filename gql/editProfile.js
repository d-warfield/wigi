import { gql } from "@apollo/client";

export default gql`
  mutation EditProfile(
    $displayName: String = ""
    $notificationToken: String = ""
    $username: String = ""
  ) {
    editProfile(
      username: $username
      notificationToken: $notificationToken
      displayName: $displayName
    ) {
      createdAt
      displayName
      invites
      userId
      notificationToken
      pending
      username
    }
  }
`;
