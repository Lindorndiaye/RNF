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
import styles from './style';
import {Button} from 'react-native-elements';
import {Text, View, Image, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import {Avatar} from 'react-native-elements';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';
import {firebase} from '@react-native-firebase/storage';

function Profil({route, navigation, image, onImagePicked}) {
  const [photo, setPhoto] = useState();

  useEffect(() => {
    if (route.params?.verfy) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
    }
    // Retrive Image
    const ref = firebase.storage().ref();
    ref
      .child(auth().currentUser.photoURL)
      .getDownloadURL()
      .then(url => {
        console.log(url);
        setPhoto(url);
      })
      .catch(error => {
        // Handle any errors
        console.log(error);
      });
  }, [route.params?.verify]);

  const user = auth().currentUser;

  const [userDetail, setUserDetail] = useState({
    nom: '',
    Email: '',
    tel: '',
    pays: '',
    adresse: '',
  });

  function pickImageHandler() {
    ImagePicker.showImagePicker({title: 'Choisir une image'}, response => {
      if (response.error) {
        console.log('image error');
      } else {
        uploadImage(
          response.uri,
          `${user.uid}${user.email}.${response.type.split('/')[1]}`,
        )
          .then(resp => {
            console.log(resp.metadata.fullPath);
            firebase.auth().currentUser.updateProfile({
              photoURL: resp.metadata.fullPath,
            });
            Alert.alert('Success');
          })
          .catch(error => {
            Alert.alert(error);
          });
        uploadImage;
        console.log('Image: ' + response.uri);
        setPhoto(response.uri);
        //onImagePicked({uri: response.uri});
      }
    });
  }

  async function uploadImage(uri, imageName) {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child('images/profils/' + imageName);
    return ref.put(blob);
  }

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(function(doc) {
        const detail = doc.data();
        console.log(`detail:${detail}`);
        setUserDetail(detail);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, [route.params?.verify]);
  return (
    <View style={styles.view2}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* <TouchableOpacity>
            <Avatar size="xlarge" rounded icon={{name: 'add'}} />
          </TouchableOpacity> */}
          <Avatar
            size="xlarge"
            onPress={pickImageHandler}
            rounded
            source={{uri: photo}}
          />
          {/* <Image style={styles.avatar} source={require('./0.jpg')} /> */}
          <Text style={styles.name}>{userDetail.nom}</Text>
        </View>
      </View>
      {/* card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="mail" color="#3897f1" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.description}>{userDetail.Email}</Text>
        </View>
      </View>
      {/* card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="phone" color="#3897f1" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.description}>{userDetail.tel}</Text>
        </View>
      </View>
      {/* card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="flag" color="#3897f1" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.description}>{userDetail.pays}</Text>
        </View>
      </View>
      {/* card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="map" color="#3897f1" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.description}>{userDetail.adresse}</Text>
        </View>
      </View>
      <Button
        buttonStyle={styles.loginButton}
        onPress={() =>
          navigation.navigate('Profil', {
            screen: 'Edit',
            params: {detail: userDetail},
          })
        }
        title="Modifier"
      />
    </View>
  );
}

export default Profil;
