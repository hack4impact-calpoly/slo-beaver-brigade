"use client";

import {
  Box,
  Card,
  Badge,
  Text,
  Button,
  Flex,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import styles from "../styles/admin/editEvent.module.css";
import { IUser } from "@database/userSchema";

function SingleVisitorComponent({ visitorData }: { visitorData: IUser }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Text onClick={onOpen}>Details</Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          style={{ width: "60vw", height: "65vh", padding: "0% 5% 5% 5%" }}
          maxW="100rem"
        >
          <ModalHeader
            style={{
              padding: "2% 0% 2% 0%",
              textAlign: "left",
              fontSize: "35px",
              fontWeight: "bold",
              fontFamily: "Lato",
              width: "100%",
            }}
          >
            {visitorData.firstName} {visitorData.lastName}
          </ModalHeader>
          <ModalCloseButton />
          <hr />
          <ModalBody style={{ display: "flex", padding: "0%" }}>
            <Box style={{ paddingRight: "4%", width: "50%" }}>
              <Text className={styles.visitorInfoSmallHeader}>
                Personal Info
              </Text>
              <Text className={styles.fieldInfo}>
                Email: {visitorData.email ? visitorData.email : "N/A"}
              </Text>
              <Text className={styles.fieldInfo}>
                Phone:{" "}
                {visitorData.phoneNumber ? visitorData.phoneNumber : "N/A"}
              </Text>
              <Text className={styles.fieldInfo}>
                Age: {visitorData.age !== -1 ? visitorData.age : "N/A"}
              </Text>
              <Text className={styles.fieldInfo}>
                Gender: {visitorData.gender ? visitorData.gender : "N/A"}
              </Text>
              <Text className={styles.fieldInfo}>Address: N/A</Text>
              <Text className={styles.fieldInfo}>City: N/A</Text>
              <Text className={styles.fieldInfo}>Zipcode: N/A</Text>
              <Text className={styles.fieldInfo}>Primary Language: N/A</Text>
              <Text className={styles.visitorInfoSmallHeader}>
                Availability
              </Text>
              <Text className={styles.fieldInfo}>Available Locations: N/A</Text>
            </Box>
            <Box style={{ paddingLeft: "4%", width: "50%" }}>
              <Text className={styles.visitorInfoSmallHeader}>
                Interest Questions
              </Text>
              <Text className={styles.fieldInfo}>
                What led you to SLO Beavers: N/A
              </Text>
              <Text className={styles.fieldInfo}>Specialized skills: N/A</Text>
              <Text className={styles.fieldInfo}>
                Why are you interested: N/A
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const EditEventVisitorInfo = ({
  visitorData,
  loading,
}: {
  visitorData: IUser[];
  loading: boolean;
}) => {
  return (
    <Box className={styles.eventInformation}>
      {loading ? (
        <div className={styles.visitorHeadingLoading}>
          Visitors
          <Spinner className={styles.spinner} speed="0.8s" thickness="3px" />
        </div>
      ) : (
        <>
          <div className={styles.visitorHeading}>
            Visitors
            <div className={styles.visitorCount}>({visitorData.length})</div>
          </div>
          <table className={styles.visitorTable}>
            <tbody>
              {visitorData.map((visitor, index) => (
                <tr className={styles.visitorRow} key={index}>
                  <td className={styles.nameColumn}>
                    {visitor.firstName} {visitor.lastName}
                  </td>
                  <td className={styles.emailColumn}>{visitor.email}</td>
                  <td className={styles.detailsColumn}>
                    <SingleVisitorComponent visitorData={visitor} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Box>
  );
};

export default EditEventVisitorInfo;
