import {
  Box,
  Flex,
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
  Input,
  useToast,
  Skeleton,
  Stack,
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
import { NavLink } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { addBtn, inputPlaceholderText, noText } from '@/utils/constants/texts';
import { IHTTPSParams } from '@/services/config';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import Pagination from '@/components/display/pagination/pagination';
import NoData from '@/components/feedback/no-data/no-data';
import {
  AdminServices,
  IGetAdminsResponse
} from '@/services/admin-services/admin-services';
import { IAdminsItem } from '@/models/admins';
import AdminViewModal from '../modals/admin-view-modal';
import AdminAddModal from '../modals/admin-add-modal';

interface IAdminsFilter {
  firstname: string;
  lastname: string;
  email: string;
}

function Admins() {
  const { handleSubmit, setValue, control } = useForm<IAdminsFilter>({
    mode: 'onChange',
    defaultValues: {
      firstname: '',
      lastname: '',
      email: ''
    }
  });
  const toast = useToast();
  const viewModal = useDisclosure();
  const addModal = useDisclosure();

  const [page, setCurrentPage] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<IAdminsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersData, setAdminsData] = useState<IGetAdminsResponse>();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  // const [disableSwitch, setDisableSwitch] = useState<boolean>(false);

  const resetForm = (): void => {
    setValue('firstname', '');
    setValue('lastname', '');
    setValue('email', '');

    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const res: IGetAdminsResponse =
        await AdminServices.getInstance().getAdmins([
          ...queryParams,
          { name: 'page', value: page }
        ]);
      setAdminsData(res);
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
              'İstifadəçilər məlumatlarının gətirilməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const onSubmit: SubmitHandler<IAdminsFilter> = async (
    data: IAdminsFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IAdminsFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  useEffect(() => {
    fetchData();
  }, [page, refreshComponent]);
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

              <BreadcrumbLink isCurrentPage as={NavLink} to="/admins">
                Adminlər
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
          <Button onClick={addModal.onOpen}>{addBtn}</Button>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Grid templateColumns="repeat(3,1fr)" py={1} gap={3}>
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
                    AD
                  </Th>
                  <Th textTransform="initial">SOYAD</Th>
                  <Th textTransform="initial">EMAİL </Th>
                  <Th textTransform="initial">TELEFON</Th>
                </Tr>
              </Thead>
              {usersData?.data?.data && usersData?.data?.data?.length > 0 ? (
                <Tbody textAlign="left">
                  {usersData?.data?.data?.map((z: IAdminsItem) => (
                    <Tr
                      _hover={{
                        background: '#efefef'
                      }}
                      cursor="pointer"
                      onClick={() => {
                        setSelectedItem(z);
                        viewModal.onOpen();
                      }}
                      key={z?.id}
                      textAlign="left"
                    >
                      <Td textAlign="left">{z?.firstname ?? noText}</Td>

                      <Td>{z?.lastname ?? noText}</Td>

                      <Td>{z?.email ?? noText}</Td>
                      <Td>{z?.phoneNumber ?? noText}</Td>
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

            {usersData?.data?.data && usersData?.data?.data?.length > 0 ? (
              <Flex mt={4} justify="flex-end">
                <Pagination
                  currentPage={page}
                  totalCount={usersData?.data?.totalDataCount}
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
        <AdminViewModal
          selectedItem={selectedItem}
          onClose={viewModal.onClose}
        />
      </Modal>
      <Modal
        scrollBehavior="inside"
        isOpen={addModal.isOpen}
        size="xl"
        variant="big"
        isCentered
        onClose={addModal.onClose}
      >
        <ModalOverlay />
        <AdminAddModal
          setRefreshComponent={setRefreshComponent}
          onClose={addModal.onClose}
        />
      </Modal>
    </>
  );
}

export default Admins;
