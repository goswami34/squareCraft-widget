export let token = null;
export let sc_u_id = null;
export let sc_w_id = null;

export function fetchTokens() {
    const widgetScript = document.getElementById("sc-script");

    if (!widgetScript) {
        console.error("❌ Widget script not found! Ensure the script tag exists with id 'sc-script'.");
        return;
    }

    token = widgetScript.dataset?.token;
    sc_u_id = widgetScript.dataset?.uId;
    sc_w_id = widgetScript.dataset?.wId;

    if (token) {
        localStorage.setItem("sc_auth_token", token);
        document.cookie = `sc_auth_token=${token}; path=/; domain=${location.hostname}; Secure; SameSite=Lax`;
    }

    if (sc_u_id) {
        localStorage.setItem("sc_u_id", sc_u_id);
        document.cookie = `sc_u_id=${sc_u_id}; path=.squarespace.com;`;
    }

    if (sc_w_id) {
        localStorage.setItem("sc_w_id", sc_w_id);
        document.cookie = `sc_w_id=${sc_w_id}; path=.squarespace.com;`;
    }
}
