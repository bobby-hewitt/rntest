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
        console.log('starting geo')
         BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
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

export const addGeofence = (geoFence) => {
return new Promise((resolve, reject) => {
    BackgroundGeolocation.addGeofence(geoFence, function() {
      resolve({success: true})
    }, function(error) {
        reject(error)
    });
  })
}

export const removeGeofence = (geofence) => {
return new Promise((resolve, reject) => {
    BackgroundGeolocation.removeGeofence(geofence, function() {
      resolve({success: true})
    }, function(error) {
        reject(error)
    });
  })
}
