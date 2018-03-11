
import  {
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk'
import FCM from "react-native-fcm";
import firebase from 'firebase'


export const login = (token) => {
	return new Promise((resolve, reject) => {
		fetch('https://graph.facebook.com/v2.5/me?fields=first_name,last_name,picture.type(large),friends&access_token=' + token)
		  .then((response) => response.json())
		  .then((json) => { 	
			FCM.getFCMToken().then(token2 => {
				const user = {
			  		fName: json.first_name,
			  		sName: json.last_name,
			  		fbId: json.id,
			  		fbAccessToken: token,
			  		friends: json.friends.data,
			  		picture: json.picture.data.url,
			  		fcm:token2
			 	}
			 	resolve(user) 
			});
	   	  
	  })	
	  .catch(() => {
	    reject('ERROR GETTING DATA FROM FACEBOOK')
	  })
	 })
}

