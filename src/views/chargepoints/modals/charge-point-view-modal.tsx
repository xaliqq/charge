/* eslint-disable no-nested-ternary */
import { IChargePointsItem } from '@/models/charge-points';
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

interface IPartnersViewModal extends modalClose {
  selectedItem: IChargePointsItem | null;
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
            <Text fontSize="sm">SAATLIQ QİYMƏT: </Text>
            <Text fontSize="sm">MAKSİMUM VOLT: </Text>
            <Text fontSize="sm">LATITUDE: </Text>
            <Text fontSize="sm">LONGITUDE: </Text>
            <Text fontSize="sm">PARTNYOR: </Text>
            <Text fontSize="sm">BİRLƏŞDİRİCİLƏR: </Text>
            <Text fontSize="sm">YARADILMA TARİXİ: </Text>
            <Text fontSize="sm">YENİLƏNMƏ TARİXİ: </Text>
            <Text fontSize="sm">STATUS: </Text>
            <Text fontSize="sm">AKTİVLİK STATUSU: </Text>
          </Stack>
          <Stack ml={8} p={3} spacing={2}>
            <Text fontSize="sm">{selectedItem?.name ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.pricePerHour ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.maxVoltage ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.latitude ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.longitude ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.owner ?? noText}</Text>
            <Text fontSize="sm">
              {' '}
              {selectedItem?.connectors?.map(item => item?.type).join(', ')}
            </Text>
            <Text fontSize="sm"> {selectedItem?.createdAt ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.lastUpdated ?? noText}</Text>
            <Text fontSize="sm"> {selectedItem?.status ?? noText}</Text>
            <Text fontSize="sm">
              {selectedItem?.isActive ? 'Aktiv' : 'Deaktiv'}
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
