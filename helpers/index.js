import Permissions from 'react-native-permissions'
import {
  Platform,
  StyleSheet,
  AppState,
  ASyncStorage,
  Text,
  Alert,
  View
} from 'react-native';


export const checkPermissions = () => {
	checkPermission('notification')
	checkPermission('photo')
	checkPermission('location', {type: 'always'})
}




function checkPermission(item, param){
		Permissions.check(item).then(response => {
			if (response === 'denied'){
				sendToSettings()
			}
	      	// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
		    else if (response !== 'authorized'){
		      	Permissions.request(item).then(response2 => {
			      // Returns once the user has chosen to 'allow' or to 'not allow' access
			      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
			      if (response2 !== 'authorized'){
			      	sendToSettings()
			      } else {
			      	alert(item + ' authorized')
			      }
			    })
		    } else {
		      	alert(item + ' authorized')
		    }
	    })

	
}


function sendToSettings(){
	Alert.alert(
      'We need access to ',
      'We need access so you can set your profile pic',
      [
        {
          text: 'Not today',
          onPress: () => console.log('Permission denied'),
          style: 'cancel',
        },
        { 	
        	text: 'Open Settings', 
        	onPress: Permissions.openSettings 
        },
      ],
    )
  
}

