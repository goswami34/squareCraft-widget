export async function setToken() {
  const widgetScript = document.getElementById("squarecraft-script");

  if (!widgetScript) {
      console.warn("⚠️ squarecraft-script not found.");
      return;
  }

  const token = widgetScript.dataset?.token;
  const squareCraft_u_id = widgetScript.dataset?.uId; 
  const squareCraft_w_id = widgetScript.dataset?.wId; 
  
  if (token) {
      console.log("🔑 Token received:", token);
      localStorage.setItem("squareCraft_auth_token", token);
      document.cookie = `squareCraft_auth_token=${token}; path=.squarespace.com;`;
  }

  if (squareCraft_u_id) {
      console.log("👤 User ID received:", squareCraft_u_id);
      localStorage.setItem("squareCraft_u_id", squareCraft_u_id);
      document.cookie = `squareCraft_u_id=${squareCraft_u_id}; path=.squarespace.com;`;

  }

  if (squareCraft_w_id) {
      console.log("🛠️ Widget ID received:", squareCraft_w_id);
      localStorage.setItem("squareCraft_w_id", squareCraft_w_id);
      document.cookie = `squareCraft_w_id=${squareCraft_w_id}; path=.squarespace.com;`;
  }
}
