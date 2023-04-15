import Login from "./components/login/login";
import UserDashboard from "./components/user-dashboard/user-dashboard";
import Header from "./components/navbar/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Login />} />
          <Route path="/user-dashboard" element={ <UserDashboard />} />
        </Routes>
      </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
