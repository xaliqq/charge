import Pagination from '@/components/display/pagination/pagination';
import NoData from '@/components/feedback/no-data/no-data';
import DatePicker from '@/components/forms/date-picker/date-picker';

import { IHTTPSParams } from '@/services/config';

import { convertFormDataToQueryParams } from '@/utils/functions/functions';
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
  Input,
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
  Stack,
  Skeleton
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiReset } from 'react-icons/bi';
import { useLocation } from 'react-router-dom';

interface IOrdersFilter {
  name: string;
  organizationId: string;
  orderType: string;
  endDate: string;
  startDate: string;
  // status: string;
}

function Archive() {
  const location = useLocation();
  console.log(location, 'asd');

  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [page, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [cibData, setCibData] = useState<any>(null);
  const [token, setToken] = useState(null);

  console.log(queryParams);

  const { handleSubmit, setValue, control } = useForm<IOrdersFilter>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      organizationId: '',
      orderType: '',
      endDate: '',
      startDate: ''
      // status: ''
    }
  });

  const fetchData = async () => {
    setLoading(true);

    let res;
    if (!token) {
      res = await axios.get(
        'https://cloud4.ninco.org:2083/api/echarge/get-token',
        {
          params: {
            username: 'ECharge',
            password: '!Sm8ZKg!%sYQYTr6'
          }
        }
      );

      setToken(res?.data?.token);
    }

    const resCib = await fetch(
      `https://cloud4.ninco.org:2083/api/echarge/cib-orders?pageIndex=${page}&needArchive=true`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token || res?.data?.token}`
        }
      }
    );

    const resCibJson = await resCib.json();

    setCibData(resCibJson);
    setLoading(false);
  };

  const onSubmit: SubmitHandler<IOrdersFilter> = async data => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IOrdersFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  useEffect(() => {
    fetchData();
  }, [page, refreshComponent]);

  const resetForm = () => {
    setValue('name', '');
    setValue('organizationId', '');
    setValue('orderType', '');
    setValue('endDate', '');
    setValue('startDate', '');
    // setValue('status', '');

    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
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
              <BreadcrumbLink isCurrentPage href="/cib">
                Cib
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
      </Box>
      <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
        <Heading fontWeight="medium" mb={1} size="xs">
          FİLTR
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Grid
              overflowX="hidden"
              templateColumns="repeat(3, 1fr)"
              py={1}
              gap={0}
            >
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="name">
                      <FormLabel fontSize="sm" mb={1}>
                        İstifadəçi ID
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
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="name">
                      <FormLabel fontSize="sm" mb={1}>
                        Ümumi ödənilən məbləğ
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
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="address">
                      <FormLabel fontSize="sm" mb={1}>
                        Başlama tarixi
                      </FormLabel>
                      <DatePicker
                        name="date-input"
                        type="date"
                        placeholder="Sifariş tarixi"
                        value={value}
                        onChange={onChange}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
            </Grid>
            <Grid
              overflowX="hidden"
              templateColumns="repeat(3, 1fr)"
              py={1}
              gap={1}
            >
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field: { onChange, value } }) => (
                    <FormControl>
                      <FormLabel fontSize="sm" mb={1}>
                        Bitmə tarixi
                      </FormLabel>
                      <DatePicker
                        name="date-input"
                        type="date"
                        placeholder="Sifariş tarixi"
                        value={value}
                        onChange={onChange}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              {/* <GridItem width="85%">
                <Controller
                  control={control}
                  name="status"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="status">
                      <FormLabel fontSize="sm" mb={1}>
                        Status
                      </FormLabel>
                      <Select
                        onChange={onChange}
                        value={value}
                        borderRadius="md"
                        placeholder="Status"
                      >
                        <option value="1">Uğurlu</option>
                        <option value="2">Uğursuz</option>
                      </Select>
                    </FormControl>
                  )}
                />
              </GridItem> */}
            </Grid>
            <Flex mt={2} justify="space-between" align="center">
              <Heading size="xs" mb={1} fontWeight="medium">
                CƏDVƏL ({cibData?.totalCount || 0})
              </Heading>
              <div>
                <IconButton
                  variant="outline"
                  onClick={resetForm}
                  aria-label="Show password"
                  icon={<BiReset size={22} />}
                />
                <Button type="submit" ml={2} variant="solid">
                  Search
                </Button>
              </div>
            </Flex>
          </Box>
        </form>
      </Box>
      <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
        {!loading ? (
          <Box>
            <TableContainer>
              <Table whiteSpace="pre-wrap" size="sm">
                <Thead textAlign="left">
                  <Tr>
                    <Th />

                    <Th textTransform="initial">ÖDƏNİŞ İD</Th>
                    <Th textTransform="initial">MƏZƏNNƏ</Th>
                    <Th textTransform="initial">SAATLIQ QİYMƏT</Th>
                    <Th textTransform="initial">ÖDƏNİŞ MƏBLƏĞİ</Th>
                    <Th textTransform="initial">GERİ QAYTARILAN MƏBLƏĞ</Th>
                    <Th textTransform="initial">BAŞLAMA MÜDDƏTİ (SAAT)</Th>
                  </Tr>
                </Thead>
                <Tbody textAlign="left">
                  {cibData?.data?.length > 0 ? (
                    cibData?.data?.map((item: any, index: number) => (
                      <Tr textAlign="left" key={item?.id}>
                        <Td textAlign="left">{(page - 1) * 10 + index + 1}</Td>

                        <Td>{item?.id || '-'}</Td>
                        <Td>{item?.currency || '-'}</Td>
                        <Td>{item?.amount || '-'}</Td>
                        <Td>{item?.amountCharged || '-'}</Td>
                        {location?.state?.status === 'refunded' ? (
                          <Td>{item?.amountRefunded}</Td>
                        ) : (
                          <Td>
                            {item?.amountRefunded === 0 ? 'Yoxdur' : 'Var'}
                          </Td>
                        )}

                        <Td>{item?.created?.substring(0, 10) || '-'}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td
                        bg="transparent !important"
                        colSpan={9}
                        textAlign="center"
                      >
                        <NoData />
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
            {cibData?.totalCount !== 0 && (
              <Flex
                justify="flex-end"
                style={{
                  marginTop: '.5em'
                }}
              >
                <Pagination
                  currentPage={page}
                  totalCount={cibData?.totalCount ? cibData?.totalCount : 0}
                  pageSize={10}
                  onPageChange={(z: number) => setCurrentPage(z)}
                />
              </Flex>
            )}
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
    </>
  );
}

export default Archive;
