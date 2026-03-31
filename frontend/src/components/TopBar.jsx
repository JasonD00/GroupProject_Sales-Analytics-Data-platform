import { useAuth } from "../context/AuthContext";

function TopBar({ pageTitle }) {
  const { user } = useAuth();

  return (
    <header style={styles.topBar}>
      <h1 style={styles.pageTitle}>{pageTitle}</h1>
      <div style={styles.right}>
        <div style={styles.userInfo}>
          <span style={styles.username}>{user?.username}</span>
          <span style={styles.roleBadge}>{user?.role}</span>
        </div>
      </div>
    </header>
  );
}

const styles = {
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 28px",
    background: "#fff",
    borderBottom: "1px solid #e0e4ef",
    flexShrink: 0,
  },
  pageTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#1a2a6c",
    fontWeight: "700",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  username: {
    fontSize: "14px",
    color: "#555",
    fontWeight: "500",
  },
  roleBadge: {
    padding: "5px 12px",
    background: "#eef0fb",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#1a2a6c",
    fontWeight: "700",
    letterSpacing: "0.3px",
  },
};

export default TopBar;