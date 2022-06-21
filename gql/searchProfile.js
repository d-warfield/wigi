import { gql } from "@apollo/client";

export default gql`
  query SearchProfile($search: String = "") {
    searchProfile(search: $search) {
      userId
      displayName
      username
    }
  }
`;
