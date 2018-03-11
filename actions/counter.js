export const addToCount = () => {
  return dispatch => {
    dispatch({
      type: 'INCREMENT_COUNTER'
    })
  }
}

export const subtractFromCount = () => {
  return dispatch => {
    dispatch({
      type: 'DECREMENT_COUNTER'
    })
  }
}

