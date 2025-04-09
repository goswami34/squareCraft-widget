export async function loadCSS(url, key) {
    let cachedData = localStorage.getItem(key);
    let lastFetched = localStorage.getItem(`${key}_timestamp`);
    let oneDay = 60 * 1000;
  
    if (cachedData && lastFetched && Date.now() - lastFetched < oneDay) {
      const style = document.createElement("style");
      style.textContent = cachedData;
      document.head.appendChild(style);
    } else {
      try {
        let response = await fetch(url);
        let text = await response.text();
        localStorage.setItem(key, text);
        localStorage.setItem(`${key}_timestamp`, Date.now());
  
        const style = document.createElement("style");
        style.textContent = text;
        document.head.appendChild(style);
      } catch (error) {
        console.error(`🚨 Failed to load ${key} from CDN`, error);
      }
    }
  }
  