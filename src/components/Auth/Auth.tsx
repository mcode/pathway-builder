import React, { FC, memo } from 'react';

import { AuthHeader, AuthBody, AuthFooter } from 'components/Auth';

const Auth: FC = () => {
  return (
    <>
      <AuthHeader />
      <AuthBody />
      <AuthFooter />
    </>
  );
};

export default memo(Auth);
