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
import { addBtn, closeBtn } from '@/utils/constants/texts';
import { AxiosError } from 'axios';
import { ConnectorTypeServices } from '@/services/connector-type-services/connector-type-services';

interface IConnectorTypeAddPayload {
  name: string;
}

function ConnectorTypeAddModal({ onClose, setRefreshComponent }: modalClose) {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting }
  } = useForm<IConnectorTypeAddPayload>({
    mode: 'onChange',
    defaultValues: {
      name: ''
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IConnectorTypeAddPayload> = async (
    data: IConnectorTypeAddPayload
  ): Promise<void> => {
    try {
      await ConnectorTypeServices.getInstance().createConnectorType(data);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Birləşdirici məlumatları uğurla əlavə edildi',
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
              'Birləşdirici məlumatlarının əlavə edilməsi zamanı xəta baş verdi',
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
      <ModalHeader>MƏLUMATIN ƏLAVƏ EDİLMƏSİ</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box>
          <form
            id="connector-type-add-modal-submit-btn"
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
          form="connector-type-add-modal-submit-btn"
          type="submit"
          isDisabled={!isValid}
          isLoading={isSubmitting}
        >
          {addBtn}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default ConnectorTypeAddModal;
