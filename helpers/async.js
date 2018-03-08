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

  export const createKey(){
    var date = new Date()
    var year = date.getYear()
    var month = date.getMonth()
    var day = date.getDate()
    return day.toString() + month.toString() + year.toString()
  }

  export const addPhotoToDate = (uri, callback) => {
    var date = new Date()
    var year = date.getYear()
    var month = date.getMonth()
    var day = date.getDate()
    var key = day.toString() + month.toString() + year.toString()
    getFromAsync(key).then((arr) => {
      var newArr = JSON.parse(arr)
      newArr.push(uri)
      saveToAsync(key, JSON.stringify(newArr))
      
      callback(newArr)
    })
    .catch(() => {
      saveToAsync(key, JSON.stringify([uri]))
      callback([uri])
    })
  }
