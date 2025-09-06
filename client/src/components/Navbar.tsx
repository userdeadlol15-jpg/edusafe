import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHome, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUsers,
  FaCog,
  FaVideo,
  FaCalendarAlt,
  FaPhone
} from 'react-icons/fa';

const NavbarContainer = styled.nav`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 100%;
    left: 0;
    right: 0;
    background: ${props => props.theme.colors.surface};
    border-top: 1px solid ${props => props.theme.colors.border};
    flex-direction: column;
    padding: 2rem;
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    transition: transform 0.3s ease;
    z-index: 999;
  }
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.surfaceLight};
  }

  ${props => props.active && `
    background: ${props.theme.colors.surfaceLight};
    box-shadow: ${props.theme.shadows.neon};
  `}
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.error}dd;
    transform: translateY(-2px);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/dashboard';
      case 'teacher':
        return '/teacher';
      case 'parent':
        return '/parent';
      case 'admin':
        return '/admin';
      default:
        return '/dashboard';
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'student':
        return <FaGraduationCap />;
      case 'teacher':
        return <FaChalkboardTeacher />;
      case 'parent':
        return <FaUsers />;
      case 'admin':
        return <FaCog />;
      default:
        return <FaUser />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to={getDashboardPath()}>
          <FaHome />
          DisasterPrep
        </Logo>

        <NavLinks isOpen={isMobileMenuOpen}>
          <NavLink 
            to={getDashboardPath()} 
            active={location.pathname === getDashboardPath()}
          >
            <FaHome />
            Dashboard
          </NavLink>

          <NavLink 
            to="/videos" 
            active={location.pathname === '/videos'}
          >
            <FaVideo />
            Learning
          </NavLink>

          <NavLink 
            to="/drills" 
            active={location.pathname === '/drills'}
          >
            <FaCalendarAlt />
            Drills
          </NavLink>

          <NavLink 
            to="/emergency" 
            active={location.pathname === '/emergency'}
          >
            <FaPhone />
            Emergency
          </NavLink>

          <NavLink 
            to="/profile" 
            active={location.pathname === '/profile'}
          >
            <FaUser />
            Profile
          </NavLink>
        </NavLinks>

        <UserMenu>
          <UserInfo>
            {getRoleIcon()}
            <span>{user?.name}</span>
            <span>({user?.role})</span>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </LogoutButton>
        </UserMenu>

        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
