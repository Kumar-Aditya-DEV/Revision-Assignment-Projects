import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <NavLink to="/api1" style={styles.link}>
        API 1
      </NavLink>
      <NavLink to="/api2" style={styles.link}>
        API 2
      </NavLink>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    padding: "20px",
    backgroundColor: "#111",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },
};

export default Navbar;
