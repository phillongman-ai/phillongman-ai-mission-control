
const { open, seal, cookie, readCookie } = require("./_crypto");
exports.handler = async (event) => {
  try {
    const saved = readCookie(event, "mc_google_state");
    if (!saved || saved !== event.queryStringParameters.state) throw new Error("Invalid OAuth state");
    open(saved);
    const body = new URLSearchParams({
      code: event.queryStringParameters.code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.SITE_URL}/.netlify/functions/google-callback`,
      grant_type: "authorization_code"
    });
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: {"Content-Type":"application/x-www-form-urlencoded"}, body
    });
    const tokens = await response.json();
    if (!response.ok) throw new Error(tokens.error_description || "Token exchange failed");
    return {
      statusCode: 302,
      headers: {
        Location: "/?connected=Google%20Calendar",
        "Set-Cookie": cookie("mc_google_tokens", seal(tokens))
      }
    };
  } catch (error) {
    return { statusCode: 400, body: error.message };
  }
};
