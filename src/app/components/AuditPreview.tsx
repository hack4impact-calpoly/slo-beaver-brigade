"use client";
import React from "react";
import style from "@styles/admin/audit.module.css";
import { Audit } from "app/lib/audit";
import { Card, CardBody, Heading, Text } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { RiArrowRightSLine } from "react-icons/ri";
import { px } from "framer-motion";

const AuditPreview = () => {
  return (
    <Card
      className={style.auditPreview}
      role="button"
      onClick={() =>
        console.log("Audit preview clicked (expansion to be implemented)")
      }
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.400"
    >
      <CardBody className={style.auditContent}>
        <CgProfile className={style.auditIcon} />
        <div className={style.auditText}>
          <Heading size="md">
            [Admin] added created a new event: Watery Walk
          </Heading>
          <Text>Today at 2:24pm</Text>
        </div>
        <RiArrowRightSLine className={style.auditIcon} />
      </CardBody>
    </Card>
  );
};

export default AuditPreview;
