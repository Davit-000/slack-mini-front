const STATE = {
  user: {},
  token: null
}

const authReducer = (state = STATE, action) => {
  const {token, user} = action

  switch (action.type) {
    case 'LOGIN':
      return {...state, token}
    case 'LOGOUT':
      return {...state, token: null}
    case 'USER':
      return Object.assign({}, state, {user})
    default:
      return state
  }
}

export default authReducer
