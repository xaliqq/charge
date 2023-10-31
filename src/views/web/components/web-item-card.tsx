import { Stack, Flex, Text, Heading } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

interface FeatureProps {
  title: string;
  text: string;
  iconBg: string;

  icon: ReactElement;
  to: string;
}
function WebItemCard({ title, iconBg, to, text, icon }: FeatureProps) {
  return (
    <Stack as={NavLink} to={to}>
      <Flex align="center">
        <Flex
          w={16}
          h={16}
          align="center"
          justify="center"
          color="white"
          rounded="full"
          bg={iconBg}
          mb={1}
        >
          {icon}
        </Flex>
        <Heading size="md" fontWeight="medium" ml={3} color="gray.700">
          {text}
        </Heading>
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color="gray.600">{text}</Text>
    </Stack>
  );
}
export default WebItemCard;
