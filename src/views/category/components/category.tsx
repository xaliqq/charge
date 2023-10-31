/* eslint-disable no-prototype-builtins */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { IHTTPSParams } from '@/services/config';
import {
  CategoryService,
  IGetCategoryResponse
} from '@/services/category-services/category-services';
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
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Input
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Select } from 'chakra-react-select';
import { BiDotsVertical, BiHome, BiReset } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import NoData from '@/components/feedback/no-data/no-data';
import { ICategoryItem } from '@/models/category';
import { selectOption } from '@/models/common';
import { selectPlaceholderText } from '@/utils/constants/texts';
import { statusOptions } from '@/utils/constants/options';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import CategoryEditModal from '../modals/category-edit-modal';

interface ICategoryFilter {
  status: selectOption | null | string;
  language: selectOption | null | string;
  name: string;
}

function Category() {
  const [page, setCurrentPage] = useState<number>(1);
  const [categoryData, setCategoryData] = useState<IGetCategoryResponse | null>(
    null
  );
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ICategoryItem>();
  const [disableSwitch, setDisableSwitch] = useState<boolean>(false);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);

  const editModal = useDisclosure();

  const fetchData = async () => {
    setLoading(true);

    const res: IGetCategoryResponse =
      await CategoryService.getInstance().getCategory([
        ...queryParams,
        { name: 'page', value: page }
      ]);
    if (res.succeeded) {
      setCategoryData(res);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ICategoryFilter> = async (
    data: ICategoryFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<ICategoryFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const { handleSubmit, setValue, control } = useForm<ICategoryFilter>({
    mode: 'onChange',
    defaultValues: {
      status: null,
      language: null,
      name: ''
    }
  });

  const resetForm = (): void => {
    setValue('status', null);
    setValue('language', null);
    setValue('name', '');

    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };

  const changeCategoryItemStatus = async (id: number) => {
    setDisableSwitch(true);
    try {
      const res = await CategoryService.getInstance().changeItemStatus(id);
      if (res?.succeeded) {
        const obj: any = {
          ...categoryData,
          datas: {
            ...categoryData?.datas,
            datas: categoryData?.datas?.datas?.map(item => {
              if (item?.id === id) {
                return { ...item, isActive: !item.isActive };
              }
              return item;
            })
          }
        };
        setCategoryData(obj);
      }
      setDisableSwitch(false);
    } catch {
      setDisableSwitch(false);
    }
  };

  const syncCatgeoryFunc = async () => {
    setSyncLoading(true);
    await CategoryService.getInstance().syncCategories();
    setSyncLoading(false);
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
              <BreadcrumbLink isCurrentPage href="/category">
                Kateqoriya
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
          <Button
            onClick={syncCatgeoryFunc}
            isDisabled={syncLoading}
            isLoading={syncLoading}
          >
            Kateqoriyaları sinxronlaşdır
          </Button>
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
                  name="name"
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="name">
                      <FormLabel fontSize="sm" mb={1}>
                        Ad
                      </FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        placeholder={selectPlaceholderText('Kateqoriya')}
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
                    <Th textTransform="initial">AD</Th>
                    <Th textTransform="initial">STATUS</Th>

                    <Th />
                  </Tr>
                </Thead>
                {categoryData?.datas?.datas &&
                categoryData?.datas?.datas?.length > 0 ? (
                  <Tbody textAlign="left">
                    {categoryData?.datas?.datas.map(
                      (z: ICategoryItem, index: number) => (
                        <Tr key={z?.id} textAlign="left">
                          <Td textAlign="left">
                            {page > 1 ? index + 1 - 10 + page * 10 : index + 1}
                          </Td>

                          <Td>{z?.nameAz}</Td>

                          <Td>
                            <FormControl display="flex" alignItems="center">
                              <Switch
                                isDisabled={disableSwitch}
                                colorScheme="brand"
                                onChange={() => {
                                  setSelectedItem(z);
                                  changeCategoryItemStatus(z?.id);
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

            {categoryData?.datas?.datas &&
            categoryData?.datas?.datas?.length > 0 ? (
              <Flex mt={4} justify="flex-end">
                <Pagination
                  currentPage={page}
                  totalCount={categoryData?.datas?.totalDataCount}
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
        <CategoryEditModal
          selectedItem={selectedItem}
          setRefreshComponent={setRefreshComponent}
          onClose={editModal.onClose}
        />
      </Modal>
    </>
  );
}

export default Category;
