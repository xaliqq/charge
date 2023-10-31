/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import Uploader from '@/components/forms/uploader/uploader';
import { ElevenService } from '@/services/web-services/web-services-eleven';
import { modalClose, selectOption } from '@/models/common';
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
import { useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import {
  addBtn,
  closeBtn,
  inputPlaceholderText,
  inputValidationText,
  selectPlaceholderText
} from '@/utils/constants/texts';

import { Select } from 'chakra-react-select';
import { languageOptions } from '@/utils/constants/options';
import { AxiosError } from 'axios';

interface IWebElevenAddPayload {
  LanguageId: selectOption | null;
  Title: string;
  Description: string;
}

function WebElevenAddModal({ onClose, setRefreshComponent }: modalClose) {
  const [photo, setPhoto] = useState<File | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IWebElevenAddPayload>({
    mode: 'onChange',
    defaultValues: {
      LanguageId: null,
      Title: '',
      Description: ''
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IWebElevenAddPayload> = async (
    data: IWebElevenAddPayload
  ): Promise<void> => {
    const formData = new FormData();
    photo && formData.append('Photo', photo);
    data?.LanguageId && formData.append('LanguageId', data?.LanguageId?.value);
    formData.append('Title', data?.Title);
    formData.append('Description', data?.Description);
    try {
      await new ElevenService().postItem(formData);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'İnqridient məlumatları uğurla əlavə edildi',
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
              'İnqridient məlumatlarının əlavə edilməsi zamanı xəta baş verdi',
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
            id="web-Eleven-add-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="LanguageId"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Dil')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.LanguageId)}
                    id="LanguageId"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Dil
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.LanguageId ? errors.LanguageId.message : ''}
                    >
                      <div>
                        <Select
                          onChange={onChange}
                          value={value}
                          options={languageOptions}
                          placeholder={selectPlaceholderText('Dil')}
                          isClearable
                        />
                      </div>
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="Title"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Başlıq')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.Title)}
                    isRequired
                    id="Title"
                  >
                    <FormLabel>Başlıq</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.Title ? errors.Title.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Başlıq')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="Description"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Açıqlama')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.Description)}
                    id="Description"
                    isRequired
                  >
                    <FormLabel>Açıqlama</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.Description ? errors.Description.message : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Açıqlama')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
            </Stack>
          </form>
        </Box>
        <Box mt={5}>
          <Uploader
            onChange={e => setPhoto(e[0])}
            limit={1}
            accept={['image/png', 'image/jpg', 'image/jpeg']}
          />
        </Box>
      </ModalBody>

      <ModalFooter>
        <Button mr={3} variant="gray" onClick={onClose}>
          {closeBtn}
        </Button>
        <Button
          form="web-Eleven-add-modal-submit-btn"
          type="submit"
          isDisabled={photo === undefined || !isValid}
          isLoading={isSubmitting}
        >
          {addBtn}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default WebElevenAddModal;
