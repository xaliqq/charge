/* eslint-disable no-nested-ternary */
import { IAdminsItem } from '@/models/admins';
import { modalClose } from '@/models/common';
import { closeBtn, noText } from '@/utils/constants/texts';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Text,
  Flex
} from '@chakra-ui/react';

interface IUsersViewModal extends modalClose {
  selectedItem: IAdminsItem | null;
}
function AdminViewModal({ onClose, selectedItem }: IUsersViewModal) {
  console.log(selectedItem);
  return (
    <ModalContent>
      <ModalHeader>MƏLUMATA BAXIŞ</ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <Flex>
          <Stack p={3} bg="gray.100" spacing={2}>
            <Text fontSize="sm">AD: </Text>
            <Text fontSize="sm">SOYAD: </Text>
            <Text fontSize="sm">EMAİL: </Text>
            <Text fontSize="sm">TELEFON: </Text>
          </Stack>
          <Stack ml={8} p={3} spacing={2}>
            <Text fontSize="sm">{selectedItem?.firstname ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.lastname ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.email ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.phoneNumber ?? noText}</Text>
          </Stack>
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button mr={3} variant="gray" onClick={onClose}>
          {closeBtn}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default AdminViewModal;
