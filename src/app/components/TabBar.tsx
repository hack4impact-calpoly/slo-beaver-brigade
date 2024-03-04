"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import '../styles/admin/TabBar.css'; 


const TabBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="tab-bar-container">
      <Link href={`/admin/events`} passHref>
        <div className={`tab ${activeTab === 'events' ? 'active' : ''}`} onClick={() => handleTabClick('events')}>
          Events
        </div>
      </Link>
      <Link href={`/admin/organizations`} passHref>
        <div className={`tab ${activeTab === 'organizations' ? 'active' : ''}`} onClick={() => handleTabClick('organizations')}>
          Organizations
        </div>
      </Link>
      <Link href={`/admin/users`} passHref>
        <div className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleTabClick('users')}>
          Users
        </div>
      </Link>
    </div>
  );
};

export default TabBar;
