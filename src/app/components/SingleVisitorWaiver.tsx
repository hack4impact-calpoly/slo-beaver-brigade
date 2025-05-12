"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text
} from "@chakra-ui/react";
import { ISignedWaiver } from "database/signedWaiverSchema";

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
      <ModalContent>
        <ModalHeader>Signed Waiver</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            <strong>Name:</strong> {waiver.signeeName}
          </Text>
          <Text>
            <strong>Date Signed:</strong>{" "}
            {new Date(waiver.dateSigned).toLocaleDateString()}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
