/* eslint-disable react/jsx-no-undef */
import {
  Box,
  Flex,
  Link,
  CloseButton,
  BoxProps,
  IconButton
} from '@chakra-ui/react';
import { FiArrowRightCircle, FiArrowLeftCircle } from 'react-icons/fi';
import { BiUser } from 'react-icons/bi';
import { AiOutlineUnorderedList, AiOutlineBranches } from 'react-icons/ai';
import { useLocalStorage } from 'usehooks-ts';
import { ReactComponent as Logo } from '@assets/logo/logo.svg';
import SvgWrapper from '@/components/display/svg-wrapper/svg-wrapper';

import { NavLink } from 'react-router-dom';

// import SvgWrapper from '@/components/display/svg-wrapper/svg-wrapper';
import { IconType } from 'react-icons/lib';
import { useState } from 'react';
import SidebarMenuItem from './sidebar-item/sidebar-item';

interface SidebarProps extends BoxProps {
  onClose: () => void;
  isOpen?: boolean;
}

export interface ISidebarMenuElements {
  title?: string;
  icon?: IconType;
  id: string;
  isDefaultCollapsed?: boolean;
  item?: ISidebarMenuElements;
  url: string;
  isCollapsable?: boolean;
  modules?: ISidebarMenuElements[];
  isChild?: boolean;
}

function Sidebar({ onClose, isOpen, ...rest }: SidebarProps) {
  const sidebarMenuElements = [
    {
      id: 'element-1',
      title: 'Tranzaksiya',
      isCollapsable: false,
      icon: AiOutlineUnorderedList,
      url: '/transactions'
    },

    {
      id: 'element-2',
      title: 'Müştərilər',
      isCollapsable: false,
      icon: BiUser,
      url: '/customers'
    },
    {
      id: 'element-4',
      title: 'Adminlər',
      isCollapsable: false,
      icon: BiUser,
      url: '/admins'
    },
    {
      id: 'element-5',
      title: 'Partnyorlar',
      isCollapsable: false,
      icon: BiUser,
      url: '/partners'
    },
    {
      id: 'element-6',
      title: 'Birləşdirici növləri',
      isCollapsable: false,
      icon: AiOutlineBranches,
      url: '/connector-types'
    },

    {
      id: 'element-7',
      title: 'Məntəqələr',
      isCollapsable: false,
      icon: AiOutlineBranches,
      url: '/charge-points'
    }
    // {
    //   id: 'element-2',
    //   title: 'Birləşdirici',
    //   isCollapsable: false,
    //   icon: BiBasket,
    //   url: '/orders1'
    // }

    // {
    //   id: 'element-2',
    //   title: 'Filiallar',
    //   isCollapsable: false,
    //   icon: BiStore,
    //   url: '/branches'
    // },

    // {
    //   id: 'element-3',
    //   title: 'Müştərilər',
    //   isCollapsable: false,
    //   icon: FiUsers,
    //   url: '/clients'
    // },
    // {
    //   id: 'element-4',
    //   title: 'İstifadəçilər',
    //   isCollapsable: false,
    //   icon: BiUser,
    //   url: '/users'
    // },
    // {
    //   id: 'element-7',
    //   title: 'Mesajlar',
    //   isCollapsable: false,
    //   icon: BiMessageDetail,
    //   url: '/messages'
    // },

    // {
    //   id: 'element-8',
    //   title: 'Karyera',
    //   isCollapsable: false,
    //   icon: IoBriefcaseOutline,
    //   url: '/career'
    // },
    // {
    //   id: 'element-8',
    //   title: 'Müraciətlər',
    //   isCollapsable: false,
    //   icon: BiBookContent,
    //   url: '/applications'
    // },
    // {
    //   id: 'element-2.1',
    //   title: 'Slayder',
    //   isCollapsable: false,
    //   icon: BiCarousel,
    //   url: '/web/slider'
    // },
    // {
    //   id: 'element-2.2',
    //   title: 'Haqqımızda',
    //   isCollapsable: false,
    //   icon: FiInfo,
    //   url: '/web/about'
    // },
    // {
    //   id: 'element-2.3',
    //   title: '11 İnqridient',
    //   isCollapsable: false,
    //   icon: BiFoodMenu,
    //   url: '/web/eleven-ingredient'
    // },
    // {
    //   id: 'element-2.4',
    //   title: 'Kateqoriya',
    //   isCollapsable: false,
    //   icon: BiCategory,
    //   url: '/category'
    // },
    // {
    //   id: 'element-2.5',
    //   title: 'Məhsul',
    //   isCollapsable: false,
    //   icon: MdFastfood,
    //   url: '/product'
    // }
  ];

  const [isMenuCollapsed, setIsMenuCollapsed] = useLocalStorage(
    'menuCollapsed',
    false
  );

  const [collapseIsOpen, setCollapseIsOpen] = useState<string[]>([]);

  const handleToggleCollapse = () => {
    setIsMenuCollapsed(prevValue => !prevValue);
    //  setCollapseIsOpen([]);
  };

  return (
    <Box
      transition=".4s ease"
      bg="white"
      shadow="lg"
      w={{ base: '100%', md: isMenuCollapsed ? '80px' : '240px' }}
      overflow="hidden"
      h="full"
      {...rest}
    >
      <Flex
        position="relative"
        alignItems="center"
        justifyContent={isOpen ? 'space-between' : 'center'}
        p={2}
      >
        {' '}
        <Box p={2} className="logo-box">
          <Link as={NavLink} to="/transactions">
            <SvgWrapper
              ratio={2 / 2}
              height={isMenuCollapsed ? '50px' : '80px'}
              width={isMenuCollapsed ? '50px' : '80px'}
            >
              <Logo />
            </SvgWrapper>
          </Link>
        </Box>
        <IconButton
          className="collapseBtn"
          variant="outline"
          borderRadius="circle"
          aria-label="Collapse Menu"
          onClick={handleToggleCollapse}
          transition=".4s ease"
          fontSize="20px"
          display={{ base: 'none', md: 'flex' }}
          icon={
            isMenuCollapsed ? <FiArrowRightCircle /> : <FiArrowLeftCircle />
          }
          position="fixed"
          top="6%"
          left={isMenuCollapsed ? '60px' : '220px'}
          zIndex="999999"
        />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Flex
        position="relative"
        alignItems="start"
        pl={2}
        flexDirection="column"
      >
        {sidebarMenuElements.map((group: ISidebarMenuElements) => (
          <SidebarMenuItem
            setIsOpen={setCollapseIsOpen}
            isOpen={collapseIsOpen}
            item={group}
            key={group.title}
          />
        ))}
      </Flex>
    </Box>
  );
}

export default Sidebar;
