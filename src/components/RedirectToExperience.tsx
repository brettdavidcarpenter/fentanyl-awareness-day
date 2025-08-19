import { Navigate } from "react-router-dom";

const RedirectToExperience = () => {
  return <Navigate to="/day-of-experience" replace={true} />;
};

export default RedirectToExperience;