import { Stack, Flex, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

interface FeatureProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
  to: string;
}
function WebItemLine({ text, icon, to, iconBg }: FeatureProps) {
  return (
    <Stack to={to} as={NavLink} direction="row" align="center">
      <Flex
        w={8}
        h={8}
        align="center"
        justify="center"
        rounded="full"
        bg={iconBg}
      >
        {icon}
      </Flex>
      <Text fontWeight="medium">{text}</Text>
    </Stack>
  );
}

export default WebItemLine;
