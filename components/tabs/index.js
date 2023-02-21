import React, {useState} from 'react';
import {ActionForm} from '../action-form';

export function Tabs({
  depositSubmitHandler,
  withdrawSubmitHandler,
  depositOnChange,
  withdrawOnChange,
  depositRef,
  withdrawRef,
  depositLoading,
  withdrawLoading,
  withdrawError,
  withdrawErrorMsg,
}) {
  const [activeTab, setActiveTab] = useState('tab1');

  function setTab1Active() {
    setActiveTab('tab1');
  }

  function setTab2Active() {
    setActiveTab('tab2');
  }
  return (
    <div className="tabs">
      <div className="tabsNav">
        <ul>
          <li
            onClick={setTab1Active}
            className={activeTab === 'tab1' ? 'active' : ''}
          >
            Withdraw
          </li>
          <li
            onClick={setTab2Active}
            className={activeTab === 'tab2' ? 'active' : ''}
          >
            Deposit
          </li>
        </ul>
      </div>
      <div className="tabsContent">
        {activeTab === 'tab1' && (
          <div className="withdrawContent">
            <ActionForm
              cssClass="withdrawlWrap"
              title="Enter Amount to Withdraw"
              submitHandler={withdrawSubmitHandler}
              inputRef={withdrawRef}
              onChangeHandler={withdrawOnChange}
              buttonText="Make Withdrawl"
              loading={withdrawLoading}
              inputError={withdrawError}
              inputMessage={withdrawErrorMsg}
            />
          </div>
        )}
        {activeTab === 'tab2' && (
          <div className="depositContent">
            <ActionForm
              cssClass="withdrawlWrap"
              title="Enter Amount to Deposit"
              submitHandler={depositSubmitHandler}
              inputRef={depositRef}
              onChangeHandler={depositOnChange}
              buttonText="Make a Deposit"
              loading={depositLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
