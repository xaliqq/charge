import { Flex, Heading } from '@chakra-ui/react';
import { FcLock } from 'react-icons/fc';

export default function NoPermission() {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      textAlign="center"
      py={10}
      px={6}
    >
      <Heading as="h2" size="xl" mt={6} mb={2}>
        DİQQƏT
      </Heading>
      <FcLock size={100} />
      <Heading as="h2" size="md" mt={6} mb={2}>
        BU SƏHİFƏNİ GÖRMƏYƏ İCAZƏNİZ YOXDUR
      </Heading>
    </Flex>
  );
}
