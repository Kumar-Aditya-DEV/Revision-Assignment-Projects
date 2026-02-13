function ProductCard({ product }) {
  return (
    <div style={styles.card}>
      <img
        src={product.image || product.thumbnail}
        alt={product.title}
        style={styles.image}
      />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
    </div>
  );
}

const styles = {
  card: {
    width: "250px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  image: {
    height: "150px",
    objectFit: "contain",
  },
};

export default ProductCard;
