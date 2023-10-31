import {
  Flex,
  Heading,
  Box,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  Image,
  StackDivider,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import { MouseEvent, useRef } from 'react';

import {
  IoBriefcaseOutline,
  IoCallOutline,
  IoInformationCircleOutline,
  IoMegaphoneOutline
} from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import kfcDad from '@assets/images/kfc-dad.png';
import WebItemCard from './components/web-item-card';
import WebItemLine from './components/web-item-line';

function Web() {
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
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
      </Box>

      <Box
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        mt={5}
        shadow="lg"
        bg="white"
        borderRadius={6}
        w="100%"
        p={4}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Stack spacing={4}>
            <Text
              textTransform="uppercase"
              color="white"
              fontWeight="medium"
              fontSize="sm"
              bg="green.1"
              p={2}
              alignSelf="flex-start"
              rounded="md"
            >
              Our Story
            </Text>
            <Flex>
              <Heading mr={2}>Veb səhifə idarə edilməsi</Heading>
              <Heading
                as={NavLink}
                to="#"
                borderRadius="md"
                color="white"
                px={2}
                bg="green.1"
              >
                kfc-az.com
              </Heading>
            </Flex>

            <Text color="gray.500" fontSize="lg">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore
            </Text>
            <Stack
              spacing={4}
              divider={
                <StackDivider
                  borderColor={useColorModeValue('gray.100', 'gray.700')}
                />
              }
            >
              <WebItemLine
                to="/web/slider"
                icon={
                  <Icon as={IoMegaphoneOutline} color="green.500" w={5} h={5} />
                }
                iconBg="green.100"
                text="Slayder"
              />
              <WebItemLine
                to="/web/about"
                icon={
                  <Icon
                    as={IoInformationCircleOutline}
                    color="green.500"
                    w={5}
                    h={5}
                  />
                }
                iconBg="green.100"
                text="Haqqımızda"
              />
              <WebItemLine
                to="#"
                icon={
                  <Icon as={IoCallOutline} color="purple.500" w={5} h={5} />
                }
                iconBg="purple.100"
                text="Əlaqə"
              />
              <WebItemLine
                to="#"
                icon={
                  <Icon
                    as={IoBriefcaseOutline}
                    color="orange.500"
                    w={5}
                    h={5}
                  />
                }
                iconBg="orange.100"
                text="Karyera"
              />
            </Stack>
          </Stack>
          <Flex>
            <Image
              rounded="md"
              ref={imageRef}
              scale="1.2"
              objectFit="contain"
              alt="WebItemLine image"
              src={kfcDad}
            />
          </Flex>
        </SimpleGrid>
      </Box>
      <Box mt={5} shadow="lg" bg="white" borderRadius={6} w="100%" p={4}>
        <SimpleGrid py={5} columns={{ base: 1, md: 4 }} spacing={10}>
          <WebItemCard
            to="/web/slider"
            icon={
              <Icon as={IoMegaphoneOutline} color="green.500" w={5} h={5} />
            }
            iconBg="green.100"
            title="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore..."
            text="Slayder"
          />
          <WebItemCard
            to="/web/about"
            iconBg="green.100"
            icon={
              <Icon
                as={IoInformationCircleOutline}
                color="green.500"
                w={5}
                h={5}
              />
            }
            title="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore..."
            text="Haqqımızda"
          />{' '}
          <WebItemCard
            to="#"
            iconBg="purple.100"
            icon={<Icon as={IoCallOutline} color="purple.500" w={5} h={5} />}
            title="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore..."
            text="Əlaqə"
          />
          <WebItemCard
            iconBg="orange.100"
            to="#"
            icon={
              <Icon as={IoBriefcaseOutline} color="orange.500" w={5} h={5} />
            }
            title="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore..."
            text="Karyera"
          />
        </SimpleGrid>
      </Box>
    </>
  );
}
export default Web;
