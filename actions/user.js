export const updateUser = (user) => {
	return dispatch => {
    dispatch({
      type: 'LOGIN',
      payload: user
    })
  }
}

export const logout = () => {
	return dispatch => {
    dispatch({
      type: 'LOGOUT'
    })
  }
}