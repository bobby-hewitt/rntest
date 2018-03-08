  import {

  AsyncStorage
} from 'react-native';

  export const getFromAsync = (key) =>{
    console.log('@MySuperStore:' +key)
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@MySuperStore:' + key).then((value) => {
        if (value !== null){
          resolve(value)
        } else {
          reject('no value found')
        }
      })
      .catch((error) => {
        reject('no value found')
      }) 
    })
  }

  export const saveToAsync = (key, value) =>{
    AsyncStorage.setItem('@MySuperStore:' + key, value).catch((error) => {
      console.log(error)
    })
  }

  export const removeItem = () =>{
    AsyncStorage.removeItem('@MySuperStore:lastPhotoFromCameraRoll').catch((error) => {
      console.log(error)
    })
  }
