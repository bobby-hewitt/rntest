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
import { addPhotoToDate, getFromAsync, createKey } from './helpers/async'
import { getPlace } from './helpers/api'
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { clearApp, getAsyncKeys } from './helpers/development'
import Login from './App/Login'
import Photos from './App/Photos'
import {registerKilledListener, registerAppListener, showLocalNotification} from "./helpers/notifications";
import { initiatePhotos } from "./helpers/photos";
import FCM, {NotificationActionType} from "react-native-fcm";

export default class App extends Component<{}> {

  constructor(props){
    super(props)
    this.state = {
      timeOfLastTrigger: 0,
      lastTriggerIdentifier: null,
      photosToGroup: [],
      photos:[],
      geofences: [],
    }
  }

  onError(e){
    console.log(e)
  }

  componentWillMount(){
    clearApp()
    // getAsyncKeys()

    let self = this;
    getFromAsync(createKey()).then((data) => {
      // self.setState({photos: JSON.parse(data)})
      console.log('photos returned')
    })
    .catch((error) => {
      console.log('error returned', error)
      return
    })
    
    // BackgroundGeolocation.getGeofences(
    //   function(geofences){
    //     if (geofences){
    //       console.log('GEOFENCES found')
    //     } else {
    //       console.log('No registeded geofences')
    //     }
    //   }, function(error){
    //     console.log(error)
    //   }
    // )
    BackgroundGeolocation.on('geofenceschange', function(event) {
      var on = event.on;   //<-- new geofences activiated.
      var off = event.off; //<-- geofences that were de-activated.
    });






    BackgroundGeolocation.on('geofence', function(geofence) {
      //if no geofences have been triggered here
      const delay = 1000 * 10
      if((new Date()).getTime() > self.state.timeOfLastTrigger + delay){
        // showLocalNotification('triggered geofence', geofence.extras.uri)

        self.setInitialGeofenceState(geofence, delay)
      } else {
        // showLocalNotification('NEED TO GROUP', geofence.extras.uri)
        
        self.addToGeofenceState(geofence)
        // addPhotoToDate(geofence.extras.uri, function(data){
        //   self.setState({photos: data})
        // })
      }
    });
    // Helpers.checkPermissions(0)
  }

  setInitialGeofenceState(geofence, delay){
    console.log('setting initial geofence')
    this.setState({
      geofences: [geofence],
      timeOfLastTrigger: (new Date()).getTime()
    })
    setTimeout(() => {
      this.bundleGeofences()
    },delay)
  }

  addToGeofenceState(geofence){
    var newFences = Object.assign([], this.state.geofences)
    newFences.push(geofence)
    this.setState({geofences: newFences})
  }

  bundleGeofences(){
  //bundle and save photos under one geofence
    let geofences = Object.assign([], this.state.geofences)

    if (geofences.length > 1){

      newGeofenceData = []
      for (var i = 0; i < geofences.length; i ++){
          Location.removeGeofence(geofences[i].identifier)
          if (geofences[i].extras.isArray){
            newGeofenceData.append(geofences.extras.photos)
          } else {
            let arrItem = {
              uri: geofences[i].extras.uri,
              timestamp: geofences[i].extras.timestamp,
            }
            newGeofenceData.push(arrItem)
          }
          //structure geofences
        }
        console.log('THE GEOFENCES', geofences[0].location)
        getPlace(geofences[0].location.coords.latitude, geofences[0].location.coords.longitude).then((place) => {
          var geoFence = {
            identifier: geofences[0].identifier,
            radius: 50,
            latitude: geofences[0].location.coords.latitude,
            longitude: geofences[0].location.coords.longitude,
            notifyOnEntry: true,
            notifyOnExit: false,
            extras: {
              place: place,                // Optional arbitrary meta-data
              isArray: true,
              photos: newGeofenceData
            }
          }
          Location.addGeofence(geoFence).then(() => {
            showLocalNotification("You have memories here", "You've stumbled upon a photo. Open the app to see it.")
            console.log('HERE IS THE GEOFENCE', geoFence)
            this.addToRecord(geoFence)
            
          })
        })
      } else {
        showLocalNotification('You have memories here', " Should be single.")
        this.addToRecord(geofences[0])
      }
  }

  addToRecord(geofence){
    var self = this;
    this.setState({
      geofences: null,
      timeOfLastTrigger: 0,
    })
    addPhotoToDate(geofence, function(data){
      self.setState({photos: data})
    })
  }

  async componentDidMount(){
    // showLocalNotification('triggered geofence')
    //first value is test
    initiatePhotos(false, (photos) => {
      if (photos){
        this.setState({photos})
      }
    })
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
    // BackgroundGeolocation.un('location', this.onLocation);
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<Login />*/}
        <Photos photos={this.state.photos.reverse()}/>
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
