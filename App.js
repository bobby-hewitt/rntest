/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import BackgroundGeolocation from "react-native-background-geolocation";
// import * as Helpers from './helpers'
import {
  LoginButton,
  AccessToken
} from 'react-native-fbsdk';

import MapView from 'react-native-maps'
import * as Location from './helpers/location'
import * as Auth from './helpers/auth'
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Login from './App/Login'
import Photos from './App/Photos'

import {registerKilledListener, registerAppListener, showLocalNotification} from "./helpers/notifications";
import FCM, {NotificationActionType} from "react-native-fcm";

export default class App extends Component<{}> {

  constructor(){
    super(props)
    this.state = {
      timeOfLastTrigger: 0
    }
  }

  onError(e){
    console.log(e)
  }

  componentWillMount(){
    let self = this;
    BackgroundGeolocation.getGeofences(
      function(geofences){
        if (geofences){
          console.log('GEOFENCES found')
        } else {
          console.log('No registeded geofences')
        }
      }, function(error){
        console.log(error)
      }
    )
    BackgroundGeolocation.on('location', Location.onLocation, this.onError);
    BackgroundGeolocation.on('geofenceschange', function(event) {
      var on = event.on;   //<-- new geofences activiated.
      var off = event.off; //<-- geofences that were de-activated.
    });
    BackgroundGeolocation.on('geofence', function(geofence) {
      
      if((new Date()).getTime() > self.state.timeOfLastTrigger + (1000 * 60)){
        showLocalNotification('triggered geofence', geofence.extras.uri)
        self.setState({timeOfLastTrigger: (new Date()).getTime()})
      } else {
        showLocalNotification('NEED TO GROUP', geofence.extras.uri)
      }

    });
    // Helpers.checkPermissions(0)
  }

    async componentDidMount(){
      // showLocalNotification('triggered geofence')
      Location.configureLocationUpdates()
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

  componentWillUnmount() {
    // Remove BackgroundGeolocation listeners
    BackgroundGeolocation.un('location', this.onLocation);
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<Login />*/}
        <Photos />
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
