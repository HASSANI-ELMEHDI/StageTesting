import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import { HashRouter, Route } from 'react-router-dom';

import AdminLayout from './layouts/admin';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <HashRouter>
        <Route path="/" component={AdminLayout} />
      </HashRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);