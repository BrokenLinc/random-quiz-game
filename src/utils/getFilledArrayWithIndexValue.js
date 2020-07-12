import { clone, map } from 'lodash';

const getFilledArrayWithIndexValue = (array, index, value, fill = null) => {
  const clonedArray = clone(array) || [];
  clonedArray[index] = value;
  return map(clonedArray, (val) => {
    return val === undefined ? fill : val;
  });
};

export default getFilledArrayWithIndexValue;
