import { gql } from "@apollo/client";

export default gql`
  query searchProfileById($id: String = "") {
    searchProfileById(id: $id) {
      displayName
      userId
      username
    }
  }
`;
