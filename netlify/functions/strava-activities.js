
const { open, seal, cookie, readCookie } = require("./_crypto");

async function refresh(tokens) {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      client_id:process.env.STRAVA_CLIENT_ID,
      client_secret:process.env.STRAVA_CLIENT_SECRET,
      refresh_token:tokens.refresh_token,
      grant_type:"refresh_token"
    })
  });
  const next = await response.json();
  if (!response.ok) throw new Error("Strava token refresh failed");
  return {...tokens, ...next};
}

exports.handler = async (event) => {
  const raw = readCookie(event, "mc_strava_tokens");
  if (!raw) return {statusCode:401, body:"Not connected"};
  try {
    let tokens = open(raw);
    let headers = {};
    if ((tokens.expires_at || 0) * 1000 < Date.now() + 60000) {
      tokens = await refresh(tokens);
      headers["Set-Cookie"] = cookie("mc_strava_tokens", seal(tokens));
    }
    const after = Math.floor((Date.now() - 30*24*60*60*1000)/1000);
    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=50`, {
      headers:{Authorization:`Bearer ${tokens.access_token}`}
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Strava request failed");
    const activities = data.map(a => ({
      id:a.id, name:a.name, sport_type:a.sport_type, type:a.type,
      start_date_local:a.start_date_local, moving_time:a.moving_time,
      elapsed_time:a.elapsed_time, distance:a.distance,
      average_heartrate:a.average_heartrate || null
    }));
    return {statusCode:200, headers:{...headers,"Content-Type":"application/json"}, body:JSON.stringify({activities})};
  } catch(error) {
    return {statusCode:500, body:error.message};
  }
};
