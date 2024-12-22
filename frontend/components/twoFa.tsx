'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import {getCookies} from "./auth";

// const {fetchAuthUser} = useContext(UserContext);
const API = process.env.NEXT_PUBLIC_API_URL;
export const enableTwoFactorAuth = async (fetchAuthUser) => {
  try {
    const response = await axios.get(
      `${API}/enable-2fa/`,
      {
        withCredentials: true, // Ensure cookies are included in the request
      }
    );
    if (response.status === 200) {
      fetchAuthUser();
    }
  } catch (error) {
    return null;
  }
};

export  const disableTwoFactorAuth = async () => {
    try {
      const response = await axios.get(
        `${API}/disable-2fa/`,
        {
          withCredentials: true, // Ensure cookies are included in the request
        }
      );
      return response.data; // Return response data if needed
    } catch (error) {
      return null;
    }
  };

  export const verify2FA = async (code) => {
    const body = {
      code: code,
    };
    try {
      const cookies = await getCookies();
      const csrfToken = cookies.cookies.csrftoken;
  
      const response = await axios.post(
        `${API}/verify-2fa/`,
        body,
        {
          headers: {
            "X-CSRFToken": csrfToken, // Include the CSRF token in the headers
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      return response.status;
    } catch (error) {
    }
  };
  