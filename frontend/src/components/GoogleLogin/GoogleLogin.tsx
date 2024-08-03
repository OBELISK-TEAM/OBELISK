'use client';
import { useCallback, useState,useEffect } from 'react';
import { redirect } from 'next/navigation'
import axios from 'axios';
import GoogleIcon from "@/components/non-lucid-icons/GoogleIcon";
import {Button} from "@/components/ui/button";

const GoogleLogin = () => {
  const [tempUserId, setTempUserId] = useState<string>('');


  const loginGoogleUser = useCallback(async (userTempId: string) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/google/login', {}, {
        headers: {
          Authorization: `Bearer ${userTempId}`
        }
      });
      alert("You are logged in.");
      localStorage.setItem('token', response.data.token);
      redirect('/user-boards');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    }
  },[]);

  const googleAuth = async () => {
    const url = getGoogleLoginUrl();
    const authWindow = window.open(url, '', 'popup=true');
    if (authWindow) {
      const checkPopupWindow = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkPopupWindow);
          if (tempUserId) loginGoogleUser(tempUserId);
          setTempUserId('');
        }
      }, 100);
    }
  };

  const getGoogleLoginUrl = () => {
    const state = crypto.randomUUID();
    setTempUserId(state);
    const googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const loginRequestParameters: { [key: string]: string } = {
      response_type: 'code',
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      scope: process.env.NEXT_PUBLIC_GOOGLE_SCOPE!,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      state
    };
    const paramsString = Object.keys(loginRequestParameters)
      .map((key) => `${key}=${encodeURIComponent(loginRequestParameters[key])}`)
      .join('&');
    return `${googleAuthEndpoint}?${paramsString}`;
  };

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.tempUserId) {
        loginGoogleUser(event.data.tempUserId);
      }
    });
  }, [loginGoogleUser]);

  return (
      <Button variant="outline" onClick={googleAuth} ><GoogleIcon width={16} height={16} /> &ensp;Google</Button>
  );
};

export default GoogleLogin;
