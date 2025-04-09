(async function squareCraft() {
  const widgetScript = document.getElementById("squarecraft-script");
  if (!widgetScript) {
    console.error(
      ":x: Widget script not found! Ensure the script tag exists with id 'squarecraft-script'."
    );
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
    document.cookie = `squareCraft_auth_token=${token}; path=/; domain=${location.hostname}; Secure; SameSite=Lax`;
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

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href =
    "https://goswami34.github.io/squareCraft-widget/src/styles/parent.css";
  document.head.appendChild(link);

  const fontSizes = [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
    46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  ];
  const LetterSpacing = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25,
  ];
  let fontSizeOptions = "";
  for (let size of fontSizes) {
    fontSizeOptions += `<option value="${size}">${size}px</option>`;
  }

  if (token) localStorage.setItem("squareCraft_auth_token", token);
  if (userId) localStorage.setItem("squareCraft_u_id", userId);
  if (widgetId) localStorage.setItem("squareCraft_w_id", widgetId);

  let selectedElement = null;
  let span = null;
  let appliedStyles = new Set();

  function getPageId() {
    let pageElement = document.querySelector("article[data-page-sections]");
    return pageElement ? pageElement.getAttribute("data-page-sections") : null;
  }

  let pageId = getPageId();
  if (!pageId)
    console.warn(":warning: No page ID found. Plugin may not work correctly.");


  function applyStylesToElement(elementId, css) {
    if (!elementId || !css) return;

    let styleTag = document.getElementById(`style-${elementId}`);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = `style-${elementId}`;
      document.head.appendChild(styleTag);
    }

    let cssText = `#${elementId} { `;
    Object.keys(css).forEach((prop) => {
      cssText += `${prop}: ${css[prop]} !important; `;
    });
    cssText += "}";

    styleTag.innerHTML = cssText;
    console.log(`✅ Styles Persisted for ${elementId}`);
  }



async function fetchModifications(retries = 3) {
  if (!pageId) return;

  const token = localStorage.getItem("squareCraft_auth_token");
  const userId = localStorage.getItem("squareCraft_u_id");
  const widgetId = localStorage.getItem("squareCraft_w_id");

  if (!token || !userId) {
      console.warn("Missing authentication data");
      return;
  }

  try {
      const response = await fetch(
          `https://admin.squareplugin.com/api/v1/get-modifications?userId=${userId}&widgetId=${widgetId}`,
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              }
          }
      );

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Retrieved modifications:", data);

      if (!data.modifications || !Array.isArray(data.modifications)) {
          console.warn("No modifications found or invalid format");
          return;
      }

      // Apply modifications for current page
      data.modifications.forEach(mod => {
          if (mod.pageId === pageId) {
              mod.elements.forEach(elem => {
                  const cssData = elem.css?.strong;
                  if (cssData) {
                      const { id, ...styles } = cssData;
                      const elementStructure = elem.elementStructure;
                      
                      // Find the block element
                      let targetElement = document.getElementById(id);
                      
                      if (targetElement) {
                          // Create or update style tag for this block's strong tags
                          let styleTag = document.getElementById(`style-${id}-strong`);
                          if (!styleTag) {
                              styleTag = document.createElement('style');
                              styleTag.id = `style-${id}-strong`;
                              document.head.appendChild(styleTag);
                          }

                          // Apply styles to all strong tags within the block
                          let cssString = `#${id} strong { `;
                          Object.entries(styles).forEach(([prop, value]) => {
                              cssString += `${prop}: ${value} !important; `;
                          });
                          cssString += '}';

                          styleTag.innerHTML = cssString;
                          console.log(`✅ Applied styles to block ${id}:`, styles);
                      }
                  }
              });
          }
      });

  } catch (error) {
      console.error("Error fetching modifications:", error);
      if (retries > 0) {
          console.log(`Retrying... (${retries} attempts left)`);
          setTimeout(() => fetchModifications(retries - 1), 2000);
      }
  }
}

function recreateModifiedElement(structure, styles) {
  const parentElement = structure.parentId ? 
      document.getElementById(structure.parentId) : 
      document.body;

  if (!parentElement) return;

  // First try to find existing element by ID
  let element = document.getElementById(structure.id);
  
  if (!element) {
      // If no element exists, create new one
      element = document.createElement(structure.type || 'span');
      element.id = structure.id;
      element.className = structure.className || 'squareCraft-font-modified';
      element.textContent = structure.content;

      // Find where to insert the element
      if (structure.content) {
          const textNodes = [];
          const walker = document.createTreeWalker(
              parentElement,
              NodeFilter.SHOW_TEXT,
              {
                  acceptNode: function(node) {
                      return node.textContent.includes(structure.content) ?
                          NodeFilter.FILTER_ACCEPT :
                          NodeFilter.FILTER_REJECT;
                  }
              },
              false
          );

          let node;
          while (node = walker.nextNode()) {
              textNodes.push(node);
          }

          if (textNodes.length > 0) {
              // Check if the text node is already inside a strong tag
              const existingStrong = textNodes[0].parentElement.closest('strong');
              if (existingStrong && structure.type === 'strong') {
                  // If we're trying to create a strong tag and the text is already in a strong tag,
                  // just apply the styles to the existing strong tag
                  element = existingStrong;
                  if (!element.id) {
                      element.id = structure.id;
                  }
              } else {
                  textNodes[0].parentNode.replaceChild(element, textNodes[0]);
              }
          }
      }
  }

  // Apply styles to the element
  if (element) {
      Object.entries(styles).forEach(([prop, value]) => {
          element.style[prop] = value;
      });
  }
}



async function saveModifications(blockId, css) {
  if (!pageId || !blockId || !css) {
      console.warn("⚠️ Missing required data to save modifications.");
      return;
  }

  const userId = localStorage.getItem("squareCraft_u_id");
  const token = localStorage.getItem("squareCraft_auth_token");
  const widgetId = localStorage.getItem("squareCraft_w_id");

  if (!userId || !token || !widgetId) {
      console.warn("⚠️ Missing authentication data");
      return;
  }

  const modificationData = {
      userId,
      token,
      widgetId,
      modifications: [{
          pageId,
          elements: [{
              elementId: blockId,
              css: {
                  strong: {
                      id: blockId,
                      ...css
                  }
              },
              elementStructure: {
                  type: 'strong',
                  content: document.getElementById(blockId)?.textContent || '',
                  parentId: document.getElementById(blockId)?.parentElement?.id || null
              }
          }]
      }]
  };

  try {
      const response = await fetch("https://admin.squareplugin.com/api/v1/modifications", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(modificationData),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Changes Saved Successfully!", result);
      
      return result;
  } catch (error) {
      console.error("❌ Error saving modifications:", error);
      throw error;
  }
}

function validateAndCleanModifications(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Remove any duplicate style tags
  const styleTags = document.querySelectorAll(`style[id^="style-${elementId}"]`);
  if (styleTags.length > 1) {
      for (let i = 1; i < styleTags.length; i++) {
          styleTags[i].remove();
      }
  }

  // Ensure styles are properly applied
  const styleTag = document.getElementById(`style-${elementId}`);
  if (styleTag && element.style.textTransform) {
      const css = {
          "text-transform": element.style.textTransform
      };
      applyStylesToElement(elementId, css);
  }
}
  
  const observer = new MutationObserver(() => {
    console.log("🔄 Edit Mode Detected. Reapplying modifications...");
    fetchModifications();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function findTextNodeByContent(element, searchText) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return node.textContent.includes(searchText)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    return walker.nextNode();
  }

  window.addEventListener("load", async () => {
    createWidget(); // Ensure the widget is created
    setTimeout(makeWidgetDraggable, 500);
    setTimeout(attachEventListeners, 1500);

    await fetchModifications(); // ✅ Fetch and apply modifications
  });

function cleanupDuplicateSpans(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Find all nested spans with the same ID
  const duplicateSpans = element.querySelectorAll(`span[id="${elementId}"]`);
  if (duplicateSpans.length <= 1) return;

  // Keep only the first span and remove others
  for (let i = 1; i < duplicateSpans.length; i++) {
      const span = duplicateSpans[i];
      const text = span.textContent;
      span.parentNode.replaceChild(document.createTextNode(text), span);
  }
}


  async function resetModifications() {
    const userId = localStorage.getItem("squareCraft_u_id");
    const token = localStorage.getItem("squareCraft_auth_token");
    const widgetId = localStorage.getItem("squareCraft_w_id");
    const pageId = getPageId(); // Ensure pageId is retrieved

    if (!userId || !token || !widgetId || !pageId) {
      console.warn(
        "⚠️ Missing required parameters: userId, token, widgetId, or pageId."
      );
      return;
    }

    try {
      const requestData = {
        userId: userId,
        token: token,
        widgetId: widgetId,
        pageId: pageId,
      };

      const response = await fetch(
        "https://webefo-backend.vercel.app/api/v1/modifications/elements",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData), // ✅ Send required data in the request body
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error resetting modifications:", errorData);
        return;
      }

      console.log("✅ Modifications reset successfully!");

      // Step 2: Remove all injected styles
      document
        .querySelectorAll("style[id^='style-']")
        .forEach((styleTag) => styleTag.remove());

      // Step 3: Clear stored data in localStorage (only UI-related, not user credentials)
      localStorage.removeItem("squareCraft_auth_token");
      localStorage.removeItem("squareCraft_u_id");
      localStorage.removeItem("squareCraft_w_id");

      // Step 4: Reset UI elements to default values
      document.getElementById("squareCraftFontSize").value = "16";
      document.getElementById("squareCraftFontWeight").value = "400";

      console.log("🎯 Reset complete. All styles and elements removed.");
    } catch (error) {
      console.error("❌ Error resetting modifications:", error);
    }
  }

  function createWidget() {
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "squarecraft-widget-container";
    widgetContainer.classList.add(
      "squareCraft-fixed",
      "squareCraft-text-color-white",
      "squareCraft-universal",
      "squareCraft-z-99999"
    );
    widgetContainer.style.display = "none"; // Hide the widget by default

    widgetContainer.innerHTML = `
         <div
           class="squareCraft-p-4  squareCraft-text-color-white squareCraft-border squareCraft-border-solid squareCraft-border-3d3d3d squareCraft-bg-color-2c2c2c squareCraft-rounded-15px squareCraft-w-300px">
           <div class="squareCraft-flex squareCraft-poppins squareCraft-universal squareCraft-items-center squareCraft-justify-between">
              <img class="squareCraft-cursor-grabbing squareCraft-universal" src="https://i.ibb.co.com/pry1mVGD/Group-28-1.png" width="140px" />
             
           </div>
           <p class="squareCraft-text-sm squareCraft-mt-6 squareCraft-poppins squareCraft-font-light">Lorem Ipsum is simply dummy text
              of the printing and typesetting industry.
           </p>
           <div
              class="squareCraft-mt-6 squareCraft-poppins squareCraft-border-t squareCraft-border-dashed squareCraft-border-color-494949  squareCraft-w-full">
           </div>
           <div class="squareCraft-mt-6 squareCraft-poppins squareCraft-flex  squareCraft-items-center squareCraft-universal">
              <p class="squareCraft-text-sm squareCraft-px-4 squareCraft-cursor-pointer tabHeader ">Design</p>
              <p class="squareCraft-text-sm squareCraft-px-4 squareCraft-cursor-pointer tabHeader">Advanced</p>
              <p class="squareCraft-text-sm squareCraft-px-4 squareCraft-cursor-pointer tabHeader">Presets</p>
           </div>
           <div
              class="squareCraft-border-t squareCraft-border-solid squareCraft-relative squareCraft-border-color-494949 squareCraft-w-full">
              <div
                 class="squareCraft-absolute squareCraft-top-0 squareCraft-left-0 squareCraft-bg-colo-EF7C2F squareCraft-w-16 squareCraft-h-1px">
              </div>
           </div>
           <div
              class="squareCraft-rounded-6px  squareCraft-mt-6  squareCraft-border squareCraft-border-solid squareCraft-border-EF7C2F squareCraft-bg-color-3d3d3d">
              <div class="squareCraft-flex squareCraft-p-2 squareCraft-items-center squareCraft-justify-between">
                 <div class="squareCraft-flex squareCraft-gap-2 squareCraft-items-center">
                    <img loading="lazy"
                       src="https://fatin-webefo.github.io/squareCraft-plugin/public/T.svg" alt="">
                    <p class="squareCraft-universal squareCraft-poppins">Typography</p>
                 </div>
                 <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg" alt="">
              </div>
              <div class="squareCraft-h-1px squareCraft-bg-3f3f3f"></div>
              <div
                 class="squareCraft-flex squareCraft-px-2   squareCraft-items-center squareCraft-justify-between">
                 <div class="squareCraft-flex squareCraft-gap-2 squareCraft-items-center">
                    <div class="toggle-container" id="toggleSwitch">
                       <div class="toggle-bullet"></div>
                    </div>
                    <p id="toggleText" class="squareCraft-text-sm squareCraft-poppins">Enable</p>
                 </div>
              </div>
              <div class="squareCraft-h-1px  squareCraft-bg-3f3f3f"></div>


              <div class="squareCraft-mt-2">
                 <div
                    class="squareCraft-flex squareCraft-poppins squareCraft-px-2  squareCraft-items-center squareCraft-justify-between squareCraft-gap-2">
                    <div
                       class="squareCraft-cursor-pointer squareCraft-bg-color-EF7C2F squareCraft-w-full squareCraft-font-light squareCraft-flex squareCraft-items-center squareCraft-text-sm squareCraft-py-1px squareCraft-rounded-6px squareCraft-text-color-white squareCraft-justify-center">
                       Normal
                    </div>
                    <div
                       class="squareCraft-cursor-pointer squareCraft-bg-3f3f3f squareCraft-w-full squareCraft-text-color-white squareCraft-font-light squareCraft-flex squareCraft-text-sm squareCraft-hover squareCraft-py-1px squareCraft-rounded-6px squareCraft-items-center squareCraft-justify-center">
                       Hover
                    </div>
                 </div>
                 <div class="squareCraft-px-4">
                    <div class="squareCraft-h-1px  squareCraft-mt-2 squareCraft-bg-3f3f3f"></div>
                 </div>
              </div>


              <div class=" squareCraft-mt-2 squareCraft-px-2 squareCraft-flex squareCraft-justify-between">
                 <p class="squareCraft-text-sm squareCraft-universal squareCraft-poppins">Text</p>
                 <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/eye.svg" width="12px" />
              </div>
              <div class="squareCraft-mt-2  squareCraft-grid squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 squareCraft-px-2" >

                 <div id="squareCraft-font-family" 
                    class="squareCraft-flex  squareCraft-bg-494949 squareCraft-h-9 squareCraft-col-span-7 squareCraft-cursor-pointer squareCraft-rounded-6px squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center "> 
                 </div>

                <div>
                  <input type="number" id="squareCraftFontSize" pleaceholder="font-size" value="20" min="10" max="50" style="width: 80px; background-color: gray; color: white; border-radius: 4px; padding: 4px 10px 4px 4px;">
                </div>
                 

              </div>

              

               <div style="margin:20px 10px;">
                <label style="font-size: 12px;">Font Weight:</label>
                <select id="squareCraftFontWeight" style="width: 100%; padding: 6px; background: #2c2c2c; color: white; border: 1px solid #585858; border-radius: 6px; margin:4px;">
                    <option value="100">Thin (100)</option>
                    <option value="200">Extra Light (200)</option>
                    <option value="300">Light (300)</option>
                    <option value="400" selected>Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi Bold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                    <option value="900">Black (900)</option>
                </select>
               </div>


              <div class="squareCraft-mt-2  squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 ">
                
              </div>

              <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 ">
                 
                 <div class="squareCraft-flex squareCraft-text-color-white squareCraft-justify-between squareCraft-col-span-3 
                    squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 
                    squareCraft-items-center squareCraft-w-full ">

                    <div class="squareCraft-Letter-spacing-container squareCraft-flex squareCraft-justify-between squareCraft-items-center squareCraft-flex squareCraft-items-center squareCraft-border 
                       squareCraft-border-solid squareCraft-border-3d3d3d  squareCraft-rounded-6px 
                       ">
                       <input type="text" id="squareCraftLineHeight" value="15" class="squareCraft-Letter-spacing-input squareCraft-font-light squareCraft-text-sm squareCraft-text-color-white 
                          squareCraft-bg-transparent squareCraft-w-full  squareCraft-py-1px squareCraft-font-light">
                       
                    </div>

                 </div>
              </div>

              <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2">
                <div class="squareCraft-flex squareCraft-col-span-6 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center">
                  <div class="squareCraft-flex squareCraft-px-2 squareCraft-items-center squareCraft-justify-between squareCraft-w-full">
                    <input 
                      type="number" 
                      id="squareCraftLetterSpacing" 
                      value="0" 
                      min="0" 
                      max="25" 
                      class="squareCraft-font-light squareCraft-text-sm squareCraft-text-color-white squareCraft-bg-transparent squareCraft-w-full squareCraft-py-1px"
                      style="width: 50px; padding: 4px;"
                    >
                    <div class="squareCraft-v-line"></div>
                    <div class="squareCraft-dropdown-container" style="position: relative;">
                      <img 
                        id="squareCraftLetterSpacingDropdown"
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/line-spacing.svg"
                        class="squareCraft-cursor-pointer"
                        style="padding: 4px;"
                      >
                      <div 
                        id="squareCraftLetterSpacingOptions" 
                        class="squareCraft-hidden squareCraft-absolute squareCraft-bg-3f3f3f squareCraft-border squareCraft-border-585858 squareCraft-rounded-6px"
                        style="top: 100%; right: 0; width: 80px; max-height: 200px; overflow-y: auto; z-index: 1000;"
                      >
                        ${[2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24].map(value => `
                          <div 
                            class="squareCraft-dropdown-item squareCraft-py-1px squareCraft-text-center squareCraft-text-sm squareCraft-cursor-pointer squareCraft-text-color-white" 
                            data-value="${value}"
                            style="padding: 8px; hover:background-color: #4a4a4a;"
                          >${value}px</div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="squareCraft-mt-2 squareCraft-px-2">
                <div class="squareCraft-flex squareCraft-items-center squareCraft-justify-between">
                  <label class="squareCraft-text-sm squareCraft-universal squareCraft-poppins">Text Color</label>
                  <div class="squareCraft-flex squareCraft-items-center squareCraft-gap-2">
                    <input 
                      type="color" 
                      id="squareCraftTextColor" 
                      value="#ffffff" 
                      class="squareCraft-color-input"
                      style="
                        width: 40px;
                        height: 40px;
                        padding: 0;
                        border: 2px solid #585858;
                        border-radius: 6px;
                        background: #2c2c2c;
                        cursor: pointer;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                      "
                    >
                    <input 
                      type="text" 
                      id="squareCraftColorHex" 
                      class="squareCraft-color-hex"
                      style="
                        width: 80px;
                        padding: 8px;
                        background: #2c2c2c;
                        border: 1px solid #585858;
                        border-radius: 6px;
                        color: white;
                        font-size: 14px;
                        font-family: 'Poppins', sans-serif;
                      "
                      placeholder="#FFFFFF"
                    >
                  </div>
                </div>
              </div>


              <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2">
                 <div class="squareCraft-flex squareCraft-col-span-6 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                    <div
                       class="squareCraft-flex squareCraft-px-2 squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                        <p class="squareCraft-font-underline squareCraft-universal squareCraft-text-sm squareCraft-cursor-pointer squareCraft-text-center squareCraft-mx-auto elements-font-style" data-style="underline">U</p>
                       
                        <div class="squareCraft-v-line"></div> 
                       <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-px-1_5 squsareCraft-font-style squareCraft-cursor-pointer" width="12px"
                     src="https://fatin-webefo.github.io/squareCraft-plugin/public/dot.svg" alt="">
                    </div>
                 </div>
              </div>


              <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2">
                 <div class="squareCraft-flex squareCraft-col-span-6 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center">
                    <div
                       class="squareCraft-flex squareCraft-poppins  squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                      <p class=" squareCraft-mx-2 squareCraft-w-full squareCraft-text-center squareCraft-universal squareCraft-text-sm squsareCraft-text-transform squareCraft-cursor-pointer" data-transform="uppercase">AG</p>
                       <div class="squareCraft-v-line"></div>
                      <p class=" squareCraft-universal  squareCraft-text-sm squareCraft-text-center squareCraft-w-full squareCraft-mx-auto squsareCraft-text-transform squareCraft-cursor-pointer" data-transform="lowercase">ag</p>
                       <div class="squareCraft-v-line"></div>
                       <p class=" squareCraft-universal  squareCraft-text-sm squareCraft-text-center squareCraft-w-full squareCraft-mx-auto squsareCraft-text-transform squareCraft-cursor-pointer" data-transform="capitalize">Ag</p>
                       <div class="squareCraft-v-line"></div>
                       <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-px-1_5 squsareCraft-text-transform squareCraft-cursor-pointer" width="12px"
                     src="https://fatin-webefo.github.io/squareCraft-plugin/public/dot.svg" alt="">
                    </div>
                 </div>
              </div>


              
      
              <div class="squareCraft-mt-2"> </div>
           </div>
           <div class="squareCraft-mt-4">
              <div
                 class="squareCraft-flex  squareCraft-items-center squareCraft-justify-between squareCraft-gap-2">
                 <button id="squareCraftPublish" style="width: 100%; padding: 10px; background: #EF7C2F; color: white;">
                    Publish Changes
                </button>
                
                 <button id="squareCraftReset" style="width: 100%; padding: 10px; background: #9f988e; color: white;">
                    cancle
                </button>
              </div>
            
           </div>
        </div>
      `;
    document.documentElement.appendChild(widgetContainer);
    makeWidgetDraggable();
    setInterval(makeWidgetDraggable, 1000);
  }

  function createWidgetIcon() {
    if (document.getElementById("squarecraft-widget-icon")) return;

    const widgetIcon = document.createElement("img");
    widgetIcon.id = "squarecraft-widget-icon";
    widgetIcon.src = "https://i.ibb.co.com/pry1mVGD/Group-28-1.png"; // Icon URL

    widgetIcon.classList.add(
      "squareCraft-absolute",
      "squareCraft-top-5",
      "squareCraft-rounded-md",
      "squareCraft-px-2",
      "squareCraft-w-16",
      "squareCraft-py-1",
      "squareCraft-bg-color-2c2c2c",
      "squareCraft-right-5",
      "squareCraft-cursor-pointer",
      "squareCraft-z-9999"
    );

    widgetIcon.addEventListener("click", function () {
      alert("Click on an element to open the widget.");
    });

    document.body.appendChild(widgetIcon);
  }

  setInterval(makeWidgetDraggable, 1000);

  function makeWidgetDraggable() {
    const widget = document.getElementById("squarecraft-widget-container");

    if (!widget) {
      console.warn(":x: Widget not found.");
      return;
    }
    widget.style.position = "fixed";
    widget.style.cursor = "grab";
    widget.style.zIndex = "999";

    let offsetX = 0,
      offsetY = 0,
      isDragging = false;

    widget.addEventListener("mousedown", (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "SELECT" ||
        event.target.isContentEditable
      ) {
        return;
      }

      event.preventDefault();
      isDragging = true;

      offsetX = event.clientX - widget.getBoundingClientRect().left;
      offsetY = event.clientY - widget.getBoundingClientRect().top;

      widget.style.transition = "none";
      widget.style.userSelect = "none";
      widget.style.cursor = "grabbing";

      document.addEventListener("mousemove", moveAt);
      document.addEventListener("mouseup", stopDragging);
    });

    function moveAt(event) {
      if (!isDragging) return;

      let newX = event.clientX - offsetX;
      let newY = event.clientY - offsetY;
      newX = Math.max(
        0,
        Math.min(window.innerWidth - widget.offsetWidth, newX)
      );
      newY = Math.max(
        0,
        Math.min(window.innerHeight - widget.offsetHeight, newY)
      );

      widget.style.left = `${newX}px`;
      widget.style.top = `${newY}px`;
    }

    function stopDragging() {
      isDragging = false;
      widget.style.cursor = "grab";
      document.removeEventListener("mousemove", moveAt);
      document.removeEventListener("mouseup", stopDragging);

      // Save last position in localStorage
      localStorage.setItem("widget_X", widget.style.left);
      localStorage.setItem("widget_Y", widget.style.top);
    }

    // Restore last saved position
    let lastX = localStorage.getItem("widget_X");
    let lastY = localStorage.getItem("widget_Y");
    if (lastX && lastY) {
      widget.style.left = lastX;
      widget.style.top = lastY;
    } else {
      widget.style.left = "50px"; // Default position
      widget.style.top = "50px";
    }
  }

  makeWidgetDraggable();

  setTimeout(makeWidgetDraggable, 1000);

  window.addEventListener("load", () => {
    setTimeout(makeWidgetDraggable, 500); // Wait for the widget to load
    createWidgetIcon();
  });
  window.addEventListener("load", async () => {
    await fetchModifications();
    createWidget(); // Ensure widget is created first
    setTimeout(makeWidgetDraggable, 500); // Apply draggability after it's added to DOM
    setTimeout(attachEventListeners, 1500);
  });

  async function loadFontsWithPagination(page = 1, perPage = 20) {
    try {
      const response = await fetch(
        "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk"
      );
      const data = await response.json();
      return data.items.slice((page - 1) * perPage, page * perPage); // Paginate fonts
    } catch (error) {
      console.error("❌ Error fetching Google Fonts:", error);
      return [];
    }
  }

  let lastSelectedFontfamilyStrong = null;

document.addEventListener("mouseup", function () {
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
        let range = selection.getRangeAt(0);
        let parentElement = range.commonAncestorContainer;

        // If the selected text is a text node, get its parent element
        if (parentElement.nodeType === Node.TEXT_NODE) {
            parentElement = parentElement.parentElement;
        }

        // Check if the parent or an ancestor is a <strong> tag
        const strongElement = parentElement.closest("strong");
        
        if (strongElement) {
          lastSelectedFontfamilyStrong = strongElement;
            console.log("✅ Selected text inside <strong>: ", strongElement.textContent);
        } else {
            lastSelectedFontfamilyStrong = null; // Reset if selection is outside <strong>
        }
    }
});



async function fontfamilies() {
  try {
    const response = await fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk');
    const data = await response.json();
    const fontDropdown = document.getElementById("squareCraft-font-family");
    const selectedFontText = fontDropdown.querySelector("p");

    // Clear existing options
    const fontList = fontDropdown.querySelector('.font-list');
    if (fontList) fontList.remove();

    // Create new font list container
    const newFontList = document.createElement('div');
    newFontList.className = 'font-list';
    newFontList.style.position = 'absolute';
    newFontList.style.top = '100%';
    newFontList.style.left = '0';
    newFontList.style.width = '100%';
    newFontList.style.maxHeight = '200px';
    newFontList.style.overflowY = 'auto';
    newFontList.style.backgroundColor = '#2c2c2c';
    newFontList.style.border = '1px solid #585858';
    newFontList.style.borderRadius = '6px';
    newFontList.style.zIndex = '1000';
    newFontList.style.display = 'none';

    // Populate font options
    data.items.forEach(font => {
        const option = document.createElement('div');
        option.className = 'font-option';
        option.textContent = font.family;
        option.style.padding = '8px';
        option.style.cursor = 'pointer';
        option.style.fontFamily = font.family;
        option.style.color = 'white';
        option.style.fontSize = '14px';
        option.dataset.font = font.family;

        // Add hover effect
        option.addEventListener('mouseover', () => {
            option.style.backgroundColor = '#4a4a4a';
        });
        option.addEventListener('mouseout', () => {
            option.style.backgroundColor = 'transparent';
        });

        // Handle font selection
        option.addEventListener('click', async () => {
            if (!selectedElement) {
                console.warn("⚠️ Please select a block first");
                return;
            }

            const blockId = selectedElement.id;
            const selectedFont = font.family;
            
            // Create or update style tag for this block's strong tags
            let styleTag = document.getElementById(`style-${blockId}-strong-fontfamily`);
            if (!styleTag) {
                styleTag = document.createElement("style");
                styleTag.id = `style-${blockId}-strong-fontfamily`;
                document.head.appendChild(styleTag);
            }

            // Apply font-family to all strong tags within this block
            styleTag.innerHTML = `
                #${blockId} strong {
                    font-family: "${selectedFont}" !important;
                }
            `;

            // Save modifications
            const css = {
                "font-family": selectedFont
            };

            await saveModifications(blockId, css);
            console.log(`✅ Applied font-family: ${selectedFont} to all bold words in block: ${blockId}`);

            // Update selected font display
            selectedFontText.textContent = selectedFont;
            selectedFontText.style.fontFamily = selectedFont;
            newFontList.style.display = 'none';
        });

        newFontList.appendChild(option);
    });

    fontDropdown.appendChild(newFontList);

    // Toggle font list visibility
    fontDropdown.addEventListener('click', (e) => {
        if (e.target !== newFontList) {
            newFontList.style.display = newFontList.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Close font list when clicking outside
    document.addEventListener('click', (e) => {
        if (!fontDropdown.contains(e.target)) {
            newFontList.style.display = 'none';
        }
    });

} catch (error) {
    console.error("Error fetching fonts:", error);
}
}

fontfamilies();


  function attachEventListeners() {
    document.body.addEventListener("click", (event) => {
      let block = event.target.closest('[id^="block-"]');
      if (!block) return;

      if (selectedElement) selectedElement.style.outline = "";
      selectedElement = block;
      selectedElement.style.outline = "2px dashed #EF7C2F";

      console.log(`✅ Selected Element: ${selectedElement.id}`);
    });


  document
  .getElementById("squareCraftPublish")
  .addEventListener("click", async () => {
    if (!selectedElement) {
      console.warn("⚠️ No element selected.");
      return;
    }

    let css = {
      "font-family": document
        .getElementById("squareCraft-font-family")
        .querySelector("p").textContent,
      "font-weight": document.getElementById("squareCraftFontWeight").value, // Use selected font weight
      // "font-aligment-icon":
      //   document.document.querySelectorAll(".alignment-icon").value,
      "font-size":
        document.getElementById("squareCraftFontSize").value + "px",
      "line-height":
        document.getElementById("squareCraftLineHeight").value + "px",
      // "font-sizeText": document.getElementById("squareCraftFontSizeInput").value + "px",
       "text-decoration": document.document.querySelectorAll(".elements-font-style").value,
      // "text-decoration": textDecorationValue,
      "letter-spacing": document.querySelector('.squareCraft-Letter-spacing-input').value + "px",
      "text-transform": document.querySelectorAll(
        ".squsareCraft-text-transform"
      ).value,
    };

    await saveModifications(selectedElement.id, css);
    // await saveModifications(lastSelectedFontfamilyStrong.id, css);
      if (lastSelectedFontfamilyStrong && lastSelectedFontfamilyStrong.id) {
        // await saveModifications(lastSelectedFontfamilyStrong.id, css);
        await saveModifications(lastSelectedFontfamilyStrong.id, {
          "font-family": css["font-family"]
      });
    }

      if (lastSelectedFontWeightStrong && lastSelectedFontWeightStrong.id) {
        await saveModifications(lastSelectedFontWeightStrong.id, {
            "font-weight": css["font-weight"]
        });
    }

    if (lastSelectedLineHeightStrong && lastSelectedLineHeightStrong.id) {
      await saveModifications(lastSelectedLineHeightStrong.id, {
          "line-height": css["font-height"]
      });
    }

    if (lastSelectedTextTransformStrongElement && lastSelectedTextTransformStrongElement.id) {
      await saveModifications(lastSelectedTextTransformStrongElement.id, css);
    }
  });


  // font weight code start here

document.body.addEventListener("click", (event) => {
  let block = event.target.closest('[id^="block-"]');
  if (!block) return;

  if (selectedElement) selectedElement.style.outline = "";
  selectedElement = block;
  selectedElement.style.outline = "2px dashed #EF7C2F";

  // Find all strong elements within the clicked block
  const strongElements = block.querySelectorAll('strong');
  console.log(`✅ Selected Block: ${block.id} with ${strongElements.length} bold words`);
});


document.getElementById("squareCraftFontWeight").addEventListener("change", async function() {
  if (!selectedElement) {
      console.warn("⚠️ No block selected");
      return;
  }

  const selectedWeight = this.value;
  const blockId = selectedElement.id;

  // Create a style tag for this block's strong tags
  let styleTag = document.getElementById(`style-${blockId}-strong`);
  if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = `style-${blockId}-strong`;
      document.head.appendChild(styleTag);
  }

  // Apply font-weight to all strong tags within this block using CSS selector
  styleTag.innerHTML = `
      #${blockId} strong {
          font-weight: ${selectedWeight} !important;
      }
  `;

  // Save modifications using the block ID
  const css = {
      "font-weight": selectedWeight
  };

  await saveModifications(blockId, css);

  console.log(`✅ Applied font-weight: ${selectedWeight} to all bold words in block: ${blockId}`);
});

async function applySavedStyles() {
  const savedStyles = await fetchModifications();
  if (!savedStyles) return;

  savedStyles.forEach(style => {
      const blockId = style.elementId;
      const weight = style.css["font-weight"];
      
      if (weight) {
          let styleTag = document.getElementById(`style-${blockId}-strong`);
          if (!styleTag) {
              styleTag = document.createElement("style");
              styleTag.id = `style-${blockId}-strong`;
              document.head.appendChild(styleTag);
          }
          
          styleTag.innerHTML = `
              #${blockId} strong {
                  font-weight: ${weight} !important;
              }
          `;
      }
  });
}

window.addEventListener("load", async () => {
  await applySavedStyles();
});

// font family code start here
// document.getElementById("squareCraft-font-family").addEventListener("change", async function() {
//   if (!selectedElement) {
//       console.warn("⚠️ No block selected");
//       return;
//   }

//   const strongElements = selectedElement.querySelectorAll('strong');
//   if (strongElements.length === 0) {
//       console.warn("⚠️ No bold text found in the selected block");
//       return;
//   }

//   const selectedFont = this.value;
//   const css = { "font-family": selectedFont };

//   for (const strongElement of strongElements) {
//       if (!strongElement.id) {
//           strongElement.id = `font-family-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//       }

//       applyStylesToElement(strongElement.id, css);
//       await saveModifications(strongElement.id, css);
//   }

//   console.log(`✅ Applied font-family: ${selectedFont} to ${strongElements.length} bold words in block: ${selectedElement.id}`);
// });

// Modify the font-size change handler
document.getElementById("squareCraftFontSize").addEventListener("input", async function() {
  if (!selectedElement) {
      console.warn("⚠️ No block selected");
      return;
  }

  const strongElements = selectedElement.querySelectorAll('strong');
  if (strongElements.length === 0) {
      console.warn("⚠️ No bold text found in the selected block");
      return;
  }

  const fontSize = this.value + "px";
  const css = { "font-size": fontSize };

  for (const strongElement of strongElements) {
      if (!strongElement.id) {
          strongElement.id = `font-size-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      applyStylesToElement(strongElement.id, css);
      await saveModifications(strongElement.id, css);
  }

  console.log(`✅ Applied font-size: ${fontSize} to ${strongElements.length} bold words in block: ${selectedElement.id}`);
});


  // font weight code end here

    // Add this event listener for font-weight dropdown
    // document
    //   .getElementById("squareCraftFontWeight")
    //   .addEventListener("change", () => {
    //     if (selectedElement) {
    //       let css = {
    //         "font-weight": document.getElementById("squareCraftFontWeight")
    //           .value,
    //       };
    //       applyStylesToElement(selectedElement.id, css);
    //       saveModifications(selectedElement.id, css);
    //     }
    //   });

    document.querySelectorAll(".alignment-icon").forEach((icon) => {
      icon.addEventListener("click", async function () {
        if (!selectedElement) return;
        const alignment = this.getAttribute("data-align");
        let css = { "text-align": alignment };
        applyStylesToElement(selectedElement.id, css);
        await saveModifications(selectedElement.id, css);
        console.log(
          `:white_check_mark: Applied text alignment: ${alignment} to ${selectedElement.id}`
        );
      });
    });



    // Modify the text decoration handler
    document.querySelectorAll(".elements-font-style").forEach((btn) => {
      btn.addEventListener("click", async function() {
        if (!selectedElement) {
          console.warn("⚠️ No block selected");
          return;
        }

        const blockId = selectedElement.id;
        const styleType = this.dataset.style;
        
        // Create a style tag for this block's strong tags
        let styleTag = document.getElementById(`style-${blockId}-strong-textdecoration`);
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = `style-${blockId}-strong-textdecoration`;
          document.head.appendChild(styleTag);
        }

        // Apply text-decoration to all strong tags within this block using CSS selector
        let decorationValue = "none";
        if (styleType === "underline") {
          decorationValue = "underline";
        } else if (styleType === "dotted") {
          decorationValue = "underline dotted";
        } else if (styleType === "line-through") {
          decorationValue = "line-through";
        }

        styleTag.innerHTML = `
          #${blockId} strong {
            text-decoration: ${decorationValue} !important;
          }
        `;

        // Save modifications using the block ID
        const css = {
          "text-decoration": decorationValue
        };

        await saveModifications(blockId, css);

        console.log(`✅ Applied text-decoration: ${decorationValue} to all bold words in block: ${blockId}`);
      });
    });

    // Add reset functionality for text decoration
    const textDecorationResetButton = document.querySelector(
      ".squareCraft-rounded-6px.squareCraft-rotate-180.squareCraft-px-1_5.squsareCraft-font-style.squareCraft-cursor-pointer"
    );

    textDecorationResetButton.addEventListener("click", async function() {
      if (!selectedElement) {
        console.warn("⚠️ No block selected");
        return;
      }

      const blockId = selectedElement.id;
      
      // Remove the style tag or set text-decoration to none
      let styleTag = document.getElementById(`style-${blockId}-strong-textdecoration`);
      if (styleTag) {
        styleTag.innerHTML = `
          #${blockId} strong {
            text-decoration: none !important;
          }
        `;
      }

      // Save the reset state
      const css = {
        "text-decoration": "none"
      };

      await saveModifications(blockId, css);

      console.log(`🔄 Reset text decoration for all bold words in block: ${blockId}`);
    });

   


   
let pendingChanges = {
  fontSize: null,
  selectedText: null,
  selectedRange: null,
  container: null
};

function clearPendingChanges() {
  // Remove any temporary preview spans
  document.querySelectorAll('[id^="squareCraft-temp-"]').forEach(span => {
      if (span && span.parentNode) {
          // Only remove if it matches our pending changes
          if (pendingChanges.selectedText && span.textContent === pendingChanges.selectedText) {
              const textNode = document.createTextNode(span.textContent);
              span.parentNode.replaceChild(textNode, span);
          }
      }
  });

  // Reset pending changes object
  pendingChanges = {
      fontSize: null,
      selectedText: null,
      selectedRange: null,
      container: null
  };
}



//font-size start

  document.getElementById("squareCraftFontSize").addEventListener("input", async function() {
    if (!selectedElement) {
        console.warn("⚠️ No block selected");
        return;
    }

    const fontSize = this.value + "px";
    const blockId = selectedElement.id;

    // Create a style tag for this block's strong tags
    let styleTag = document.getElementById(`style-${blockId}-strong-fontsize`);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = `style-${blockId}-strong-fontsize`;
        document.head.appendChild(styleTag);
    }

    // Apply font-size to all strong tags within this block using CSS selector
    styleTag.innerHTML = `
        #${blockId} strong {
            font-size: ${fontSize} !important;
        }
    `;

    // Save modifications using the block ID
    const css = {
        "font-size": fontSize
    };

    await saveModifications(blockId, css);

    console.log(`✅ Applied font-size: ${fontSize} to all bold words in block: ${blockId}`);
  });

// font-size end



// text-color code start here

function initializeTextColor() {
  const colorInput = document.getElementById('squareCraftTextColor');
  const colorHexInput = document.getElementById('squareCraftColorHex');

  if (!colorInput || !colorHexInput) {
      console.warn("⚠️ Color input elements not found");
      return;
  }

  // Handle color input changes
  colorInput.addEventListener('input', async function() {
      if (!selectedElement) {
          console.warn("⚠️ Please select a block first");
          return;
      }

      const blockId = selectedElement.id;
      const selectedColor = this.value;

      // Create or update style tag for this block's strong tags
      let styleTag = document.getElementById(`style-${blockId}-strong-color`);
      if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = `style-${blockId}-strong-color`;
          document.head.appendChild(styleTag);
      }

      // Apply color to all strong tags within this block using CSS selector
      styleTag.innerHTML = `
          #${blockId} strong {
              color: ${selectedColor} !important;
          }
      `;

      // Update hex input
      colorHexInput.value = selectedColor.toUpperCase();

      // Save modifications
      const css = {
          "color": selectedColor
      };

      await saveModifications(blockId, css);
      console.log(`✅ Applied color: ${selectedColor} to all bold words in block: ${blockId}`);
  });

  // Handle hex input changes
  colorHexInput.addEventListener('input', async function() {
      if (!selectedElement) {
          console.warn("⚠️ Please select a block first");
          return;
      }

      const blockId = selectedElement.id;
      let selectedColor = this.value;

      // Ensure the color value starts with #
      if (!selectedColor.startsWith('#')) {
          selectedColor = '#' + selectedColor;
      }

      // Validate hex color
      if (!/^#[0-9A-F]{6}$/i.test(selectedColor)) {
          console.warn("⚠️ Invalid hex color format");
          return;
      }

      // Create or update style tag for this block's strong tags
      let styleTag = document.getElementById(`style-${blockId}-strong-color`);
      if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = `style-${blockId}-strong-color`;
          document.head.appendChild(styleTag);
      }

      // Apply color to all strong tags within this block using CSS selector
      styleTag.innerHTML = `
          #${blockId} strong {
              color: ${selectedColor} !important;
          }
      `;

      // Update color input
      colorInput.value = selectedColor;

      // Save modifications
      const css = {
          "color": selectedColor
      };

      await saveModifications(blockId, css);
      console.log(`✅ Applied color: ${selectedColor} to all bold words in block: ${blockId}`);
  });
}



initializeTextColor();


// text-color code end here




    let lastSelectedLineHeightStrong = null;

    document.addEventListener("mouseup", function() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
            let range = selection.getRangeAt(0);
            let container = range.commonAncestorContainer;
            
            // If the container is a text node, get its parent
            if (container.nodeType === Node.TEXT_NODE) {
                container = container.parentElement;
            }
            
            // Check if selection is within a strong tag
            const strongElement = container.closest('strong');
            if (strongElement) {
                lastSelectedLineHeightStrong = strongElement;
                console.log("✅ Selected text inside <strong> for line height:", strongElement.textContent);
            } else {
                lastSelectedLineHeightStrong = null;
            }
        }
    });


    document.getElementById("squareCraftLineHeight").addEventListener("input", async function() {
      const lineHeightValue = this.value;
      if (!lineHeightValue) {
          console.warn("⚠️ Please enter a valid line height value");
          return;
      }
  
      // Use either the last selected bold text or the currently selected element
      const targetElement = lastSelectedLineHeightStrong || selectedElement;
      
      if (!targetElement) {
          console.warn("⚠️ No element selected to apply line height");
          return;
      }
  
      // Ensure the element has an ID
      if (!targetElement.id) {
          targetElement.id = `line-height-${Date.now()}`;
      }
  
      // Apply line height with 'px' unit and !important
      const lineHeight = `${lineHeightValue}px`;
      
      // Create a style element with !important
      let styleTag = document.getElementById(`style-${targetElement.id}`);
      if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = `style-${targetElement.id}`;
          document.head.appendChild(styleTag);
      }
  
      // Apply styles with !important to both the target element and its paragraphs
      styleTag.innerHTML = `
          #${targetElement.id} { line-height: ${lineHeight} !important; }
      `;
  
      // Save modifications with !important
      let css = { 
          "line-height": `${lineHeight} !important`
      };
      
      await saveModifications(targetElement.id, css);
  
      // Force a reflow to ensure styles are applied
      targetElement.offsetHeight;
  
      // Apply styles to all paragraphs within the element
      const paragraphs = targetElement.getElementsByTagName('p');
      for (let p of paragraphs) {
          p.style.lineHeight = lineHeight;
      }
  
      console.log("✅ Applied line height:", lineHeight, "to element:", targetElement.id);
  });

    // Add this function to handle line height on page load
    function applyLineHeightOnLoad() {
      // Get all elements with line-height styles
      const styleTags = document.querySelectorAll('style[id^="style-"]');
      styleTags.forEach(styleTag => {
          const elementId = styleTag.id.replace('style-', '');
          const element = document.getElementById(elementId);
          if (element) {
              const computedStyle = window.getComputedStyle(element);
              const lineHeight = computedStyle.lineHeight;
              
              // Apply line height to all paragraphs within the element
              const paragraphs = element.getElementsByTagName('p');
              for (let p of paragraphs) {
                  p.style.lineHeight = lineHeight;
              }
          }
      });
    }

    // Add this to your existing window load event listener
    window.addEventListener("load", async () => {
      createWidget();
      setTimeout(makeWidgetDraggable, 500);
      setTimeout(attachEventListeners, 1500);
      await fetchModifications();
      // Add this line to apply line heights after modifications are fetched
      setTimeout(applyLineHeightOnLoad, 2000);
    });
    
    // letter spacing start
    
    function initializeLetterSpacing() {
      const letterSpacingInput = document.getElementById('squareCraftLetterSpacing');
      const letterSpacingDropdown = document.getElementById('squareCraftLetterSpacingDropdown');
      const letterSpacingOptions = document.getElementById('squareCraftLetterSpacingOptions');
    
      if (!letterSpacingInput || !letterSpacingDropdown || !letterSpacingOptions) {
        console.warn("⚠️ Letter spacing elements not found");
        return;
      }
    
      // Toggle dropdown visibility
      letterSpacingDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        letterSpacingOptions.classList.toggle('squareCraft-hidden');
      });
    
      // Handle option selection
      letterSpacingOptions.querySelectorAll('.squareCraft-dropdown-item').forEach(option => {
        option.addEventListener('click', async (e) => {
          const value = e.target.dataset.value;
          letterSpacingInput.value = value;
          letterSpacingOptions.classList.add('squareCraft-hidden');
          await applyLetterSpacing(value);
        });
      });
    
      // Handle manual input
      letterSpacingInput.addEventListener('input', async function() {
        await applyLetterSpacing(this.value);
      });
    
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        letterSpacingOptions.classList.add('squareCraft-hidden');
      });
    
      // Function to apply letter spacing
      async function applyLetterSpacing(value) {
        if (!selectedElement) {
          console.warn("⚠️ Please select a block first");
          return;
        }
    
        if (!value) return;
    
        const blockId = selectedElement.id;
        
        // Create or update style tag for this block's strong tags
        let styleTag = document.getElementById(`style-${blockId}-strong-letterspacing`);
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = `style-${blockId}-strong-letterspacing`;
          document.head.appendChild(styleTag);
        }
    
        // Apply letter spacing to all strong tags within this block
        styleTag.innerHTML = `
          #${blockId} strong {
            letter-spacing: ${value}px !important;
          }
        `;
    
        // Save modifications
        const css = {
          "letter-spacing": `${value}px`
        };
    
        await saveModifications(blockId, css);
        console.log(`✅ Applied letter spacing: ${value}px to all bold words in block: ${blockId}`);
      }
    }
    
    // Initialize letter spacing when DOM is loaded
    document.addEventListener("DOMContentLoaded", initializeLetterSpacing);
    
    // Also initialize when widget is created/updated
    function createWidget() {
      
      // Add this at the end of createWidget function
      setTimeout(initializeLetterSpacing, 100);
    }

    // letter spacing end



    // text-transform start

    // Modify the text-transform handler
    document.querySelectorAll(".squsareCraft-text-transform").forEach((textTransform) => {
      textTransform.addEventListener("click", async function() {
          if (!selectedElement) {
              console.warn("⚠️ No block selected");
              return;
          }

          const transform = this.getAttribute("data-transform");
          const blockId = selectedElement.id;

          // Create a style tag for this block's strong tags
          let styleTag = document.getElementById(`style-${blockId}-strong-texttransform`);
          if (!styleTag) {
              styleTag = document.createElement("style");
              styleTag.id = `style-${blockId}-strong-texttransform`;
              document.head.appendChild(styleTag);
          }

          // Apply text-transform to all strong tags within this block using CSS selector
          styleTag.innerHTML = `
              #${blockId} strong {
                  text-transform: ${transform} !important;
              }
          `;

          // Save modifications using the block ID
          const css = {
              "text-transform": transform
          };

          await saveModifications(blockId, css);

          console.log(`✅ Applied text-transform: ${transform} to all bold words in block: ${blockId}`);
      });
    });

    // Modify the text-transform reset button handler
    const undoButton = document.querySelector(
      ".squareCraft-rounded-6px.squareCraft-rotate-180.squareCraft-px-1_5.squsareCraft-text-transform.squareCraft-cursor-pointer"
    );

    undoButton.addEventListener("click", async function() {
      if (!selectedElement) {
          console.warn("⚠️ No block selected");
          return;
      }

      const blockId = selectedElement.id;
      
      // Remove the style tag or set text-transform to none
      let styleTag = document.getElementById(`style-${blockId}-strong-texttransform`);
      if (styleTag) {
          styleTag.innerHTML = `
              #${blockId} strong {
                  text-transform: none !important;
              }
          `;
      }

      // Save the reset state
      const css = {
          "text-transform": "none"
      };

      await saveModifications(blockId, css);

      console.log(`🔄 Reset text transform for all bold words in block: ${blockId}`);
    });
  

    // Reset text-transform
      // const undoButton = document.querySelector(
      //   ".squareCraft-rounded-6px.squareCraft-rotate-180.squareCraft-px-1_5.squsareCraft-text-transform.squareCraft-cursor-pointer"
      // );

    // text-transform end
    //   hover code start here
    const hoverButton = document.querySelector(
      ".squareCraft-cursor-pointer.squareCraft-bg-3f3f3f.squareCraft-hover"
    );
    hoverButton.addEventListener("click", function () {
      if (!selectedElement) {
        console.warn("⚠️ No element selected to apply hover effect.");
        return;
      }

      const elementId = selectedElement.id;
      if (!elementId) return;

      console.log("🎨 Hover mode activated for:", elementId);

      // Define the hover effect styles
      const hoverCSS = {
        "background-color": "#ff5733", // Change background color on hover
        transition: "background-color 0.3s ease-in-out",
      };

      // Remove old hover styles if any
      let existingHoverStyle = document.getElementById(
        `hover-style-${elementId}`
      );
      if (existingHoverStyle) existingHoverStyle.remove();

      // Create a new style element for hover effect
      const styleTag = document.createElement("style");
      styleTag.id = `hover-style-${elementId}`;
      styleTag.innerHTML = `
            #${elementId}:hover {
                background-color: ${hoverCSS["background-color"]} !important;
                transition: ${hoverCSS["transition"]};
            }
        `;
      document.head.appendChild(styleTag);

      // Save modifications to the backend
      saveModifications(elementId, { ":hover": hoverCSS });

      console.log("✨ Hover effect applied to:", elementId);
    });

    // Attach event listener to the reset button
    document
      .getElementById("squareCraftReset")
      .addEventListener("click", async () => {
        const confirmReset = confirm(
          "Are you sure you want to reset all modifications?"
        );
        if (confirmReset) {
          await resetModifications();
        }
      });

  }

  document.addEventListener("DOMContentLoaded", function () {
    createWidgetIcon();

    makeWidgetDraggable();
    function insertCustomAdminIcon() {
      const adminNavbar = document.querySelector("[data-test='editor-header']"); // Target the Squarespace admin navbar

      if (!adminNavbar) {
        console.warn("Admin navbar not found. Retrying...");
        setTimeout(insertCustomAdminIcon, 1000); // Retry in case the page hasn't fully loaded
        return;
      }

      if (document.getElementById("customAdminIcon")) return;

      const customIcon = document.createElement("img");
      customIcon.src = "https://i.ibb.co.com/VpxFTKBz/Group-29.jpg"; // Your icon URL
      customIcon.id = "customAdminIcon";
      customIcon.style.cursor = "pointer";
      customIcon.style.marginLeft = "15px"; // Adjust spacing
      customIcon.style.width = "32px"; // Icon size
      customIcon.style.height = "32px";

      customIcon.addEventListener("click", function () {
        alert("Custom Plugin Clicked!");
      });

      adminNavbar.appendChild(customIcon);
      console.log("✅ Custom admin icon added!");
    }

    insertCustomAdminIcon();
    function checkURL() {
      const currentURL = window.location.href;
      let widgetContainer = document.getElementById(
        "squarecraft-widget-container"
      );

      console.log("Current URL:", currentURL);

      if (currentURL.includes("/#")) {
        console.log("✅ Widget is VISIBLE on the Code Injection page.");

        if (!widgetContainer) {
          createWidget();
          setTimeout(() => {
            widgetContainer = document.getElementById(
              "squarecraft-widget-container"
            );
            if (widgetContainer) makeWidgetDraggable();
          }, 500);
        } else {
          widgetContainer.style.display = "block";
          makeWidgetDraggable();
        }
      } else {
        console.log("❌ Widget is HIDDEN on other pages.");
        if (widgetContainer) widgetContainer.style.display = "none";
      }
    }

    checkURL();
    setInterval(checkURL, 1000);
    setInterval(makeWidgetDraggable, 1000);

    createWidget();
    makeWidgetDraggable();
    attachEventListeners();
    fetchModifications();
    makeWidgetDraggable();

    // const fontSizeInput = document.getElementById("squareCraftFontSizeInput");
    // const dropdownArrow = document.getElementById("squareCraftFontSizeDropdown");
    // const dropdownOptions = document.getElementById("squareCraftFontSizeOptions");

    const fontSize = document.getElementById("squareCraftFontSize");
    const dropdownArrow = document.getElementById(
      "squareCraftFontSizeDropdown"
    );
    const dropdownOptions = document.getElementById(
      "squareCraftFontSizeOptions"
    );

    document.addEventListener("click", function (event) {
      if (
        !dropdownArrow.contains(event.target) &&
        !dropdownOptions.contains(event.target)
      ) {
        dropdownOptions.classList.add("squareCraft-hidden");
      }
    });

  });
})();
