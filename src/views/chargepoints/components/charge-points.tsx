/* eslint-disable no-prototype-builtins */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { IHTTPSParams } from '@/services/config';

import Pagination from '@/components/display/pagination/pagination';
import {
  Flex,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
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
  Input,
  Tr,
  BreadcrumbSeparator,
  Skeleton,
  // Image,
  Stack,
  useToast,
  Modal,
  ModalOverlay,
  useDisclosure,
  // ModalBody,
  // ModalCloseButton,
  // ModalContent,
  // ModalHeader,
  Menu,
  MenuButton,
  // MenuItem,
  MenuList,
  MenuItem
  // Divider
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiDotsVertical, BiErrorCircle, BiHome, BiReset } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import NoData from '@/components/feedback/no-data/no-data';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
// import { viewImgModalHeader } from '@/utils/constants/texts';
import { AxiosError } from 'axios';
import {
  ChargePointServices,
  IGetChargePointsResponse
} from '@/services/charge-points-services/charge-points-services';
import { IChargePointsItem } from '@/models/charge-points';
import { Select } from 'chakra-react-select';
import { selectPlaceholderText } from '@/utils/constants/texts';
import {
  chargePointStatusOptions,
  statusOptions
} from '@/utils/constants/options';
import { selectOption } from '@/models/common';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import ChargePointEditModal from '../modals/charge-point-active-modal';
import AddPartnerModal from '../modals/add-partner-modal';
import ChargePointViewModal from '../modals/charge-point-view-modal';

interface IWebChargePointFilter {
  pricePerHour: string;
  latitude: string;
  longitude: string;
  name: string;
  owner: string;
  createdAt: string;
  status: selectOption | null;
  activationStatus: selectOption | null;
}

function ChargePoints() {
  const user = useSelector((state: RootState) => state.user.data);

  const [page, setCurrentPage] = useState<number>(1);
  const [chargePointData, setChargePointData] =
    useState<IGetChargePointsResponse>();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<IChargePointsItem>({
    id: '',
    externalId: '',
    name: '',
    status: '',
    type: '',
    lastUpdated: '',
    createdAt: '',
    maxVoltage: 0,
    latitude: 0,
    longitude: 0,
    pricePerHour: 0,
    isActive: false
  });

  const editModal = useDisclosure();
  // const deleteModal = useDisclosure();
  const viewModal = useDisclosure();
  const addPartnerModal = useDisclosure();

  const toast = useToast();
  const fetchData = async () => {
    setLoading(true);

    try {
      const res: IGetChargePointsResponse =
        await ChargePointServices.getInstance().getChargePoints([
          ...queryParams,
          { name: 'page', value: page }
        ]);
      setChargePointData(res);
      setLoading(false);
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
              'ChargePoint məlumatlarının gətirilməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const onSubmit: SubmitHandler<IWebChargePointFilter> = async (
    data: IWebChargePointFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IWebChargePointFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const { handleSubmit, setValue, control } = useForm<IWebChargePointFilter>({
    mode: 'onChange',
    defaultValues: {
      pricePerHour: '',
      latitude: '',
      longitude: '',
      name: '',
      owner: '',
      createdAt: '',
      status: null,
      activationStatus: null
    }
  });

  const resetForm = (): void => {
    setValue('pricePerHour', '');
    setValue('latitude', '');
    setValue('longitude', '');
    setValue('name', '');
    setValue('owner', '');
    setValue('status', null);
    setValue('activationStatus', null);
    setValue('createdAt', '');
    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
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
              <BreadcrumbLink isCurrentPage href="/charge-points">
                Birləşdirici növləri
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
            <Grid templateColumns="repeat(3, 1fr)" py={1} gap={1}>
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="activationStatus"
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="activationStatus">
                      <FormLabel fontSize="sm" mb={1}>
                        Aktivlik statusu
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
                        options={chargePointStatusOptions}
                        placeholder={
                          <div className="custom-select-placeholder">
                            {selectPlaceholderText('Aktivlik statusu')}
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
                  name="pricePerHour"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="pricePerHour">
                      <FormLabel fontSize="sm" mb={1}>
                        Saatlıq qiymət
                      </FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        borderRadius="md"
                        type="number"
                        placeholder="Daxil edin"
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="latitude"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="latitude">
                      <FormLabel fontSize="sm" mb={1}>
                        Latitude
                      </FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        borderRadius="md"
                        type="number"
                        placeholder="Daxil edin"
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="longitude"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="longitude">
                      <FormLabel fontSize="sm" mb={1}>
                        Longitude
                      </FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        borderRadius="md"
                        type="number"
                        placeholder="Daxil edin"
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="name">
                      <FormLabel fontSize="sm" mb={1}>
                        Ad
                      </FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        borderRadius="md"
                        type="text"
                        placeholder="Daxil edin"
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(3, 1fr)" py={1} gap={1}>
              {user?.role !== 'Partner' && (
                <GridItem width="85%">
                  <Controller
                    control={control}
                    name="owner"
                    render={({ field: { onChange, value } }) => (
                      <FormControl id="owner">
                        <FormLabel fontSize="sm" mb={1}>
                          Manifaktura
                        </FormLabel>
                        <Input
                          onChange={onChange}
                          value={value}
                          borderRadius="md"
                          type="text"
                          placeholder="Daxil edin"
                        />
                      </FormControl>
                    )}
                  />
                </GridItem>
              )}
            </Grid>

            <Flex mt={2} justify="flex-end">
              <Button type="submit" ml={2} variant="solid">
                Sinxronlaşdırma
              </Button>
              <IconButton
                ml={2}
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
                      AD
                    </Th>

                    <Th textAlign="left" textTransform="initial">
                      SAATLIQ QİYMƏT
                    </Th>

                    <Th textAlign="left" textTransform="initial">
                      STATUS
                    </Th>
                    <Th textAlign="center" textTransform="initial">
                      AKTİVLİK STATUSU
                    </Th>

                    <Th />
                  </Tr>
                </Thead>
                {chargePointData?.data?.data &&
                chargePointData?.data?.data?.length > 0 ? (
                  <Tbody textAlign="left">
                    {chargePointData?.data?.data?.map(
                      (z: IChargePointsItem) => (
                        <Tr
                          _hover={{
                            background: '#efefef',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setSelectedItem(z);
                            viewModal.onOpen();
                          }}
                          key={z?.id}
                          textAlign="left"
                        >
                          <Td textAlign="left">{z?.name}</Td>
                          <Td textAlign="left">{z?.pricePerHour}</Td>
                          <Td textAlign="left">{z?.status}</Td>
                          <Td textAlign="left">
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              {z?.isActive ? (
                                <AiOutlineCheckCircle color="green" size={20} />
                              ) : (
                                <BiErrorCircle color="red" size={20} />
                              )}
                            </div>
                          </Td>

                          <Td textAlign="right">
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="Options"
                                icon={<BiDotsVertical />}
                                variant="outline"
                                onClick={e => {
                                  e.stopPropagation();
                                }}
                              />
                              <MenuList>
                                <MenuItem
                                  isDisabled={z?.isActive}
                                  onClick={e => {
                                    e.stopPropagation();
                                    setSelectedItem(z);
                                    editModal.onOpen();
                                  }}
                                >
                                  Aktivləşdir
                                </MenuItem>
                                <MenuItem
                                  onClick={e => {
                                    e.stopPropagation();
                                    setSelectedItem(z);
                                    addPartnerModal.onOpen();
                                  }}
                                >
                                  Partnyor əlavə et
                                </MenuItem>
                                {/* <Divider my={2} /> */}
                                {/* <MenuItem
                                  onClick={() => {
                                    setSelectedItem(z);
                                    deleteModal.onOpen();
                                  }}
                                >
                                  Sil
                                </MenuItem> */}
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      )
                    )}
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
            {chargePointData?.data?.data &&
            chargePointData?.data?.data?.length > 0 ? (
              <Flex
                mt={4}
                justify="flex-end"
                style={{
                  marginTop: '.5em'
                }}
              >
                <Pagination
                  currentPage={page}
                  totalCount={chargePointData?.data?.totalDataCount}
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
        <ChargePointViewModal
          selectedItem={selectedItem}
          onClose={viewModal.onClose}
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
        <ChargePointEditModal
          id={selectedItem?.externalId}
          setRefreshComponent={setRefreshComponent}
          onClose={editModal.onClose}
        />
      </Modal>
      <Modal
        scrollBehavior="inside"
        isOpen={addPartnerModal.isOpen}
        size="xl"
        variant="big"
        isCentered
        onClose={addPartnerModal.onClose}
      >
        <ModalOverlay />
        <AddPartnerModal
          id={selectedItem?.id}
          setRefreshComponent={setRefreshComponent}
          onClose={addPartnerModal.onClose}
        />
      </Modal>
      {/* <Modal
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
                }${selectedItem?.photo}`}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </>
  );
}

export default ChargePoints;
