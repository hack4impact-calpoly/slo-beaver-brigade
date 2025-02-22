'use client';
import React from "react";
import { useState } from "react";
import style from "@styles/admin/audit.module.css";
import MessageLog from "../../components/MessageLog";
import { Text, Input, Select, Spinner, Center } from "@chakra-ui/react";
import useSWR from "swr";
import { ILog } from "@/database/logSchema";


const fetcher = (url: string) => fetch(url).then((res) => res.json());
const AuditPage = () => {
  const { data: logs, error, isLoading } = useSWR<ILog[]>('/api/logs', fetcher);
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const filteredLogs = logs?.filter(log => {
    const matchesUser = userFilter ? 
      log.user.toLowerCase().includes(userFilter.toLowerCase()) : 
      true;
    const matchesAction = actionFilter ? 
      log.action.toLowerCase().includes(actionFilter.toLowerCase()) : 
      true;
    return matchesUser && matchesAction;
  });

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
          </div>
        </div>
        <hr className={style.divider}></hr>
        <div className={style.auditList}>
          {isLoading ? (
            <Center p={8}>
              <Spinner size="xl" />
            </Center>
          ) : error ? (
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
