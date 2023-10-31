const checkPermission = (permissions: string[]): boolean => {
  const userPermissions: string[] = [
    'route_main_page',
    'route_menus_page',
    'route_orders_page'
  ];
  return permissions.some(p => userPermissions.includes(p));
};
export default checkPermission;
