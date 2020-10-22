import React, { FC, memo } from 'react';
import styles from './Auth.module.scss';

import example from 'example-pathway.png';
import github from 'github.png';
import email from 'email.png';
const AuthBody: FC = () => {

  return (
    <>
      <img src={example} alt="pathway" className={styles.example} />
      <label className={styles.mainText}>A simple app to build</label>
      <label className={styles.mainText}> customized clinical pathways</label>
      <label className={styles.subText}>using mCODE. a standardized data </label>
      <label className={styles.subText}> model around cancer</label>
      <button className={styles.tryIt}>Try it</button>
      <span>
        <img className={styles.images} src={github} />
        <img className={styles.images} src={email} />
      </span>
    </>
  );
};

export default memo(AuthBody);
