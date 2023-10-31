import { Box, Heading, Text, Button } from '@chakra-ui/react';

export default function NotFound() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, green.1, green.0, green.1)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={6} mb={6}>
        Belə bir səhifə mövcud deyil
      </Text>

      <Button
        colorScheme="teal"
        bgGradient="linear(to-r, green.1, green.0, green.1)"
        color="white"
        variant="solid"
      >
        Go to Home
      </Button>
    </Box>
  );
}
