import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import Admin from "./components/Admin";
import AdminLogin from "./components/AdminLogin";
import Home from "./components/Home";
import Chopnavbar from "./components/Chopnavbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/chop" element={<Chopnavbar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
