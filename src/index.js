import React, { useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import AuthContextProvider from "./AppContext";
import App from './App';
import reportWebVitals from "./reportWebVitals";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Root() {
  const appContext = useContext(AuthContextProvider);
  const [context, setContext] = useState(appContext);

  // TODO: can we specify this updater function elsewhere?
  const userLogin = (userId, sessioId, isLoggedIn) => {
    localStorage.setItem('sessionId', sessioId);
    localStorage.setItem('userId', userId);
    setContext({ ...context, isLoggedIn });
  };

  const userLogout = () => {
    localStorage.removeItem('sessionId');
    setContext({ ...context, isLoggedIn: false });
  };

  // Specify context value (copy defaults and override toggleTheme func)
  const state = {
    ...context,
    userLogin: userLogin,
    userLogout: userLogout
  };

  return (
    <React.StrictMode>
      <AuthContextProvider.Provider value={state}>
        <App />
      </AuthContextProvider.Provider>
    </React.StrictMode>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);

reportWebVitals();

