/* eslint-disable no-nested-ternary */
import { modalClose } from '@/models/common';
import { IPartnersItem } from '@/models/partner';
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

interface IPartnersViewModal extends modalClose {
  selectedItem: IPartnersItem | null;
}
function PartnerViewModal({ onClose, selectedItem }: IPartnersViewModal) {
  console.log(selectedItem);
  return (
    <ModalContent>
      <ModalHeader>MƏLUMATA BAXIŞ</ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <Flex>
          <Stack p={3} bg="gray.100" spacing={2}>
            <Text fontSize="sm">AD: </Text>
            <Text fontSize="sm">EMAİL: </Text>
            <Text fontSize="sm">QURUCU: </Text>
            <Text fontSize="sm">MƏNTƏQƏLƏR: </Text>
          </Stack>
          <Stack ml={8} p={3} spacing={2}>
            <Text fontSize="sm">{selectedItem?.name ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.owner?.email ?? noText}</Text>
            <Text fontSize="sm">
              {' '}
              {selectedItem?.owner?.firstname} {selectedItem?.owner?.lastname}
            </Text>
            <Text fontSize="sm">
              {' '}
              {selectedItem?.chargePoints?.map(item => item?.name).join(', ')}
            </Text>
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

export default PartnerViewModal;
