const friendlyJoin = (arr) => {
  if (arr.length === 1) return arr[0];
  const firsts = arr.slice(0, arr.length - 1);
  const last = arr[arr.length - 1];
  return firsts.join(', ') + ', and ' + last;
};

export default friendlyJoin;
