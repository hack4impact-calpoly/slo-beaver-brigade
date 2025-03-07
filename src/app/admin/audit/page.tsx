'use client';
import React, { use } from "react";
import { useState, useEffect } from "react";
import style from "@styles/admin/audit.module.css";
import MessageLog from "../../components/MessageLog";
import { Text, Input, Select, Spinner, Center , Button} from "@chakra-ui/react";
import { useLogs } from "app/lib/swrfunctions";
import { ILog } from "@/database/logSchema";

const AuditPage = () => {
  const { logs, isLoading, isError, mutateLogs } = useLogs();
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [mounted, setMounted] = useState(false); // Helps prevent flickering on initial load

  // Set mounted to true after the component mounts to prevent flickering
  useEffect(() => {
    setMounted(true); // Only on client side load
    mutateLogs();
  }, []);

  if (!mounted) {
    return <Center p={8}><Spinner size="xl" /></Center>;
  }

  const filteredLogs = logs?.filter(log => {
    const matchesUser = userFilter ? 
      log.user.toLowerCase().includes(userFilter.toLowerCase()) : 
      true;
    const matchesAction = actionFilter ? 
      log.action.toLowerCase().includes(actionFilter.toLowerCase()) : 
      true;
    return matchesUser && matchesAction;
  });

   // Function to manually refresh logs
   const refreshLogs = () => {
    mutateLogs(); // Revalidate the logs data
  };

  return (
    <div className={style.page}>
      <main>
        <div className={style.auditPage}>
          <Text fontSize={["xl", "xl", "2xl"]} fontWeight="light" color="black">
            Audit Log
          </Text>
          <div className={style.filtering}>
            <Text
              fontSize={["xl", "xl", "2xl"]}
              fontWeight="light"
              color="black"
            >
              Filter:
            </Text>
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
            <Button onClick={refreshLogs} ml={4}>
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
            filteredLogs?.map((log) => (
              <MessageLog key={log._id} log={log} />
            ))
          )}
        </div>
      </main>
    </div>
  );

};

export default AuditPage;
