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
  editBtn,
  closeBtn,
  inputPlaceholderText,
  inputValidationText
} from '@/utils/constants/texts';

import { AxiosError } from 'axios';
import { IPartnersItem } from '@/models/partner';
import { PartnerServices } from '@/services/partner-services/partner-services';

interface IPartnerEditModal extends modalClose {
  selectedItem: IPartnersItem | null;
}
function PartnerEditModal({
  onClose,
  setRefreshComponent,
  selectedItem
}: IPartnerEditModal) {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IPartnersItem>({
    mode: 'onChange',
    defaultValues: {
      id: selectedItem?.id,
      percentage: selectedItem?.percentage
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IPartnersItem> = async (
    data: IPartnersItem
  ): Promise<void> => {
    try {
      await PartnerServices.getInstance().updatePartner(data);
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
            id="partner-edit-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="percentage"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Ad')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors?.percentage)}
                    isRequired
                    id="percentage"
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Gəlir faizi
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors?.percentage ? errors?.percentage.message : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="number"
                        min={0}
                        max={100}
                        placeholder={inputPlaceholderText('Gəlir faizi')}
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
          form="partner-edit-modal-submit-btn"
          type="submit"
          isDisabled={!isValid}
          isLoading={isSubmitting}
        >
          {editBtn}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default PartnerEditModal;
