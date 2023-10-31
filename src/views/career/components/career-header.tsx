import { ICareerHeaderPayload } from '@/models/career';
import {
  CareerServices,
  IGetCareerHeaderResponse
} from '@/services/career-services/career-services';
import {
  inputPlaceholderText,
  inputValidationText
} from '@/utils/constants/texts';
import {
  Flex,
  FormControl,
  FormLabel,
  Button,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  Tooltip,
  useToast,
  Skeleton,
  Stack
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

interface ICareerHeaderItem {
  titleFirst: string;
  titleSecond: string;
  descriptionFirst: string;
  descriptionSecond: string;
}

function CareerHeader() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit: handleSubmitForm1,
    control: controlForm1,
    setValue: setValue1,
    formState: {
      errors: errorsForm1,
      isValid: isValidForm1,
      isSubmitting: isSubmittingForm1
    }
  } = useForm<ICareerHeaderItem>({
    mode: 'onChange'
  });

  const {
    handleSubmit: handleSubmitForm2,
    control: controlForm2,
    setValue: setValue2,
    formState: {
      errors: errorsForm2,
      isValid: isValidForm2,
      isSubmitting: isSubmittingForm2
    }
  } = useForm<ICareerHeaderItem>({
    mode: 'onChange',
    defaultValues: {
      titleFirst: '',
      titleSecond: '',
      descriptionFirst: '',
      descriptionSecond: ''
    }
  });

  const {
    handleSubmit: handleSubmitForm3,
    control: controlForm3,
    setValue: setValue3,
    formState: {
      errors: errorsForm3,
      isValid: isValidForm3,
      isSubmitting: isSubmittingForm3
    }
  } = useForm<ICareerHeaderItem>({
    mode: 'onChange',
    defaultValues: {
      titleFirst: '',
      titleSecond: '',
      descriptionFirst: '',
      descriptionSecond: ''
    }
  });

  const activeLang = (): number => {
    switch (activeTab) {
      case 0: {
        return 1;
      }
      case 1: {
        return 2;
      }
      case 2: {
        return 3;
      }
      default: {
        return 1;
      }
    }
  };

  const getWebAboutHeaderData = async (): Promise<void> => {
    setLoading(true);

    try {
      const res: IGetCareerHeaderResponse =
        await CareerServices.getInstance().getCareerHeader(activeLang());
      if (res.data.languageId === 1) {
        setValue1('titleFirst', res.data.firstHeader.title);
        setValue1('descriptionFirst', res.data.firstHeader.description);
        setValue1('titleSecond', res.data.secondHeader.title);
        setValue1('descriptionSecond', res.data.secondHeader.description);
      }

      if (res.data.languageId === 2) {
        setValue2('titleFirst', res.data.firstHeader.title);
        setValue2('descriptionFirst', res.data.firstHeader.description);
        setValue2('titleSecond', res.data.secondHeader.title);
        setValue2('descriptionSecond', res.data.secondHeader.description);
      }
      if (res.data.languageId === 3) {
        setValue3('titleFirst', res.data.firstHeader.title);
        setValue3('descriptionFirst', res.data.firstHeader.description);
        setValue3('titleSecond', res.data.secondHeader.title);
        setValue3('descriptionSecond', res.data.secondHeader.description);
      }
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
              'Haqqımızda Başlıq/açıqlama məlumatlarının yenilənməsi  zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };
  const onSubmit: SubmitHandler<ICareerHeaderItem> = async (
    data: ICareerHeaderItem
  ) => {
    const payload: ICareerHeaderPayload = {
      firstHeader: {
        title: data.titleFirst,
        description: data.descriptionFirst
      },
      secondHeader: {
        title: data.titleSecond,
        description: data.descriptionSecond
      },
      languageId: activeLang()
    };
    try {
      await CareerServices.getInstance().updateCareerHeader(payload);
      getWebAboutHeaderData();
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
              'Karyera başlığ  məlumatlarının yenilənməsi  zamanı xəta baş verdi',
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
    getWebAboutHeaderData();
  }, [activeTab]);
  return (
    <Box>
      <Tabs
        onChange={e => {
          setActiveTab(e);
        }}
      >
        <TabList>
          <Tab>AZ</Tab>
          <Tab>EN</Tab>
          <Tab>RU</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            {!loading ? (
              <form onSubmit={handleSubmitForm1(onSubmit)}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  gap="20px"
                >
                  <Box w="100%">
                    <Flex gap="10px" justifyContent="space-between">
                      <Box w="100%">
                        <Controller
                          control={controlForm1}
                          name="titleFirst"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Yuxarı başlıq')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm1.titleFirst)}
                              isRequired
                              id="titleFirst"
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Yuxarı başlıq
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm1.titleFirst
                                    ? errorsForm1.titleFirst.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Yuxarı başlıq'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                      <Box w="100%">
                        <Controller
                          control={controlForm1}
                          name="descriptionFirst"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Yuxarı açıqlama')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm1.descriptionFirst)}
                              id="descriptionFirst"
                              isRequired
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Yuxarı açıqlama
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm1.descriptionFirst
                                    ? errorsForm1.descriptionFirst.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Yuxarı açıqlama'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                    </Flex>
                    <Flex gap="10px" justifyContent="space-between">
                      <Box w="100%">
                        <Controller
                          control={controlForm1}
                          name="titleSecond"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Aşağı başlıq')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm1.titleSecond)}
                              isRequired
                              id="titleSecond"
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Aşağı başlıq
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm1.titleSecond
                                    ? errorsForm1.titleSecond.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Aşağı başlıq'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                      <Box w="100%">
                        <Controller
                          control={controlForm1}
                          name="descriptionSecond"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Aşağı açıqlama')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm1.descriptionSecond)}
                              id="descriptionSecond"
                              isRequired
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Aşağı açıqlama
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm1.descriptionSecond
                                    ? errorsForm1.descriptionSecond.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Aşağı açıqlama'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                    </Flex>
                  </Box>
                  <Box>
                    <Button
                      isDisabled={!isValidForm1}
                      type="submit"
                      isLoading={isSubmittingForm1}
                      alignSelf="end"
                    >
                      Yenilə
                    </Button>
                  </Box>
                </Flex>
              </form>
            ) : (
              <Stack>
                <Skeleton height="120px" />
              </Stack>
            )}
          </TabPanel>
          <TabPanel px={0}>
            {!loading ? (
              <form onSubmit={handleSubmitForm2(onSubmit)}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  gap="20px"
                >
                  <Box w="100%">
                    <Flex gap="10px" justifyContent="space-between">
                      <Box w="100%">
                        <Controller
                          control={controlForm2}
                          name="titleFirst"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Yuxarı başlıq')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm2.titleFirst)}
                              isRequired
                              id="titleFirst"
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Yuxarı başlıq
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm2.titleFirst
                                    ? errorsForm2.titleFirst.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Yuxarı başlıq'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                      <Box w="100%">
                        <Controller
                          control={controlForm2}
                          name="descriptionFirst"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Yuxarı açıqlama')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm2.descriptionFirst)}
                              id="descriptionFirst"
                              isRequired
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Yuxarı açıqlama
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm2.descriptionFirst
                                    ? errorsForm2.descriptionFirst.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Yuxarı açıqlama'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                    </Flex>
                    <Flex gap="10px" justifyContent="space-between">
                      <Box w="100%">
                        <Controller
                          control={controlForm2}
                          name="titleSecond"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Aşağı başlıq')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm2.titleSecond)}
                              isRequired
                              id="titleSecond"
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Aşağı başlıq
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm2.titleSecond
                                    ? errorsForm2.titleSecond.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Aşağı başlıq'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                      <Box w="100%">
                        <Controller
                          control={controlForm2}
                          name="descriptionSecond"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Aşağı açıqlama')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm2.descriptionSecond)}
                              id="descriptionSecond"
                              isRequired
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Aşağı açıqlama
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm2.descriptionSecond
                                    ? errorsForm2.descriptionSecond.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Aşağı açıqlama'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                    </Flex>
                  </Box>
                  <Box>
                    <Button
                      isDisabled={!isValidForm2}
                      type="submit"
                      isLoading={isSubmittingForm2}
                      alignSelf="end"
                    >
                      Yenilə
                    </Button>
                  </Box>
                </Flex>
              </form>
            ) : (
              <Stack>
                <Skeleton height="120px" />
              </Stack>
            )}
          </TabPanel>
          <TabPanel px={0}>
            {!loading ? (
              <form onSubmit={handleSubmitForm3(onSubmit)}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  gap="20px"
                >
                  <Box w="100%">
                    <Flex gap="10px" justifyContent="space-between">
                      <Box w="100%">
                        <Controller
                          control={controlForm3}
                          name="titleFirst"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Yuxarı başlıq')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm3.titleFirst)}
                              isRequired
                              id="titleFirst"
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Yuxarı başlıq
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm3.titleFirst
                                    ? errorsForm3.titleFirst.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Yuxarı başlıq'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                      <Box w="100%">
                        <Controller
                          control={controlForm3}
                          name="descriptionFirst"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Yuxarı açıqlama')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm3.descriptionFirst)}
                              id="descriptionFirst"
                              isRequired
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Yuxarı açıqlama
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm3.descriptionFirst
                                    ? errorsForm3.descriptionFirst.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Yuxarı açıqlama'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                    </Flex>
                    <Flex gap="10px" justifyContent="space-between">
                      <Box w="100%">
                        <Controller
                          control={controlForm3}
                          name="titleSecond"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Aşağı başlıq')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm3.titleSecond)}
                              isRequired
                              id="titleSecond"
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Aşağı başlıq
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm3.titleSecond
                                    ? errorsForm3.titleSecond.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Aşağı başlıq'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                      <Box w="100%">
                        <Controller
                          control={controlForm3}
                          name="descriptionSecond"
                          rules={{
                            required: {
                              value: true,
                              message: inputValidationText('Aşağı açıqlama')
                            }
                          }}
                          render={({ field: { onChange, value } }) => (
                            <FormControl
                              isInvalid={Boolean(errorsForm3.descriptionSecond)}
                              id="descriptionSecond"
                              isRequired
                            >
                              <FormLabel fontSize="sm" mb={1}>
                                Aşağı açıqlama
                              </FormLabel>
                              <Tooltip
                                hasArrow
                                placement="top-end"
                                label={
                                  errorsForm3.descriptionSecond
                                    ? errorsForm3.descriptionSecond.message
                                    : ''
                                }
                              >
                                <Textarea
                                  onChange={onChange}
                                  value={value}
                                  placeholder={inputPlaceholderText(
                                    'Aşağı açıqlama'
                                  )}
                                />
                              </Tooltip>
                            </FormControl>
                          )}
                        />
                      </Box>
                    </Flex>
                  </Box>
                  <Box>
                    <Button
                      isDisabled={!isValidForm3}
                      type="submit"
                      isLoading={isSubmittingForm3}
                      alignSelf="end"
                    >
                      Yenilə
                    </Button>
                  </Box>
                </Flex>
              </form>
            ) : (
              <Stack>
                <Skeleton height="120px" />
              </Stack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default CareerHeader;
