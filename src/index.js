import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './immer';
import React from 'react';
import ReactDOM from 'react-dom';

import App from 'components/App';

import './styles/index.scss';

// Enable why did you render for development mode
// Will automatically track all memoized components
// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, {
//     trackAllPureComponents: true
//   });
// }

ReactDOM.render(<App />, document.getElementById('root'));
