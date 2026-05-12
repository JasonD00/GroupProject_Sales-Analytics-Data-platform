function LoadingSpinner() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner} />
      <p style={styles.text}>Loading...</p>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    gap: "14px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "4px solid #e0e4ef",
    borderTop: "4px solid #1a2a6c",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: {
    color: "#aaa",
    fontSize: "14px",
    margin: 0,
  },
};

export default LoadingSpinner;