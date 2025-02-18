(async function squareCraft() {
  const widgetScript = document.getElementById("squarecraft-script");
  if (!widgetScript) {
    console.error("❌ Widget script not found! Ensure the script tag exists with id 'squarecraft-script'.");
    return;
  }

  const token = widgetScript?.dataset?.token || localStorage.getItem("squareCraft_auth_token");
  const userId = widgetScript.dataset?.uId || localStorage.getItem("squareCraft_u_id");
  const widgetId = widgetScript.dataset?.wId || localStorage.getItem("squareCraft_w_id");

  if (token) localStorage.setItem("squareCraft_auth_token", token);
  if (userId) localStorage.setItem("squareCraft_u_id", userId);
  if (widgetId) localStorage.setItem("squareCraft_w_id", widgetId);

  let selectedElement = null;
  let appliedStyles = new Set();

  function getPageId() {
    let pageElement = document.querySelector("article[data-page-sections]");
    return pageElement ? pageElement.getAttribute("data-page-sections") : null;
  }

  let pageId = getPageId();
  if (!pageId) console.warn("⚠️ No page ID found. Plugin may not work correctly.");

  function applyStylesToElement(elementId, css) {
    if (!elementId || !css || appliedStyles.has(elementId)) return;

    let styleTag = document.getElementById(`style-${elementId}`);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = `style-${elementId}`;
      document.head.appendChild(styleTag);
    }

    let cssText = `#${elementId}, #${elementId} * { `; 
    Object.keys(css).forEach(prop => {
      cssText += `${prop}: ${css[prop]} !important; `;
    });
    cssText += "}";

    if (css["border-radius"]) {
      cssText += `#${elementId} { overflow: hidden !important; }`; 
    }

    styleTag.innerHTML = cssText;
    appliedStyles.add(elementId);
    console.log(`✅ Styles Persisted for ${elementId}`);
  }

  async function fetchModifications(retries = 3) {
    if (!pageId) return;

    try {
      console.log(`📄 Fetching saved modifications for Page ID: ${pageId}`);

      const response = await fetch(
        `https://webefo-backend.vercel.app/api/v1/get-modifications?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
          },
        }
      );

      // if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log(data)
      if (!data.modifications || data.modifications.length === 0) {
        console.warn("⚠️ No styles found for this page.");
        return;
      }

      console.log("📥 Applying stored modifications...", data);
      data.modifications.forEach(({ pageId: storedPageId, elements }) => {
        if (storedPageId === pageId) {
          elements.forEach(({ elementId, css }) => {
            applyStylesToElement(elementId, css);
          });
        }
      });

    } catch (error) {
      console.error("❌ Error fetching modifications:", error);
      if (retries > 0) {
        console.log(`🔄 Retrying fetch... (${retries} left)`);
        setTimeout(() => fetchModifications(retries - 1), 2000);
      }
    }
  }

  async function saveModifications(elementId, css) {
    if (!pageId || !elementId || !css) {
      console.warn("⚠️ Missing required data to save modifications.");
      return;
    }

    applyStylesToElement(elementId, css);
    console.log("📡 Saving modifications for:", { pageId, elementId, css });

    const modificationData = {
      userId,
      token,
      widgetId,
      modifications: [{ pageId, elements: [{ elementId, css }] }],
 };

    try {
      const response = await fetch("https://webefo-backend.vercel.app/api/v1/modifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
          "userId": userId,
          "pageId": pageId,
          "widget-id": widgetId,
        },
        body: JSON.stringify(modificationData),
      });

      console.log("✅ Changes Saved Successfully!", await response.json());
    } catch (error) {
      console.error("❌ Error saving modifications:", error);
    }
  }

  async function fontfamilies() {
    const response = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk");
    const data = await response.json();
    
    const fontDropdown = document.getElementById("squareCraft-font-family");
    fontDropdown.style.position = "relative";
    fontDropdown.style.cursor = "pointer";

    // Default selected font
    let selectedFont = "Please select the font";  // You can change the default
    fontDropdown.querySelector("p").textContent = selectedFont;

    // Create dropdown list (hidden by default)
    const fontList = document.createElement("div");
    fontList.style.position = "absolute";
    fontList.style.top = "100%";
    fontList.style.left = "0";
    fontList.style.width = "100%";
    fontList.style.background = "#2c2c2c";
    fontList.style.border = "1px solid #585858";
    fontList.style.borderRadius = "6px";
    fontList.style.overflowY = "auto";
    fontList.style.maxHeight = "200px";
    fontList.style.display = "none";
    fontList.style.zIndex = "1000";

    data.items.forEach(font => {
      const option = document.createElement("div");
      option.textContent = font.family;
      option.style.padding = "8px";
      option.style.cursor = "pointer";
      option.style.fontFamily = font.family;

      option.addEventListener("click", () => {
        selectedFont = font.family;
        fontDropdown.querySelector("p").textContent = selectedFont;
        fontList.style.display = "none"; // Hide after selection

        // Apply the selected font to the target element
        if (selectedElement) {
          selectedElement.style.fontFamily = selectedFont;
        }
      });

      fontList.appendChild(option);
    });

    fontDropdown.appendChild(fontList);

    // Toggle dropdown on click
    fontDropdown.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent closing when clicking the dropdown
      fontList.style.display = fontList.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      fontList.style.display = "none";
    });
  }

  fontfamilies();

  function createWidget() {
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "squarecraft-widget-container";
    widgetContainer.style.position = "fixed";
    widgetContainer.style.top = "100px";
    widgetContainer.style.left = "100px";
    widgetContainer.style.zIndex = "9999";

    widgetContainer.innerHTML = `
      <div style="width: 300px; background: #2c2c2c; padding: 20px; border-radius: 18px; color: white;">
        <h3>🎨 SquareCraft Widget</h3>

        <label>Font Size:</label>
        <input type="number" id="squareCraftFontSize" value="16" min="10" max="50" style="width: 100%;">

        <label>Background Color:</label>
        <input type="color" id="squareCraftBgColor" value="#ffffff" style="width: 100%;">

        <label>Border Radius:</label>
        <input type="range" id="squareCraftBorderRadius" min="0" max="50" value="0">

        <div id="squareCraft-font-family" class="squareCraft-flex squareCraft-col-span-8 squareCraft-cursor-pointer squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center squareCraft-h-full">
            <div class="squareCraft-bg-494949 squareCraft-w-full squareCraft-px-2 squareCraft-py-1px ">
                <p class="squareCraft-text-sm squareCraft-font-light"></p>
            </div <div class="squareCraft-bg-3f3f3f squareCraft-px-2" style="height: 27px; padding: 0 8px;">
                <img class="squareCraft-h-full squareCraft-rotate-180" width="12px"
                    src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">
            </div>
        </div>

        <button id="squareCraftPublish" style="width: 100%; padding: 10px; background: #EF7C2F; color: white;">
          Publish Changes
        </button>
      </div>
    `;

    document.body.appendChild(widgetContainer);
  }

  function attachEventListeners() {
    document.body.addEventListener("click", (event) => {
      let block = event.target.closest('[id^="block-"]');
      if (!block) return;

      if (selectedElement) selectedElement.style.outline = "";
      selectedElement = block;
      selectedElement.style.outline = "2px dashed #EF7C2F";

      console.log(`✅ Selected Element: ${selectedElement.id}`);
    });

    document.getElementById("squareCraftPublish").addEventListener("click", async () => {
      if (!selectedElement) {
        console.warn("⚠️ No element selected.");
        return;
      }

      let css = {
        "font-size": document.getElementById("squareCraftFontSize").value + "px",
        "background-color": document.getElementById("squareCraftBgColor").value,
        "border-radius": document.getElementById("squareCraftBorderRadius").value + "px",
        "font-family": document.getElementById("squareCraft-font-family").querySelector("p").textContent // Use the selected font family
      };

      await saveModifications(selectedElement.id, css);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    createWidget();
    attachEventListeners();
    fetchModifications();
  });
})();
