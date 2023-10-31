/* eslint-disable no-unneeded-ternary */
import {
  Box,
  Text,
  Collapse,
  Icon,
  VStack,
  Flex,
  Tooltip
} from '@chakra-ui/react';
import { useEffect, Dispatch, SetStateAction } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';
import { ISidebarMenuElements } from '../sidebar';
import './sidebar-item.scss';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;
interface SidebarMenuItemProps {
  item: ISidebarMenuElements | ISidebarMenuElements[];
  isOpen: string[];
  setIsOpen: Dispatcher<string[]>;
}

function SidebarMenuItem({ item, isOpen, setIsOpen }: SidebarMenuItemProps) {
  const isSingleItem = !Array.isArray(item);

  const {
    title,
    id,
    url,
    isDefaultCollapsed = false,
    isCollapsable,
    modules,
    isChild,
    icon
  } = isSingleItem
    ? (item as ISidebarMenuElements)
    : (item as ISidebarMenuElements[])[0];

  const isMenuCollapsed = useReadLocalStorage('menuCollapsed');
  const location = useLocation();
  const currentURL = location.pathname;
  const targetURL = url;
  const isURLMatched = currentURL === targetURL;
  const handleClick = (shouldCollapseId: string): void => {
    setIsOpen(prevIsOpen =>
      prevIsOpen.includes(shouldCollapseId)
        ? prevIsOpen.filter(z => z !== shouldCollapseId)
        : [...prevIsOpen, shouldCollapseId]
    );
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    isDefaultCollapsed && setIsOpen(prev => [...prev, id]);
  }, []);
  return (
    <VStack w={isChild ? '100%' : '80%'}>
      <Box
        as={!isCollapsable ? NavLink : Box}
        display="flex"
        pr={3}
        w="100%"
        my={1}
        alignItems="center"
        _activeLink={{ border: 'none' }}
        className={`${'sidebar-item'} ${
          isURLMatched ? 'sidebar-item-active' : ''
        }`}
        cursor="pointer"
        pl={4}
        to={url}
        py={2}
      >
        <Flex to={url} as={NavLink}>
          <Icon
            mr={4}
            color="gray.900"
            className="sidebar-item-icon"
            fontSize={24}
            as={icon}
          />
          {!isMenuCollapsed && (
            <Tooltip
              hasArrow
              placement="top-end"
              label={title && title.length > 15 ? title : ''}
            >
              <Text
                whiteSpace="nowrap"
                className="sidebar-item-text"
                fontSize={17}
                color="gray.900"
              >
                {title && title.length > 15
                  ? `${title?.substring(0, 14)}..`
                  : title || ''}
              </Text>
            </Tooltip>
          )}
        </Flex>
        {isCollapsable && (
          <Box
            className="sidebar-item-collapse-icon"
            ml={3}
            onClick={() => (isCollapsable ? handleClick(id) : undefined)}
          >
            {isOpen?.includes(id) ? (
              <FiArrowUp size={24} color="gray.900" />
            ) : (
              <FiArrowDown size={24} color="gray.900" />
            )}
          </Box>
        )}
      </Box>

      {(isCollapsable || isOpen) && (
        <Collapse in={isOpen?.includes(id) ? true : undefined}>
          <VStack align="start" pl={10} py={1}>
            {modules &&
              modules.map((subGroup: ISidebarMenuElements) => (
                <SidebarMenuItem
                  item={subGroup}
                  setIsOpen={setIsOpen}
                  isOpen={isOpen}
                  key={subGroup.title}
                />
              ))}
          </VStack>
        </Collapse>
      )}
    </VStack>
  );
}
export default SidebarMenuItem;
