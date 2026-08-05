
const { open, seal, cookie, readCookie } = require("./_crypto");

async function refresh(tokens) {
  if (!tokens.refresh_token) return tokens;
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: tokens.refresh_token,
    grant_type: "refresh_token"
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body
  });
  const next = await response.json();
  if (!response.ok) throw new Error("Google token refresh failed");
  return {...tokens, ...next, refresh_token: tokens.refresh_token};
}

exports.handler = async (event) => {
  const raw = readCookie(event, "mc_google_tokens");
  if (!raw) return {statusCode:401, body:"Not connected"};
  try {
    let tokens = open(raw);
    let headers = {};
    let response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&maxResults=20&timeMin=${encodeURIComponent(new Date().toISOString())}`, {
      headers:{Authorization:`Bearer ${tokens.access_token}`}
    });
    if (response.status === 401) {
      tokens = await refresh(tokens);
      response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&maxResults=20&timeMin=${encodeURIComponent(new Date().toISOString())}`, {
        headers:{Authorization:`Bearer ${tokens.access_token}`}
      });
      headers["Set-Cookie"] = cookie("mc_google_tokens", seal(tokens));
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Google Calendar request failed");
    const events = (data.items || []).map(item => ({
      id:item.id, summary:item.summary || "Untitled event",
      start:item.start?.dateTime || item.start?.date,
      end:item.end?.dateTime || item.end?.date,
      location:item.location || ""
    }));
    return {statusCode:200, headers:{...headers,"Content-Type":"application/json"}, body:JSON.stringify({events})};
  } catch (error) {
    return {statusCode:500, body:error.message};
  }
};
