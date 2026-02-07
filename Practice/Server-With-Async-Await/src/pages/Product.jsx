import React, { useEffect, useState } from "react";

function Product() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("https://fakestoreapi.com/products/1");
      const resData = await data.json();
      setProduct(resData);
    };

    fetchData();
  }, []); 

  return (
    <div>
      <h1>Product Page</h1>

      {product && (
        <div>
          <h3>{product.title}</h3>
          <img src={product.image} alt={product.title} width="150" />
          <p>Price: ${product.price}</p>
        </div>
      )}
    </div>
  );
}

export default Product;
