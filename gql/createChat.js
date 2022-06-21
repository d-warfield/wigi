import { gql } from "@apollo/client";
export default gql`
  mutation CreateChat($friendId: String = "") {
    createChat(friendId: $friendId) {
      chatId
      friendId
    }
  }
`;
