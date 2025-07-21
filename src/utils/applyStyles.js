export function applyStylesToElement(element, css) {
    if (!element || !css) return;
  
    const elementId = element.id;
    let styleTag = document.getElementById(`style-${elementId}`);
  
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = `style-${elementId}`;
      document.head.appendChild(styleTag);
    }
  
    let cssText = `#${elementId}, #${elementId} h1, #${elementId} h2, #${elementId} h3, #${elementId} h4, #${elementId} p { `;
    Object.keys(css).forEach((prop) => {
      cssText += `${prop}: ${css[prop]} !important; `;
    });
    cssText += "}";
  
    styleTag.innerHTML = cssText;
  }
  