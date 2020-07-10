import React from 'react';
import { Button as DefaultButton } from '@chakra-ui/core';

import Icon from './Icon';

const renderIcon = (icon, props) => {
  return () => icon ? <Icon {...props} icon={icon} /> : null;
};

const Button = (props) => {
  const { leftIcon, rightIcon, ...restProps } = props;

  return (
    <DefaultButton
      rightIcon={renderIcon(rightIcon, { style: { marginLeft: 8 } })}
      leftIcon={renderIcon(leftIcon, { style: { marginRight: 8 } })}
      {...restProps}
    />
  );
};

export default Button;
