/* eslint-disable no-unused-vars */
import { IUpdateCareerBannerItem } from '@/models/career';
import {
  inputValidationText,
  inputPlaceholderText
} from '@/utils/constants/texts';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Skeleton,
  Stack,
  Textarea,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Uploader from '@/components/forms/uploader/uploader';
import {
  CareerServices,
  IGetCareerBannerResponse
} from '@/services/career-services/career-services';
import { AxiosError } from 'axios';

function CareerBanner() {
  const [loading, setLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState<File | string | null>(null);
  const [comingPhoto, setComingPhoto] = useState<File | string | null>(null);

  const {
    handleSubmit: handleSubmitForm,
    control: controlForm,
    setValue,
    watch,
    formState: {
      errors: errorsForm,
      isValid: isValidForm,
      isSubmitting: isSubmittingForm
    }
  } = useForm<IUpdateCareerBannerItem>({
    mode: 'onChange',
    defaultValues: {
      titleAz: '',
      titleEn: '',
      titleRu: '',
      photo: null
    }
  });
  const toast = useToast();

  const getCareerBannerData = async (): Promise<void> => {
    setLoading(true);

    try {
      const res: IGetCareerBannerResponse =
        await CareerServices.getInstance().getCareerBanner();

      setValue('titleAz', res.data.titleAz);
      setValue('titleEn', res.data.titleEn);
      setValue('titleRu', res.data.titleRu);
      setComingPhoto(res.data.imageUrl);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);

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
              'Karyera banner məlumatlarının yenilənməsi  zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };
  const onSubmit: SubmitHandler<IUpdateCareerBannerItem> = async (
    data: IUpdateCareerBannerItem
  ) => {
    const payload = new FormData();
    payload.append('titleAz', data?.titleAz || '');
    payload.append('titleEn', data?.titleEn || '');
    payload.append('titleRu', data?.titleRu || '');
    // eslint-disable-next-line no-unused-expressions
    photo && payload.append('photo', photo || '');

    try {
      await CareerServices.getInstance().updateCareerBanner(payload);
      getCareerBannerData();
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
              'Karyera banner  məlumatlarının yenilənməsi  zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  useEffect(() => {
    getCareerBannerData();
  }, []);

  return (
    <Box>
      {!loading ? (
        <form onSubmit={handleSubmitForm(onSubmit)}>
          <Box mb={5}>
            <Box mt={5}>
              <Uploader
                onChange={e => setPhoto(e[0])}
                limit={1}
                accept={['image/png', 'image/jpg', 'image/jpeg']}
              />
            </Box>
            {comingPhoto && (
              <Box mt={5}>
                <Image
                  border="1px solid black"
                  h={300}
                  w={300}
                  mb={1}
                  objectFit="contain"
                  src={`${import.meta.env.VITE_BASE_URL_IMG}${comingPhoto}`}
                />
              </Box>
            )}
          </Box>
          <Flex alignItems="space-between" gap="20px">
            <Box w="30%">
              <Controller
                control={controlForm}
                name="titleAz"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Başlıq (AZ)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errorsForm.titleAz)}
                    isRequired
                    id="titleAz"
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Başlıq (AZ)
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errorsForm.titleAz ? errorsForm.titleAz.message : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        placeholder={inputPlaceholderText('Başlıq (AZ)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
            </Box>
            <Box w="30%">
              <Controller
                control={controlForm}
                name="titleEn"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Başlıq (EN)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errorsForm.titleEn)}
                    isRequired
                    id="titleEn"
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Başlıq (EN)
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errorsForm.titleEn ? errorsForm.titleEn.message : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        placeholder={inputPlaceholderText('Başlıq (EN)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
            </Box>
            <Box w="30%">
              <Controller
                control={controlForm}
                name="titleRu"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Başlıq (RU)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errorsForm.titleRu)}
                    isRequired
                    id="titleRu"
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Başlıq (RU)
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errorsForm.titleRu ? errorsForm.titleRu.message : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        placeholder={inputPlaceholderText('Başlıq (RU)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
            </Box>
            <Flex w="10%" alignSelf="end" justifyContent="flex-end">
              <Button
                isDisabled={
                  !isValidForm ||
                  photo === undefined ||
                  photo === null ||
                  photo === ''
                }
                type="submit"
                isLoading={isSubmittingForm}
                alignSelf="end"
              >
                Yenilə
              </Button>
            </Flex>
          </Flex>
        </form>
      ) : (
        <Stack>
          <Skeleton height="220px" />
        </Stack>
      )}
    </Box>
  );
}

export default CareerBanner;
