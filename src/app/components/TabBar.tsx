"use client"

import styles from '../styles/admin/tabbar.module.css';

import React, { useState } from 'react';
import Link from 'next/link';

const TabBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
      <div className={styles.tabBarContainer}>
        <Link href={`/admin/events`} passHref>
          <div className={`${styles.tab} ${activeTab === 'events' ? styles.active : ''}`} onClick={() => handleTabClick('events')}>
            Events
          </div>
        </Link>
        <Link href={`/admin/organizations`} passHref>
          <div className={`${styles.tab} ${activeTab === 'organizations' ? styles.active : ''}`} onClick={() => handleTabClick('organizations')}>
            Organizations
          </div>
        </Link>
        <Link href={`/admin/users`} passHref>
          <div className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => handleTabClick('users')}>
            Users
          </div>
        </Link>
      </div>
  );
};

export default TabBar;
