/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import Signin from './Signin';
import Signup from './Signup';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import Home from './Home';
import AsyncStorage from '@react-native-community/async-storage';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
export const AuthContext = React.createContext();

function App({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [error, setError] = useState(null);
  function onAuthStateChanged(userCredencial) {
    setUser(userCredencial);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [user]);
  useEffect(() => {
    if (error !== null) {
      Alert.alert(error);
      setError(null);
    }
  }, [error]);

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: auth().currentUser,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: auth().currentUser,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = auth().currentUser;
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async ({email, password}) => {
        auth()
          .signInWithEmailAndPassword(email, password)
          .then(function(u) {
            if (u) {
              console.log(u);
              dispatch({type: 'SIGN_IN', token: u.user.uid});
              // navigation.navigate('Home');
            }
          })
          .catch(function(error) {
            console.log(error.code);
            switch (error.code) {
              case 'auth/invalid-email':
                setError('Invalid email address format.');
                break;
              case 'auth/user-not-found':
                setError("Votre email n'est associé a aucun compte");
                break;
              case 'auth/wrong-password':
                setError('Invalid email address or password.');
                break;
              case 'auth/too-many-requests':
                setError('Too many request. Try again in a minute.');
                break;
              default:
                setError('Check your internet connection.');
            }
          });
      },
      signOut: () => {
        console.log('signOut');
        auth().signOut();
        dispatch({type: 'SIGN_OUT'});
      },

      signUp: async ({email, password}) => {
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(function(u) {
            if (u) {
              console.log(`created user: ${u}`);
              profil(u.user.uid);
              dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
            } else {
              console.log('nothing');
            }
          })
          .catch(function(error) {
            console.log(error.code);
            switch (error.code) {
              case 'auth/email-already-in-use':
                setError('E-mail already in use.');
                break;
              case 'auth/invalid-email':
                setError('Invalid e-mail address format.');
                break;
              case 'auth/weak-password':
                setError('Password is too weak.');
                break;
              case 'auth/too-many-requests':
                setError('Too many request. Try again in a minute.');
                break;
              default:
                setError('Check your internet connection.');
            }
          });
      },
    }),
    [],
  );
  function profil(userId) {
    firestore()
      .collection('users')
      .doc(userId)
      .set({
        userID: '',
        nom: '',
        Email: '',
        tel: '',
        pays: '',
        adresse: '',
      })
      .then(function() {
        return true;
      })
      .catch(function(error) {
        return false;
      });
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {state.userToken == null ? (
            <>
              <Stack.Screen
                name="Login"
                component={Signin}
                options={{title: 'Se connecter'}}
              />
              <Stack.Screen
                name="Inscription"
                component={Signup}
                options={{title: "S'inscrire"}}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={Home} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
export default App;
