import {gql} from '@apollo/client';

export const MAKE_WITHDRAWL = gql`
  mutation updateBankUser($patch: UpdateBankUserInput!) {
    updateBankUser(input: $patch) {
      bankUser {
        name
        balance
        withdrawlLimit
        transactions {
          businessName
          date
          id
          total
        }
      }
    }
  }
`;

export const MAKE_DEPOSIT = gql`
  mutation updateBankUser($patch: UpdateBankUserInput!) {
    updateBankUser(input: $patch) {
      bankUser {
        name
        balance
        withdrawlLimit
        transactions {
          businessName
          date
          id
          total
        }
      }
    }
  }
`;
