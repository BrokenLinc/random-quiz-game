import React from 'react';
import firebase from 'firebase/app';

import firebaseConfig from './firebaseConfig';
import { AuthProvider } from './lib/useAuth';
import Router from './Router';
import ThemeProvider from './ThemeProvider';

firebase.initializeApp(firebaseConfig);

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
