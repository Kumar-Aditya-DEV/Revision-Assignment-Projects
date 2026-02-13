import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Api1 from "./pages/Api1";
import Api2 from "./pages/Api2";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/api1" />} />
        <Route path="/api1" element={<Api1 />} />
        <Route path="/api2" element={<Api2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
