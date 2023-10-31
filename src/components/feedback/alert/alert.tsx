import { useToast, UseToastOptions } from '@chakra-ui/react';


function Alert(props: UseToastOptions) {
  const toast = useToast();
  return <>{toast(props)}</>
}

export default Alert;
