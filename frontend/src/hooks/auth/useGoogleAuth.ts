import { useAuth } from "@/contexts/AuthContext";

const getGoogleLoginUrl = () => {
  const state = crypto.randomUUID();
  const googleAuthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  const loginRequestParameters: { [key: string]: string } = {
    response_type: "code",
    redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
    scope: "email profile",
    client_id: process.env.GOOGLE_CLIENT_ID!,
    state,
  };

  const paramsString = Object.keys(loginRequestParameters)
    .map((key) => `${key}=${encodeURIComponent(loginRequestParameters[key])}`)
    .join("&");

  return { url: `${googleAuthEndpoint}?${paramsString}`, state };
};

export const useGoogleAuth = () => {
  const { loginGoogleUser } = useAuth();
  const googleAuth = () => {
    const { url, state } = getGoogleLoginUrl();
    const newAuthWindow = window.open(
      url,
      "GoogleAuthPopup",
      "width=600,height=600",
    );

    if (newAuthWindow) {
      const checkPopupWindow = setInterval(() => {
        if (newAuthWindow.closed) {
          clearInterval(checkPopupWindow);
          console.log("Popup closed");
          if (state) {
            loginGoogleUser(state);
          }
        }
      }, 100);
    }
  };

  return {
    googleAuth,
  };
};
