import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/SideNav.css';
import HamburgerMenu from './HamburgerMenu';
// SVG imports...
import { ReactComponent as DashboardIcon } from '../../assets/dashboard.svg';
import { ReactComponent as SettingsIcon } from '../../assets/settings.svg';
import { ReactComponent as ChatsIcon } from '../../assets/chat.svg';
import { ReactComponent as ProfileIcon } from '../../assets/profile-user.svg';
import { ReactComponent as FriendsIcon } from '../../assets/friends.svg';

const SideNav = ({ currentPage }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const toggleCollapse = () => setIsCollapsed((c) => !c);

  return (
    <div className={`side-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="side-nav-header">
        <HamburgerMenu isOpen={!isCollapsed} onToggle={toggleCollapse} />
      </div>
      <div className="nav-items">
        <NavItem text="Dashboard"   path="/dashboard" isCollapsed={isCollapsed} Icon={DashboardIcon} />
        <NavItem text="Friends"     path="/friends"   isCollapsed={isCollapsed} Icon={FriendsIcon} />
        <NavItem text="Chats"       path="/chats"     isCollapsed={isCollapsed} Icon={ChatsIcon} />
        <NavItem text="Profile"     path="/profile"   isCollapsed={isCollapsed} Icon={ProfileIcon} />
        <NavItem text="Settings"    path="/settings"  isCollapsed={isCollapsed} Icon={SettingsIcon} />
      </div>
    </div>
  );
};

const NavItem = ({ text, path, isCollapsed, Icon }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`
    }
    style={{ cursor: 'pointer' }}
  >
    <div className={`icon-container ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <Icon className="nav-icon" />
    </div>
    <div className={`text-container ${isCollapsed ? 'collapsed' : ''}`}>
      <span className={`nav-text ${isCollapsed ? 'collapsed' : ''}`}>{text}</span>
    </div>
  </NavLink>
);

export default SideNav;
