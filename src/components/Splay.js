import React from 'react';
import { map } from 'lodash';
import { List, ListItem, Text } from '@chakra-ui/core';

const printValue = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  if(typeof value === 'boolean') return value ? 'true' : 'false';
  return value;
};

const Splay = (props) => {
  const { children, type, ...restProps } = props;
  const keys = Object.keys(restProps).sort();
  return (
    <>
      <Text fontSize="2xl" fontWeight="bold">
        {type} {props.id}
      </Text>
      <List styleType="disc" stylePos="outside" ml={8} mb={8}>
        {map(keys, (key) => (
          <ListItem key={key}><b>{key}:</b> {printValue(restProps[key])}</ListItem>
        ))}
      </List>
      {children}
    </>
  );
};

export default Splay;
