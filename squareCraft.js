(async function squareCraft() {
  const widgetScript = document.getElementById("squarecraft-script");
  if (!widgetScript) {
    console.error("❌ Widget script not found! Ensure the script tag exists with id 'squarecraft-script'.");
    return;
  }

  const token = widgetScript.dataset?.token;
  const squareCraft_u_id = widgetScript.dataset?.uId; 
  const squareCraft_w_id = widgetScript.dataset?.wId; 
  const userId = localStorage.getItem("squareCraft_u_id");
  const widgetId = localStorage.getItem("squareCraft_w_id");
  
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
 if (token) localStorage.setItem("squareCraft_auth_token", token);
  if (userId) localStorage.setItem("squareCraft_u_id", userId);
  if (widgetId) localStorage.setItem("squareCraft_w_id", widgetId);

  let selectedElement = null;
  let appliedStyles = new Set(); // Track applied styles to prevent duplicate injection

  function getPageId() {
    let pageElement = document.querySelector("article[data-page-sections]");
    return pageElement ? pageElement.getAttribute("data-page-sections") : null;
  }

  let pageId = getPageId();
  if (!pageId) console.warn("⚠️ No page ID found. Plugin may not work correctly.");

  /**
   * 🎨 Apply Styles to an Element & Ensure Persistence
   */
  function applyStylesToElement(elementId, css) {
    if (!elementId || !css || appliedStyles.has(elementId)) return;

    let styleTag = document.getElementById(`style-${elementId}`);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = `style-${elementId}`;
      document.head.appendChild(styleTag);
    }

    let cssText = `#${elementId} { `;
    Object.keys(css).forEach(prop => {
      cssText += `${prop}: ${css[prop]} !important; `;
    });
    cssText += "}";

    styleTag.innerHTML = cssText;
    appliedStyles.add(elementId);
    console.log(`✅ Styles Persisted for ${elementId}`);
  }

  /**
   * 📡 Fetch & Apply Stored Modifications After Page Load
   */
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

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
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

  /**
   * 💾 Save Modifications for Selected Element
   */
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

  // async function fontfamilies() {
  //   const response = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk");
  //   const data = await response.json();
    
  //   const fontDropdown = document.getElementById("squareCraft-font-family");
  //   fontDropdown.style.position = "relative";
  //   fontDropdown.style.cursor = "pointer";

  //   // Default selected font
  //   let selectedFont = "Please select the font";  // You can change the default
  //   fontDropdown.querySelector("p").textContent = selectedFont;

  //   // Create dropdown list (hidden by default)
  //   const fontList = document.createElement("div");
  //   fontList.style.position = "absolute";
  //   fontList.style.top = "100%";
  //   fontList.style.left = "0";
  //   fontList.style.width = "100%";
  //   fontList.style.background = "#2c2c2c";
  //   fontList.style.border = "1px solid #585858";
  //   fontList.style.borderRadius = "6px";
  //   fontList.style.overflowY = "auto";
  //   fontList.style.maxHeight = "200px";
  //   fontList.style.display = "none";
  //   fontList.style.zIndex = "1000";

  //   data.items.forEach(font => {
  //     const option = document.createElement("div");
  //     option.textContent = font.family;
  //     option.style.padding = "8px";
  //     option.style.cursor = "pointer";
  //     option.style.fontFamily = font.family;

  //     option.addEventListener("click", () => {
  //       selectedFont = font.family;
  //       fontDropdown.querySelector("p").textContent = selectedFont;
  //       fontList.style.display = "none"; // Hide after selection

  //       // Apply the selected font to the target element
  //       if (selectedElement) {
  //         selectedElement.style.fontFamily = selectedFont;
  //       }
  //     });

  //     fontList.appendChild(option);
  //   });

  //   fontDropdown.appendChild(fontList);

  //   // Toggle dropdown on click
  //   fontDropdown.addEventListener("click", (event) => {
  //     event.stopPropagation(); // Prevent closing when clicking the dropdown
  //     fontList.style.display = fontList.style.display === "block" ? "none" : "block";
  //   });

  //   // Close dropdown when clicking outside
  //   document.addEventListener("click", () => {
  //     fontList.style.display = "none";
  //   });
  // }

//   async function fontfamilies() {
//     const response = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk");
//     const data = await response.json();
    
//     const fontDropdown = document.getElementById("squareCraft-font-family");
//     fontDropdown.style.position = "relative";
//     fontDropdown.style.cursor = "pointer";

//     let selectedFont = "Please select the font";
//     fontDropdown.querySelector("p").textContent = selectedFont;

//     const fontList = document.createElement("div");
//     fontList.style.position = "absolute";
//     fontList.style.top = "100%";
//     fontList.style.left = "0";
//     fontList.style.width = "100%";
//     fontList.style.background = "#2c2c2c";
//     fontList.style.border = "1px solid #585858";
//     fontList.style.borderRadius = "6px";
//     fontList.style.overflowY = "auto";
//     fontList.style.maxHeight = "200px";
//     fontList.style.display = "none";
//     fontList.style.zIndex = "1000";

//     data.items.forEach(font => {
//         const option = document.createElement("div");
//         option.textContent = font.family;
//         option.style.padding = "8px";
//         option.style.cursor = "pointer";
//         option.style.fontFamily = font.family;

//         option.addEventListener("click", async () => {
//             selectedFont = font.family;
//             fontDropdown.querySelector("p").textContent = selectedFont;
//             fontList.style.display = "none";

//             // Apply font-family to the selected element
//             if (selectedElement) {
//                 selectedElement.style.fontFamily = selectedFont;

//                 // Save the modification immediately
//                 let css = { "font-family": selectedFont };
//                 await saveModifications(selectedElement.id, css);
//             }
//         });

//         fontList.appendChild(option);
//     });

//     fontDropdown.appendChild(fontList);

//     fontDropdown.addEventListener("click", (event) => {
//         event.stopPropagation();
//         fontList.style.display = fontList.style.display === "block" ? "none" : "block";
//     });

//     document.addEventListener("click", () => {
//         fontList.style.display = "none";
//     });
// }
async function fontfamilies() {
  const response = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk");
  const data = await response.json();

  const fontDropdown = document.getElementById("squareCraft-font-family");
  fontDropdown.style.position = "relative";
  fontDropdown.style.width = "100%";
  fontDropdown.style.border = "1px solid #585858";
  fontDropdown.style.borderRadius = "6px";
  fontDropdown.style.background = "#2c2c2c";
  fontDropdown.style.color = "white";
  fontDropdown.style.display = "flex";
  fontDropdown.style.alignItems = "center";
  fontDropdown.style.justifyContent = "space-between";
  fontDropdown.style.padding = "10px";
  fontDropdown.style.cursor = "pointer";

  // Create text container for the selected font
  let selectedFont = "Select a Font";  
  const selectedFontText = document.createElement("p");
  selectedFontText.textContent = selectedFont;
  selectedFontText.style.flexGrow = "1"; 
  selectedFontText.style.fontSize = "14px";

  // Dropdown arrow icon
  const dropdownArrow = document.createElement("img");
  dropdownArrow.src = "https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg";
  dropdownArrow.style.width = "12px";
  dropdownArrow.style.height = "12px";
  dropdownArrow.style.transform = "rotate(180deg)";

  fontDropdown.appendChild(selectedFontText);
  fontDropdown.appendChild(dropdownArrow);

  // Create dropdown list (hidden initially)
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

  // Add fonts to the dropdown
  data.items.forEach(font => {
      const option = document.createElement("div");
      option.textContent = font.family;
      option.style.padding = "8px";
      option.style.cursor = "pointer";
      option.style.fontFamily = font.family;
      option.style.transition = "background 0.3s";
      option.style.color = "white";
      option.style.fontSize = "14px";

      // Hover effect
      option.addEventListener("mouseover", () => {
          option.style.background = "#444";
      });

      option.addEventListener("mouseout", () => {
          option.style.background = "transparent";
      });

      // Click event to select font
      option.addEventListener("click", async () => {
          selectedFont = font.family;
          selectedFontText.textContent = selectedFont;
          selectedFontText.style.fontFamily = selectedFont;
          fontList.style.display = "none";

          // Apply font-family to the selected element
          if (selectedElement) {
              selectedElement.style.fontFamily = selectedFont;

              // Save the modification immediately
              let css = { "font-family": selectedFont };
              await saveModifications(selectedElement.id, css);
          }
      });

      fontList.appendChild(option);
  });

  fontDropdown.appendChild(fontList);

  // Toggle dropdown on click
  fontDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
      fontList.style.display = fontList.style.display === "block" ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
      fontList.style.display = "none";
  });
}

  fontfamilies();

  /**
   * 🎛️ Create Floating Widget for Editing Styles
   */
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
        <p>Border Radius: <span id="borderRadiusValue">0px</span></p>

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

  /**
   * 🎯 Handle Element Selection & Style Updates
   */
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

  /**
   * 🔄 Handle AJAX Navigation
   */
  const observer = new MutationObserver(() => {
    console.log("🔄 Page updated via AJAX. Re-fetching styles...");
    pageId = getPageId();
    appliedStyles.clear();
    fetchModifications();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("DOMContentLoaded", () => {
    createWidget();
    attachEventListeners();
    fetchModifications();
  });
})();
