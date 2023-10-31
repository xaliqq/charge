/* eslint-disable no-unused-vars */
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  Flex
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import Navbar from './navbar/navbar';
import Sidebar from './sidebar/sidebar';
import Footer from './footer/footer';

export default function Layout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMenuCollapsed] = useLocalStorage('menuCollapsed', false);
  const [navbarColor, setNavbarColor] = useState('whiteAlpha.900');

  const marginMd = !isOpen ? '0px' : '240px';
  const marginCollapsedMd = !isOpen ? '0px' : '300px';

  const sidebarWidth = isMenuCollapsed ? '95px' : '240px';
  const contentMarginLeft = isMenuCollapsed ? marginCollapsedMd : marginMd;

  const handleScroll = () => {
    // Get the current scroll position
    const { scrollY } = window;

    // Set the navbar color to red if the scroll position is greater than or equal to 20px, otherwise, set it to white
    if (scrollY >= 50) {
      setNavbarColor('whiteAlpha.200');
    } else {
      setNavbarColor('whiteAlpha.900');
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box minH="100vh" bg="gray.100">
      <Flex minH="100vh">
        <Box position="fixed" height="100vh" zIndex={99}>
          <Sidebar
            onClose={onClose}
            width={{ base: '240px', md: sidebarWidth }}
            display={{ base: 'none', md: 'block' }}
            isOpen={isOpen}
            minHeight="100%"
            overflowY="auto"
          />
          <Drawer
            autoFocus={false}
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            size="full"
          >
            <DrawerContent>
              <Sidebar isOpen={isOpen} onClose={onClose} />
            </DrawerContent>
          </Drawer>
        </Box>
        <Box
          transition=".4s ease"
          width="100%"
          pl={{ md: 30, base: 0 }}
          pr={{ md: 10, base: 0 }}
          pt={{ md: 7, base: 0 }}
          ml={{ md: !isMenuCollapsed ? '240px' : '80px', base: '0' }}
          pos="relative"
          backdropFilter="saturate(180%) blur(5px)"
        >
          <Flex
            zIndex={98}
            borderRadius={6}
            as="header"
            position="sticky"
            bg={navbarColor}
            justifyContent="flex-end"
            right={0}
            top={0}
            backdropFilter="saturate(180%) blur(5px)"
            w="100%"
            width="100%"
            shadow="lg"
            transition=".4s ease"
          >
            <Navbar onOpen={onOpen} />
          </Flex>
          <Box mt={10} transition=".4s ease" w="100%" minHeight="70vh">
            <Outlet />
          </Box>
          <Box
            my={6}
            p={4}
            shadow="lg"
            borderRadius={6}
            bg="white"
            transition=".4s ease"
          >
            <Footer />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
