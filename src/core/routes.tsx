import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@core/layout';
import checkPermission from '@/utils/checkPermission';
import Transactions from '@/views/transactions/transactions';
import Web from '@/views/web/web';
import WebAboutPage from '@/views/web-about/pages';
import WebElevenPage from '@/views/web-eleven/pages';
import WebSliderPage from '@/views/web-slider/pages';
import BranchesPage from '@/views/branches/pages';
import ClientsPage from '@/views/clients/pages';
import UsersPage from '@/views/users/pages';
import ProductPage from '@/views/product/pages';
import Category from '@/views/category/components/category';
import MessagesPages from '@/views/messages/pages';
import CarrerPage from '@/views/career/pages';
import ApplicationsPage from '@/views/applications/pages';
import { Spinner } from '@chakra-ui/react';
import Customers from '@/views/customers/customers';
import Reservations from '@/views/reservations/reservations';
import Admins from '@/views/admins/pages';
import Partners from '@/views/partners/components/partners';
import ConnectorTypesPage from '@/views/connector-types/pages';
import Connectors from '@/views/connectors/components/connectors';
import ChargePointsPage from '@/views/chargepoints/pages';
import Cib from '@/views/cib/cib';
import Sessions from '@/views/sessions/sessions';
import ActiveSessions from '@/views/active-sessions/active-sessions';
import Reports from '@/views/reports/reports';
import Archive from '@/views/archive/archive';
import Login from './login/login';
import NotFound from './404/404';
import NoPermission from './no-permission/no-permission';

// const MAIN_PAGE = lazy(() => import('@/views/main/pages'));
const SERVICES_PAGE = lazy(() => import('@views/services'));

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Navigate to="/reports" /> },
      { path: '/home', element: <Navigate to="/reports" /> },
      // {
      //   path: '/home',
      //   index: true,
      //   element: checkPermission(['route_main_page']) ? (
      //     <Suspense fallback={<Spinner />}>
      //       {' '}
      //       <MAIN_PAGE />
      //     </Suspense>
      //   ) : (
      //     <Navigate to="/no-permission" />
      //   ),
      //   permission: ['view_main_page']
      // },
      {
        path: 'transactions',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Transactions />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'archive',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Archive />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'cib',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Cib />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'sessions',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Sessions />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'active-sessions',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <ActiveSessions />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'reports',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Reports />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'customers',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Customers />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'reservations',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Reservations />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'admins',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Admins />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'partners',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Partners />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'connector-types',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <ConnectorTypesPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'connectors',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <Connectors />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'charge-points',
        element: checkPermission(['route_orders_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <ChargePointsPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'menus',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <h1>menus</h1>
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'branches',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <BranchesPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },

      {
        path: 'clients',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <ClientsPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'users',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <UsersPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'messages',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <MessagesPages />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'career',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <CarrerPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'applications',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <ApplicationsPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },

      {
        path: 'reports',
        element: checkPermission(['route_reports_page']) ? (
          <Suspense fallback={<Spinner />}>
            <h1>reports</h1>
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'web',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <Web />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'web/slider',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <WebSliderPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'web/about',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <WebAboutPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'web/eleven-ingredient',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <WebElevenPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'category',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <Category />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'product',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>
            <ProductPage />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'test',
        element: checkPermission(['route_menus_page']) ? (
          <Suspense fallback={<Spinner />}>TEST</Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_about_page'],
        children: [
          {
            path: '/test/1',

            element: checkPermission(['view_test_page1']) ? (
              <h1>test 1</h1>
            ) : (
              <Navigate to="/no-permission" />
            ),
            permission: ['view_test_page1']
          },
          {
            path: '/test/2',
            element: checkPermission(['view_test_page2']) ? (
              <h1>test 2</h1>
            ) : (
              <Navigate to="/no-permission" />
            ),
            permission: ['view_test_page2']
          }
        ]
      },
      {
        path: 'info',
        element: checkPermission(['view_services_page']) ? (
          <Suspense fallback={<Spinner />}>
            {' '}
            <SERVICES_PAGE />
          </Suspense>
        ) : (
          <Navigate to="/no-permission" />
        ),
        permission: ['view_services_page']
      },
      {
        path: 'no-permission',
        element: <NoPermission />
      },
      {
        path: '404',
        element: <NotFound />
      }
    ]
  },

  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  }
];

export default routes;
