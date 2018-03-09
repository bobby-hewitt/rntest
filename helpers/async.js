  import {
  AsyncStorage
} from 'react-native';

  export const getFromAsync = (key) =>{
    console.log('@MySuperStore:' +key)
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@MySuperStore:' + key).then((value) => {
        if (value !== null){
          resolve(JSON.parse(value))
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
    AsyncStorage.setItem('@MySuperStore:' + key, JSON.stringify(value)).catch((error) => {
      console.log(error)
    })
  }

  export const removeItem = () =>{
    AsyncStorage.removeItem('@MySuperStore:lastPhotoFromCameraRoll').catch((error) => {
      console.log(error)
    })
  }

  export const createKey = () => {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()
    var day = date.getDate()
    return day.toString() + month.toString() + year.toString()
  }

  export const addPhotoToDate = (data, callback) => {
    const key = createKey()

    getFromAsync(key).then((arr) => {
      var newArr = JSON.parse(arr)
      newArr.push(data)
      saveToAsync(key, JSON.stringify(newArr))
      
      callback(newArr)
    })
    .catch(() => {
      saveToAsync(key, JSON.stringify([data]))
      callback([data])
    })
  }
