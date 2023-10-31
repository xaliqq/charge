import { isBlockedOptions } from '@/utils/constants/options';
import {
  inputPlaceholderText,
  noText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { Select } from 'chakra-react-select';
import {
  Flex,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  useToast,
  Input,
  Skeleton,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { BiHome, BiReset } from 'react-icons/bi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { selectOption } from '@/models/common';
import { IClientsItem } from '@/models/clients';
import {
  ClientsServies,
  IGetClientsResponse
} from '@/services/clients-services/clients-services';
import { IHTTPSParams } from '@/services/config';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import { AxiosError } from 'axios';
import Pagination from '@/components/display/pagination/pagination';
import NoData from '@/components/feedback/no-data/no-data';
import ClientsViewModal from '../modals/clients-view-modal';

interface IBranchesFilter {
  isBlocked: selectOption | null | string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
}

function Clients() {
  const { handleSubmit, setValue, control } = useForm<IBranchesFilter>({
    mode: 'onChange',
    defaultValues: {
      isBlocked: null,
      firstname: '',
      lastname: '',
      phoneNumber: '',
      email: ''
    }
  });
  const toast = useToast();
  const viewModal = useDisclosure();

  const [page, setCurrentPage] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<IClientsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientsData, setClientsData] = useState<IGetClientsResponse>();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [disableSwitch, setDisableSwitch] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res: IGetClientsResponse =
        await ClientsServies.getInstance().getClients([
          ...queryParams,
          { name: 'page', value: page }
        ]);
      setClientsData(res);
      setLoading(false);
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
              'Filiallar məlumatlarının gətirilməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const resetForm = (): void => {
    setValue('isBlocked', null);
    setValue('firstname', '');
    setValue('lastname', '');
    setValue('phoneNumber', '');
    setValue('email', '');

    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };

  const onSubmit: SubmitHandler<IBranchesFilter> = async (
    data: IBranchesFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IBranchesFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  useEffect(() => {
    fetchData();
  }, [page, refreshComponent]);

  console.log(selectedItem);

  const blockUser = async (id: string) => {
    setDisableSwitch(true);
    try {
      await ClientsServies.getInstance().blockClient(id);
      const obj: any = {
        ...clientsData,
        datas: {
          ...clientsData?.datas,
          datas: clientsData?.datas?.datas?.map(item => {
            if (item?.id === id) {
              return { ...item, isBlocked: !item.isBlocked };
            }
            return item;
          })
        }
      };
      setClientsData(obj);
      setDisableSwitch(false);
    } catch (error: unknown) {
      setDisableSwitch(false);

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
              'Filiallar məlumatlarının dəyişdirilməsi zamanı zamanı xəta baş verdi',
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
    <>
      <Box
        bg="white"
        w="100%"
        shadow="lg"
        px={4}
        py={2}
        borderRadius={6}
        transition=".4s ease"
      >
        <Flex align="center">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={NavLink} to="/home">
                <BiHome />
              </BreadcrumbLink>
              <BreadcrumbSeparator />

              <BreadcrumbLink isCurrentPage as={NavLink} to="/clients">
                Müştərilər
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
      </Box>
      <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading fontWeight="medium" mb={1} size="xs">
            FİLTR
          </Heading>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Grid templateColumns="repeat(2,1fr)" py={1} gap={3}>
              <GridItem>
                <Controller
                  control={control}
                  name="isBlocked"
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="isBlocked">
                      <FormLabel fontSize="sm">Bloklanma statusu</FormLabel>
                      <Select
                        onChange={onChange}
                        value={value}
                        options={isBlockedOptions}
                        placeholder={
                          <div className="custom-select-placeholder">
                            {selectPlaceholderText('Bloklanma statusu')}
                          </div>
                        }
                        isClearable
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem>
                <Controller
                  control={control}
                  name="firstname"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="firstname">
                      <FormLabel fontSize="sm">Ad</FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Ad')}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem>
                <Controller
                  control={control}
                  name="lastname"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="lastname">
                      <FormLabel fontSize="sm">Soyad</FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Soyad')}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem>
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="phoneNumber">
                      <FormLabel fontSize="sm">Telefon</FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Telefon')}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="email">
                      <FormLabel fontSize="sm">Email</FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Email')}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
            </Grid>
            <Flex mt={2} justify="flex-end">
              <IconButton
                variant="outline"
                onClick={resetForm}
                aria-label="Show password"
                icon={<BiReset size={22} />}
              />
              <Button type="submit" ml={2} variant="solid">
                Axtar
              </Button>
            </Flex>
          </Box>
        </form>
      </Box>
      <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
        <Heading size="xs" mb={1} fontWeight="medium">
          CƏDVƏL
        </Heading>
        {!loading ? (
          <Box overflowX="auto">
            <Table overflowX="auto" size="sm">
              <Thead textAlign="left">
                <Tr>
                  <Th textAlign="left" textTransform="initial">
                    TELEFON
                  </Th>
                  <Th textTransform="initial">EMAİL </Th>
                  <Th textTransform="initial">AD</Th>
                  <Th textTransform="initial">SOYAD</Th>
                  <Th textTransform="initial">BLOK STATUSU</Th>
                </Tr>
              </Thead>
              {clientsData?.datas?.datas &&
              clientsData?.datas?.datas?.length > 0 ? (
                <Tbody textAlign="left">
                  {clientsData?.datas?.datas?.map((z: IClientsItem) => (
                    <Tr
                      cursor="pointer"
                      onClick={() => {
                        setSelectedItem(z);
                        viewModal.onOpen();
                      }}
                      key={z?.id}
                      textAlign="left"
                    >
                      <Td textAlign="left">{z?.phoneNumber ?? noText}</Td>

                      <Td>{z?.email ?? noText}</Td>

                      <Td>{z?.firstname ?? noText}</Td>
                      <Td>{z?.lastname ?? noText}</Td>
                      <Td>
                        <FormControl
                          onClick={e => e.stopPropagation()}
                          display="flex"
                          alignItems="center"
                        >
                          <Switch
                            isDisabled={disableSwitch}
                            colorScheme="brand"
                            onChange={() => {
                              setSelectedItem(z);
                              blockUser(z?.id);
                            }}
                            isChecked={z?.isBlocked}
                            id="switch-input"
                          />
                        </FormControl>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              ) : (
                <Tbody>
                  <Tr>
                    <Td
                      bg="transparent !important"
                      colSpan={7}
                      textAlign="center"
                    >
                      <NoData />
                    </Td>
                  </Tr>
                </Tbody>
              )}
            </Table>

            {clientsData?.datas?.datas &&
            clientsData?.datas?.datas?.length > 0 ? (
              <Flex mt={4} justify="flex-end">
                <Pagination
                  currentPage={page}
                  totalCount={clientsData?.datas?.totalDataCount}
                  pageSize={10}
                  onPageChange={(z: number) => setCurrentPage(z)}
                />
              </Flex>
            ) : null}
          </Box>
        ) : (
          <Stack>
            <Skeleton height="30px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
          </Stack>
        )}
      </Box>

      <Modal
        scrollBehavior="inside"
        isOpen={viewModal.isOpen}
        size="xl"
        variant="big"
        isCentered
        onClose={viewModal.onClose}
      >
        <ModalOverlay />
        <ClientsViewModal
          selectedItem={selectedItem}
          onClose={viewModal.onClose}
        />
      </Modal>
    </>
  );
}

export default Clients;
