export const getPlace = (lat, lng) => {
	return new Promise((resolve, reject) => {
		//AIzaSyCfLcDDYb2J-LjUxQ9hUSaGESsRqivzBxI
		const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat+ ',' +lng +'&key=AIzaSyCfLcDDYb2J-LjUxQ9hUSaGESsRqivzBxI'
		fetch(url)
  		.then((response) => response.json())
  		.then((responseJson) => {
	      	console.log(url)
	      	resolve(responseJson.results[0].address_components[1].short_name + ', ' + responseJson.results[0].address_components[2].short_name)
	    }).catch((error) => {
	      	console.log('error with places', error)
	      	resolve('no place at all')
	    })
 	})
}