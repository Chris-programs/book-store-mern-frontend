import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase.config';
import { AuthContext } from '../custom hook/useAuth';

// * create useAuth.js in custom hook *
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// * Create an instance of the Google provider object *
const googleProvider = new GoogleAuthProvider();

// * authProvider *
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // * register a user *
  const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // * login the user *
  const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // * sign in with Google *
  const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  // * logout the user *
  const logout = () => {
    return signOut(auth);
  };

  // * manage user data *
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const { displayName, email, photoURL } = user;
        const userData = {
          email: email,
          username: displayName,
          photo: photoURL,
        };
        return userData;
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
  };

  return (
    <>
      {loading && <div>Loading...</div>}
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    </>
  );
};
