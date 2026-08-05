
const { seal, cookie } = require("./_crypto");
exports.handler = async () => {
  const state = seal({ ts: Date.now(), provider: "google" });
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.SITE_URL}/.netlify/functions/google-callback`,
    response_type: "code",
    scope: "openid email https://www.googleapis.com/auth/calendar.readonly",
    access_type: "offline",
    prompt: "consent",
    state
  });
  return {
    statusCode: 302,
    headers: {
      Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      "Set-Cookie": cookie("mc_google_state", state, 600)
    }
  };
};
