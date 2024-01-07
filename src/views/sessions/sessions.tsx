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
  createdDateTo: string;
  createdDateFrom: string;
  // status: string;
}

function Sessions() {
  const location = useLocation();
  console.log(location, 'asd');

  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [page, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [token, setToken] = useState(null);

  console.log(queryParams);

  const { handleSubmit, setValue, control, getValues } = useForm<IOrdersFilter>(
    {
      mode: 'onChange',
      defaultValues: {
        name: '',
        organizationId: '',
        orderType: '',
        createdDateTo: '',
        createdDateFrom: ''
        // status: ''
      }
    }
  );

  const addQueryParamsToUrl = (url: string, params: any) => {
    const queryString = Object.keys(params)
      .map(
        key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join('&');

    return `${url}?${queryString}`;
  };

  const fetchData = async (status: number) => {
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

    const url =
      status === 0 ? 'cable-states-hooks' : 'order-status-changed-hooks';

    const resSession = await fetch(
      addQueryParamsToUrl(`https://cloud4.ninco.org:2083/api/echarge/${url}`, {
        pageIndex: page,
        status,
        createdDateFrom: getValues('createdDateFrom'),
        createdDateTo: getValues('createdDateTo')
      }),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token || res?.data?.token}`
        }
      }
    );

    const resSessionJson = await resSession.json();

    setSessionData(resSessionJson);
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
    fetchData(location?.state?.status);
  }, [page, refreshComponent, location?.state?.status]);

  const resetForm = () => {
    setValue('name', '');
    setValue('organizationId', '');
    setValue('orderType', '');
    setValue('createdDateFrom', '');
    setValue('createdDateTo', '');
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
              <BreadcrumbLink isCurrentPage href="/sessions">
                Sessions
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
                  name="createdDateFrom"
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
                  name="createdDateTo"
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
                CƏDVƏL ({sessionData?.totalCount || 0})
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
                    <Th textAlign="left" textTransform="initial">
                      İD
                    </Th>
                    <Th textTransform="initial">MƏNTƏQƏ İD</Th>
                    {location?.state?.status === 1 ? (
                      <>
                        <Th textTransform="initial">SESSİYA İD</Th>
                        <Th textTransform="initial">SƏBƏB</Th>
                      </>
                    ) : (
                      <Th textTransform="initial">CABLE STATE</Th>
                    )}
                    <Th textTransform="initial">CONNECTOR</Th>
                    <Th textTransform="initial">BAŞLAMA MÜDDƏTİ</Th>
                    <Th textTransform="initial">BAŞLAMA MÜDDƏTİ (SAAT)</Th>
                  </Tr>
                </Thead>
                <Tbody textAlign="left">
                  {sessionData?.data?.length > 0 ? (
                    sessionData?.data?.map((item: any) => (
                      <Tr textAlign="left" key={item?.id}>
                        <Td textAlign="left">{item?.id || '-'}</Td>
                        {location?.state?.status === 1 ? (
                          <>
                            <Td>{item?.sessionId || '-'}</Td>
                            <Td>{item?.finishReason || '-'}</Td>
                          </>
                        ) : (
                          <Td>{item?.cableState || '-'}</Td>
                        )}
                        <Td>{item?.chargePointId || '-'}</Td>

                        <Td>{item?.connector || '-'}</Td>
                        <Td>{item?.createdDate?.substring(0, 10) || '-'}</Td>
                        <Td>{item?.createdDate?.substring(11, 19) || '-'}</Td>
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
            {sessionData?.totalCount !== 0 && (
              <Flex
                justify="flex-end"
                style={{
                  marginTop: '.5em'
                }}
              >
                <Pagination
                  currentPage={page}
                  totalCount={
                    sessionData?.totalCount ? sessionData?.totalCount : 0
                  }
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

export default Sessions;
