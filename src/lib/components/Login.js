import React from 'react';
import { Button, Flex } from '@chakra-ui/core';

import useAuth from '../useAuth';

const Login = () => {
  const auth = useAuth();
  return (
    <Flex height="100%" alignItems="center" justifyContent="center">
      <Button
        onClick={auth.signIn}
        rightIcon="arrow-forward"
      >
        Login With Google
      </Button>
    </Flex>
  );
};

export default Login;
