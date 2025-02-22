import React from "react";
import style from "@styles/admin/audit.module.css";
import AuditPreview from "@app/components/AuditPreview";
import { Text } from "@chakra-ui/react";

const AuditPage = () => {
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
            <h3>By user</h3>
            <h3>By action</h3>
          </div>
        </div>
        <hr className={style.divider}></hr>
        <div className={style.auditList}>
          <AuditPreview />
          <AuditPreview />
          <AuditPreview />
        </div>
      </main>
    </div>
  );
};

export default AuditPage;
