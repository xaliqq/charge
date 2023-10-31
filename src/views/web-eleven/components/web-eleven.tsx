/* eslint-disable no-prototype-builtins */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { IHTTPSParams } from '@/services/config';
import {
  ElevenService,
  IGetElevenResponse
} from '@/services/web-services/web-services-eleven';
import Pagination from '@/components/display/pagination/pagination';
import {
  Flex,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Switch,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Button,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  BreadcrumbSeparator,
  Skeleton,
  Image,
  Stack,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Divider
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Select } from 'chakra-react-select';
import { BiDotsVertical, BiHome, BiReset } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import NoData from '@/components/feedback/no-data/no-data';
import { IWebElevenItem } from '@/models/web-eleven';
import { selectOption } from '@/models/common';
import DeleteModal from '@/components/display/delete-modal/delete-modal';
import {
  addBtn,
  selectPlaceholderText,
  viewImgModalHeader
} from '@/utils/constants/texts';
import { languageOptions, statusOptions } from '@/utils/constants/options';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import { AxiosError } from 'axios';
import WebElevenAddModal from '../modals/web-eleven-add-modal';
import WebElevenEditModal from '../modals/web-eleven-edit-modal';

interface IWebElevenFilter {
  status: selectOption | null | string;
  language: selectOption | null | string;
}

function WebEleven() {
  const [page, setCurrentPage] = useState<number>(1);
  const [elevenData, setElevenData] = useState<IGetElevenResponse>();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<IWebElevenItem>({
    id: 0,
    title: '',
    description: '',
    imageUrl: '',
    languageId: 0,
    isActive: false
  });
  const [disableSwitch, setDisableSwitch] = useState<boolean>(false);
  const [deleteModalButtonLoading, setDeleteModalButtonLoading] =
    useState<boolean>(false);

  const addModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const viewImgModal = useDisclosure();

  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);

    try {
      const res: IGetElevenResponse = await new ElevenService().getItems([
        ...queryParams,
        { name: 'page', value: page }
      ]);
      setElevenData(res);
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
              'Slider məlumatlarının gətirilməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const onSubmit: SubmitHandler<IWebElevenFilter> = async (
    data: IWebElevenFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IWebElevenFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const { handleSubmit, setValue, control } = useForm<IWebElevenFilter>({
    mode: 'onChange',
    defaultValues: {
      status: null,
      language: null
    }
  });

  const resetForm = (): void => {
    setValue('status', null);
    setValue('language', null);

    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };

  const changeElevenItemStatus = async (id: number) => {
    setDisableSwitch(true);
    try {
      const res = await new ElevenService().changeItemStatus(id);
      if (res?.succeeded) {
        const obj: any = {
          ...elevenData,
          datas: {
            ...elevenData?.datas,
            datas: elevenData?.datas?.datas?.map(item => {
              if (item?.id === id) {
                return { ...item, isActive: !item.isActive };
              }
              return item;
            })
          }
        };
        setElevenData(obj);
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
  const deleteItem = async () => {
    setDeleteModalButtonLoading(true);
    try {
      await new ElevenService().deleteItem(selectedItem?.id);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'İnqridient məlumatları uğurla əlavə edildi',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true
      });
      setDeleteModalButtonLoading(false);
      deleteModal.onClose();
      setRefreshComponent((prev: boolean) => !prev);
    } catch (error: unknown) {
      setDeleteModalButtonLoading(false);
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
              'İnqridient məlumatlarının əlavə edilməsi zamanı xəta baş verdi',
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

              <BreadcrumbLink as={NavLink} to="/web">
                Veb səhifə
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <BreadcrumbLink isCurrentPage href="/web/eleven-ingredient">
                11 İnqridient
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
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="language"
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="language">
                      <FormLabel fontSize="sm" mb={1}>
                        Dil
                      </FormLabel>
                      <Select
                        onChange={onChange}
                        value={value}
                        options={languageOptions}
                        placeholder={
                          <div className="custom-select-placeholder">
                            {selectPlaceholderText('Dil')}
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
          <Box>
            <TableContainer>
              <Table size="sm">
                <Thead textAlign="left">
                  <Tr>
                    <Th textAlign="left" textTransform="initial">
                      İD
                    </Th>
                    <Th textTransform="initial">DİL</Th>
                    <Th textTransform="initial">BAŞLIQ</Th>
                    <Th textTransform="initial">AÇIQLAMA</Th>
                    <Th textTransform="initial">ŞƏKİL</Th>
                    <Th textTransform="initial">STATUS</Th>

                    <Th />
                  </Tr>
                </Thead>
                {elevenData?.datas?.datas &&
                elevenData?.datas?.datas?.length > 0 ? (
                  <Tbody textAlign="left">
                    {elevenData?.datas?.datas?.map((z: IWebElevenItem) => (
                      <Tr key={z?.id} textAlign="left">
                        <Td textAlign="left">{z?.id}</Td>

                        <Td>
                          {z?.languageId === 1
                            ? 'Azərbaycan'
                            : z?.languageId === 2
                            ? 'İngilis'
                            : 'Rus'}
                        </Td>
                        <Td>{z?.title}</Td>
                        <Td>{z?.description}</Td>
                        <Td>
                          <Image
                            cursor="pointer"
                            onClick={() => {
                              setSelectedItem(z);
                              viewImgModal.onOpen();
                            }}
                            h={10}
                            objectFit="contain"
                            w={10}
                            src={`${
                              import.meta.env.VITE_BASE_URL_IMG
                            }${z?.imageUrl}`}
                          />
                        </Td>
                        <Td>
                          <FormControl display="flex" alignItems="center">
                            <Switch
                              isDisabled={disableSwitch}
                              colorScheme="brand"
                              onChange={() => {
                                setSelectedItem(z);
                                changeElevenItemStatus(z?.id);
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
                              <Divider my={2} />
                              <MenuItem
                                onClick={() => {
                                  setSelectedItem(z);
                                  deleteModal.onOpen();
                                }}
                              >
                                Sil
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
            </TableContainer>

            {elevenData?.datas?.datas &&
            elevenData?.datas?.datas?.length > 0 ? (
              <Flex mt={4} justify="flex-end">
                <Pagination
                  currentPage={page}
                  totalCount={elevenData?.datas?.totalDataCount}
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
        isOpen={addModal.isOpen}
        size="xl"
        variant="big"
        isCentered
        onClose={addModal.onClose}
      >
        <ModalOverlay />
        <WebElevenAddModal
          setRefreshComponent={setRefreshComponent}
          onClose={addModal.onClose}
        />
      </Modal>
      <Modal
        scrollBehavior="inside"
        isOpen={editModal.isOpen}
        size="xl"
        variant="big"
        isCentered
        onClose={editModal.onClose}
      >
        <ModalOverlay />
        <WebElevenEditModal
          selectedItem={selectedItem}
          setRefreshComponent={setRefreshComponent}
          onClose={editModal.onClose}
        />
      </Modal>
      <Modal
        scrollBehavior="inside"
        isOpen={viewImgModal.isOpen}
        size="full"
        isCentered
        onClose={viewImgModal.onClose}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>{viewImgModalHeader}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={10}
          >
            <Box p={5}>
              <Image
                h="100%"
                objectFit="contain"
                w="100%"
                src={`${
                  import.meta.env.VITE_BASE_URL_IMG
                }${selectedItem?.imageUrl}`}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        scrollBehavior="inside"
        isOpen={deleteModal.isOpen}
        size="xl"
        variant="big"
        isCentered
        onClose={deleteModal.onClose}
      >
        <ModalOverlay />
        <DeleteModal
          deleteModalButtonLoading={deleteModalButtonLoading}
          event={deleteItem}
          onClose={deleteModal.onClose}
        />
      </Modal>
    </>
  );
}

export default WebEleven;
