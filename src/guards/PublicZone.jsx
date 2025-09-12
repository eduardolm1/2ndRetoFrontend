import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicZone = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? <Navigate to="/" replace /> : children;
};

export default PublicZone;