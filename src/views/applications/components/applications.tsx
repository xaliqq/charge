import Pagination from '@/components/display/pagination/pagination';
import NoData from '@/components/feedback/no-data/no-data';
import { IApplicationFilter, IApplicationItem } from '@/models/applications';
import {
  ApplicationsServies,
  IGetApplicationsResponse
} from '@/services/application-services/application-services';
import { IHTTPSParams } from '@/services/config';
import { inputPlaceholderText, noText } from '@/utils/constants/texts';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import {
  Flex,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Heading,
  Button,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  IconButton,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Stack,
  Skeleton,
  Input,
  useToast
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiHome, BiReset } from 'react-icons/bi';
import { MdPictureAsPdf } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

function Applications() {
  const { handleSubmit, setValue, control } = useForm<IApplicationFilter>({
    mode: 'onChange',
    defaultValues: {
      firstname: '',
      lastname: '',
      fathersName: ''
    }
  });
  const [page, setCurrentPage] = useState<number>(1);
  const [applicationsData, setApplicationData] =
    useState<IGetApplicationsResponse>();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfLoader, setPdfLoader] = useState<boolean>(false);
  const [pdfLoaderId, setPdfLoaderId] = useState<number>(0);

  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);

    try {
      const res: IGetApplicationsResponse =
        await ApplicationsServies.getInstance().getApplications([
          ...queryParams,
          { name: 'page', value: page }
        ]);
      setApplicationData(res);
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
              'Müraciətlər məlumatlarının gətirilməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const onSubmit: SubmitHandler<IApplicationFilter> = async (
    data: IApplicationFilter
  ) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IApplicationFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  const resetForm = (): void => {
    setValue('firstname', '');
    setValue('lastname', '');
    setValue('fathersName', '');

    setCurrentPage(1);
    setQueryParams([]);
    setRefreshComponent(r => !r);
  };
  useEffect(() => {
    fetchData();
  }, [page, refreshComponent]);

  const getDocument = async (id: number) => {
    setPdfLoaderId(id);
    setPdfLoader(true);
    try {
      const res =
        await ApplicationsServies.getInstance().getApplciationDocuments(id);
      const pdfUrl = URL.createObjectURL(res);
      window.open(pdfUrl, '_blank');
      URL.revokeObjectURL(pdfUrl);
      setPdfLoaderId(0);
      setPdfLoader(false);
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
              'Müraciətlər sənədinin gətirilməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
      setPdfLoaderId(0);

      setPdfLoader(false);
    }
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
              <BreadcrumbLink as={NavLink} to="/home">
                <BiHome />
              </BreadcrumbLink>
              <BreadcrumbSeparator />

              <BreadcrumbLink isCurrentPage as={NavLink} to="/applications">
                Müraciətlər
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
            <Grid templateColumns="repeat(2,1fr)" py={1} gap={3}>
              <GridItem>
                <Controller
                  control={control}
                  name="firstname"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="firstname">
                      <FormLabel fontSize="sm">Ad</FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Ad')}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem>
                <Controller
                  control={control}
                  name="lastname"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="lastname">
                      <FormLabel fontSize="sm">Soyad</FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Soyad')}
                      />
                    </FormControl>
                  )}
                />
              </GridItem>
              <GridItem>
                <Controller
                  control={control}
                  name="fathersName"
                  render={({ field: { onChange, value } }) => (
                    <FormControl id="fathersName">
                      <FormLabel fontSize="sm">Ata adı</FormLabel>
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Ata adı')}
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
          <Box overflowX="auto">
            <Table overflowX="auto" size="sm">
              <Thead textAlign="left">
                <Tr>
                  <Th textAlign="left" textTransform="initial">
                    TELEFON
                  </Th>
                  <Th textTransform="initial">AD </Th>
                  <Th textTransform="initial">SOYAD </Th>
                  <Th textTransform="initial">ATA ADI </Th>
                  <Th textTransform="initial">EMAİL</Th>
                  <Th textTransform="initial">MESAJ</Th>
                  <Th textTransform="initial">SƏNƏD</Th>
                </Tr>
              </Thead>
              {applicationsData?.datas?.datas &&
              applicationsData?.datas?.datas?.length > 0 ? (
                <Tbody textAlign="left">
                  {applicationsData?.datas?.datas?.map(
                    (z: IApplicationItem) => (
                      <Tr key={z?.id} textAlign="left">
                        <Td textAlign="left">{z?.phoneNumber ?? noText}</Td>

                        <Td>{z?.firstname ?? noText}</Td>
                        <Td>{z?.lastname ?? noText}</Td>
                        <Td>{z?.fathersName ?? noText}</Td>
                        <Td>{z?.email ?? noText}</Td>
                        <Td>{z?.message ?? noText}</Td>
                        <Td
                          cursor="pointer"
                          onClick={() => {
                            // window.open(z?.cvLocation);
                            getDocument(z?.id);
                          }}
                        >
                          <IconButton
                            size="sm"
                            variant="outline"
                            isLoading={pdfLoader && z.id === pdfLoaderId}
                            isDisabled={pdfLoader}
                            icon={<MdPictureAsPdf size={23} />}
                            aria-label=""
                          />
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

            {applicationsData?.datas?.datas &&
            applicationsData?.datas?.datas?.length > 0 ? (
              <Flex mt={4} justify="flex-end">
                <Pagination
                  currentPage={page}
                  totalCount={applicationsData?.datas?.totalDataCount}
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
    </>
  );
}

export default Applications;
