(async function fontFamilyDropdownInteract() {
  const token = widgetScript?.dataset?.token;
  const userId = widgetScript.dataset?.uId; 
  const widgetId = widgetScript.dataset?.wId; 

  if (token) {
    console.log("🔑 Token received:", token);
    localStorage.setItem("squareCraft_auth_token", token);
    document.cookie = `squareCraft_auth_token=${token}; path=.squarespace.com;`;
}

if (userId) {
    console.log("👤 User ID received:", userId);
    localStorage.setItem("squareCraft_u_id", userId);
    document.cookie = `squareCraft_u_id=${userId}; path=.squarespace.com;`;

}

if (widgetId) {
    console.log("🛠️ Widget ID received:", widgetId);
    localStorage.setItem("squareCraft_w_id", widgetId);
    document.cookie = `squareCraft_w_id=${widgetId}; path=.squarespace.com;`;
}
    console.log("✅ SquareCraft Plugin Loaded");
    setTimeout(() => {
      if (!window.location.href.includes("squarespace.com/config")) return;
  
      console.log("🔹 Injecting Custom Admin Logo...");
      const toolbar = document.querySelector('[data-test="header-nav"]'); 
      console.log("toolbar found...", toolbar);
      if (!toolbar) {
        console.warn("⚠️ Squarespace navbar not found.");
        return;
      }
   
      if (document.getElementById("customAdminLogo")) return;
  
      const logoWrapper = document.createElement("div");
      logoWrapper.id = "customAdminLogo";
      logoWrapper.style.display = "flex";
      logoWrapper.style.alignItems = "center";
      logoWrapper.style.marginLeft = "10px";
      const logo = document.createElement("img");
      logo.src = "https://i.ibb.co.com/LXKK6swV/Group-29.jpg"; 
      logo.alt = "Your Plugin";
      logo.style.width = "28px";
      logo.style.height = "28px";
      logo.style.borderRadius = "50%";
      logo.style.cursor = "pointer";
  
      logoWrapper.appendChild(logo);
      toolbar.appendChild(logoWrapper);
  
      console.log("✅ Custom Admin Logo Added to Squarespace Navbar");
  
    }, 2000);
  
    function isEditingMode() {
      return document.body.classList.contains("sqs-editing");
    }
    function observeDOMChanges() {
      const observer = new MutationObserver(() => {
        console.log("🔄 DOM Updated - Checking for changes...");
    
        if (isEditingMode()) {
          console.log("🛠 Detected Edit Mode - Rechecking modifications...");
          setTimeout(fetchModifications, 3000); // ✅ Wait 3s before fetching again
        } else {
          fetchModifications();
        }
      });
    
      observer.observe(document.body, { childList: true, subtree: true });
    }
    
    async function saveModifications(pageId, elementId, css) {
      if (!pageId || !elementId || !css) return;
  
      applyStylesToElement(elementId, css);
      console.log("Saving modifications for Page ID and Element ID:", pageId, elementId);
      const modificationData = {
        userId,
        token,
        widgetId,
        modifications: [
            {
                pageId,
                elements: [{ elementId, css }]
            }
        ]
    };
  
      try {
        const response = await fetch("https://webefo-backend.vercel.app/api/v1/modifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`
          },
          body: JSON.stringify(modificationData),
        });
  
        console.log("✅ Changes Saved Successfully!", response.json());
  
      } catch (error) {
        console.error("❌ Error saving modifications:", error);
      }
    }

    setTimeout(() => {
      console.log("🔗 Full URL:", window.location.href);
    }, 1000);
  
    function shouldShowWidget() {
      const url = window.location.href;
      const pathname = window.location.pathname;
      return url.includes("#") || pathname !== "/";
    }
  
    function toggleWidgetVisibility() {
      const widget = document.getElementById("squarecraft-widget-container");
      if (!widget) return;
      widget.style.display = shouldShowWidget() ? "block" : "none";
    }
  
    const widgetScript = document.getElementById("squarecraft-script");
  

    if (token) {
      console.log("🔑 Token received:", token);
      localStorage.setItem("squareCraft_auth_token", token);
      document.cookie = `squareCraft_auth_token=${token}; path=.squarespace.com;`;
    }
  
    let selectedElement = null;
    let lastHighlightedElement = null; // ✅ Store last clicked element for proper highlight reset
  
    function initializeSquareCraft() {
      createWidget();
      attachEventListeners();
      fetchModifications();
      observeDOMChanges();
      toggleWidgetVisibility();
    }
  
    function createWidget() {
      const widgetContainer = document.createElement("div");
      widgetContainer.id = "squarecraft-widget-container";
      widgetContainer.style.position = "fixed";
      widgetContainer.style.top = "100px";
      widgetContainer.style.left = "100px";
      widgetContainer.style.cursor = "grab";
      widgetContainer.style.zIndex = "9999";
  
      widgetContainer.innerHTML = `
        <div style="width: 300px; background: #2c2c2c; padding: 20px; border-radius: 18px; border: 1.5px solid #3D3D3D; color: white;">
          <h3>🎨 SquareCraft Widget</h3>
  
          <label>Font Size:</label>
          <input type="number" id="squareCraftFontSize" value="16" min="10" max="50" style="width: 100%;">
  
          <label>Background Color:</label>
          <input type="color" id="squareCraftBgColor" value="#ffffff" style="width: 100%;">
  
          <label>Border Radius:</label>
          <input type="range" id="squareCraftBorderRadius" min="0" max="50" value="0">
          <p>Border Radius: <span id="borderRadiusValue">0px</span></p>
  
          <button id="squareCraftPublish" style="width: 100%; padding: 10px; background: #EF7C2F; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Publish Changes
          </button>
        </div>
      `;
  
      document.body.appendChild(widgetContainer);
    }
  
    function highlightElement(element) {
      if (!element) return;
  
      if (lastHighlightedElement && lastHighlightedElement !== element) {
        lastHighlightedElement.style.animation = "";
      }
  
      element.style.animation = "borderGlow 1s infinite alternate";
      lastHighlightedElement = element; 
  
      if (!document.getElementById("borderGlowStyle")) {
        const style = document.createElement("style");
        style.id = "borderGlowStyle";
        style.innerHTML = `
          @keyframes borderGlow {
            0% { border: 2px solid red; }
            50% { border: 2px solid yellow; }
            100% { border: 2px solid red; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    function attachEventListeners() {
      document.addEventListener("click", (event) => {
        let { pageId, elementId } = getPageAndElement(event.target);
        if (!pageId || !elementId) return;
  
        selectedElement = event.target;
        highlightElement(selectedElement);
        console.log(`🆔 Page ID: ${pageId}, Element ID: ${elementId}`);
      });
  
      document.getElementById("squareCraftFontSize").addEventListener("input", applyStyle);
      document.getElementById("squareCraftBgColor").addEventListener("input", applyStyle);
      document.getElementById("squareCraftBorderRadius").addEventListener("input", function () {
        document.getElementById("borderRadiusValue").textContent = this.value + "px";
        applyStyle();
      });
  
      document.getElementById("squareCraftPublish").addEventListener("click", async () => {
        if (!selectedElement) {
          console.warn("⚠️ No element selected for publishing.");
          return;
        }
  
        let { pageId, elementId } = getPageAndElement(selectedElement);
        if (!pageId || !elementId) {
          console.warn("⚠️ No valid page or block found for publishing.");
          return;
        }
  
        let css = getCSSModifications(selectedElement);
        console.log("🎨 Publishing Changes:", { pageId, elementId, css });
  
        await saveModifications(pageId, elementId, css);
      });
    }
  
    function getPageAndElement(targetElement) {
      let page = targetElement.closest("article[data-page-sections]");
      let block = targetElement.closest('[id^="block-"]');
  
      if (!page || !block) {
        console.warn("⚠️ No valid page or block found.");
        return {};
      }
  
      return {
        pageId: page.getAttribute("data-page-sections"),
        elementId: block.id,
      };
    }
  
    function applyStyle() {
      if (!selectedElement) return;
    
      const fontSize = document.getElementById("squareCraftFontSize").value + "px";
      selectedElement.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, a, div, li, strong, em").forEach(el => {
        el.style.fontSize = fontSize;
      });
    
      const bgColor = document.getElementById("squareCraftBgColor").value;
      selectedElement.style.backgroundColor = bgColor;
    
      const borderRadius = document.getElementById("squareCraftBorderRadius").value + "px";
      selectedElement.style.borderRadius = borderRadius;
      selectedElement.querySelectorAll("img").forEach(img => {
        img.style.borderRadius = borderRadius;
      });
    }
    
    
    function getCSSModifications(element) {
      if (!element) return null;
      const computedStyle = window.getComputedStyle(element);
      return {
        "font-size": computedStyle.fontSize,
        "background-color": computedStyle.backgroundColor,
        "border-radius": computedStyle.borderRadius,
        "color": computedStyle.color,
      };
    }
  
    function applyStylesToElement(elementId, css) {
      const element = document.getElementById(elementId);
      if (!element) return;
    
      Object.keys(css).forEach((prop) => {
        if (prop === "font-size") {
          element.querySelectorAll("h1, h2, h3, p, span, a").forEach(el => {
            el.style.fontSize = css[prop];
          });
        } else if (prop === "border-radius") {
          element.style.borderRadius = css[prop];
          element.querySelectorAll("img").forEach(img => {
            img.style.borderRadius = css[prop];
          });
        } else {
          element.style[prop] = css[prop];
        }
      });
    
      console.log(`🎨 Styles applied to ${elementId}:`, css);
    }
    
  
  
    async function fetchModifications() {
      try {
    
        // 🔹 Detect Edit Mode
        if (isEditingMode()) {
          console.log("🛠 Squarespace is in Edit Mode - Waiting for changes...");
          setTimeout(fetchModifications, 3000); // Retry after 3s
          return;
        }
    
        let pageElement = document.querySelector("article[data-page-sections]");
        let pageId = pageElement ? pageElement.getAttribute("data-page-sections") : null;
    
        if (!pageId) {
          console.warn("⚠️ No valid page ID found. Retrying in 2s...");
          setTimeout(fetchModifications, 2000);
          return;
        }
    
        console.log(`📄 Fetching modifications for Page ID: ${pageId}`);
    
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
        console.log("📥 Fetched Modifications:", data);
    
        data.modifications.forEach(({ page_id, elements }) => {
          if (page_id === pageId) {
            elements.forEach(({ elementId, css }) => {
              console.log(`🎨 Applying styles to ${elementId}`);
              applyStylesToElement(elementId, css);
            });
          }
        });
    
      } catch (error) {
        console.error("❌ Error fetching modifications:", error);
      }
    }
    
    
    
  
  
  
    document.addEventListener("DOMContentLoaded", initializeSquareCraft);
    window.addEventListener("hashchange", toggleWidgetVisibility);
    window.addEventListener("popstate", toggleWidgetVisibility);
  })();
  