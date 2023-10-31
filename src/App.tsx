/* eslint-disable no-unused-expressions */
import { Suspense, useEffect } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import routesList from '@core/routes';
import './core/global.scss';
// import { useDispatch } from 'react-redux';
import { Spinner } from '@chakra-ui/react';
// import { setUser } from './redux/auth/user-slice';
// import { RootState } from './redux/store';
// import { AuthService } from './services/auth-services/auth-services';

function App() {
  const router = useRoutes(routesList);
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // const user = useSelector((state: RootState) => state.user.user);

  const userToken: any = useReadLocalStorage('userToken');

  const getMe = async () => {
    try {
      // const res = await new AuthService().getUserData();
      // dispatch(setUser(res?.user));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    userToken?.token && getMe();
  }, []);
  useEffect(() => {
    if (!userToken && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [userToken, location]);

  return (
    <div>
      <Suspense fallback={<Spinner />}>{router}</Suspense>
    </div>
  );
}

export default App;
