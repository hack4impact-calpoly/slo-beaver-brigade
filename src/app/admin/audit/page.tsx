'use client';
import React, { use } from 'react';
import { useState, useEffect } from 'react';
import style from '@styles/admin/audit.module.css';
import MessageLog from '../../components/MessageLog';
import { Text, Input, Select, Spinner, Center, Button } from '@chakra-ui/react';
import { ILog } from '@/database/logSchema';

const AuditPage = () => {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [mounted, setMounted] = useState(false); // Helps prevent flickering on initial load
  const [page, setPage] = useState(0);
  const logLimit = 25;

  const fetchLogs = async () => {
    const res = await fetch('/api/logs', { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch logs');
      setIsError(true);
      setIsLoading(false);
      return;
    }
    const fetchedlogs = await res.json();
    console.log("Fetching logs on client.")
    setLogs(fetchedlogs);
    setPage(0);
    setIsLoading(false);
  };

  // Set mounted to true after the component mounts to prevent flickering
  useEffect(() => {
    setMounted(true); // Only on client side load
    fetchLogs();
  }, []);

  if (!mounted) {
    return (
      <Center p={8}>
        <Spinner size="xl" />
      </Center>
    );
  }

  const filteredLogs = logs?.filter((log) => {
    const matchesUser = userFilter
      ? log.user.toLowerCase().includes(userFilter.toLowerCase())
      : true;
    const matchesAction = actionFilter
      ? log.action.toLowerCase().includes(actionFilter.toLowerCase())
      : true;
    return matchesUser && matchesAction;
  });

  return (
    <div className={style.page}>
      <main>
        <div className={style.auditPage}>
          <Text fontSize={['xl', 'xl', '2xl']} fontWeight="light" color="black">
            Audit Log
          </Text>
          <div className={style.filtering}>
            <Text
              fontSize={['xl', 'xl', '2xl']}
              fontWeight="light"
              color="black"
            >
              Filter:
            </Text>
            <div className={style.filterButtons}>
              <Input
                placeholder="Filter by user"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                width="200px"
                ml={4}
              />
              <Input
                placeholder="Filter by action"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                width="200px"
                ml={4}
              />
            </div>
            <Button onClick={fetchLogs} ml={4}>
              Refresh Logs
            </Button>
          </div>
        </div>
        <hr className={style.divider}></hr>
        <div className={style.auditList}>
          {isLoading ? (
            <Center p={8}>
              <Spinner size="xl" />
            </Center>
          ) : isError ? (
            <Text color="red.500">Error loading audit logs</Text>
          ) : filteredLogs?.length === 0 ? (
            <Text>No logs found</Text>
          ) : (
            <>
              {filteredLogs?.slice(page * logLimit, (page+1) * logLimit).map(
                (log) => <MessageLog key={log._id} log={log} />)}
              {<div className={style.pageCountContainer}>
                <Button 
                  className={style.pageButton}
                  isDisabled={page === 0}
                  onClick={() => setPage(page-1)}>
                    Previous
                </Button>
                <Text
                  fontSize={['xl', 'xl', '2xl']}
                  fontWeight="light"
                  color="black"
                >
                  Page {page+1}
                </Text>
                <Button
                  className={style.pageButton}
                  isDisabled={(page+1) * logLimit >= filteredLogs.length} 
                  onClick={() => setPage(page+1)}>
                    Next
                </Button>
              </div>
              }
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuditPage;
