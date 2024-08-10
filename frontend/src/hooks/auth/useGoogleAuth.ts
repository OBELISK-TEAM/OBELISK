import { useAuth } from "@/contexts/AuthContext";

const getGoogleLoginUrl = () => {
  const state = crypto.randomUUID();
  const googleAuthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  console.log(
    "process.env.GOOGLE_CALLBACK_URL",
    process.env.GOOGLE_CALLBACK_URL,
  );
  console.log("process.env.GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);

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

//this hook is a special wrapper for loginGoogleUser, inside it uses loginGoogleUser from useAuth
export const useGoogleAuth = () => {
  const { loginGoogleUser } = useAuth();
  const googleAuth = () => {
    return new Promise<void>((resolve, reject) => {
      const { url, state } = getGoogleLoginUrl();
      const newAuthWindow = window.open(
        url,
        "GoogleAuthPopup",
        "width=600,height=600",
      );

      if (newAuthWindow) {
        const checkPopupWindow = setInterval(async () => {
          if (newAuthWindow.closed) {
            clearInterval(checkPopupWindow);
            try {
              if (state) {
                await loginGoogleUser(state);
                resolve();
              }
            } catch (err) {
              reject(err);
            }
          }
        }, 100);
      } else {
        reject(new Error("Unable to open the popup window"));
      }
    });
  };

  return {
    googleAuth,
  };
};
