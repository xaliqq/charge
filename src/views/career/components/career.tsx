import {
  Flex,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Heading
} from '@chakra-ui/react';
import { BiHome } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import CareerBanner from './career-banner';
import CareerHeader from './career-header';
import CareerList from './career-list';

function Career() {
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

              <BreadcrumbLink isCurrentPage as={NavLink} to="/career">
                Karyera
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
      </Box>
      <Box
        mt={5}
        bg="white"
        w="100%"
        shadow="lg"
        px={4}
        py={2}
        borderRadius={6}
        transition=".4s ease"
      >
        <Heading size="xs" mb={1} fontWeight="medium">
          KARYERA BANNER BAŞLIĞI
        </Heading>
        <CareerBanner />
      </Box>
      <Box
        mt={5}
        bg="white"
        w="100%"
        shadow="lg"
        px={4}
        py={2}
        borderRadius={6}
        transition=".4s ease"
      >
        <Heading size="xs" mb={1} fontWeight="medium">
          KARYERA BAŞLIĞI
        </Heading>
        <CareerHeader />
      </Box>
      <CareerList />
    </>
  );
}

export default Career;
