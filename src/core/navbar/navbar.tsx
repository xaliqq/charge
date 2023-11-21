import DeleteModal from '@/components/display/delete-modal/delete-modal';
import { RootState } from '@/redux/store';
import { noText } from '@/utils/constants/texts';
import {
  FlexProps,
  Flex,
  IconButton,
  HStack,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiLogOut, BiMenu } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useLocalStorage } from 'usehooks-ts';
import PasswordModal from './password-modal';

interface NavbarProps extends FlexProps {
  onOpen: () => void;
}
function Navbar({ onOpen, ...rest }: NavbarProps) {
  // const { colorMode, toggleColorMode } = useColorMode();
  // eslint-disable-next-line no-unused-vars
  const [userToken, setUserToken] = useLocalStorage('userToken', '');
  const user = useSelector((state: RootState) => state.user.data);

  const [logoutModalButtonLoading, setLogoutModalButtonLoading] =
    useState<boolean>(false);

  const logOutModal = useDisclosure();
  const passwordModal = useDisclosure();

  const logOut = (): void => {
    setLogoutModalButtonLoading(true);
    setUserToken('');
  };

  return (
    <Flex
      px={{ base: 4, md: 4 }}
      py={1}
      alignItems="center"
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        {/* <SwitchIcon
          onChange={toggleColorMode}
          status={colorMode === 'light'}
          size="lg"
        /> */}
        {/* <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button> */}
        <Flex alignItems="center">
          <HStack>
            <VStack
              display={{ base: 'none', md: 'flex' }}
              alignItems="flex-start"
              spacing="1px"
              ml="2"
            >
              <Text
                fontWeight="medium"
                fontSize="sm"
              >{`${user.firstname} ${user.lastname}`}</Text>
              <Text fontSize="xs" fontWeight="medium" color="gray.600">
                {user.role ?? noText}
              </Text>
            </VStack>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BiMenu size={22} />}
                variant="outline"
              />
              <MenuList>
                <MenuItem
                  onClick={() => {
                    logOutModal.onOpen();
                  }}
                  icon={<BiLogOut />}
                >
                  Çıxış
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </HStack>
      <Modal
        scrollBehavior="inside"
        isOpen={logOutModal.isOpen}
        size="xl"
        variant="big"
        isCentered
        onClose={logOutModal.onClose}
      >
        <ModalOverlay />
        <DeleteModal
          deleteModalButtonLoading={logoutModalButtonLoading}
          event={logOut}
          text=""
          header="Hesabdan çıxış etmək istədiyinizə əminsinizmi?"
          onClose={logOutModal.onClose}
          eventText="Çıxış et"
        />
      </Modal>
      <Modal
        scrollBehavior="inside"
        isOpen={passwordModal.isOpen}
        size="xl"
        variant="big"
        isCentered
        onClose={passwordModal.onClose}
      >
        <ModalOverlay />
        <PasswordModal onClose={passwordModal.onClose} />
      </Modal>
    </Flex>
  );
}

export default Navbar;
