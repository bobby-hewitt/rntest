import BackgroundGeolocation from "react-native-background-geolocation";

export const configureLocationUpdates = () => {
	BackgroundGeolocation.configure({
      // Geolocation Config
      forceReloadOnGeofence: true,
      forceReloadOnHeartbeat: true,
      desiredAccuracy: 0,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
      
          BackgroundGeolocation.startGeofences(state1 => {
              console.log('- Start geofences: ', state1);
          });
      }
    });
  
}

export const onLocation = (l) => {
	console.log(l)
}


export const addGeoFences = (geoFences) => {
  return new Promise((resolve, reject) => {
    BackgroundGeolocation.addGeofences(geoFences, function() {
      resolve({success: true, geofences: geoFences.length})
    }, function(error) {
        reject(error)
    });
  })
  
  
}
