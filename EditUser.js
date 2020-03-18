/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import {Pays} from './Pays';

import styles from './style';
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {Button} from 'react-native-elements';

function Edit({route, navigation}) {
  const {detail} = route.params;

  const user = auth().currentUser;
  const [nom, setNom] = useState({value: detail.nom, error: ''});
  const [tel, setTel] = useState({value: detail.tel, error: ''});
  const [pays, setPays] = useState({value: detail.pays, error: ''});
  const [adresse, setAdresse] = useState({
    value: detail.adresse,
    error: '',
  });

  const ref = firestore().collection('users');

  function addUsers() {
    ref
      .doc(user.uid)
      .set({
        userID: user.uid,
        nom: nom.value,
        Email: user.email,
        tel: tel.value,
        pays: pays.value,
        adresse: adresse.value,
      })
      .then(function() {
        navigation.navigate('Profiluser', {
          verify: Math.floor(Math.random() * 10000000000),
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <TextInput
              style={styles.loginFormTextInput}
              value={nom.value}
              placeholder="Nom"
              onChangeText={text => setNom({value: text, error: ''})}
            />
            <TextInput
              style={styles.loginFormTextInput}
              value={tel.value}
              placeholder="Numero de telephone"
              onChangeText={text => setTel({value: text, error: ''})}
            />
            <TextInput
              style={styles.loginFormTextInput}
              value={adresse.value}
              placeholder="Adresse"
              onChangeText={text => setAdresse({value: text, error: ''})}
            />
            <RNPickerSelect
              fixedLabel
              placeholder={{
                label: 'Selectionnez votre pays...',
                color: 'black',
              }}
              label="Telephone"
              value={pays.value}
              onValueChange={value => setPays({value: value, error: ''})}
              items={Pays}
            />
            <Button
              buttonStyle={styles.loginButton}
              onPress={addUsers}
              title="Mettre à jour"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default Edit;
