/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import Uploader from '@/components/forms/uploader/uploader';
import { AboutService } from '@/services/web-services/web-services-about';
import { modalClose } from '@/models/common';
import { Select } from 'chakra-react-select';
import { IWebAboutItem } from '@/models/web-about';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Image,
  useToast,
  FormControl,
  FormLabel,
  Stack,
  Input,
  Tooltip,
  HStack,
  PinInput,
  PinInputField
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import {
  closeBtn,
  inputPlaceholderText,
  inputValidationText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { languageOptions } from '@/utils/constants/options';
import { AxiosError } from 'axios';

interface IAboutEditModal extends modalClose {
  selectedItem: IWebAboutItem;
}
function WebAboutEditModal({
  onClose,
  setRefreshComponent,
  selectedItem
}: IAboutEditModal) {
  const [photo, setPhoto] = useState<File | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IWebAboutItem>({
    mode: 'onChange',
    defaultValues: {
      id: selectedItem.id,
      title: selectedItem.title,
      year: selectedItem.year.toString(),
      description: selectedItem.description,
      languageId: languageOptions?.find(
        z => z.value.toString() === selectedItem?.languageId?.toString()
      )
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IWebAboutItem> = async (
    data: IWebAboutItem
  ): Promise<void> => {
    const formData = new FormData();
    selectedItem.id && formData.append('id', selectedItem.id.toString());
    photo && formData.append('Photo', photo);

    formData.append('title', data?.title.toString());
    formData.append('year', data?.year.toString());

    formData.append('description', data?.description.toString());
    if (typeof data?.languageId === 'object' && 'value' in data.languageId) {
      formData.append('languageId', data.languageId.value.toString());
    } else {
      // Handle the case when data?.languageId is a number
      formData.append('languageId', data?.languageId.toString());
    }

    try {
      await new AboutService().updateItem(formData);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'İnqridient məlumatları uğurla yeniləndi',
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
              'İnqridient məlumatlarının yenilənməsi zamanı xəta baş verdi',
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
            noValidate
            id="web-About-edit-modal-submit-btn"
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
        {!photo && (
          <Box mt={5}>
            <Image
              border="1px solid black"
              h={300}
              w={300}
              mb={1}
              objectFit="contain"
              src={`${
                import.meta.env.VITE_BASE_URL_IMG
              }${selectedItem?.imageUrl}`}
            />
          </Box>
        )}
      </ModalBody>

      <ModalFooter>
        <Button mr={3} variant="gray" onClick={onClose}>
          {closeBtn}
        </Button>
        <Button
          form="web-About-edit-modal-submit-btn"
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

export default WebAboutEditModal;
