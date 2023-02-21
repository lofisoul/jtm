import React from 'react';
import Link from 'next/link';
import {BankOutlined, LogoutOutlined} from '@ant-design/icons';

export function Header({isDashboard = false}) {
  return (
    <header>
      <h1>
        <BankOutlined /> JTM
      </h1>
      {isDashboard && (
        <div className="logout">
          <Link href="/">
            <LogoutOutlined style={{fontSize: '2rem'}} /> Logout
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
