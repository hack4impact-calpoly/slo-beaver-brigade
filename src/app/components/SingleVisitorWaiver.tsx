'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Flex,
  Box,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import { ISignedWaiver } from 'database/signedWaiverSchema';
import WaiverVersion, { IWaiverVersion } from '@database/waiverVersionsSchema';
import styles from '../styles/admin/editEvent.module.css';

interface SignedWaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  waiver: ISignedWaiver | null;
  waiverVersion?: IWaiverVersion | null;
}

export default function SignedWaiverModal({
  isOpen,
  onClose,
  waiver,
  waiverVersion,
}: SignedWaiverModalProps) {
  if (!waiver) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        style={{ width: '80vw', height: '65vh', overflow: 'auto' }}
        maxW="80vw"
      >
        <ModalHeader
          style={{
            padding: '1% 5%',
            textAlign: 'left',
            fontSize: '35px',
            fontWeight: 'bold',
            fontFamily: 'Lato',
            width: '100%',
          }}
        >
          <Flex direction="column" align="left" p={4}>
            <Text>{waiver.signeeName}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          style={{ display: 'flex', flexDirection: 'column', padding: '0%' }}
          className={styles.parentContainer}
        >
          {waiverVersion ? (
            <Box className={styles.infoBox}>
              <Text className={styles.visitorInfoSmallHeader}>
                Terms and Conditions
              </Text>
              <Textarea
                value={waiverVersion.body}
                readOnly
                height="400px"
                resize="none"
                whiteSpace="pre-line"
                className={styles.scroller}
                mb={4}
              />
              <Text whiteSpace="pre-line" className={styles.fieldInfo}>
                {waiverVersion.acknowledgement}
              </Text>
              <Flex mt={6} justify="space-between" wrap="wrap">
                <div style={{ width: '45%' }}>
                  <Text className={styles.fieldInfo}>
                    <Text as="span" className={styles.boldText}>
                      Signed by
                    </Text>
                    <br />
                    {waiver.signeeName}
                  </Text>
                </div>
                <div style={{ width: '45%' }}>
                  <Text className={styles.fieldInfo}>
                    <Text as="span" className={styles.boldText}>
                      Date Signed
                    </Text>
                    <br />
                    {new Date(waiver.dateSigned).toLocaleDateString()}
                  </Text>
                </div>
              </Flex>
              {waiver.dependents.length > 0 && (
                <div style={{ width: '45%' }}>
                  <Text className={styles.fieldInfo}>
                    <Text as="span" className={styles.boldText}>
                      Dependents
                    </Text>
                    <br />
                    {waiver.dependents.map((dep, idx) => (
                      <Text key={idx}>{dep}</Text>
                    ))}
                  </Text>
                </div>
              )}
            </Box>
          ) : (
            <Box className={styles.infoBox}>
              <Text className={styles.visitorInfoSmallHeader}>
                Terms and Conditions
              </Text>
              <Text className={styles.fieldInfo}>Waiver not found.</Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
