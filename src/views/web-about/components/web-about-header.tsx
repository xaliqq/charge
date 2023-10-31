import {
  AboutService,
  IWebAboutHeaderGetResponse,
  IWebAboutHeaderUpdatePayload
} from '@/services/web-services/web-services-about';
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

interface IWebAboutHeader {
  title: string;
  description: string;
}

function WebAboutHeader() {
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
  } = useForm<IWebAboutHeader>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: ''
    }
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
  } = useForm<IWebAboutHeader>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: ''
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
  } = useForm<IWebAboutHeader>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: ''
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
      const res: IWebAboutHeaderGetResponse =
        await new AboutService().getItemsHeader(activeLang());

      if (res.data.languageId === 1) {
        setValue1('description', res.data.description);
        setValue1('title', res.data.title);
      }

      if (res.data.languageId === 2) {
        setValue2('description', res.data.description);
        setValue2('title', res.data.title);
      }
      if (res.data.languageId === 3) {
        setValue3('description', res.data.description);
        setValue3('title', res.data.title);
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
  const onSubmit: SubmitHandler<IWebAboutHeader> = async (
    data: IWebAboutHeader
  ) => {
    const payload: IWebAboutHeaderUpdatePayload = {
      ...data,
      languageId: activeLang()
    };
    try {
      await new AboutService().updateItemHeader(payload);
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
              'Haqqımızda  məlumatlarının yenilənməsi  zamanı xəta baş verdi',
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
                <Flex alignItems="space-between" gap="20px">
                  <Box w="20%">
                    <Controller
                      control={controlForm1}
                      name="title"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText('Dil')
                        }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <FormControl
                          isInvalid={Boolean(errorsForm1.title)}
                          isRequired
                          id="title"
                        >
                          <FormLabel fontSize="sm" mb={1}>
                            Başlıq
                          </FormLabel>
                          <Tooltip
                            hasArrow
                            placement="top-end"
                            label={
                              errorsForm1.title ? errorsForm1.title.message : ''
                            }
                          >
                            <Textarea
                              onChange={onChange}
                              value={value}
                              placeholder={inputPlaceholderText('Başlıq')}
                            />
                          </Tooltip>
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Box w="70%">
                    <Controller
                      control={controlForm1}
                      name="description"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText('Açıqlama')
                        }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <FormControl
                          isInvalid={Boolean(errorsForm1.description)}
                          id="description"
                          isRequired
                        >
                          <FormLabel fontSize="sm" mb={1}>
                            Açıqlama
                          </FormLabel>
                          <Tooltip
                            hasArrow
                            placement="top-end"
                            label={
                              errorsForm1.description
                                ? errorsForm1.description.message
                                : ''
                            }
                          >
                            <Textarea
                              onChange={onChange}
                              value={value}
                              placeholder={inputPlaceholderText('Açıqlama')}
                            />
                          </Tooltip>
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Flex w="10%" alignSelf="end" justifyContent="flex-end">
                    <Button
                      isDisabled={!isValidForm1}
                      type="submit"
                      isLoading={isSubmittingForm1}
                      alignSelf="end"
                    >
                      Yenilə
                    </Button>
                  </Flex>
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
                <Flex alignItems="space-between" gap="20px">
                  <Box w="20%">
                    <Controller
                      control={controlForm2}
                      name="title"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText('Dil')
                        }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <FormControl
                          isInvalid={Boolean(errorsForm2.title)}
                          isRequired
                          id="title"
                        >
                          <FormLabel fontSize="sm" mb={1}>
                            Başlıq
                          </FormLabel>
                          <Tooltip
                            hasArrow
                            placement="top-end"
                            label={
                              errorsForm2.title ? errorsForm2.title.message : ''
                            }
                          >
                            <Textarea
                              onChange={onChange}
                              value={value}
                              placeholder={inputPlaceholderText('Başlıq')}
                            />
                          </Tooltip>
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Box w="70%">
                    <Controller
                      control={controlForm2}
                      name="description"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText('Açıqlama')
                        }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <FormControl
                          isInvalid={Boolean(errorsForm2.description)}
                          id="description"
                          isRequired
                        >
                          <FormLabel fontSize="sm" mb={1}>
                            Açıqlama
                          </FormLabel>
                          <Tooltip
                            hasArrow
                            placement="top-end"
                            label={
                              errorsForm2.description
                                ? errorsForm2.description.message
                                : ''
                            }
                          >
                            <Textarea
                              onChange={onChange}
                              value={value}
                              placeholder={inputPlaceholderText('Açıqlama')}
                            />
                          </Tooltip>
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Flex w="10%" alignSelf="end" justifyContent="flex-end">
                    <Button
                      isDisabled={!isValidForm2}
                      type="submit"
                      isLoading={isSubmittingForm2}
                      alignSelf="end"
                    >
                      Yenilə
                    </Button>
                  </Flex>
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
                <Flex alignItems="space-between" gap="20px">
                  <Box w="20%">
                    <Controller
                      control={controlForm3}
                      name="title"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText('Dil')
                        }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <FormControl
                          isInvalid={Boolean(errorsForm3.title)}
                          isRequired
                          id="title"
                        >
                          <FormLabel fontSize="sm" mb={1}>
                            Başlıq
                          </FormLabel>
                          <Tooltip
                            hasArrow
                            placement="top-end"
                            label={
                              errorsForm3.title ? errorsForm3.title.message : ''
                            }
                          >
                            <Textarea
                              onChange={onChange}
                              value={value}
                              placeholder={inputPlaceholderText('Başlıq')}
                            />
                          </Tooltip>
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Box w="70%">
                    <Controller
                      control={controlForm3}
                      name="description"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText('Açıqlama')
                        }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <FormControl
                          isInvalid={Boolean(errorsForm3.description)}
                          id="description"
                          isRequired
                        >
                          <FormLabel fontSize="sm" mb={1}>
                            Açıqlama
                          </FormLabel>
                          <Tooltip
                            hasArrow
                            placement="top-end"
                            label={
                              errorsForm3.description
                                ? errorsForm3.description.message
                                : ''
                            }
                          >
                            <Textarea
                              onChange={onChange}
                              value={value}
                              placeholder={inputPlaceholderText('Açıqlama')}
                            />
                          </Tooltip>
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Flex w="10%" alignSelf="end" justifyContent="flex-end">
                    <Button
                      isDisabled={!isValidForm3}
                      type="submit"
                      isLoading={isSubmittingForm3}
                      alignSelf="end"
                    >
                      Yenilə
                    </Button>
                  </Flex>
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

export default WebAboutHeader;
