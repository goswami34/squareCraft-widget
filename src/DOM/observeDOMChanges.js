import { isEditingMode } from "https://fatin-webefo.github.io/squareCraft-Plugin/src/DOM/isEditingMode.js";

function fontFamilyDropdown() {
    if (document.getElementById("squareCraft-script-fontFamily")) {
        console.warn("⚠️ SquareCraft script already exists.");
        return;
    }

    const script = document.createElement("script");
    script.id = "squareCraft-script-fontFamily";
    script.src = "https://fatin-webefo.github.io/squareCraft-Plugin/src/html/parentHtml/fontfamilyDropdown/fontFamilyDropdowninteract.js";
    script.defer = true;

    script.onload = () => console.log("✅ fontFamilyDropdown.js loaded successfully!");
    script.onerror = (e) => console.error("❌ Failed to load fontFamilyDropdown.js", e);
    
    document.body.appendChild(script);
}
fontFamilyDropdown();
export function observeDOMChanges() {
  fontFamilyDropdown(); 
    const observer = new MutationObserver(() => {
        console.log("🔄 DOM Updated - Checking for changes...");

        if (isEditingMode()) {
            console.log("🛠 Detected Edit Mode - Rechecking modifications...");
            fontFamilyDropdown(); 
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
