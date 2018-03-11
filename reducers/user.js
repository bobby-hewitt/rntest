
const initialState = {
  loggedIn: false,
  fName: null,
  sName: null,
  fbId: null,
  fcm: null,
  fbAccessToken: null,
  friends: null,
  picture: null,
}

export default (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        ...action.payload,
        loggedIn: true
      }
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false
      }
    default:
      return state
  }
}

