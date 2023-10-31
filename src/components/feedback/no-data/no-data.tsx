import { Flex, Heading, Text } from '@chakra-ui/react';
import { ReactComponent as NoDataIcon } from '@assets/images/no-data.svg';
import SvgWrapper from '@/components/display/svg-wrapper/svg-wrapper';

interface INoDataPropTypes {
  title?: string;
  content?: string;
}
function NoData({ title, content }: INoDataPropTypes) {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      p={5}
    >
      <SvgWrapper ratio={2 / 2} height="80px" width="80px">
        <NoDataIcon />
      </SvgWrapper>
      <Heading color="#DCE0E6" as="h2" size="sm" mt={2} mb={2}>
        {title || 'MƏLUMAT YOXDUR'}
      </Heading>
      <Text color="gray.500">{content || ''}</Text>
    </Flex>
  );
}

export default NoData;
