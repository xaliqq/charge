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
import { useLocation, useNavigate } from 'react-router-dom';
import { ISidebarMenuElements } from '../sidebar';
import './sidebar-item.scss';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;
interface SidebarMenuItemProps {
  item: ISidebarMenuElements | ISidebarMenuElements[];
  isOpen: string[];
  setIsOpen: Dispatcher<string[]>;
}

function SidebarMenuItem({ item, isOpen, setIsOpen }: SidebarMenuItemProps) {
  const navigate = useNavigate();
  const isSingleItem = !Array.isArray(item);

  const {
    title,
    id,
    url = '',
    isDefaultCollapsed = false,
    isCollapsable,
    modules,
    isChild,
    icon,
    state
  } = isSingleItem
    ? (item as ISidebarMenuElements)
    : (item as ISidebarMenuElements[])[0];

  const isMenuCollapsed = useReadLocalStorage('menuCollapsed');
  const location = useLocation();
  const isURLMatched = id === location?.state?.id;
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
        as={Box}
        display="flex"
        pr={3}
        w="100%"
        my={1}
        alignItems="center"
        _activeLink={{ border: 'none' }}
        className={`${'sidebar-item'} ${
          isURLMatched ? 'sidebar-item-active' : ''
        }`}
        onClick={() =>
          isCollapsable ? handleClick(id) : navigate(url, { state })
        }
        cursor="pointer"
        pl={4}
        py={2}
      >
        <Flex>
          {icon && (
            <Icon
              mr={4}
              color="gray.900"
              className="sidebar-item-icon"
              fontSize={20}
              as={icon}
            />
          )}

          {!isMenuCollapsed && (
            <Tooltip
              hasArrow
              placement="top-end"
              label={title && title.length > 15 ? title : ''}
            >
              <Text
                whiteSpace="nowrap"
                className="sidebar-item-text"
                fontSize={14}
                color="gray.900"
              >
                {title && title.length > 17
                  ? `${title?.substring(0, 16)}..`
                  : title || ''}
              </Text>
            </Tooltip>
          )}
        </Flex>
      </Box>

      {(isCollapsable || isOpen) && (
        <Collapse in={isOpen?.includes(id) ? true : undefined}>
          {modules &&
            modules.map((subGroup: ISidebarMenuElements) => (
              <SidebarMenuItem
                item={subGroup}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                key={subGroup.title}
              />
            ))}
        </Collapse>
      )}
    </VStack>
  );
}
export default SidebarMenuItem;
