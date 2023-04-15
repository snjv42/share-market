import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState, useContext } from "react";
import { useEffect } from "react";
import AuthContextProvider from "../../AppContext";
import Spinner from "react-bootstrap/Spinner";
import { BASE_URL } from "../../constants/constants";

const OrderForm = () => {
  //const [nseListing, setNseListing] = useState();
  const [company, setCompany] = useState();
  const { sessionId, userId } = useContext(AuthContextProvider);
  const [isNseLoading, setNseLoading] = useState(true);

  const [orderObj, setOrderObj] = useState({
    complexty: "regular",
    discqty: "0",
    exch: "NSE",
    pCode: "MIS",
    prctyp: "L",
    price: "",
    qty: 0,
    ret: "DAY",
    symbol_id: "",
    trading_symbol: "",
    transtype: "",
    trigPrice: "00.00",
    orderTag: "1",
  });

  const makeOrder = async (tType) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userId} ${sessionId}`);
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify([{
        ...orderObj,
        transtype: tType
    }
    ]);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
    };
    
    return fetch(BASE_URL + "/placeOrder/executePlaceOrder", requestOptions)
  };

  useEffect(() => {
    fetch("https://v2api.aliceblueonline.com/restpy/contract_master?exch=NSE")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        //setNseListing(data);
        const company = data.NSE.find(
          (val) => val.trading_symbol === "ASHOKLEY-EQ"
        );
        setCompany(company);
        setOrderObj({
          ...orderObj,
          price: company?.pdc,
          symbol_id: company?.token,
          trading_symbol: company?.trading_symbol,
        });
      })
      .catch((error) => {
        console.error("Error fetching data: " + error);
      })
      .finally(() => {
        setNseLoading(false);
      });
  });

  const handleChange = (evt) => {
    if (evt.target.id === "qty") {
      setOrderObj({
        ...orderObj,
        qty: evt.target.value,
      });
    }
    if (evt.target.id === "trigPrice") {
      setOrderObj({
        ...orderObj,
        trigPrice: evt.target.value,
      });
    }

    if (evt.target.id === "orderTag") {
      setOrderObj({
        ...orderObj,
        orderTag: evt.target.value,
      });
    }
  };

  const orderHandler = (tType) => {
    makeOrder(tType)
    .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <Card>
      <Card.Header className="text-center" bg="primary">
        NSE Buy/Sell Order
      </Card.Header>
      <Card.Body>
        {isNseLoading && (
          <div className="loader">
            <Spinner animation="border" />
          </div>
        )}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Exchange: <b>NSE</b>
            </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Product Type: <b>MIS (Margin Intraday Square Off)</b>
            </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Price Type: <b>Limit</b>
            </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Retention Type: <b>DAY</b>
            </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Company Name: <b>{company?.formatted_ins_name}</b>
            </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Share Price: <b>{company?.pdc}</b>
            </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3" controlId="qty">
            <Form.Label>Number of quantity</Form.Label>
            <Form.Control
              name="qty"
              value={orderObj.qty}
              type="number"
              placeholder="Enter Quantity"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="trigPrice">
            <Form.Label>Trigger Price</Form.Label>
            <Form.Control
              name="trigPrice"
              value={orderObj.trigPrice}
              type="number"
              placeholder="Enter Price"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="orderTag">
            <Form.Label>Order Tag</Form.Label>
            <Form.Control
              name="orderTag"
              value={orderObj.orderTag}
              type="text"
              placeholder="Order Tag"
              required
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col>
              <Button
                variant="success"
                type="button"
                style={{ width: "100%" }}
                onClick={() => orderHandler("BUY")}
              >
                BUY
              </Button>
            </Col>
            <Col>
              <Button
                variant="danger"
                type="button"
                style={{ width: "100%" }}
                onClick={() => orderHandler("SELL")}
              >
                SELL
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default OrderForm;
