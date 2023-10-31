/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import Uploader from '@/components/forms/uploader/uploader';
import { SliderService } from '@/services/web-services/web-services-slider';
import { modalClose, selectOption } from '@/models/common';
import { ISliderListItem } from '@/models/web-slider';
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
  Tooltip
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import {
  closeBtn,
  inputValidationText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { languageOptions } from '@/utils/constants/options';
import { AxiosError } from 'axios';

interface IWebSliderEditPayload {
  languageId: selectOption;
}
interface ISliderEditModal extends modalClose {
  selectedItem: ISliderListItem;
}
function WebSliderEditModal({
  onClose,
  setRefreshComponent,
  selectedItem
}: ISliderEditModal) {
  const [photo, setPhoto] = useState<File | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IWebSliderEditPayload>({
    mode: 'onChange',
    defaultValues: {
      languageId: languageOptions?.find(
        z => z.value.toString() === selectedItem.languageId.toString()
      )
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IWebSliderEditPayload> = async (
    data: IWebSliderEditPayload
  ): Promise<void> => {
    const formData = new FormData();
    selectedItem && formData.append('id', selectedItem.id.toString());
    photo && formData.append('Photo', photo);

    formData.append('LanguageId', data?.languageId.value.toString());
    try {
      await new SliderService().updateItem(formData);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Slider məlumatları uğurla yeniləndi',
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
              'Slider məlumatlarının yenilənməsi zamanı xəta baş verdi',
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
            id="web-slider-edit-modal-submit-btn"
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
              src={`${import.meta.env.VITE_BASE_URL_IMG}${selectedItem?.photo}`}
            />
          </Box>
        )}
      </ModalBody>

      <ModalFooter>
        <Button mr={3} variant="gray" onClick={onClose}>
          {closeBtn}
        </Button>
        <Button
          form="web-slider-edit-modal-submit-btn"
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

export default WebSliderEditModal;
