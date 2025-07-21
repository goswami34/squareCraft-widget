export function getToggleState() {
    return localStorage.getItem("sc_enabled") !== "false";
  }
  
  export function setToggleState(state) {
    localStorage.setItem("sc_enabled", state ? "true" : "false");
  }
  