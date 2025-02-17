'use client';

import React from 'react';
import { Card, CardBody, Heading, Text } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { RiArrowRightSLine } from "react-icons/ri";
import style from "@styles/admin/audit.module.css";
import { useRouter } from "next/navigation";
import { ILog } from "@/database/logSchema";

interface MessageLogProps {
  log: ILog;
}

const MessageLog: React.FC<MessageLogProps> = ({ log }) => {
  const router = useRouter();

  const formatDate = (date: Date): string => {
    const now = new Date();
    const logDate = new Date(date);
    const diffInHours = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `Today at ${logDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return logDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const handleClick = () => {
    if (log.link) {
      router.push(`/events/${log.link}`);
    } else {
      router.push(`/users/${log.user}`);
    }
  };

  return (
    <Card
      className={style.auditPreview}
      role="button"
      onClick={handleClick}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.400"
    >
      <CardBody className={style.auditContent}>
        <CgProfile className={style.auditIcon} />
        <div className={style.auditText}>
          <Heading size="md">
            {log.user} {log.action}
          </Heading>
          <Text>{formatDate(log.date)}</Text>
        </div>
        <RiArrowRightSLine className={style.auditIcon} />
      </CardBody>
    </Card>
  );
};

export default MessageLog;