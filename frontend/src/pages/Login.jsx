import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


/*
***** TO-DO *****
 - Update login to use "AuthContext"
*/
function Login() {
const { login } = useAuth();

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if(!username || !password){
      alert("Please enter username and password");
      return;
    }
    if(username == "user" && password == "ADMIN"){
      const userData = {username: "user", role : "ADMIN"};
      login(userData);
      navigate("/dashboard");
    }else{
      alert("Invalid username or password");
    }

  }

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2 style={styles.title}>Sales Analytics Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        <div style={styles.links}>
          <Link to="/forgot-password" style={styles.link}>
            Forgot Password?
          </Link>
          <Link to="/create-account" style={styles.link}>
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#1a2a6c",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "350px",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
  },
  title: {
    marginBottom: "30px",
    textAlign: "center",
    color: "#1a2a6c",
  },
  input: {
    marginBottom: "20px",
    padding: "12px 15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#1a2a6c",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },
  links: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  link: {
    color: "#1a2a6c",
    textDecoration: "none",
  },
};

export default Login;