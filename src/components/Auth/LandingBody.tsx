import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import example from 'assets/example-pathway.png';
import useStyles from './styles';

const LandingBody: FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.landingBody}>
      <div className={styles.landingContent}>
        <div className={clsx(styles.text, styles.mainText)}>
          A simple app to build customized clinical pathways
        </div>

        <div className={clsx(styles.text, styles.subText)}>
          using{' '}
          <a
            href="https://mcodeinitiative.org/"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            mCODE
          </a>
          , a standardized data model around cancer
        </div>

        <Link to="/demo">
          <Button className={styles.tryItButton}>Try It</Button>
        </Link>

        <div className={styles.socialMedia}>
          <a
            href="https://github.com/mcode/pathway-builder"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton className={styles.iconGithub}>
              <FontAwesomeIcon icon={faGithub} />
            </IconButton>
          </a>

          {/*TODO: hook up*/}
          <IconButton className={styles.iconEmail}>
            <div className={styles.iconEmailCircle}>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
          </IconButton>
        </div>
      </div>

      <>
        <img src={example} alt="pathway" className={styles.exampleImage} />
      </>
    </div>
  );
};

export default memo(LandingBody);
