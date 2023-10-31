import Pagination from '@/components/display/pagination/pagination';
import NoData from '@/components/feedback/no-data/no-data';
import { IBranchItem } from '@/models/branches';
import { IGlobalResponse, selectOption } from '@/models/common';
import {
  BranchesServies,
  IGetBranchesResponse
} from '@/services/branches-services/branches-services';
import { IHTTPSParams } from '@/services/config';
import { statusOptions } from '@/utils/constants/options';
import { noText, selectPlaceholderText } from '@/utils/constants/texts';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import {
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  BreadcrumbSeparator,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  useToast,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Modal,
  ModalOverlay,
  Switch
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiDotsVertical, BiHome, BiReset } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import { Select } from 'chakra-react-select';
import BranchesEditModal from '../modals/branches-edit-modal';

interface IBranchesFilter {
  status: selectOption | null | string;
  language: selectOption | null | string;
}

function Branches() {
  const { handleSubmit, setValue, control } = useForm<IBranchesFilter>({
    mode: 'onChange',
    defaultValues: {
      status: null,
      language: null
    }
  });

  const [page, setCurrentPage] = useState<number>(1);
  const [branchesData, setBranchesData] = useState<IGetBranchesResponse>();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncLoading, setSyncloading] = useState<boolean>(false);
  const [syncTerminalLoading, setSyncTerminalloading] =
    useState<boolean>(false);
  const [disableSwitch, setDisableSwitch] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IBranchItem | null>(null);

  const toast = useToast();
  const editModal = useDisclosure();

  const fetchData = async () => {
    setLoading(true);

    try {
      const res: IGetBranchesResponse =
        await BranchesServies.getInstance().getBranches([
          ...queryParams,
          { name: 'page', value: page }
        ]);
      setBranchesData(res);
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

  const onSubmit: SubmitHandler<IBranchesFilter> = async (
    data: IBranchesFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IBranchesFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const resetForm = (): void => {
    setValue('status', null);
    setValue('language', null);

    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };

  useEffect(() => {
    fetchData();
  }, [page, refreshComponent]);

  const syncBranches = async () => {
    setSyncloading(true);
    try {
      const res: IGlobalResponse =
        await BranchesServies.getInstance().syncBranches();
      setSyncloading(false);

      if (res.succeeded) {
        setRefreshComponent(prev => !prev);
        toast({
          title: 'Filiallar məlumatları uğurla sinxronlaşdırıldı',
          status: 'success',
          position: 'top-right',
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error: unknown) {
      setSyncloading(false);
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
              'Filiallar məlumatlarının sinxronlaşdırılması zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const syncTerminals = async () => {
    setSyncTerminalloading(true);
    try {
      const res: IGlobalResponse =
        await BranchesServies.getInstance().syncTerminals();
      setSyncTerminalloading(false);
      if (res.succeeded) {
        setRefreshComponent(prev => !prev);

        toast({
          title: 'Terminal məlumatları uğurla sinxronlaşdırıldı',
          status: 'success',
          position: 'top-right',
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error: unknown) {
      setSyncTerminalloading(false);
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
              'Terminal məlumatlarının sinxronlaşdırılması zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const changeBranchItemStatus = async (id: number) => {
    setDisableSwitch(true);
    try {
      const res = await BranchesServies.getInstance().changeItemStatus(id);
      if (res?.succeeded) {
        const obj: any = {
          ...branchesData,
          datas: {
            ...branchesData?.datas,
            datas: branchesData?.datas?.datas?.map(item => {
              if (item?.id === id) {
                return { ...item, isActive: !item.isActive };
              }
              return item;
            })
          }
        };
        setBranchesData(obj);
      }
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

              <BreadcrumbLink isCurrentPage as={NavLink} to="/branches">
                Filiallar
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
          <div>
            <Button
              isLoading={syncTerminalLoading}
              isDisabled={syncTerminalLoading}
              onClick={syncTerminals}
              mr={2}
            >
              {' '}
              Terminalları sinxronlaşdır
            </Button>
            <Button
              isLoading={syncLoading}
              isDisabled={syncLoading}
              onClick={syncBranches}
            >
              {' '}
              Filialları sinxronlaşdır
            </Button>
          </div>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Grid templateColumns="repeat(3, 1fr)" py={1} gap={1}>
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="status"
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="status">
                      <FormLabel fontSize="sm" mb={1}>
                        Status
                      </FormLabel>
                      <Select
                        className="chakra-select"
                        onChange={onChange}
                        value={value}
                        options={statusOptions}
                        placeholder={
                          <div className="custom-select-placeholder">
                            {selectPlaceholderText('Status')}
                          </div>
                        }
                        isClearable
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
                    İD
                  </Th>
                  <Th textTransform="initial">TELEFON </Th>

                  <Th textTransform="initial">AD (DAXİLİ)</Th>
                  <Th textTransform="initial">ÜNVAN(DAXİLİ)</Th>
                  <Th textTransform="initial">STATUS</Th>

                  <Th />
                </Tr>
              </Thead>
              {branchesData?.datas?.datas &&
              branchesData?.datas?.datas?.length > 0 ? (
                <Tbody textAlign="left">
                  {branchesData?.datas?.datas?.map((z: IBranchItem) => (
                    <Tr key={z?.id} textAlign="left">
                      <Td textAlign="left">{z?.id ?? noText}</Td>

                      <Td>{z?.phoneNumber ?? noText}</Td>

                      <Td>{z?.internalNameAz ?? noText}</Td>
                      <Td>{z?.internalAddressAz ?? noText}</Td>
                      <Td>
                        <FormControl display="flex" alignItems="center">
                          <Switch
                            isDisabled={disableSwitch}
                            colorScheme="brand"
                            onChange={() => {
                              setSelectedItem(z);
                              changeBranchItemStatus(z?.id);
                            }}
                            isChecked={z?.isActive}
                            id="email-alerts"
                          />
                        </FormControl>
                      </Td>
                      <Td textAlign="right">
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<BiDotsVertical />}
                            variant="outline"
                          />
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                setSelectedItem(z);
                                editModal.onOpen();
                              }}
                            >
                              Düzəliş et
                            </MenuItem>
                          </MenuList>
                        </Menu>
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

            {branchesData?.datas?.datas &&
            branchesData?.datas?.datas?.length > 0 ? (
              <Flex mt={4} justify="flex-end">
                <Pagination
                  currentPage={page}
                  totalCount={branchesData?.datas?.totalDataCount}
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
        isOpen={editModal.isOpen}
        size="xl"
        variant="big"
        isCentered
        onClose={editModal.onClose}
      >
        <ModalOverlay />
        <BranchesEditModal
          selectedItem={selectedItem}
          setRefreshComponent={setRefreshComponent}
          onClose={editModal.onClose}
        />
      </Modal>
    </>
  );
}

export default Branches;
