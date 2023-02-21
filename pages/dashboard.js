import React, {useState, useRef} from 'react';
import {gql, useQuery, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';

export const GET_BANK_USER = gql`
  query getBankUser($id: ID!) {
    getBankUser(id: $id) {
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
`;

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

export default function Dashboard() {
  const router = useRouter();
  const query = router.query;

  const [amountToWithdraw, setAmountToWithDraw] = useState(0);
  const [amountToDeposit, setAmountToDeposit] = useState(0);
  const [balanceAfterWithdrawl, setBalanceAfterWithdrawl] = useState(0);
  const [balanceAfterDeposit, setBalanceAfterDeposit] = useState(0);
  const [sessionLimit, setSessionLimit] = useState(0);

  const withdrawlRef = useRef(null);
  const depositRef = useRef(null);

  const {data, loading, error} = useQuery(GET_BANK_USER, {
    variables: {id: query.id},
  });

  const [withdrawMoney] = useMutation(MAKE_WITHDRAWL, {
    refetchQueries: [{query: GET_BANK_USER, variables: {id: query.id}}],
    variables: {
      patch: {
        filter: {
          id: [query.id],
        },
        set: {
          balance: balanceAfterWithdrawl,
        },
      },
    },
  });

  const [depositMoney] = useMutation(MAKE_DEPOSIT, {
    refetchQueries: [{query: GET_BANK_USER, variables: {id: query.id}}],
    variables: {
      patch: {
        filter: {
          id: [query.id],
        },
        set: {
          balance: balanceAfterDeposit,
          transactions: [
            {
              businessName: 'JTM',
              total: amountToDeposit,
              date: new Date().toISOString(),
            },
          ],
        },
      },
    },
  });

  function handleWithdrawlAmount(e) {
    setAmountToWithDraw(Number(e.target.value));
    setBalanceAfterWithdrawl(data.getBankUser.balance - Number(e.target.value));
  }

  function makeWithdrawl(e) {
    e.preventDefault();
    if (amountToWithdraw > data.getBankUser.withdrawlLimit) {
      console.log('YOU CANT DO THAT!');
      return;
    }

    if (data.getBankUser.withdrawlLimit - sessionLimit - amountToWithdraw < 0) {
      console.log("You've Busted!");
      return;
    }

    setSessionLimit(sessionLimit + amountToWithdraw);
    withdrawMoney();
    withdrawlRef.current.value = '';
  }

  function handleDepositAmount(e) {
    setAmountToDeposit(Number(e.target.value));
    setBalanceAfterDeposit(data.getBankUser.balance + Number(e.target.value));
  }

  function makeDeposit(e) {
    e.preventDefault();
    depositMoney();
    depositRef.current.value = '';
  }

  if (loading) return 'LOADING...';

  if (error) return 'ERROR';

  return (
    <div>
      <h1>Dashboard</h1>
      {data && (
        <>
          <h2>Welcome back, {data.getBankUser.name}!</h2>
          <div className="balanceWrap">
            Current Balance: ${data.getBankUser.balance.toLocaleString()}
          </div>

          <div className="withdrawlWrap">
            <h3>Withdrawl</h3>
            <form onSubmit={makeWithdrawl}>
              <input
                ref={withdrawlRef}
                type="number"
                onChange={handleWithdrawlAmount}
              />
              <button type="submit">Withdraw Money</button>
            </form>
          </div>
          <div className="depositWrap">
            <h3>Deposit</h3>
            <form onSubmit={makeDeposit}>
              <input
                ref={depositRef}
                type="number"
                onChange={handleDepositAmount}
              />
              <button type="submit">Deposit</button>
            </form>
          </div>
          <div className="transactionsWrap">
            {data.getBankUser.transactions.map(transaction => {
              console.log(transaction);
              return (
                <div key={transaction.id}>
                  {transaction.businessName} {transaction.total}{' '}
                  {transaction.date}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
