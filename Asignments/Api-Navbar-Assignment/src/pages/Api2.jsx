import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApi2 } from "../features/products/productSlice";
import ProductCard from "../components/ProductCard";

function Api2() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchApi2());
  }, [dispatch]);

  return (
    <div style={styles.container}>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    marginTop: "40px",
  },
};

export default Api2;
