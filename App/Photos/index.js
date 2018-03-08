
import {
  LoginButton,
  AccessToken
} from 'react-native-fbsdk';

import * as Auth from '../../helpers/auth'
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  FlatList,
  Image,
  Text,
  CameraRoll,
  Dimensions,
  View,
  ScrollView,
  AsyncStorage
} from 'react-native';
import { addGeoFences } from '../../helpers/location'
import { getFromAsync, saveToAsync, removeItem } from '../../helpers/async'
export default class Photos extends Component<{}> {


  constructor(props){
    super(props)
    this.state = {
      photos: [],
      message: 'hello'
    }
  }


  checkLastPhoto(){
      getFromAsync('lastPhotoFromCameraRoll').then((value) => {
        // this.getPhotos(value)
        // this.removeItem()
        this.getPhotos(value)

      })
      .catch((error) => {
        this.getPhotos(null)
      }) 
  }

  setGeoFences(photos){
    
    var geoFences = []
    
    for (var i = 0; i < photos.length; i++){
      const p = photos[i]
      if (p.node.location.latitude && p.node.location.longitude){
        var geoFence = {
          identifier: p.node.image.filename,
          radius: 50,
          latitude: p.node.location.latitude,
          longitude: p.node.location.longitude,
          notifyOnEntry: true,
          notifyOnExit: false,
          extras: {                // Optional arbitrary meta-data
            zone_id: 1234,
            uri: p.node.image.uri,
            notify: true,
          }
        }
        geoFences.push(geoFence)
      }
    }

    addGeoFences(geoFences).then((data) => {
      this.setState({message: data.geofences + ' added from ' + photos.length + ' photos' })
    }).catch((error) => {
      this.setState({message: error})
    })
  }

  getPhotos(last){
    var params = {
      first: 10000,
      
      assetType: 'Photos'
    }
    if (last){
      params.after = last
    }
    CameraRoll.getPhotos(params).then((p) => {
      if (p.edges && p.edges.length > 0){
        console.log('NUMBER OF PHOTOS: ' + p.edges.length)
        this.setGeoFences(p.edges)
      } else {
        console.log('NUMBER OF PHOTOS = 0')
      }
      if (p.page_info && p.page_info.end_cursor){
          saveToAsync('lastPhotoFromCameraRoll', p.page_info.end_cursor)
      }
    })
  }


  componentWillMount(){
    this.checkLastPhoto()
      // CameraRoll.getPhotos({
      //    first: 10000,
      //    assetType: 'Photos',
      //  }).then((p) => {
      //   this.setState({photos: p.edges}, () => {
      //     console.log(p.edges)
      //   })
      //   // console.log(p.edges)
      // })
  }

  keyExtractor = (item, index) => index;

  renderItem(item){
   
    return(
      <Image
            key={item}
           style={{
            width: Dimensions.get('window').width,
             height: 300,
           }}
           source={{ uri: item.item}}>
        

      </Image>
    )
  }

  render() {
    return (
      <View stye={styles.container}>
        <FlatList
         keyExtractor={this.keyExtractor}
          data={this.props.photos}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
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
