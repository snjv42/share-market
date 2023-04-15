import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import sha256 from "crypto-js/sha256";
import classNames from "classnames";
import AuthContextProvider from "../../AppContext";
import { BASE_URL } from "../../constants/constants";
import './login.css';

function Login() {
  const { userLogin, userLogout } = useContext(AuthContextProvider);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [apikey, setApikey] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    userLogout();
  }, []);

  const onUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const onApiKeyChange = (e) => {
    setApikey(e.target.value);
  };

  const getEncryptionKey = async () => {
    const raw = JSON.stringify({
      userId: userId,
    });
    return fetch(BASE_URL + "customer/getAPIEncpkey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
      redirect: "follow",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
    });
  };

  const getSessionId = async (userData) => {
    const raw = JSON.stringify({
      userId: userId,
      userData: userData,
    });
    return fetch(BASE_URL + "customer/getUserSID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
      redirect: "follow",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
    });
  };

  const handleSubmit = async () => {
    if (userId && apikey) {
      setLoading(true);
      const apiEnc = await getEncryptionKey().then((response) =>
        response.json()
      );
      const hash = sha256(userId + apikey + apiEnc.encKey);
      const sessionId = await getSessionId(hash.toString()).then((response) =>
        response.json()
      );
      setLoading(false);
      if (sessionId.stat === "Ok") {
        userLogin(userId, sessionId.sessionID, true);
        navigate("/user-dashboard");
      }
      console.log(sessionId);
    }
  };
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="col-md-5 p-5 shadow-sm border rounded-5 border-primary bg-white">
        <div>
          <h2 className="text-center mb-4 text-primary">Trade Login</h2>
          <div className="mb-3">
            <label className="form-label">User Id</label>
            <input
              type="text"
              className="form-control border border-primary"
              id="userid"
              value={userId}
              onChange={(e) => onUserIdChange(e)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">API Key</label>
            <input
              type="text"
              className="form-control border border-primary"
              id="apikey"
              value={apikey}
              onChange={(e) => onApiKeyChange(e)}
              required
            />
          </div>
          <div className="d-grid">
            <button
              className={ classNames('btn btn-primary', { 'button-loader': isLoading } ) }
              type="submit"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Spinner animation="border" role="status"></Spinner>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
