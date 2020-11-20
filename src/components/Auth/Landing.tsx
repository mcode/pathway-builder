import React, { FC, memo } from 'react';

import { LandingHeader, LandingBody, LandingFooter } from 'components/Auth';
import useStyles from './styles';
import { useAuthModalContext } from './AuthModalProvider';

const Landing: FC = () => {
  const styles = useStyles();
  const { openLoginModal, openSignupModal } = useAuthModalContext();

  return (
    <div className={styles.landing}>
      <LandingHeader openLogin={openLoginModal} openSignup={openSignupModal} />
      <LandingBody />
      <LandingFooter />
    </div>
  );
};

export default memo(Landing);
