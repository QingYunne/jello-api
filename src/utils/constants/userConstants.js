// constants/user.constants.js
export const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

export const USER_FIELDS = {
  PUBLIC: ['username', 'displayName', 'avatar', 'email'],
  PRIVATE: ['email', 'username', 'displayName', 'avatar', 'role']
}
