/**
 * Register action
 *
 * @param {String} token
 * @returns {{token: String, type: string}}
 */
export const login = token => ({
  type: 'LOGIN',
  token
})

/**
 * Logout action
 *
 * @returns {{type: string}}
 */
export const logout = () => ({
  type: 'LOGOUT'
})

/**
 * Set auth user action
 *
 * @param {Object} user
 * @returns {{type: string, user}}
 */
export const setUser = user => ({
  type: 'USER',
  user
})
