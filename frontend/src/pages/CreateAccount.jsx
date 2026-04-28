import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="" disabled>Select a role</option>
            <option value="SALES_REP">Sales Representative</option>
            <option value="SALES_MANAGER">Sales Manager</option>
            <option value="ANALYST">Business Analyst</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>

        <Link to="/" style={styles.link}>
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#1a2a6c",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxSizing: "border-box",
  },
  title: {
    margin: 0,
    textAlign: "center",
    color: "#1a2a6c",
  },
  errorBox: {
    padding: "10px 14px",
    background: "#fdecea",
    border: "1px solid #f5c6c2",
    borderRadius: "5px",
    color: "#c62828",
    fontSize: "13px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  select: {
    padding: "12px 15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "15px",
    background: "#fff",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#1a2a6c",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },
  link: {
    color: "#1a2a6c",
    fontSize: "14px",
    textDecoration: "none",
    textAlign: "center",
  },
};

export default CreateAccount;