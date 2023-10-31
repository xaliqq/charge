/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import { SliderService } from '@/services/web-services/web-services-slider';
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
  Tooltip
} from '@chakra-ui/react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import {
  addBtn,
  closeBtn,
  inputValidationText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { AxiosError } from 'axios';
import { Select } from 'chakra-react-select';

interface IWebSliderAddPayload {
  languageId: selectOption | null;
}

function ConnectorAddModal({ onClose, setRefreshComponent }: modalClose) {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IWebSliderAddPayload>({
    mode: 'onChange',
    defaultValues: {
      languageId: null
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<
    IWebSliderAddPayload
  > = async () // data: IWebSliderAddPayload
  : Promise<void> => {
    const formData = new FormData();
    // data?.name && formData.append('name', data?.name);
    try {
      await new SliderService().postItem(formData);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Slider məlumatları uğurla əlavə edildi',
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
              'Slider məlumatlarının əlavə edilməsi zamanı xəta baş verdi',
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
            id="connector-add-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="languageId"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Test')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.languageId)}
                    id="languageId"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Şarj məntəqəsi
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
                          options={[]}
                          placeholder={selectPlaceholderText('Test')}
                          isClearable
                        />
                      </div>
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="languageId"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Test')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.languageId)}
                    id="languageId"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Birləşdirici tipi
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
                          options={[]}
                          placeholder={selectPlaceholderText('Test')}
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
      </ModalBody>

      <ModalFooter>
        <Button mr={3} variant="gray" onClick={onClose}>
          {closeBtn}
        </Button>
        <Button
          form="connector-add-modal-submit-btn"
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

export default ConnectorAddModal;
