import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Product from "./pages/Product";
import Post from "./pages/Post";
import User from "./pages/User";

function App() {
  return (
    <>
      <div className="card">
        <nav style={{display: "flex", gap: "30px"}}>
      <Link to="/post">Post</Link>
      <Link to="/product">Product</Link> 
      <Link to="/user">User</Link>
        </nav>
        <Routes>
          <Route path="/post" element={<Post />} />
          <Route path="/product" element={<Product />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
