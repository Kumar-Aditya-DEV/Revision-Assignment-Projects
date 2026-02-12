import React, { useEffect, useState } from "react";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch API only once
  useEffect(() => {
    console.log("Fetching products...");

    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Data received:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return <h2>Loading products...</h2>;
  }

  // Filtering
  let filteredProducts = products;

  if (selectedCategory !== "All") {
    filteredProducts = products.filter(
      (product) => product.category === selectedCategory
    );
  }

   let finalProducts = [...filteredProducts];

  if (sortOption === "low") {
    finalProducts.sort((a, b) => a.price - b.price);
  }

  if (sortOption === "high") {
    finalProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product Listing</h1>

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All</option>
        <option value="men's clothing">Men's Clothing</option>
        <option value="women's clothing">Women's Clothing</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
      </select>

      {/* Price Sort */}
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={{ marginLeft: "10px" }}
      >
        <option value="">Sort by Price</option>
        <option value="low">Low to High</option>
        <option value="high">High to Low</option>
      </select>

      {/* Product List */}
      <div style={{ marginTop: "20px" }}>
        {finalProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{product.title}</h3>
            <p>₹ {product.price}</p>
            <p>₹ {product.image}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
