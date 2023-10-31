import { IClientsItem } from "@/models/clients";
import { modalClose } from "@/models/common";
import { closeBtn, noText } from "@/utils/constants/texts";
import { ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Stack, Text, Flex } from "@chakra-ui/react";
import React from "react";

interface IClientsViewModal extends modalClose {
    selectedItem: IClientsItem | null;
}
function ClientsViewModal({
    onClose,
    selectedItem
}: IClientsViewModal) {

    console.log(selectedItem);
    return <ModalContent>
        <ModalHeader>MƏLUMATA BAXIŞ</ModalHeader>

        <ModalCloseButton />
        <ModalBody>
            <Flex>
                <Stack p={3} bg="gray.100" spacing={2}>
                    <Text fontSize='sm'>AD: </Text>
                    <Text fontSize='sm'>SOYAD: </Text>
                    <Text fontSize='sm'>TELEFON: </Text>
                    <Text fontSize='sm'>EMAİL: </Text>
                    <Text fontSize='sm'>CİNS: </Text>
                    <Text fontSize='sm'>DOĞUM TARİXİ: </Text>
                </Stack>
                <Stack ml={8} p={3} spacing={2}>
                    <Text fontSize='sm'>{selectedItem?.firstname ?? noText}</Text>
                    <Text fontSize='sm'> {selectedItem?.lastname ?? noText}</Text>
                    <Text fontSize='sm'> {selectedItem?.phoneNumber ?? noText}</Text>
                    <Text fontSize='sm'> {selectedItem?.email ?? noText}</Text>
                    <Text fontSize='sm'> {selectedItem?.gender ?? noText}</Text>
                    <Text fontSize='sm'> {selectedItem?.birthday.slice(0, 10) ?? noText}</Text>
                </Stack>
            </Flex>
        </ModalBody>

        <ModalFooter>
            <Button mr={3} variant="gray" onClick={onClose}>
                {closeBtn}
            </Button>
        </ModalFooter>
    </ModalContent>
}

export default ClientsViewModal;
