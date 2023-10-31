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
  Stack,
  useToast,
  Modal,
  ModalOverlay,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Divider
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiDotsVertical, BiHome, BiReset } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import NoData from '@/components/feedback/no-data/no-data';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import DeleteModal from '@/components/display/delete-modal/delete-modal';
import { addBtn } from '@/utils/constants/texts';
import { AxiosError } from 'axios';
import {
  ConnectorTypeServices,
  IGetConnectorTypesResponse
} from '@/services/connector-type-services/connector-type-services';
import { IConnectorTypesItem } from '@/models/connector-types';
// import { SliderService } from '@/services/web-services/web-services-slider';
import ConnectorTypeAddModal from '../modals/connector-types-add-modal';
import ConnectorTypeEditModal from '../modals/connector-types-edit-modal';

interface IConnectorTypesFilter {
  plugName: string;
}

function ConnectorTypes() {
  const [page, setCurrentPage] = useState<number>(1);
  const [connectorData, setConnectorData] =
    useState<IGetConnectorTypesResponse>();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<IConnectorTypesItem>({
    name: ''
  });
  const [deleteModalButtonLoading, setDeleteModalButtonLoading] =
    useState<boolean>(false);

  const addModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const toast = useToast();
  const fetchData = async () => {
    setLoading(true);

    try {
      const res: IGetConnectorTypesResponse =
        await ConnectorTypeServices.getInstance().getConnectorTypes([
          ...queryParams,
          { name: 'page', value: page }
        ]);
      setConnectorData(res);
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

  const onSubmit: SubmitHandler<IConnectorTypesFilter> = async (
    data: IConnectorTypesFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IConnectorTypesFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const { handleSubmit, setValue, control } = useForm<IConnectorTypesFilter>({
    mode: 'onChange',
    defaultValues: {
      plugName: ''
    }
  });

  const resetForm = (): void => {
    setValue('plugName', '');
    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };

  const deleteItem = async () => {
    setDeleteModalButtonLoading(true);
    try {
      await ConnectorTypeServices.getInstance().deleteConnectorType(
        selectedItem?.id
      );
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Slider məlumatları uğurla əlavə edildi',
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
              <BreadcrumbLink isCurrentPage href="/connector-types">
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
          <Button onClick={addModal.onOpen}>{addBtn}</Button>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Grid templateColumns="repeat(3, 1fr)" py={1} gap={1}>
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="plugName"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="plugName">
                      <FormLabel fontSize="sm" mb={1}>
                        Adı
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
                      AD
                    </Th>
                    <Th textAlign="left" textTransform="initial">
                      MƏNTƏQƏ SAYI
                    </Th>

                    <Th />
                  </Tr>
                </Thead>
                {connectorData?.data?.data &&
                connectorData?.data?.data?.length > 0 ? (
                  <Tbody textAlign="left">
                    {connectorData?.data?.data?.map(
                      (z: IConnectorTypesItem) => (
                        <Tr key={z?.id} textAlign="left">
                          <Td textAlign="left">{z?.name}</Td>
                          <Td textAlign="left">{z?.chargePointCount}</Td>

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
            {connectorData?.data?.data &&
            connectorData?.data?.data?.length > 0 ? (
              <Flex mt={4} justify="flex-end">
                <Pagination
                  currentPage={page}
                  totalCount={connectorData?.data?.totalDataCount}
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
        <ConnectorTypeAddModal
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
        <ConnectorTypeEditModal
          selectedItem={selectedItem}
          setRefreshComponent={setRefreshComponent}
          onClose={editModal.onClose}
        />
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

export default ConnectorTypes;
