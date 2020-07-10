const Suspender = (props) => {
  const { error, loaded, children } = props;
  if (error) return 'Error!';
  if (!loaded) return 'Loading...';
  return children();
};

export default Suspender;
