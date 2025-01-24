import "../styles/slidebar.css";
import { useNavigate } from "react-router-dom";

const Slidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="slidebar">
      <h2 className="slidebar-title">FILE MANAGER</h2>
      <ul className="slidebar-menu">
        <li className="active">Dashboard</li>
        <li onClick={() => navigate("/cloud-lift")}>CloudLift</li>
        <li onClick={() => navigate("/ai-seeker")}>AiSeeker</li>
        <li onClick={() => navigate("/ask-me")}>Ask Me</li>
        <li onClick={() => navigate("/quick-stats")}>QuickStats</li>
        <li onClick={() => navigate("/profile")}>Profile</li>
      </ul>
    </div>
  );
};

export default Slidebar;
