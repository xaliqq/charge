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
  Input
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Select } from 'chakra-react-select';
import { BiDotsVertical, BiHome, BiReset } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import NoData from '@/components/feedback/no-data/no-data';
import { ICategoryList, IProductItem } from '@/models/product';
import { selectOption } from '@/models/common';
import {
  selectPlaceholderText,
  viewImgModalHeader
} from '@/utils/constants/texts';
import { statusOptions } from '@/utils/constants/options';
import {
  IGetCategoryListResponse,
  IGetProductResponse,
  ProductService
} from '@/services/product-services/product-services';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import ProductEditModal from '../modals/product-edit-modal';

interface IProductFilter {
  status: selectOption | null | string;
  categoryId: selectOption | null | string;
  name: string;
  description: string;
  minPrice: string;
  maxPrice: string;
}

function Product() {
  const [page, setCurrentPage] = useState<number>(1);
  const [productData, setProductData] = useState<IGetProductResponse>();
  const [categoryList, setCategoryList] = useState<ICategoryList[] | null>(
    null
  );
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<IProductItem>();
  const [disableSwitch, setDisableSwitch] = useState<boolean>(false);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);

  const editModal = useDisclosure();
  const viewImgModal = useDisclosure();

  const fetchData = async () => {
    setLoading(true);

    const res: IGetProductResponse =
      await ProductService.getInstance().getProduct([
        ...queryParams,
        { name: 'page', value: page }
      ]);
    if (res.succeeded) {
      setProductData(res);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<IProductFilter> = async (
    data: IProductFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IProductFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const { handleSubmit, setValue, control } = useForm<IProductFilter>({
    mode: 'onChange',
    defaultValues: {
      status: null,
      categoryId: null,
      name: '',
      description: '',
      minPrice: '',
      maxPrice: ''
    }
  });

  const syncProductFunc = async () => {
    setSyncLoading(true);
    await ProductService.getInstance().syncProduct();
    setSyncLoading(false);
  };

  const resetForm = (): void => {
    setValue('status', null);
    setValue('categoryId', null);
    setValue('name', '');
    setValue('description', '');
    setValue('minPrice', '');
    setValue('maxPrice', '');

    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };

  const fetchCategoryList = async () => {
    const res: IGetCategoryListResponse =
      await ProductService.getInstance().getCategoryList();

    if (res.succeeded) {
      setCategoryList(res.datas);
    }
  };

  const changeProductItemStatus = async (id: number, e: any) => {
    setDisableSwitch(true);
    try {
      const res = await ProductService.getInstance().changeItemStatus(id);
      if (res?.succeeded) {
        const obj: any = {
          ...productData,
          datas: {
            ...productData?.datas,
            datas: productData?.datas?.datas?.map(item => {
              if (item?.id === id) {
                return { ...item, isActive: !item.isActive };
              }
              return item;
            })
          }
        };

        setProductData(obj);
      }
      setDisableSwitch(false);
    } catch {
      e.target.checked = !e.target.checked;
      setDisableSwitch(false);
    }
  };

  console.log(productData, 'asdsadsa');

  useEffect(() => {
    fetchData();
  }, [page, refreshComponent]);

  useEffect(() => {
    fetchCategoryList();
  }, []);

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
              <BreadcrumbLink isCurrentPage href="/product">
                Məhsullar
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
            onClick={syncProductFunc}
            isDisabled={syncLoading}
            isLoading={syncLoading}
          >
            Məhsulları sinxronlaşdır
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
                  name="categoryId"
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="categoryId ">
                      <FormLabel fontSize="sm" mb={1}>
                        Kateqoriya
                      </FormLabel>
                      <Select
                        onChange={onChange}
                        value={value}
                        options={
                          categoryList?.map(option => ({
                            label: option.name,
                            value: option.id.toString()
                          })) as selectOption[]
                        }
                        placeholder={
                          <div className="custom-select-placeholder">
                            {selectPlaceholderText('Kateqoriya')}
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
                        Başlıq
                      </FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        placeholder={selectPlaceholderText('Başlıq')}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="description"
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="description">
                      <FormLabel fontSize="sm" mb={1}>
                        Açıqlama
                      </FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        placeholder={selectPlaceholderText('Açıqlama')}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="minPrice"
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="minPrice">
                      <FormLabel fontSize="sm" mb={1}>
                        Min. qiymət
                      </FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        placeholder={selectPlaceholderText('Min. qiymət')}
                        type="number"
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="maxPrice"
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="maxPrice">
                      <FormLabel fontSize="sm" mb={1}>
                        Max. qiymət
                      </FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        placeholder={selectPlaceholderText(' Max. qiymət')}
                        type="number"
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
                    <Th textTransform="initial">BAŞLIQ</Th>
                    <Th textTransform="initial">AÇIQLAMA</Th>
                    <Th textTransform="initial">QİYMƏT</Th>
                    <Th textTransform="initial">KATEQORİYA</Th>
                    <Th textTransform="initial">ŞƏKİL</Th>
                    <Th textTransform="initial">STATUS</Th>

                    <Th />
                  </Tr>
                </Thead>
                {productData?.datas?.datas &&
                productData?.datas?.datas?.length > 0 ? (
                  <Tbody textAlign="left">
                    {productData?.datas?.datas?.map(
                      (z: IProductItem, index: number) => (
                        <Tr key={z?.id} textAlign="left">
                          <Td textAlign="left">
                            {page > 1 ? index + 1 - 10 + page * 10 : index + 1}
                          </Td>

                          <Td>{z?.nameAz}</Td>
                          <Td>{z?.descriptionAz}</Td>
                          <Td>{z?.price} ₼</Td>
                          <Td>{z?.category?.name}</Td>
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
                                onChange={e => {
                                  setSelectedItem(z);
                                  changeProductItemStatus(z?.id, e);
                                }}
                                isChecked={Boolean(z?.isActive)}
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

            {productData?.datas?.datas &&
            productData?.datas?.datas?.length > 0 ? (
              <Flex mt={4} justify="flex-end">
                <Pagination
                  currentPage={page}
                  totalCount={productData?.datas?.totalDataCount}
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
        <ProductEditModal
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
    </>
  );
}

export default Product;
