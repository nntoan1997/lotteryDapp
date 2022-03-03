import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import 'bootstrap/dist/js/bootstrap.js'

import App from './App';

import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
import { MetaMaskProvider } from './hooks/metamask'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'flag-icon-css/css/flag-icons.min.css'

function getLibrary(provider, connector) {
  return new Web3(provider)
}


i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'vn'],
    fallbackLng: 'en',
    debug: false,
    // Options for language detector
    detection: {
      order: ['path', 'cookie', 'htmlTag'],
      caches: ['cookie'],
    },
    // react: { useSuspense: false },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
  })

const loadingMarkup = (
  <div className="py-4 text-center">
    <h3>Loading..</h3>
  </div>
)

ReactDOM.render(
  <Suspense fallback={loadingMarkup}>
    <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MetaMaskProvider>
          <App />
        </MetaMaskProvider>
      </Web3ReactProvider>
    </React.StrictMode>
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
