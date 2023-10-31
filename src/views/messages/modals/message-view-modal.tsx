/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
import { modalClose } from "@/models/common";
import { IMessageItemDetailed } from "@/models/messages";
import { IGetMessageDetailedResponse, MessagesServices } from "@/services/messages-services/messages-services";
import { closeBtn, noText } from "@/utils/constants/texts";
import { ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Stack, Text, Flex, useToast, Skeleton } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IMessageViewModal extends modalClose {
    selectedId: string | null;
}
function MessageViewModal({
    onClose,
    selectedId
}: IMessageViewModal) {
    const toast = useToast();

    const [detailedMessage, setDetailedMessage] = useState<IMessageItemDetailed>();

    const fetchMessageById = async (id: string) => {
        try {
            const res: IGetMessageDetailedResponse = await MessagesServices.getInstance().getMessageById(id)
            setDetailedMessage(res.data)
        }
        catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                if (error?.response?.data?.messages?.length) {
                    error.response.data.messages?.map((z: string) =>
                        toast({
                            title: 'Xəta baş verdi',
                            description: z,
                            status: 'error',
                            position: 'top-right',
                            duration: 3000,
                            isClosable: true
                        })
                    );
                } else {
                    toast({
                        title: 'Xəta baş verdi',
                        description:
                            'Mesaj məlumatlarının gətirilməsi zamanı xəta baş verdi',
                        status: 'error',
                        position: 'top-right',
                        duration: 3000,
                        isClosable: true
                    });
                }
            }
        }
    }

    useEffect(() => { selectedId && fetchMessageById(selectedId) }, [])



    return <ModalContent>
        <ModalHeader>MƏLUMATA BAXIŞ</ModalHeader>

        <ModalCloseButton />
        <ModalBody>
            {detailedMessage ? <Flex>
                <Stack p={3} bg="gray.100" spacing={2}>
                    <Text fontSize='sm'>AD: </Text>
                    <Text fontSize='sm'>SOYAD: </Text>
                    <Text fontSize='sm'>TELEFON: </Text>
                    <Text fontSize='sm'>CİNS: </Text>
                    <Text fontSize='sm'>TARİX: </Text>
                    <Text fontSize='sm'>YER: </Text>
                    <Text fontSize='sm'>MESAJ: </Text>
                </Stack>
                <Stack ml={8} p={3} spacing={2}>
                    <Text fontSize='sm'>{detailedMessage?.senderFirstname ?? noText}</Text>
                    <Text fontSize='sm'> {detailedMessage?.senderLastname ?? noText}</Text>
                    <Text fontSize='sm'> {detailedMessage?.senderPhone ?? noText}</Text>
                    <Text fontSize='sm'> {detailedMessage?.sendersGender ?? noText}</Text>
                    <Text fontSize='sm'> {detailedMessage?.createdAt ?? noText}</Text>
                    <Text fontSize='sm'> {detailedMessage?.organizationName ?? noText}</Text>
                    <Text fontSize='sm'> {detailedMessage?.description ?? noText}</Text>

                </Stack>
            </Flex> : <Skeleton height={200} />}
        </ModalBody>

        <ModalFooter>
            <Button mr={3} variant="gray" onClick={onClose}>
                {closeBtn}
            </Button>
        </ModalFooter>
    </ModalContent>
}

export default MessageViewModal;
