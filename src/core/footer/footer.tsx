import {
  Box,
  Stack,
  Text,
  //  Link,
  Flex
} from '@chakra-ui/react';
// import { NavLink } from 'react-router-dom';

function Footer() {
  return (
    <Box>
      <Flex
        w="100%"
        py={1}
        px={9}
        direction={{ base: 'column', md: 'row' }}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Stack direction="row" spacing={6}>
          {/* <Link as={NavLink} to="/home">
            Home Page
          </Link> */}
        </Stack>
        <Text>© 2023 All rights reserved</Text>
      </Flex>
    </Box>
  );
}
export default Footer;
