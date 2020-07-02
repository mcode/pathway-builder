import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { enableMapSet } from 'immer';

import App from 'components/App';

import './styles/index.scss';

// Enable use of immer produce on maps
enableMapSet();

// Enable why did you render for development mode
// Will automatically track all memoized components
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true
  });
}

ReactDOM.render(<App />, document.getElementById('root'));
