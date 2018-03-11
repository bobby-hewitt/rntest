


import MapView from 'react-native-maps'
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Dimensions,
  View
} from 'react-native';

export default class Maps extends Component<{}> {

  constructor(props){
    super(props)
    this.state = {
      
    }
  }

  

  componentWillMount(){
    console.log('mounting maps')
  }

  render() {
    return (

        <MapView
          style={styles.mapContainer}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
  
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    flex:1,
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
});
