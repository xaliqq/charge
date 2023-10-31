/* eslint-disable prefer-rest-params */

import { MouseEvent, useEffect, useRef, useState } from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  // Grid,
  // GridItem,
  Button,
  Stack,
  Grid,
  useToast,
  GridItem,
  Skeleton
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import kfcSvf from '@assets/images/kfc.svg';
import ReactApexChart from 'react-apexcharts';
import {
  IReportLineItem,
  ReportServies
} from '@/services/report-services/report-services';
import { AxiosError } from 'axios';
// import PieChart from '../charts/pie-chart';
// import PieChart from '../charts/pie-chart';

function Main() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const lineChartDefaultData = {
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Product Trends by Month',
        style: {
          fontWeight: '500'
        }
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          'ads',
          41,
          35,
          51,
          49,
          62,
          69,
          91,
          148,
          10,
          41,
          35,
          51,
          49,
          62,
          69,
          91,
          148,
          49,
          62,
          69,
          91,
          148
        ]
      }
    },
    series: [
      {
        name: 'Desktops',
        data: [
          10, 41, 35, 51, 49, 62, 69, 91, 148, 10, 41, 35, 51, 49, 62, 69, 91,
          148, 49, 62, 69, 91, 148
        ]
      }
    ]
  };

  const columnChartDefaultData = {
    series: [
      {
        name: 'Gəl götür',
        data: [12]
      },
      {
        name: 'Çatdırılma',
        data: [0]
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Sifarişin növü']
      },

      title: {
        text: 'SİFARİŞ NÖVÜNƏ GÖRƏ SATIŞ',
        style: {
          fontWeight: '500'
        }
      },
      fill: {
        opacity: 1
      }
    }
  };

  const [lineChartDataSeven, setLineChartDataSeven] = useState<any>({
    ...lineChartDefaultData,
    options: {
      ...lineChartDefaultData.options,
      title: {
        ...lineChartDefaultData.options.title,
        text: 'SON 7 GÜN ƏRZİNDƏ SATIŞ'
      }
    }
  });
  const [lineChartDataMonth, setLineChartDataMonth] = useState<any>({
    ...lineChartDefaultData,
    options: {
      ...lineChartDefaultData.options,
      title: {
        ...lineChartDefaultData.options.title,
        text: 'SON 30 GÜN ƏRZİNDƏ SATIŞ'
      }
    }
  });
  const [columnChartData, setColumnChartData] = useState<any>(
    columnChartDefaultData
  );

  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const box = imageRef?.current?.getBoundingClientRect();
    if (!box) return;
    const mouseX = event.clientX - box.left;
    const mouseY = event.clientY - box.top;
    const newX = (mouseX / box.width) * 20;
    const newY = (mouseY / box.height) * 20;
    if (imageRef.current) {
      imageRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    }
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current!.style.transform = 'translate(0, 0)';
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const resSeven = await ReportServies.getInstance().getSalesDaily(7);
      const resMonth = await ReportServies.getInstance().getSalesDaily(30);
      const resTypes = await ReportServies.getInstance().getSalesType();

      const objSeven = {
        options: {
          ...lineChartDataSeven.options,
          xaxis: {
            categories: resSeven?.datas?.map(
              (item: IReportLineItem) => item.day
            )
          }
        },
        series: [
          {
            ...lineChartDataSeven?.series[0],
            data: resSeven?.datas?.map((item: IReportLineItem) => item.value)
          }
        ]
      };
      setLineChartDataSeven(objSeven);
      const objMonth = {
        options: {
          ...lineChartDataMonth.options,
          xaxis: {
            categories: resMonth?.datas?.map(
              (item: IReportLineItem) => item.day
            )
          }
        },
        series: [
          {
            ...lineChartDataMonth?.series[0],
            data: resMonth?.datas?.map((item: IReportLineItem) => item.value)
          }
        ]
      };
      setLineChartDataMonth(objMonth);
      const objTypes = {
        ...columnChartData,
        series: [
          {
            name: 'Gəl götür',
            data: [resTypes.data.pickupCount]
          },
          {
            name: 'Çatdırılma',
            data: [resTypes.data.deliveryCount]
          }
        ]
      };
      setColumnChartData(objTypes);
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
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
            description: 'Məlumatların gətirilməsi zamanı xəta baş verdi',
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
    fetchChartData();
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
              <BreadcrumbLink isCurrentPage href="#">
                Ana səhifə
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
      </Box>

      <Box
        pos="relative"
        mt={5}
        overflow="hidden"
        shadow="lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        bg="white"
        borderRadius={6}
        w="100%"
        p={4}
      >
        <img
          ref={imageRef}
          draggable="false"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            overflow: 'hidden !important',
            left: 0,
            width: '100%',
            right: 0,
            height: '100%',
            opacity: '0.8'
          }}
          alt=""
          src={kfcSvf}
        />
        <Stack
          textAlign="center"
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 5, md: 10 }}
        >
          <Flex align="center">
            <Heading
              as={NavLink}
              to="#"
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '3xl', md: '3xl' }}
              color="green.1"
              mr={2}
            >
              KFC veb-səhifəsinin
            </Heading>
            <Heading
              fontWeight={600}
              fontSize={{ base: '1xl', sm: '2xl', md: '3xl' }}
              color="gray.800"
            >
              admin panelinə xoş gəlmisiniz{' '}
            </Heading>
          </Flex>
          <span color="gray.500">
            Never miss a meeting. Never be late for one too. Keep track of your
            meetings and receive smart reminders in appropriate times. Read your
            smart “Daily Agenda” every morning.
          </span>
          <Stack spacing={6} direction="row">
            <Button as={NavLink} to="#" rounded="full" px={6}>
              Menular
            </Button>
            <Button as={NavLink} to="#" rounded="full" px={6}>
              Səhifəni idarə et
            </Button>
          </Stack>
          <Flex height={{ sm: '24rem', lg: '20rem' }} w="full" />
        </Stack>
      </Box>
      {!loading ? (
        <>
          <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
            <Grid
              overflowX="hidden"
              templateColumns="repeat(3, 2fr)"
              py={2}
              gap={5}
            >
              <GridItem colSpan={24}>
                <ReactApexChart
                  options={lineChartDataSeven.options}
                  series={lineChartDataSeven.series}
                  type="line"
                  height={350}
                />
              </GridItem>
            </Grid>
          </Box>
          <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
            <Grid
              overflowX="hidden"
              templateColumns="repeat(3, 2fr)"
              py={2}
              gap={5}
            >
              <GridItem colSpan={24}>
                <ReactApexChart
                  options={lineChartDataMonth.options}
                  series={lineChartDataMonth.series}
                  type="line"
                  height={350}
                />
              </GridItem>
            </Grid>
          </Box>
          <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
            <Grid
              overflowX="hidden"
              templateColumns="repeat(3, 2fr)"
              py={2}
              gap={5}
            >
              <GridItem colSpan={24}>
                <ReactApexChart
                  options={columnChartData.options}
                  series={columnChartData.series}
                  type="bar"
                  height={350}
                />
              </GridItem>
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <Skeleton marginTop={5} height="300px" />
          <Skeleton marginTop={5} height="300px" />
          <Skeleton marginTop={5} height="300px" />
        </>
      )}
    </>
  );
}

export default Main;
