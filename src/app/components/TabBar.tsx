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
        <Link className={`${styles.tab} ${activeTab === 'calendar' ? styles.active : ''}`} onClick={() => handleTabClick('calendar')} href={`/calendar`} passHref>
            Calendar
        </Link>
        <Link className={`${styles.tab} ${activeTab === 'events' ? styles.active : ''}`} onClick={() => handleTabClick('events')} href={`/admin/events`} passHref> Events
        </Link>
        <Link className={`${styles.tab} ${activeTab === 'organizations' ? styles.active : ''}`} onClick={() => handleTabClick('organizations')} href={`/admin/organizations`} passHref>
            Organizations
        </Link>
        <Link className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => handleTabClick('users')} href={`/admin/users`} passHref>
            Users
        </Link>
      </div>
  );
};

export default TabBar;
