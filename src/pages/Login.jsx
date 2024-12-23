import { useState } from "react";
import {ToastContainer, useToast} from "react-toastify"
import { handleError, handleSuccess } from "../Utils";
import { Navigate, useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png'
import styles from './Login.module.css'
function Login() {

    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        const copyLoginInfo = {...loginInfo}
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo)
    }
    
    const handleLogin = async(e) => {
        e.preventDefault();
        const {email,password} = loginInfo
        if(!email || !password){
            return handleError("email and password are required")
        }
        try {
            const url = `${import.meta.env.VITE_BASE_URL}/auth/login`
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loginInfo),
            });

            const result = await response.json();
            const { success, message, error, jwtToken, email } = result;
            if(success){
                handleSuccess(message)
                localStorage.setItem("token", jwtToken);
                localStorage.setItem("email", email);
                setTimeout(()=>{
                    navigate("/home");
                },1000)
            }else if(error){
                const details = error?.details[0].message
                handleError(details)
            }else if(!success){
                handleError(message)
            }


        } catch (error) {
            handleError(error)
            
        }
    }

  return (
    <div className={styles.loginContainerBox}>
      <div className={styles.loginContainer}>
        <div className={styles.logoBox}>
          <img src={logo} alt="logo.png" className={styles.logoImg} />
          <p className={styles.logoHeading}>Welcome to Digitalflake admin</p>
        </div>
        <div>
          <form onSubmit={handleLogin}>
            <div className={styles.inputBox}>
              <label htmlFor="email">Email-id</label>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                autoFocus
                placeholder="Enter your email..."
                value={setLoginInfo.email}
              />
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="password">Password</label>
              <input
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Enter your password..."
                value={setLoginInfo.password}
              />
            </div>
            <button type="submit" className={styles.loginBtn}>Log in</button>
          </form>
        </div>

      </div>
      <ToastContainer />
    </div>
  );
}

export default Login