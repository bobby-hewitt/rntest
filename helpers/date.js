const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const suffixes = ['', 'st', 'nd','rd','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','st','nd','rd','th','th','th','th','th','th','th','th']

export const fromTimestamp = (timestamp) => {
	var date = new Date(parseInt(timestamp * 1000))

	var year = date.getFullYear()
	var month = date.getMonth()
	var datem = date.getDate()
	var day = date.getDay()
	return days[day] + ' ' + datem + suffixes[datem] + ' ' + months[month] + ' ' + year

}