"use client";
import React, { useEffect, useState } from "react";
import SigninPage from "../../components/signinPage";
import SignupPage from "../../components/signupPage";
import { UserContext } from "../../components/context/usercontext";
import { useContext } from "react";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleNavigateToSignup = () => {
    if (isLogin) {
      setIsLogin(false);
    }
  };

  const handleNavigateToSignin = () => {
    if (!isLogin) {
      setIsLogin(true);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isLogin ? (
        <SigninPage onNavigate={handleNavigateToSignup} /> // Pass the success handler
      ) : (
        <SignupPage onNavigate={handleNavigateToSignin} />
      )}
    </div>
  );
};

export default Login;
