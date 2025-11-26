import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
  },
  content: {
    flex: 1,
    padding: "20px",
  },
};

export default Layout;
