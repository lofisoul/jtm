import {gql} from '@apollo/client';

export const ALL_BANK_USERS_QUERY = gql`
  query allBankUsers {
    queryBankUser {
      id
      pin
      name
      balance
      withdrawlLimit
    }
  }
`;

export const GET_BANK_USER_BY_PIN = gql`
  query GetBankUserByPin($pin: Int!) {
    queryBankUser(filter: {pin: {in: [$pin]}}) {
      id
    }
  }
`;

export const GET_BANK_USER = gql`
  query getBankUser($id: ID!) {
    getBankUser(id: $id) {
      name
      balance
      withdrawlLimit
      transactions(order: {desc: date}) {
        businessName
        date
        id
        total
      }
    }
  }
`;
