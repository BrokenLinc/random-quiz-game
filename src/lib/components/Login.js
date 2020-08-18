import React from 'react';
import { Button, Flex, Image } from '@chakra-ui/core';

import useAuth from '../useAuth';

const Login = () => {
  const auth = useAuth();
  return (
    <Flex height="100%" direction="column" alignItems="center" justifyContent="center">
      <Image alt="How Many Times" src="logo.svg" mb={4} width={220} />
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
