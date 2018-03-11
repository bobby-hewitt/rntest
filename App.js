
import BackgroundGeolocation from "react-native-background-geolocation";
// import * as Helpers from './helpers'

import MainNav from './App/MainNav'

import * as Location from './helpers/location'
import * as Auth from './helpers/auth'
import { addPhotoToDate, getFromAsync, createKey } from './helpers/async'
import { getPlace } from './helpers/api'
import React, { Component } from 'react';
import Onboard from './App/Onboard'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
} from 'react-native';
import firebase from 'firebase'
import { clearApp, getAsyncKeys } from './helpers/development'
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
      route: 'feed',
    }
  }

    onTabClick(link){
    console.log('tb clicked')
    this.setState({route: link})
  }

  onError(e){
    console.log(e)
  }

  initialiseFirebase(){
  var config = {
    apiKey: "AIzaSyC8XK_ubSWBB_IyN4SPY3jNaPmrLOLLw0Y",
    authDomain: "places-8f3fb.firebaseapp.com",
    databaseURL: "https://places-8f3fb.firebaseio.com",
    projectId: "places-8f3fb",
    storageBucket: "places-8f3fb.appspot.com",
    messagingSenderId: "216148414726"
  };
  firebase.initializeApp(config);
  }

  componentWillMount(){
    this.initialiseFirebase()
    clearApp()
    getAsyncKeys()
    let self = this;
    getFromAsync(createKey()).then((data) => {
      self.setState({photos: JSON.parse(data)})
      console.log('photos returned')
    })
    .catch((error) => {
      console.log('error returned', error)
      return
    })
    
    BackgroundGeolocation.on('location', Location.onLocation, this.onError);
    BackgroundGeolocation.on('geofenceschange', function(event) {
      console.log('GEOFENCES CHANGED')
      var on = event.on;   //<-- new geofences activiated.
      var off = event.off; //<-- geofences that were de-activated.
    });

    BackgroundGeolocation.on('geofence', function(geofence) {
      const delay = 1000 * 10
      if((new Date()).getTime() > self.state.timeOfLastTrigger + delay){
        self.setInitialGeofenceState(geofence, delay)
      } else {
        self.addToGeofenceState(geofence)
      }
    });
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
    console.log('bundling geofencew')
    let geofences = Object.assign([], this.state.geofences)
    if (geofences.length > 1){
      newGeofenceData = []
      for (var i = 0; i < geofences.length; i ++){
          Location.removeGeofence(geofences[i].identifier)
          if (geofences[i].extras.isArray){
            newGeofenceData.concat(geofences[i].extras.photos)
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
    BackgroundGeolocation.un('location', this.onLocation);
  }



  render() {
    return (
      <MainNav 
        photos={this.state.photos}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tabBarContainer:{
    zIndex:100000000,
  },
  tabBar:{
    flexDirection:'row',
  }
});
