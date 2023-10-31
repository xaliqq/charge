/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-no-bind */
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
  Input,
  Tooltip
} from '@chakra-ui/react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import {
  addBtn,
  closeBtn,
  inputPlaceholderText,
  inputValidationText
} from '@/utils/constants/texts';

import { AxiosError } from 'axios';
import { IAdminsItem } from '@/models/admins';
import { AdminServices } from '@/services/admin-services/admin-services';

function AdminAddModal({ onClose, setRefreshComponent }: modalClose) {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IAdminsItem>({
    mode: 'onChange',
    defaultValues: {
      firstname: '',
      lastname: '',
      phoneNumber: '',
      email: ''
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IAdminsItem> = async (
    data: IAdminsItem
  ): Promise<void> => {
    try {
      await AdminServices.getInstance().createAdmin(data);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Admin məlumatları uğurla əlavə edildi',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true
      });
      onClose && onClose();
      setRefreshComponent && setRefreshComponent((prev: boolean) => !prev);
    } catch (error: unknown) {
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
              'Admin məlumatlarının əlavə edilməsi zamanı xəta baş verdi',
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
            noValidate
            id="admin-add-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="firstname"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Ad')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.firstname)}
                    isRequired
                    id="firstname"
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Ad
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.firstname ? errors.firstname.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Ad')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="lastname"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Soyad')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.lastname)}
                    id="lastname"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Soyad
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.lastname ? errors.lastname.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Soyad')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="email"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Email')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.email)}
                    id="email"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Email
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.email ? errors.email.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Email')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('phoneNumber')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.phoneNumber)}
                    id="phoneNumber"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Telefon
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.phoneNumber ? errors.phoneNumber.message : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Telefon')}
                      />
                    </Tooltip>
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
          form="admin-add-modal-submit-btn"
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

export default AdminAddModal;
