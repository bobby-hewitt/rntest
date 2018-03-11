export const initFirebase = (payload) => {
	return dispatch => {
    dispatch({
      type: 'INIT_FIREBASE',
      payload: payload
    })
  }
}
