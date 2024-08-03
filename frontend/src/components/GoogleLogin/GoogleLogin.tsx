"use client";

import { redirect } from "next/navigation";
import axios from "axios";
import React from "react";
import {Button} from "@/components/ui/button";

const GoogleLogin = () => {
  const loginGoogleUser = async (userTempId: string) => {
    try {
      console.log("123123123");
      const response = await axios.post(
          process.env.NEXT_LOGIN_GOOGLE_USER_ENDPOINT!,
          {},
          {
            headers: {
              Authorization: `Bearer ${userTempId}`,
            },
          },
      );
      alert("You are logged in.");
      localStorage.setItem("token", response.data.token);
      redirect("/user-boards");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const googleAuth = () => {
    console.log("23123123");
    const { url, state } = getGoogleLoginUrl();
    console.log(url);

    const newAuthWindow = window.open(url, "", "popup=true");

    if (newAuthWindow) {
      const checkPopupWindow = setInterval(async () => {
        try {
          if (newAuthWindow.closed) {
            clearInterval(checkPopupWindow);
            if (state) {
              await loginGoogleUser(state);
            }
          } else {
            newAuthWindow.postMessage("ping", "*");
          }
        } catch (e) {
          console.log(e);
        }
      }, 100);
    }
  };

  const getGoogleLoginUrl = () => {
    const state = crypto.randomUUID();
    const googleAuthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    const scope = process.env.NEXT_PUBLIC_GOOGLE_SCOPE?.split(",").map(scope => `https://www.googleapis.com/auth/userinfo.${scope}`).join(" ");

    const loginRequestParameters: { [key: string]: string } = {
      response_type: "code",
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      scope: scope!,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      state,
    };

    const paramsString = Object.keys(loginRequestParameters)
        .map((key) => `${key}=${encodeURIComponent(loginRequestParameters[key])}`)
        .join("&");
    return { url: `${googleAuthEndpoint}?${paramsString}`, state };
  };

  return (
        <Button variant="outline"
            onClick={googleAuth} className="flex-1"
        >
          <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="mr-3 w-5 h-5"
          />
          Google
        </Button>
  );
};

export default GoogleLogin;
