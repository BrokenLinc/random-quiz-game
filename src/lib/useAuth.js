import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const db = firebase.firestore;

const AuthContext = React.createContext({});

export const updateUser = (id, values) => {
  return db().collection('users').doc(id).set(values, {
    merge: true
  });
};

export const AuthProvider = (props) => {
  const googleAuthProvider = React.useRef(new firebase.auth.GoogleAuthProvider()).current;
  const [loaded, setLoaded] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user ? {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      } : null);
      setLoaded(true);
      // TODO: set hasLoggedOut to true
      return updateUser(user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    });
  }, []);

  const value = {
    loaded,
    signIn: () => firebase.auth().signInWithPopup(googleAuthProvider),
    signOut: () => firebase.auth().signOut(),
    user,
  };

  return (
    <AuthContext.Provider value={value} {...props} />
  );
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export default useAuth;
