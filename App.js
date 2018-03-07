/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as Helpers from './helpers'
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;
import MapView from 'react-native-maps'
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {registerKilledListener, registerAppListener, showLocalNotification} from "./helpers/notifications";
import FCM, {NotificationActionType} from "react-native-fcm";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {

  // componentDidMount(){
  //   // Helpers.checkPermissions(0)
  // }

    async componentDidMount(){
      registerAppListener(this.props.navigation);
      FCM.getInitialNotification().then(notif => {
        this.setState({
          initNotif: notif
        })
        if(notif && notif.targetScreen === 'detail'){
          setTimeout(()=>{
            this.props.navigation.navigate('Detail')
          }, 500)
        }
      });

      try{
        let result = await FCM.requestPermissions({badge: false, sound: true, alert: true});
      } catch(e){
        console.error(e);
      }

      FCM.getFCMToken().then(token => {
        console.log("TOKEN (getFCMToken)", token);
        this.setState({token: token || ""})
      });

      if(Platform.OS === 'ios'){
        FCM.getAPNSToken().then(token => {
          console.log("APNS TOKEN (getFCMToken)", token);
        });
      }
    }

  render() {
    return (
      <View style={styles.container}>
         <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    alert(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("logout.")}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
