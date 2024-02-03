import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Button as H4IButton } from "@styles/Button";
import React from "react";

interface Props {
  buttonName: string;
  title: string;
  message: string;
  isPositive: boolean;
}

/* Usage:
    buttonName: the name of the button that prompts the warning 
                and the name of the button that confirms the action.
                (Ex: Create, Delete, Edit, Confirm, Send, etc)

    title: title of the warning (Ex: Create Event?, Delete User?, etc)

    message: the message of the warning (Ex: Are you sure you want to delete this event? 
             This action is not reversible.)
             
    isPositive: changes the color of the warning button in the warning message. 
                Green for positive, red for negative. (Ex: True: Create, Edit, Send. False: Delete)
*/
            
const Confirmation = ({ buttonName, title, message, isPositive }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

  return (
    <>
      <H4IButton onClick={onOpen}>{buttonName}</H4IButton>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{message}</AlertDialogBody>

            <AlertDialogFooter>
              <H4IButton ref={cancelRef} onClick={onClose} color="slategray">
                Cancel
              </H4IButton>
              <H4IButton onClick={onClose} color={isPositive ? "forestgreen" : "crimson"} >
                {buttonName}
              </H4IButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Confirmation;
