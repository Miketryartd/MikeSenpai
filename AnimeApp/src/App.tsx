import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/Main");
  }, [navigate]);

  return <p>Redirecting...</p>;
}

export default App;