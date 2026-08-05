
const { open, seal, cookie, readCookie } = require("./_crypto");
exports.handler = async (event) => {
  try {
    const saved = readCookie(event, "mc_strava_state");
    if (!saved || saved !== event.queryStringParameters.state) throw new Error("Invalid OAuth state");
    open(saved);
    const response = await fetch("https://www.strava.com/oauth/token", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        client_id:process.env.STRAVA_CLIENT_ID,
        client_secret:process.env.STRAVA_CLIENT_SECRET,
        code:event.queryStringParameters.code,
        grant_type:"authorization_code"
      })
    });
    const tokens = await response.json();
    if (!response.ok) throw new Error(tokens.message || "Token exchange failed");
    return {
      statusCode:302,
      headers:{
        Location:"/?connected=Strava",
        "Set-Cookie":cookie("mc_strava_tokens", seal(tokens))
      }
    };
  } catch(error) {
    return {statusCode:400, body:error.message};
  }
};
