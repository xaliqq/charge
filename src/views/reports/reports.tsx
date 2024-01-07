/* eslint-disable no-unsafe-optional-chaining */
// import NoData from '@/components/feedback/no-data/no-data';
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
  FormLabel,
  Button,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Skeleton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Stack
} from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiReset } from 'react-icons/bi';
import { useLocation } from 'react-router-dom';

interface IOrdersFilter {
  createdFrom: string;
  createdTo: string;
}

interface IReportData {
  series: number[];
  options: ApexOptions;
}

function Reports() {
  const location = useLocation();
  console.log(location, 'asd');

  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [page, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [reportData, setReportData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [token, setToken] = useState(null);

  console.log(queryParams);

  const reportStateCount: IReportData = {
    series: chartData?.map((item: any) => item?.totalTransactions),
    options: {
      chart: {
        width: 380,
        type: 'pie'
      },
      labels: chartData?.map((item: any) => item?.chargePointName),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    }
  };
  const reportStateProfit: IReportData = {
    series: chartData?.map((item: any) => item?.totalProfit),
    options: {
      chart: {
        width: 380,
        type: 'pie'
      },

      labels: chartData?.map((item: any) => item?.chargePointName),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    }
  };
  // eslint-disable-next-line no-unused-vars
  const reportStateDuration: IReportData = {
    series: chartData?.map((item: any) =>
      Math.trunc(item.totalDurationInMinutes / 60)
    ),
    options: {
      chart: {
        width: 380,
        type: 'pie'
      },
      labels: chartData?.map((item: any) => item?.chargePointName),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    }
  };

  const { handleSubmit, setValue, control, getValues } = useForm<IOrdersFilter>(
    {
      mode: 'onChange',
      defaultValues: {
        createdFrom: '',
        createdTo: ''
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

    const resReport = await fetch(
      addQueryParamsToUrl(
        'https://cloud4.ninco.org:2083/api/echarge/transaction-report',
        {
          createdFrom: getValues('createdFrom'),
          createdTo: getValues('createdTo')
        }
      ),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token || res?.data?.token}`
        }
      }
    );

    const resReportJson = await resReport.json();

    const chartReport = await fetch(
      addQueryParamsToUrl(
        'https://cloud4.ninco.org:2083/api/echarge/statistics-report',
        {
          createdFrom: getValues('createdFrom'),
          createdTo: getValues('createdTo')
        }
      ),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token || res?.data?.token}`
        }
      }
    );

    const chartReportJson = await chartReport.json();

    setChartData(chartReportJson.data);
    setReportData(resReportJson.data);
    setLoading(false);
  };

  console.log(chartData);

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
    setValue('createdFrom', '');
    setValue('createdTo', '');

    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };

  console.log(loading, reportData);

  //   const renderSkeletons = () => {
  //     const components = [];
  //     // eslint-disable-next-line no-plusplus
  //     for (let i = 0; i < 13; i++) {
  //       components.push(
  //         <Box
  //           mt={5}
  //           display="inline-block"
  //           shadow="lg"
  //           bg="white"
  //           borderRadius={6}
  //           w="32%"
  //           p={4}
  //         >
  //           <Skeleton height="80px" />
  //         </Box>
  //       );
  //     }
  //     return components;
  //   };

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
              <BreadcrumbLink isCurrentPage href="/reports">
                Reports
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
                  name="createdFrom"
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
              <GridItem width="85%">
                <Controller
                  control={control}
                  name="createdTo"
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
            </Grid>

            <Flex mt={2} justify="flex-end" align="center">
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
          <Flex flexWrap="wrap" justifyContent="space-between">
            <div style={{ marginBottom: '5rem' }}>
              <Heading ml="7.5rem" size="sm">
                Tranzaksiyalar
              </Heading>
              <ReactApexChart
                options={reportStateCount.options}
                series={reportStateCount.series}
                type="pie"
                width={500}
              />
            </div>
            <div style={{ marginBottom: '5rem' }}>
              <Heading ml="7.5rem" size="sm">
                Qazanılan xeyir
              </Heading>
              <ReactApexChart
                options={reportStateProfit.options}
                series={reportStateProfit.series}
                type="pie"
                width={500}
              />
            </div>
            <div>
              <Heading ml="7.5rem" size="sm">
                Müddət (saat)
              </Heading>
              <ReactApexChart
                options={reportStateDuration.options}
                series={reportStateDuration.series}
                type="pie"
                width={500}
              />
            </div>
          </Flex>
        ) : (
          <Skeleton height="70px" />
        )}
      </Box>
      <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
        {!loading ? (
          <Box>
            <TableContainer>
              <Table whiteSpace="pre-wrap" size="sm">
                <Thead textAlign="left">
                  <Tr>
                    <Th />
                    {chartData?.map((item: any) => (
                      <Th textAlign="left" textTransform="initial">
                        {item?.chargePointName}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody textAlign="left">
                  {
                    // transactionData?.data?.length > 0 ? (
                    <>
                      <Tr textAlign="left">
                        <Td textAlign="left">Tranzaksiyalar</Td>
                        {chartData?.map((item: any) => (
                          <Td textAlign="left">
                            {item?.totalTransactions || '-'}
                          </Td>
                        ))}
                      </Tr>
                      <Tr textAlign="left">
                        <Td textAlign="left">Məbləğ</Td>
                        {chartData?.map((item: any) => (
                          <Td textAlign="left">{item?.totalProfit || '-'}</Td>
                        ))}
                      </Tr>
                      <Tr textAlign="left">
                        <Td textAlign="left">Müddət (saat)</Td>
                        {chartData?.map((item: any) => (
                          <Td textAlign="left">
                            {Math.trunc(item.totalDurationInMinutes / 60) ||
                              '-'}
                          </Td>
                        ))}
                      </Tr>
                    </>

                    // ) : (
                    //   <Tr>
                    //     <Td
                    //       bg="transparent !important"
                    //       colSpan={9}
                    //       textAlign="center"
                    //     >
                    //       <NoData />
                    //     </Td>
                    //   </Tr>
                    // )
                  }
                </Tbody>
              </Table>
            </TableContainer>
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
      <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
        {!loading ? (
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Tranzaksiyaların sayı
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Flex
                  mt={2}
                  justify="flex-start"
                  align="stretch"
                  flexWrap="wrap"
                >
                  <Box
                    mt={5}
                    display="inline-block"
                    border="1px"
                    borderColor="gray.100"
                    shadow="xl"
                    bg="white"
                    borderRadius={6}
                    w="32%"
                    p={4}
                    mr={2}
                  >
                    <Stat>
                      <StatLabel>Tranzaksiyaların ümumi sayı</StatLabel>
                      <StatNumber>{reportData?.allTransactionCount}</StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    shadow="xl"
                    bg="white"
                    border="1px"
                    borderColor="gray.100"
                    borderRadius={6}
                    w="32%"
                    p={4}
                    mr={2}
                  >
                    <Stat>
                      <StatLabel>Ödənilməmiş tranzaksiyaların sayı</StatLabel>
                      <StatNumber>
                        {reportData?.unpaidTransactionCount}
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    shadow="xl"
                    bg="white"
                    border="1px"
                    borderColor="gray.100"
                    borderRadius={6}
                    w="32%"
                    p={4}
                    mr={2}
                  >
                    <Stat>
                      <StatLabel>Rədd edilmiş tranzaksiyaların sayı</StatLabel>
                      <StatNumber>
                        {reportData?.rejectedTransactionCount}
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    shadow="xl"
                    bg="white"
                    border="1px"
                    borderColor="gray.100"
                    borderRadius={6}
                    w="32%"
                    p={4}
                    mr={2}
                  >
                    <Stat>
                      <StatLabel>Ödənilmiş tranzaksiyaların sayı</StatLabel>
                      <StatNumber>
                        {reportData?.chargedTransactionCount}
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    shadow="xl"
                    bg="white"
                    border="1px"
                    borderColor="gray.100"
                    borderRadius={6}
                    w="32%"
                    p={4}
                    mr={2}
                  >
                    <Stat>
                      <StatLabel>
                        Geri qaytarılmış tranzaksiyaların sayı
                      </StatLabel>
                      <StatNumber>
                        {reportData?.refundedTransactionCount}
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    shadow="xl"
                    bg="white"
                    border="1px"
                    borderColor="gray.100"
                    borderRadius={6}
                    w="32%"
                    p={4}
                    mr={2}
                  >
                    <Stat>
                      <StatLabel>
                        İmtina edilmiş tranzaksiyaların sayı
                      </StatLabel>
                      <StatNumber>
                        {reportData?.declinedTransactionCount}
                      </StatNumber>
                    </Stat>
                  </Box>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ) : (
          <Skeleton height="50px" />
        )}
      </Box>
      <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
        {!loading ? (
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Tranzaksiyaların dəyəri
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Flex
                  mt={2}
                  justify="flex-start"
                  align="stretch"
                  flexWrap="wrap"
                >
                  <Box
                    mt={5}
                    display="inline-block"
                    border="1px"
                    borderColor="gray.100"
                    shadow="xl"
                    mr={2}
                    bg="white"
                    borderRadius={6}
                    w="32%"
                    p={4}
                  >
                    <Stat>
                      <StatLabel>Tranzaksiyaların ümumi dəyəri</StatLabel>
                      <StatNumber>
                        {reportData?.totalTransactionAmount} AZN
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    border="1px"
                    borderColor="gray.100"
                    shadow="xl"
                    mr={2}
                    bg="white"
                    borderRadius={6}
                    w="32%"
                    p={4}
                  >
                    <Stat>
                      <StatLabel>Ödənilmiş tranzaksiyaların dəyəri</StatLabel>
                      <StatNumber>
                        {reportData?.totalChargedTransactionAmount} AZN
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    border="1px"
                    borderColor="gray.100"
                    shadow="xl"
                    mr={2}
                    bg="white"
                    borderRadius={6}
                    w="32%"
                    p={4}
                  >
                    <Stat>
                      <StatLabel>
                        Geri qaytarılmış tranzaksiyaların dəyəri
                      </StatLabel>

                      <StatNumber>
                        {reportData?.totalRefundedTransactionAmount} AZN
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    border="1px"
                    borderColor="gray.100"
                    shadow="xl"
                    mr={2}
                    bg="white"
                    borderRadius={6}
                    w="32%"
                    p={4}
                  >
                    <Stat>
                      <StatLabel>Ödənilməmiş tranzaksiyaların dəyəri</StatLabel>

                      <StatNumber>
                        {reportData?.totalUnpaidTransactionAmount} AZN
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    border="1px"
                    borderColor="gray.100"
                    shadow="xl"
                    bg="white"
                    mr={2}
                    borderRadius={6}
                    w="32%"
                    p={4}
                  >
                    <Stat>
                      <StatLabel>
                        İmtina edilmiş tranzaksiyaların dəyəri
                      </StatLabel>

                      <StatNumber>
                        {reportData?.totalDeclinedTransactionAmount} AZN
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    border="1px"
                    borderColor="gray.100"
                    shadow="xl"
                    mr={2}
                    bg="white"
                    borderRadius={6}
                    w="32%"
                    p={4}
                  >
                    <Stat>
                      <StatLabel>
                        Rədd edilmiş tranzaksiyaların dəyəri
                      </StatLabel>

                      <StatNumber>
                        {reportData?.totalRejectedTransactionAmount} AZN
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box
                    mt={5}
                    display="inline-block"
                    border="1px"
                    borderColor="gray.100"
                    shadow="xl"
                    mr={2}
                    bg="white"
                    borderRadius={6}
                    w="32%"
                    p={4}
                  >
                    <Stat>
                      <StatLabel>Qazanılan xeyir</StatLabel>

                      <StatNumber>{reportData?.totalProfit} AZN</StatNumber>
                    </Stat>
                  </Box>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ) : (
          <Skeleton height="50px" />
        )}
      </Box>
    </>
  );
}

export default Reports;
