import React, { FC, memo } from 'react';

import { AuthHeader, AuthBody, AuthFooter } from 'components/Auth';
import ThemeProvider from '../ThemeProvider';

const Auth: FC = () => {
  return (
    <ThemeProvider theme="light">
      <>
        <AuthHeader />
        <AuthBody />
        <AuthFooter />
      </>
    </ThemeProvider>
  );
};

export default memo(Auth);
