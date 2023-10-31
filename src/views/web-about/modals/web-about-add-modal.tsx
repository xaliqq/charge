/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import Uploader from '@/components/forms/uploader/uploader';
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
  Tooltip,
  PinInput,
  PinInputField,
  HStack
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
import { AboutService } from '@/services/web-services/web-services-about';
import { AxiosError } from 'axios';

interface IWebAboutAddPayload {
  languageId: selectOption | null;
  title: string;
  description: string;
  year: string;
}

function WebAboutAddModal({ onClose, setRefreshComponent }: modalClose) {
  const [photo, setPhoto] = useState<File | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IWebAboutAddPayload>({
    mode: 'onChange',
    defaultValues: {
      languageId: null,
      title: '',
      year: '',
      description: ''
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IWebAboutAddPayload> = async (
    data: IWebAboutAddPayload
  ): Promise<void> => {
    const formData = new FormData();
    photo && formData.append('Photo', photo);
    data?.languageId && formData.append('languageId', data?.languageId?.value);
    formData.append('title', data?.title);
    formData.append('description', data?.description);
    formData.append('year', data?.year);
    try {
      await new AboutService().postItem(formData);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Haqqımızda məlumatları uğurla əlavə edildi',
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
              'Haqqımızda məlumatlarının əlavə edilməsi zamanı xəta baş verdi',
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
            id="web-about-add-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="languageId"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Dil')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.languageId)}
                    id="languageId"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Dil
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.languageId ? errors.languageId.message : ''}
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
                name="title"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Başlıq')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.title)}
                    isRequired
                    id="title"
                  >
                    <FormLabel>Başlıq</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.title ? errors.title.message : ''}
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
                name="description"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Açıqlama')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.description)}
                    id="description"
                    isRequired
                  >
                    <FormLabel>Açıqlama</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.description ? errors.description.message : ''
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
              <Controller
                control={control}
                name="year"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('İl')
                  },
                  minLength: {
                    value: 4,
                    message: 'Ən azı 4 rəqəm olmalıdır'
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.year)}
                    id="year"
                    isRequired
                  >
                    <FormLabel>İl</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.year ? errors.year.message : ''}
                    >
                      <HStack>
                        <PinInput onChange={onChange} value={value}>
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                        </PinInput>
                      </HStack>
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
          form="web-about-add-modal-submit-btn"
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

export default WebAboutAddModal;
