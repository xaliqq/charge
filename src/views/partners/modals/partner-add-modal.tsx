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
import { IPartnersItem } from '@/models/partner';
import { PartnerServices } from '@/services/partner-services/partner-services';

function PartnerAddModal({ onClose, setRefreshComponent }: modalClose) {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IPartnersItem>({
    mode: 'onChange',
    defaultValues: {
      owner: {
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: ''
      },
      name: '',
      taxId: ''
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IPartnersItem> = async (
    data: IPartnersItem
  ): Promise<void> => {
    try {
      await PartnerServices.getInstance().createPartner(data);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Partner məlumatları uğurla əlavə edildi',
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
              'Partner məlumatlarının əlavə edilməsi zamanı xəta baş verdi',
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
            id="partner-add-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="owner.firstname"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Ad')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors?.owner?.firstname)}
                    isRequired
                    id="owner.firstname"
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Ad
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors?.owner?.firstname
                          ? errors?.owner?.firstname.message
                          : ''
                      }
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
                name="owner.lastname"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Soyad')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors?.owner?.lastname)}
                    id="owner.lastname"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Soyad
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors?.owner?.lastname
                          ? errors?.owner?.lastname.message
                          : ''
                      }
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
                name="owner.phoneNumber"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Telefon')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors?.owner?.phoneNumber)}
                    id="owner.phoneNumber"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Telefon
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors?.owner?.phoneNumber
                          ? errors.owner.phoneNumber.message
                          : ''
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
              <Controller
                control={control}
                name="owner.email"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Email')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors?.owner?.email)}
                    id="owner.email"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Email
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors?.owner?.email ? errors.owner.email.message : ''
                      }
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
                name="name"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Şirkətin adı')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.name)}
                    id="name"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Şirkətin adı
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.name ? errors.name.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Şirkətin adı')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="taxId"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('VÖEN')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.taxId)}
                    id="taxId"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      VÖEN
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.taxId ? errors.taxId.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('VÖEN')}
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
          form="partner-add-modal-submit-btn"
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

export default PartnerAddModal;
