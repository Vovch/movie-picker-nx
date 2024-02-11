import React from 'react';

export const withLogger = (Component: React.ComponentType) => (props: any) => {
  console.log(props);

  return <Component {...props} />;
};
