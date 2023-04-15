
const AuthContext = {
  isLoggedIn: !!localStorage.getItem('sessionId'),
  sessionId: localStorage.getItem('sessionId'),
  userId: localStorage.getItem('userId'),
  userLogin: () => {},
  userLogout: () => {},
};

export default AuthContext;
