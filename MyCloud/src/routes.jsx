import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CloudLift from "./pages/CloudLift";
import AiSeeker from "./pages/AiSeeker";
import AskMe from "./pages/AskMe";
import QuickStats from "./pages/QuickStats";
import Profile from "./pages/Profile";
const AppRoutes = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cloud-lift" element={<CloudLift />} />
          <Route path="/ai-seeker" element={<AiSeeker />} />
          <Route path="/ask-me" element={<AskMe />} />
          <Route path="/quick-stats" element={<QuickStats />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    );
  };
  
  export default AppRoutes;
  