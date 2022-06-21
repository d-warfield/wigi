import { gql } from "@apollo/client";
export default gql`
  query GetFriends {
    getAllFriends {
      chatId
      friendId
      profile {
        displayName
        username
      }
    }
  }
`;
