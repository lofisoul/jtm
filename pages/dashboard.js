import React, {useState, useRef} from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {GET_BANK_USER} from '../lib/queries';
import {MAKE_DEPOSIT, MAKE_WITHDRAWL} from '../lib/mutations';
import {Header} from '../components/header';
import {Tabs} from '../components/tabs';
import {
  InfoCircleOutlined,
  UserOutlined,
  LoadingOutlined,
  WarningOutlined,
} from '@ant-design/icons';

export default function Dashboard() {
  const router = useRouter();
  const query = router.query;

  const [amountToWithdraw, setAmountToWithDraw] = useState(0);
  const [amountToDeposit, setAmountToDeposit] = useState(0);
  const [balanceAfterWithdrawl, setBalanceAfterWithdrawl] = useState(0);
  const [balanceAfterDeposit, setBalanceAfterDeposit] = useState(0);
  const [sessionLimit, setSessionLimit] = useState(0);
  const [withdrawError, setWithdrawError] = useState(false);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState('');

  const withdrawlRef = useRef(null);
  const depositRef = useRef(null);

  const {
    data,
    loading: loadingUser,
    error: errorUser,
  } = useQuery(GET_BANK_USER, {
    variables: {id: query.id},
  });

  const [withdrawMoney, {loading: withdrawLoading}] = useMutation(
    MAKE_WITHDRAWL,
    {
      refetchQueries: [{query: GET_BANK_USER, variables: {id: query.id}}],
      variables: {
        patch: {
          filter: {
            id: [query.id],
          },
          set: {
            balance: balanceAfterWithdrawl,
            transactions: [
              {
                businessName: 'JTM - WITHDRAWL',
                total: amountToWithdraw,
                date: new Date().toISOString(),
              },
            ],
          },
        },
      },
    },
  );

  const [depositMoney, {loading: depositLoading}] = useMutation(MAKE_DEPOSIT, {
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
              businessName: 'JTM - DEPOSIT',
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
    setWithdrawError(false);
    if (amountToWithdraw > data.getBankUser.withdrawlLimit) {
      setWithdrawError(true);
      setWithdrawErrorMsg(
        `You cannot withdraw more than $${data.getBankUser.withdrawlLimit}`,
      );
      return;
    }

    if (data.getBankUser.withdrawlLimit - sessionLimit - amountToWithdraw < 0) {
      setWithdrawError(true);
      setWithdrawErrorMsg(
        `You have exceeded your withdrawl limit of $${data.getBankUser.withdrawlLimit}`,
      );
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

  function formatDate(d) {
    const b = new Date(d);

    let year = b.getFullYear();
    let day = b.getDate();
    let month = b.getMonth();

    return `${month + 1}/${day}/${year}`;
  }

  return (
    <>
      <Header isDashboard />
      <main>
        <div className="container">
          <h1>Dashboard</h1>
          {loadingUser && (
            <div className="dashboardLoading">
              <LoadingOutlined />
            </div>
          )}
          {errorUser && (
            <div className="warning">
              <WarningOutlined /> Whoops! Something went wrong fetching your
              account.
            </div>
          )}
          {data && (
            <>
              <h2>
                <UserOutlined /> Welcome back, {data.getBankUser.name}!
              </h2>
              <div className="balanceWrap">
                <div>
                  <strong>Current Balance:</strong> $
                  {data.getBankUser.balance.toLocaleString()}
                </div>
                <div>
                  <InfoCircleOutlined /> <strong>Daily withdrawl limit:</strong>{' '}
                  ${data.getBankUser.withdrawlLimit}
                </div>
              </div>
              <div className="dashboardMain">
                <Tabs
                  depositSubmitHandler={makeDeposit}
                  withdrawSubmitHandler={makeWithdrawl}
                  depositOnChange={handleDepositAmount}
                  withdrawOnChange={handleWithdrawlAmount}
                  depositRef={depositRef}
                  withdrawRef={withdrawlRef}
                  depositLoading={depositLoading}
                  withdrawLoading={withdrawLoading}
                  withdrawError={withdrawError}
                  withdrawErrorMsg={withdrawErrorMsg}
                />
                <div className="transactionsWrap">
                  <h3>Recent Transactions</h3>
                  {depositLoading || withdrawLoading ? (
                    <div className="dashboardLoading">
                      <LoadingOutlined />
                    </div>
                  ) : (
                    data.getBankUser.transactions
                      .filter(
                        transaction =>
                          formatDate(transaction.date) !== '12/31/1969',
                      )
                      .map(transaction => {
                        return (
                          <div key={transaction.id} className="transaction">
                            <div className="transactionInfo">
                              {transaction.businessName}
                              <span>{formatDate(transaction.date)}</span>
                            </div>
                            <div className="transactionTotal">
                              ${transaction.total}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
