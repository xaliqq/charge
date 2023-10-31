/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import { modalClose } from '@/models/common';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  useToast,
  FormControl,
  FormLabel,
  Stack,
  Input
} from '@chakra-ui/react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { closeBtn } from '@/utils/constants/texts';
import { AxiosError } from 'axios';
import { IConnectorTypesItem } from '@/models/connector-types';
import { ConnectorTypeServices } from '@/services/connector-type-services/connector-type-services';

interface IConnectorTypeEditPayload {
  id: number;
  name: string;
}
interface IConnectorTypeEditModal extends modalClose {
  selectedItem: IConnectorTypesItem;
}
function ConnectorTypeEditModal({
  onClose,
  setRefreshComponent,
  selectedItem
}: IConnectorTypeEditModal) {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting }
  } = useForm<IConnectorTypeEditPayload>({
    mode: 'onChange',
    defaultValues: {
      id: selectedItem.id,
      name: selectedItem.name
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IConnectorTypeEditPayload> = async (
    data: IConnectorTypeEditPayload
  ): Promise<void> => {
    try {
      await ConnectorTypeServices.getInstance().updateConnectorType(data);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Birləşdirici məlumatları uğurla yeniləndi',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true
      });
      onClose && onClose();
      setRefreshComponent && setRefreshComponent((prev: boolean) => !prev);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
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
              'Birləşdirici məlumatlarının yenilənməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  return (
    <ModalContent>
      <ModalHeader>MƏLUMATA DÜZƏLİŞ EDİLMƏSİ</ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <Box>
          <form
            id="connector-type-edit-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl isRequired id="name">
                    <FormLabel fontSize="sm" mb={1}>
                      Adı
                    </FormLabel>
                    <Input
                      onChange={onChange}
                      value={value}
                      borderRadius="md"
                      type="text"
                      placeholder="Daxil edin"
                    />
                  </FormControl>
                )}
              />
            </Stack>
          </form>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Button mr={3} variant="gray" onClick={onClose}>
          {closeBtn}
        </Button>
        <Button
          form="connector-type-edit-modal-submit-btn"
          type="submit"
          isDisabled={!isValid}
          isLoading={isSubmitting}
        >
          Düzəliş
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default ConnectorTypeEditModal;
