// import React from 'react';
// import '../components/css/Header.css'; // Import the CSS file
// import { Link } from 'react-router-dom';
// import { PiUser } from "react-icons/pi";
// import { GrLogout } from "react-icons/gr";

// const Header = () => {
//   // Define the handleLogout function
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     // Redirect to login page or home page
//     window.location.href = '/login';

//   };

//   return (
//     <header className="mall-header">
//       <div className="logo">Shopping Mall</div>
//       <nav className="nav-links">
//         <a href="/">Home</a>
//         <a href="/shoplist">Shops</a>
//         <a href="/deals">Deals</a>
//         <a href="/event">Events</a>
//         <a href="/signup">Sign Up</a>
//         {/* Logout Button */}
//         <div className="logout-button" onClick={handleLogout} style={{ cursor: "pointer" }}>
//           <GrLogout style={{ fontSize: "24px" }} /> {/* Logout icon */}
//         </div>
//       </nav>

//       {/* User Wallet Link */}
//       <a href="/user/wallet" style={{ marginLeft: '20px' }}>
//         <PiUser style={{ fontSize: '30px' }} /> {/* Increased size */}
//       </a>
//     </header>
//   );
// };

// export default Header;


import React from 'react';
import '../components/css/Header.css';  // Import the CSS file
import LogoutButton from './Logout/Logout';
import { Link } from 'react-router-dom'; 
import { PiUser } from "react-icons/pi";
import UserWallet from './Userwallet/UserWallet';

const Header = () => {
  return (
    <header className="mall-header">
      <div className="logo">Shopping Mall</div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/shoplist">Shops</a>
        <a href="/deals">Deals</a>
        <a href="/event">Events</a>
        <a href="/signup">Sign Up</a>
        <div className='logout-button'>
          <LogoutButton/>
        </div>

      </nav>

      <a href="/user/wallet" style={{ marginLeft: '20px' }}>
          <PiUser style={{ fontSize: '30px' }} /> {/* Increased size */}
      </a>
      
    </header>
  );
};

export default Header;