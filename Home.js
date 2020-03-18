import React, {useContext} from 'react';
import {AuthContext} from './App';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Profil from './Profil';
import EditUser from './EditUser';
import styles from './style';
import {Button} from 'react-native-elements';

function HomeScreen({navigation}) {
  return (
    <View style={styles.view1}>
      <Text>Home Screen</Text>
    </View>
  );
}

function Deconnexion({navigation}) {
  const {signOut} = useContext(AuthContext);
  return (
    <View style={styles.view1}>
      <Text>Voulez-vous vous deconnectez ?</Text>
      {/* <Button onPress={() => signOut()} title="Deconnexion" /> */}
      <Button
        buttonStyle={styles.loginButton}
        onPress={() => signOut()}
        title="Deconnexion"
      />
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Roots() {
  return (
    <Stack.Navigator initialRouteName="Profil">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Home'}}
      />
    </Stack.Navigator>
  );
}

function Root() {
  return (
    <Stack.Navigator initialRouteName="Profil">
      <Stack.Screen
        name="Profiluser"
        component={Profil}
        options={{title: 'Profil'}}
      />
      <Stack.Screen name="Edit" component={EditUser} />
    </Stack.Navigator>
  );
}

export default function Home() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Roots} />
        <Drawer.Screen name="Profil" component={Root} />
        <Drawer.Screen name="Deconnexion" component={Deconnexion} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
