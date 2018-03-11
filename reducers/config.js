
const initialState = {
  firebase: null
}

export default (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'INIT_FIREBASE':
      return {
        ...state,
        firebase: action.payload
      }
    default:
      return state
  }
}

