export async function loadCSS(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();

    const style = document.createElement("style");
    style.textContent = text;
    document.head.appendChild(style);

    console.log("✅ CSS loaded from", url);
  } catch (error) {
    console.error(`🚨 Failed to load CSS from ${url}`, error);
  }
}