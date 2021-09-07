import React from 'react';
import { render } from 'react-dom';
import AppProvider from "./AppProvider";
import Company from './Company';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

render(
  <AppProvider>
    <Company title={'Company'} />
  </AppProvider>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
