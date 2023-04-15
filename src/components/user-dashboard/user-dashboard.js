import { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import AuthContextProvider from "../../AppContext";
import { BASE_URL } from "../../constants/constants";
import "./user-dashboard.css";
import OrderForm from "./order-form";

const UserDashboard = () => {
  const { isLoggedIn, sessionId, userId } = useContext(AuthContextProvider);
  const [userInfo, setUserInfo] = useState();
  const navigate = useNavigate();


  const getUserInfo = async () => {
    return fetch(BASE_URL + "customer/accountDetails", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userId} ${sessionId}`,
        "Content-Type": "application/json",
      },
      redirect: "follow",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
    });
  };

  useEffect(() => {
    async function fetchUserDetails() {
      await getUserInfo()
        .then((response) => response.json())
        .then((json) => setUserInfo(json));
    }

    if (!isLoggedIn) {
      navigate("/");
    } else {
      fetchUserDetails();
    }
  });

  return (
    <div className="container body-content">
      <div className="user-profile">
        <Card>
          <Card.Header className="text-center" bg="primary">
            User Profile
          </Card.Header>
          {userInfo && (
            <Card.Body>
              <Card.Title className="text-center">
                Hi {userInfo?.accountName}
              </Card.Title>
              <Card.Text className="text-center">
                Invest / Trade on Stock Exchanges
              </Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item></ListGroup.Item>
                <ListGroup.Item>
                  <div className="row">
                    <span>Account Id</span>
                    <span>{userInfo?.accountId}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="row">
                    <span>Account Status</span>
                    <span>{userInfo?.accountStatus}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="row">
                    <span>Phone no.</span>
                    <span>{userInfo?.cellAddr}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="row">
                    <span>Email</span>
                    <span>{userInfo?.emailAddr}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="row">
                    <span>Deposite Type</span>
                    <span>{userInfo?.dpType}</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          )}
        </Card>
      </div>
      <div className="portfolio-trigger">
       <OrderForm></OrderForm>
      </div>
    </div>
  );
};

export default UserDashboard;
