import {
  CameraRoll,
  AsyncStorage
} from 'react-native';

import { addGeoFences } from './location'
import { getFromAsync, saveToAsync, removeItem } from './async'
var isTest;

  export const initiatePhotos = (test, callback) => {
    console.log('is in initiate photos')
    isTest = test
    checkLastPhoto(callback)
  }

  function checkLastPhoto(callback){
      getFromAsync('lastPhotoFromCameraRoll').then((value) => {
        //change value to null to get all photos every time
        getPhotos(isTest ? null : value, callback)
      })
      .catch((error) => {
        getPhotos(null, callback)
      }) 
  }

   function getPhotos(last, callback){
    var params = {
      first: 10000,  
      assetType: 'Photos'
    }
    if (last){
      params.after = last
    }
    CameraRoll.getPhotos(params).then((p) => {
      if (p.edges && p.edges.length > 0){
        if (isTest){
          returnAllPhotos(p.edges, callback)
        }
        setGeoFences(p.edges)
      } else {
      }
      if (p.page_info && p.page_info.end_cursor){
          saveToAsync('lastPhotoFromCameraRoll', p.page_info.end_cursor)
      }
    })
  }

  function returnAllPhotos(photos, callback){
    var allPhotos = []

    for (var i =0; i < photos.length; i++){
      if (i === 0){
        scrollPhotos = []
        const photo = {
          uri: photos[i].node.image.uri,
          timestamp: photos[i].node.timestamp
        }
        scrollPhotos.push(photo)
        scrollPhotos.push(photo)
        scrollPhotos.push(photo)
        scrollPhotos.push(photo)
        scrollPhotos.push(photo)
        scrollPhotos.push(photo)


        allPhotos.push({
          scrollPhotos,
          isArray: true,
        })
      } else {
        const photo = {
          uri: photos[i].node.image.uri,
          timestamp: photos[i].node.timestamp
        }
        allPhotos.push(photo)
      }
      
    }
    callback(allPhotos)
  }



  function setGeoFences(photos){
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
            timestamp: p.node.timestamp
          }
        }
        geoFences.push(geoFence)
      }
    }

    addGeoFences(geoFences).then((data) => {
      console.log(data.geofences + ' added from ' + photos.length + ' photos')
    }).catch((error) => {
      console.log(error)
    })
  }


 