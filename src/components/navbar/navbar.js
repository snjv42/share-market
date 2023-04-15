import Container from 'react-bootstrap/Container';
import { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AuthContextProvider from '../../AppContext';

function Header() {
    const { isLoggedIn } = useContext(AuthContextProvider);
  return (
    <>
      <Navbar bg="primary" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="#home">PROFIT CAP</Navbar.Brand>
          <Nav className="me-auto">
            {
                isLoggedIn && (
                    <Nav.Link href="/">Log Out</Nav.Link>
                )
            }
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;