
const { seal, cookie } = require("./_crypto");
exports.handler = async () => {
  const state = seal({ ts: Date.now(), provider: "strava" });
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: `${process.env.SITE_URL}/.netlify/functions/strava-callback`,
    response_type: "code",
    approval_prompt: "auto",
    scope: "read,activity:read",
    state
  });
  return {
    statusCode:302,
    headers:{
      Location:`https://www.strava.com/oauth/authorize?${params}`,
      "Set-Cookie":cookie("mc_strava_state", state, 600)
    }
  };
};
