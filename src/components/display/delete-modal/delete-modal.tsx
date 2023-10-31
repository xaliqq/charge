import { modalClose } from '@/models/common';
import { closeBtn } from '@/utils/constants/texts';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Heading,
  Text,
  Box
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';

interface IDeleteModal extends modalClose {
  modalTitle?: string;
  header?: string;
  text?: string;
  event: () => void;
  eventText?: string;
  deleteModalButtonLoading?: boolean;
}

function DeleteModal({
  modalTitle,
  onClose,
  eventText,
  deleteModalButtonLoading,
  header,
  text,
  event
}: IDeleteModal) {
  return (
    <ModalContent>
      <ModalHeader>{modalTitle ?? 'Xəbərdarlıq'}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Flex>
          <Box mr={5}>
            <FiAlertCircle
              color="#9A0021"
              className="sidebar-item-icon"
              fontSize={90}
            />
          </Box>
          <Box>
            <Heading size="lg">
              {header ??
                'Məlumat Silinəcək, davam etmək istədiyinizə əminsinizmi?'}
            </Heading>
            <Text>{text ?? 'Məlumatlar silinəcək!'}</Text>
          </Box>
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
          {closeBtn}
        </Button>
        <Button
          type="button"
          isDisabled={deleteModalButtonLoading}
          isLoading={deleteModalButtonLoading}
          onClick={event}
          variant="ghost"
        >
          {eventText ?? 'Sil'}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default DeleteModal;
