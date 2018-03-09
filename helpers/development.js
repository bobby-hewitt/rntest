import {
  AsyncStorage
} from 'react-native';


import BackgroundGeolocation from "react-native-background-geolocation";

export const clearApp = () => {
	 BackgroundGeolocation.removeGeofences()
}

export const getAsyncKeys = () => {
	AsyncStorage.getAllKeys().then((keys) => {
		console.log('KEYS KNOWN TO APP', keys)
	}).catch((err) => {
		console.log('KEYS KNOWN TO APP ERR', err)
	})
}