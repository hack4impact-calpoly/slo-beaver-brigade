"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Flex,
  Box
} from "@chakra-ui/react";
import { ISignedWaiver } from "database/signedWaiverSchema";
import styles from "../styles/admin/editEvent.module.css";

interface SignedWaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  waiver: ISignedWaiver | null;
}

export default function SignedWaiverModal({
  isOpen,
  onClose,
  waiver,
}: SignedWaiverModalProps) {
  if (!waiver) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        style={{ width: "60vw", height: "40vh", overflow: "auto" }}
        maxW="100rem"
      >
        <ModalHeader
          style={{
            padding: "1% 5%",
            textAlign: "left",
            fontSize: "35px",
            fontWeight: "bold",
            fontFamily: "Lato",
            width: "100%",
          }}
        >
          {waiver.signeeName}
        </ModalHeader>
        <ModalCloseButton />
        <hr />
        <ModalBody
          style={{ display: "flex", flexDirection: "column", padding: "0%" }}
          className={styles.parentContainer}
        >
          <Box className={styles.infoBox}>
            <Text className={styles.visitorInfoSmallHeader}>
              Waiver Details
            </Text>
            <div className={styles.accountInfo} style={{ display: "flex" }}>
              <div style={{ width: "100%" }}>
                <Text className={styles.fieldInfo}>
                  <Text as="span" className={styles.boldText}>Name</Text><br />
                  {waiver.signeeName}
                </Text>
                <Text className={styles.fieldInfo}>
                  <Text as="span" className={styles.boldText}>Date Signed</Text><br />
                  {new Date(waiver.dateSigned).toLocaleDateString()}
                </Text>
              </div>
            </div>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}