import React, { FC, memo } from 'react';

import example from 'example-pathway.png';
import github from 'github.png';
import email from 'email.png';
import useStyles from './styles';

const AuthBody: FC = () => {
  const styles = useStyles();
  return (
    <>
      <img src={example} alt="pathway" className={styles.exampleImage} />
      <label className={styles.mainText}>A simple app to build</label>
      <br />
      <label className={styles.mainText}> customized clinical pathways</label>
      <br />
      <label className={styles.subText}>using mCODE. a standardized data </label>
      <br />
      <label className={styles.subText}> model around cancer</label>
      <br />
      <button className={styles.tryItButton}>Try it</button>
      <br />
      <span>
        <img className={styles.images} src={github} alt="github" />
        <img className={styles.images} src={email} alt="email" />
      </span>
    </>
  );
};

export default memo(AuthBody);
