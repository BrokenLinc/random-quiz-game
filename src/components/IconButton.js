import React from 'react';
import { IconButton as DefaultIconButton } from '@chakra-ui/core';

import Icon from './Icon';

const renderIcon = (icon, props) => {
  return () => icon ? <Icon {...props} icon={icon} /> : null;
};

const IconButton = (props) => {
  const { icon, ...restProps } = props;

  return (
    <DefaultIconButton
      icon={renderIcon(icon)}
      {...restProps}
    />
  );
};

export default IconButton;
