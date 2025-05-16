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
  Box,
  Divider,
  Textarea
} from "@chakra-ui/react";
import { ISignedWaiver } from "database/signedWaiverSchema";
import WaiverVersion, { IWaiverVersion } from '@database/waiverVersionsSchema';
import styles from "../styles/admin/editEvent.module.css";

const waiverText = `1. I am voluntarily joining an activity sponsored by the SLO Beaver Brigade, which may include tours to and from and in and around beaver ponds, as well as litter and brush removal or planting in riverbeds and creekbeds, and related activities.

2. I understand that the SLO Beaver Brigade has no duty or responsibility for me or my dependents’ safety or property. I am participating in this activity entirely at my own risk and assume full responsibility for any and all bodily injury, disability, death, or property damage as a result of my participation in a SLO Beaver Brigade event. I recognize that these risks may include hiking, crossing streams or wading through water, falling trees and limbs, poison oak, stinging nettles, thistles and other barbed plants, poisonous insects, snakes including rattlesnakes, ticks, wild animals, inclement weather, wildfires or floods, homeless encampments, sharp objects in and around the riverbed such as barbed wire, unsupervised dogs or horses, ATV riders, dirt bikers or other vehicles, hunters, target shooters, poachers, and any other risks on or around the premises of the activity, known or unknown to me or event organizers and leaders.

3. I hereby RELEASE, WAIVE, and DISCHARGE the SLO Beaver Brigade, Dr. Emily Fairfax, Audrey Taub, Cooper Lienhart, Kate Montgomery, Fred Frank, Hannah Strauss, landowners, and Beaver Brigade interns/fellows, volunteers, members, sponsors, affiliates and other agents from any and all liability, claims, demands and actions whatsoever, regardless of whether such loss is caused by the acts or failures to act of any party organizing or leading a specific event or activity on behalf of the SLO Beaver Brigade, and I surrender any and all rights to seek compensation for any injury whatsoever sustained during my participation in a SLO Beaver Brigade activity. I agree to INDEMNIFY and HOLD HARMLESS releases against any and all claims, suits, or actions brought by me, my spouse, family, heirs, or anyone else on behalf of me or my dependents, and agree to reimburse all attorney’s fees and related costs that may be incurred by releases due to my participation in SLO Beaver Brigade events or activities.

4. I hereby grant the SLO Beaver Brigade permission to use my likeness in a photograph, video, or other digital media (“photo”) in any and all of its publications, including web-based publications, without payment or other consideration. I hereby irrevocably authorize the SLO Beaver Brigade to edit, alter, copy, exhibit, publish, or distribute these photos for any lawful purpose. In addition, I waive any right to inspect or approve the finished product wherein my likeness appears. Additionally, I waive any right to royalties or other compensation arising from or related to the use of the photo.`;

const signatureText = `BY SIGNING THIS AGREEMENT, I ACKNOWLEDGE AND REPRESENT THAT I HAVE READ THIS WAIVER OF LIABILITY AND HOLD HARMLESS AGREEMENT, that I fully understand and consent to the terms of this agreement, and that I am signing it of my own free will. I agree that no oral representations, statements, or inducements apart from this written agreement have been made or implied. I am at least 18 years of age, fully competent, responsible, and legally able to sign this agreement for myself or my dependents.`;


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
        style={{ width: "60vw", height: "65vh", overflow: "auto" }}
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
          <Flex direction="column" align="left" p={4}>
            <Text>{waiver.signeeName}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          style={{ display: "flex", flexDirection: "column", padding: "0%" }}
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
                height="200px"
                resize="none"
                whiteSpace="pre-line"
                className={styles.scroller}
                mb={4}
              />
              <Text whiteSpace="pre-line" className={styles.fieldInfo}>
                {waiverVersion.acknowledgement}
              </Text>
              <Flex mt={6} justify="space-between" wrap="wrap">
              <div style={{ width: "45%" }}>
                <Text className={styles.fieldInfo}>
                  <Text as="span" className={styles.boldText}>Signed by</Text><br />
                  {waiver.signeeName}
                </Text>
              </div>
              <div style={{ width: "45%" }}>
                <Text className={styles.fieldInfo}>
                  <Text as="span" className={styles.boldText}>Date Signed</Text><br />
                  {new Date(waiver.dateSigned).toLocaleDateString()}
                </Text>
              </div>
              </Flex>
              {waiver.dependents.length > 0 && (
                <div style={{ width: "45%" }}>
                    <Text className={styles.fieldInfo}>
                        <Text as="span" className={styles.boldText}>Dependents</Text><br />
                            {waiver.dependents.map((dep, idx) => (
                            <Text key={idx}>{dep}</Text>
                            ))}
                    </Text>
                </div>
                )}
            </Box>
          ) : (
            <Box className={styles.infoBox}>
              <Text className={styles.visitorInfoSmallHeader}>Terms and Conditions</Text>
              <Text className={styles.fieldInfo}>Waiver not found.</Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}