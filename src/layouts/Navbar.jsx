import React from 'react'
import navLogo from '../assets/images/navLogo.png'
import adminLogo from "../assets/images/adminLogo.png"
import styles from "./Navbar.module.css"
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../Utils';

function Navbar() {
  const navigate = useNavigate();
  const handleLogOut = () => {
    Swal.fire({
      title: "Log Out",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        handleSuccess("User Loggedout");
      }
    });
  };

  return (
    <div>
      <div className={styles.navContainer}>
        <div className={styles.navLogoImg}>
          <img src={navLogo} alt="" />
        </div>
        <div className={styles.navAdminLogoImg} onClick={handleLogOut}>
          <img src={adminLogo} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Navbar