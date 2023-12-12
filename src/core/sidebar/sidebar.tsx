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

import {
  //  AiOutlineUnorderedList,
  AiOutlineBranches
} from 'react-icons/ai';
import { useLocalStorage } from 'usehooks-ts';
import { ReactComponent as Logo } from '@assets/logo/logo.svg';
import SvgWrapper from '@/components/display/svg-wrapper/svg-wrapper';
import { CiMenuBurger } from 'react-icons/ci';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { MdOutlineArchive } from 'react-icons/md';

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
  url?: string;
  isCollapsable?: boolean;
  modules?: ISidebarMenuElements[];
  isChild?: boolean;
  state?: any;
}

function Sidebar({ onClose, isOpen, ...rest }: SidebarProps) {
  const sidebarMenuElements = [
    {
      id: 'element-11',
      title: 'Hesabatlar',
      isCollapsable: false,
      icon: HiOutlineDocumentReport,
      state: {
        id: 'element-11'
      },
      url: '/reports'
    },
    {
      id: 'element-1',
      title: 'Tranzaksiya',
      isCollapsable: true,
      icon: CiMenuBurger,
      modules: [
        {
          id: 'element-1-1',
          title: 'Ödənilməyən',
          isCollapsable: false,
          url: '/transactions',
          state: {
            status: 0,
            id: 'element-1-1'
          },
          isChild: true
        },
        {
          id: 'element-1-2',
          title: 'Ödənilən',
          isCollapsable: false,
          url: '/transactions',
          state: {
            status: 3,
            id: 'element-1-2'
          },
          isChild: true
        },
        {
          id: 'element-1-3',
          title: 'Geri qaytarılan',
          isCollapsable: false,
          url: '/transactions',
          state: {
            status: 5,
            id: 'element-1-3'
          },
          isChild: true
        },
        {
          id: 'element-1-4',
          title: 'Rədd edilən',
          isCollapsable: false,
          url: '/transactions',
          state: {
            status: 6,
            id: 'element-1-4'
          },
          isChild: true
        },
        {
          id: 'element-1-5',
          title: 'İmtina edilən',
          isCollapsable: false,
          url: '/transactions',
          state: {
            status: 8,
            id: 'element-1-5'
          },
          isChild: true
        }
      ]
    },
    {
      id: 'element-8',
      title: 'Cib',
      isCollapsable: true,
      icon: CiMenuBurger,
      modules: [
        {
          id: 'element-8-1',
          title: 'Ödənilməyən',
          isCollapsable: false,
          url: '/cib',
          state: {
            status: 'new',
            id: 'element-8-1'
          },
          isChild: true
        },
        {
          id: 'element-8-2',
          title: 'Ödənilən',
          isCollapsable: false,
          url: '/cib',
          state: {
            status: 'charged',
            id: 'element-8-2'
          },
          isChild: true
        },
        {
          id: 'element-8-3',
          title: 'Geri qaytarılan',
          isCollapsable: false,
          url: '/cib',
          state: {
            status: 'refunded',
            id: 'element-8-3'
          },
          isChild: true
        },
        {
          id: 'element-8-4',
          title: 'Rədd edilən',
          isCollapsable: false,
          url: '/cib',
          state: {
            status: 'rejected',
            id: 'element-8-4'
          },
          isChild: true
        },
        {
          id: 'element-8-5',
          title: 'İmtina edilən',
          isCollapsable: false,
          url: '/cib',
          state: {
            status: 'declined',
            id: 'element-8-5'
          },
          isChild: true
        }
      ]
    },
    {
      id: 'element-9',
      title: 'Sessiyalar',
      isCollapsable: true,
      icon: CiMenuBurger,
      modules: [
        {
          id: 'element-9-1',
          title: 'Kabel',
          isCollapsable: false,
          url: '/sessions',
          state: {
            status: 0,
            id: 'element-9-1'
          },
          isChild: true
        },
        {
          id: 'element-9-2',
          title: 'Bitiş',
          isCollapsable: false,
          url: '/sessions',
          state: {
            status: 1,
            id: 'element-9-2'
          },
          isChild: true
        }
      ]
    },
    {
      id: 'element-10',
      title: 'Charging',
      isCollapsable: false,
      icon: CiMenuBurger,

      url: '/active-sessions',
      state: {
        id: 'element-10'
      }
    },
    {
      id: 'element-2',
      title: 'Müştərilər',
      isCollapsable: false,
      icon: BiUser,
      state: {
        id: 'element-2'
      },
      url: '/customers'
    },
    {
      id: 'element-4',
      title: 'Adminlər',
      isCollapsable: false,
      icon: BiUser,
      state: {
        id: 'element-4'
      },
      url: '/admins'
    },
    {
      id: 'element-5',
      title: 'Partnyorlar',
      isCollapsable: false,
      icon: BiUser,
      state: {
        id: 'element-5'
      },
      url: '/partners'
    },
    {
      id: 'element-6',
      title: 'Birləşdirici növləri',
      isCollapsable: false,
      icon: AiOutlineBranches,
      state: {
        id: 'element-6'
      },
      url: '/connector-types'
    },
    {
      id: 'element-7',
      title: 'Məntəqələr',
      isCollapsable: false,
      icon: AiOutlineBranches,
      state: {
        id: 'element-7'
      },
      url: '/charge-points'
    },
    {
      id: 'element-12',
      title: 'Arxiv',
      isCollapsable: false,
      icon: MdOutlineArchive,
      state: {
        id: 'element-12'
      },
      url: '/archive'
    }
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
          <Link as={NavLink} to="/reports">
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
