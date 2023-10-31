import Pagination from '@/components/display/pagination/pagination';
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

interface IOrdersFilter {
  name: string;
  organizationId: string;
  orderType: string;
  endDate: string;
  startDate: string;
  // status: string;
}

function Transactions() {
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [page, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [transactionData, setTransactionData] = useState<any>(null);

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

    const { data } = await axios.get(
      'https://cloud4.ninco.org:2083/api/echarge/get-token',
      {
        params: {
          username: 'ECharge',
          password: '!Sm8ZKg!%sYQYTr6'
        }
      }
    );

    const resTransaction = await fetch(
      `https://cloud4.ninco.org:2083/api/echarge/get-transactions?page=${page}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data?.token}`
        }
      }
    );

    const resTransactionJson = await resTransaction.json();

    setTransactionData(resTransactionJson);
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

  console.log(transactionData);

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
              <BreadcrumbLink isCurrentPage href="/transactions">
                Transactions
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
            <Flex mt={2} justify="flex-end">
              <IconButton
                variant="outline"
                onClick={resetForm}
                aria-label="Show password"
                icon={<BiReset size={22} />}
              />
              <Button type="submit" ml={2} variant="solid">
                Search
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
              <Table whiteSpace="pre-wrap" size="sm">
                <Thead textAlign="left">
                  <Tr>
                    <Th textAlign="left" textTransform="initial">
                      MƏNTƏQƏ ADI
                    </Th>
                    <Th textTransform="initial">ÜMUMİ ÖDƏNİLƏN MƏBLƏĞ</Th>
                    <Th textTransform="initial">VALYUTA</Th>
                    <Th textTransform="initial">İSTİFADƏ MÜDDƏTİ</Th>
                    <Th textTransform="initial">SAATLIQ QİYMƏT</Th>
                    <Th textTransform="initial">BAŞLAMA MÜDDƏTİ</Th>
                    <Th textTransform="initial">BİTMƏ MÜDDƏTİ</Th>
                  </Tr>
                </Thead>
                <Tbody textAlign="left">
                  {transactionData?.data?.map((item: any) => (
                    <Tr textAlign="left" key={item?.id}>
                      <Td textAlign="left">{item?.chargePointName || '-'}</Td>

                      <Td>{item?.amount || '-'}</Td>
                      <Td>{item?.currency || '-'}</Td>
                      <Td>{item?.duration || '-'}</Td>
                      <Td>{item?.pricePerHour || '-'}</Td>
                      <Td>{item?.createdAt || '-'}</Td>
                      <Td>{item?.endDate || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Flex
              justify="flex-end"
              style={{
                marginTop: '.5em'
              }}
            >
              <Pagination
                currentPage={page}
                totalCount={
                  transactionData?.totalCount ? transactionData?.totalCount : 0
                }
                pageSize={10}
                onPageChange={(z: number) => setCurrentPage(z)}
              />
            </Flex>
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

export default Transactions;
