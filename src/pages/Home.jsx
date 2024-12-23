import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../Utils";
import { ToastContainer } from "react-toastify";
import styles from './Home.module.css'
import logo from "../assets/images/logo.png";

function Home() {
  const [loggedInEmail, setLoggedInEmail] = useState("");

  // const navigate = useNavigate();
  useEffect(() => {
    setLoggedInEmail(localStorage.getItem("email"));
  }, []);


  return (
    <>
      <div className={styles.homeContainer}>
        <div className={styles.homeBannerImg}>
          <img src={logo} alt="" />
        </div>
        <p>Welcome to Digitalflake admin</p>
      </div>
      <ToastContainer />
    </>
  );
}

export default Home;
