import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import {
  Box,
  Center,
  FormControl,
  FormLabel,
  Input,
  Stack,
  VStack,
  Button,
  InputRightElement,
  InputGroup,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthService } from '@/services/auth-services/auth-services';
import { IAuthLogin } from '@/models/user';
import { useLocalStorage } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { setUser } from '@/redux/auth/user-slice';
import { useDispatch } from 'react-redux';
import {
  inputPlaceholderText,
  inputValidationText
} from '@/utils/constants/texts';
import { HttpError } from '@/services/http_error';

function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IAuthLogin>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userToken, setUserToken] = useLocalStorage<any>('userToken', null);

  const onSubmit: SubmitHandler<IAuthLogin> = async data => {
    try {
      const res = await new AuthService().getToken(data, (e: HttpError) => {
        console.log(e);
        // e.message = 'your custom message';
        // e.preventDefault = true : 'prevent toast message, '
      });

      if (!res) return;

      if (!userToken) setUserToken({ token: res?.data?.token });
      // const resUser = await new AuthService().getUserData();
      dispatch(setUser(res?.data));
      navigate('/home');
    } catch (err) {
      /* do something with error */
    }
  };

  return (
    <Center height="100vh">
      <VStack spacing={8} align="stretch" w="400px">
        <Box p={8} shadow="lg" borderWidth="1px" borderRadius="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Email')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.email)}
                    isRequired
                    id="email"
                  >
                    <FormLabel>Email</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.email ? errors.email.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Email')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="password"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Şifrə')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.password)}
                    isRequired
                    id="password"
                  >
                    <FormLabel>Şifrə</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.password ? errors.password.message : ''}
                    >
                      <InputGroup size="md">
                        <Input
                          onChange={onChange}
                          value={value}
                          type={show ? 'text' : 'password'}
                          placeholder={inputPlaceholderText('Şifrə')}
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            h="1.75rem"
                            size="sm"
                            onClick={() => value && setShow(!show)}
                            aria-label="Show password"
                            icon={!show ? <FiEye /> : <FiEyeOff />}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </Tooltip>
                  </FormControl>
                )}
              />

              <Button
                isDisabled={!isValid}
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                mt={4}
              >
                Daxil ol
              </Button>
            </Stack>
          </form>
        </Box>
      </VStack>
    </Center>
  );
}

export default Login;
