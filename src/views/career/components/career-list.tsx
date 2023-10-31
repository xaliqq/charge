import { IHTTPSParams } from '@/services/config';
import { statusOptions } from '@/utils/constants/options';
import { Select } from 'chakra-react-select';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import {
  Box,
  Flex,
  Heading,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  IconButton,
  Button,
  useToast,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ListItem,
  OrderedList,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiDotsVertical, BiReset } from 'react-icons/bi';
import { selectOption } from '@/models/common';
import {
  addBtn,
  noText,
  selectPlaceholderText,
  viewImgModalHeader
} from '@/utils/constants/texts';
import {
  CareerServices,
  IGetCareerListResponse
} from '@/services/career-services/career-services';
import { AxiosError } from 'axios';
import Pagination from '@/components/display/pagination/pagination';
import NoData from '@/components/feedback/no-data/no-data';
import { ICareerListItem } from '@/models/career';
import CareerAddModal from '../modals/career-add-modal';
import CareerEditModal from '../modals/career-edit-modal';

interface ICareerFilter {
  status: selectOption | null | string;
}
function CareerList() {
  const { handleSubmit, setValue, control } = useForm<ICareerFilter>({
    mode: 'onChange',
    defaultValues: {
      status: null
    }
  });
  const toast = useToast();
  const addModal = useDisclosure();
  const editModal = useDisclosure();
  const viewImgModal = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<
    ICareerListItem | undefined
  >();
  const [careerListData, setCareerListData] =
    useState<IGetCareerListResponse>();
  const [page, setCurrentPage] = useState<number>(1);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [disableSwitch, setDisableSwitch] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: IGetCareerListResponse =
        await CareerServices.getInstance().getCareerList([
          ...queryParams,
          { name: 'page', value: page }
        ]);
      setCareerListData(res);
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
              'Karyera kontent məlumatlarının gətirilməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const onSubmit: SubmitHandler<ICareerFilter> = async (
    data: ICareerFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<ICareerFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const resetForm = (): void => {
    setValue('status', null);
    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };

  useEffect(() => {
    fetchData();
  }, [page, refreshComponent]);

  const detectLangLabel = (langId: number): string => {
    switch (langId) {
      case 1: {
        return 'AZ';
      }
      case 2: {
        return 'EN';
      }
      case 3: {
        return 'RU';
      }
      default: {
        return noText;
      }
    }
  };

  const changeBranchItemStatus = async (id: number) => {
    setDisableSwitch(true);
    try {
      await CareerServices.getInstance().changeItemStatus(id);
      const obj: any = {
        ...careerListData,
        datas: {
          ...careerListData?.datas,
          datas: careerListData?.datas?.datas?.map(item => {
            if (item?.id === id) {
              return { ...item, isActive: !item.isActive };
            }
            return item;
          })
        }
      };
      setCareerListData(obj);
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
    <div>
      <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading fontWeight="medium" mb={1} size="xs">
            KARYERA FİLTR
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
        <Heading fontWeight="medium" mb={1} size="xs">
          KARYERA CƏDVƏL
        </Heading>
        {!loading ? (
          <Box overflowX="auto">
            <Table overflowX="auto" size="sm">
              <Thead textAlign="left">
                <Tr>
                  <Th textAlign="left" textTransform="initial">
                    İD
                  </Th>
                  <Th textTransform="initial">BAŞLIQ</Th>
                  <Th textTransform="initial">AÇIQLAMA</Th>
                  <Th textTransform="initial">ŞƏKİL</Th>
                  <Th textTransform="initial">STATUS</Th>

                  <Th textTransform="initial" />
                </Tr>
              </Thead>
              {careerListData?.datas?.datas &&
              careerListData?.datas?.datas?.length > 0 ? (
                <Tbody textAlign="left">
                  {careerListData?.datas?.datas?.map((z: ICareerListItem) => (
                    <Tr
                      cursor="pointer"
                      onClick={() => {
                        // setSelectedId(z?.id.toString());
                        // viewModal.onOpen();
                      }}
                      key={z?.id}
                      textAlign="left"
                    >
                      <Td textAlign="left">{z?.id ?? noText}</Td>

                      <Td>
                        {z.titles.length ? (
                          <OrderedList>
                            {z.titles.map(x => (
                              <ListItem>{`${detectLangLabel(x.languageId)} : ${
                                x.title
                              }`}</ListItem>
                            ))}
                          </OrderedList>
                        ) : (
                          noText
                        )}
                      </Td>
                      <Td>
                        {z.careerContentDescriptions.length ? (
                          <OrderedList>
                            {z.careerContentDescriptions.map(x => (
                              <ListItem>{`${detectLangLabel(x.languageId)} : ${
                                x.description
                              }`}</ListItem>
                            ))}
                          </OrderedList>
                        ) : (
                          noText
                        )}
                      </Td>
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
                              changeBranchItemStatus(Number(z?.id));
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
                            {/* <Divider my={2} /> */}
                            {/* <MenuItem
                                                        onClick={() => {
                                                            // setSelectedItem(z);
                                                            // deleteModal.onOpen();
                                                        }}
                                                    >
                                                        Sil
                                                    </MenuItem> */}
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

            {careerListData?.datas?.datas &&
            careerListData?.datas?.datas?.length > 0 ? (
              <Flex mt={4} justify="flex-end">
                <Pagination
                  currentPage={page}
                  totalCount={careerListData?.datas?.totalDataCount}
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
        <CareerAddModal
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
        <CareerEditModal
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
    </div>
  );
}

export default CareerList;
