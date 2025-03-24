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
    "https://fatin-webefo.github.io/squareCraft-plugin/src/styles/parent.css";
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
  if (!pageId) {
    console.warn("⚠️ No page ID found");
    return;
  }

  const token = localStorage.getItem("squareCraft_auth_token");
  const userId = localStorage.getItem("squareCraft_u_id");
  const widgetId = localStorage.getItem("squareCraft_w_id");

  if (!token || !userId || !widgetId) {
    console.warn("⚠️ Missing authentication data");
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
      console.warn("⚠️ No modifications found or invalid format");
      return;
    }

    // Apply modifications for current page
    data.modifications.forEach(mod => {
      if (mod.pageId === pageId) {
        mod.elements.forEach(elem => {
          // Check for anchor tag modifications
          const cssData = elem.css?.a;
          if (cssData) {
            const { id, ...styles } = cssData;
            const elementStructure = elem.elementStructure;
            
            
            // Find or create the element
            let targetElement = document.getElementById(elementStructure?.originalElementId || id);
            
            if (!targetElement && elementStructure) {
              // Create new anchor element if it doesn't exist
              targetElement = document.createElement('a');
              targetElement.id = elementStructure.originalElementId || id;
              targetElement.textContent = elementStructure.content;
              
              // Find the parent element
              const parentElement = elementStructure.parentId ? 
                document.getElementById(elementStructure.parentId) : 
                document.body;
              
              if (parentElement) {
                // Find the text node to replace
                const walker = document.createTreeWalker(
                  parentElement,
                  NodeFilter.SHOW_TEXT,
                  {
                    acceptNode: function(node) {
                      return node.textContent.includes(elementStructure.content) ?
                        NodeFilter.FILTER_ACCEPT :
                        NodeFilter.FILTER_REJECT;
                    }
                  }
                );
                
                let textNode;
                const textNodes = [];
                while (textNode = walker.nextNode()) {
                  textNodes.push(textNode);
                }
                
                if (textNodes.length > 0) {
                  const node = textNodes[0];
                  const parent = node.parentNode;
                  
                  // Check if already wrapped in anchor
                  if (parent.tagName === 'A') {
                    targetElement = parent;
                    if (!targetElement.id) {
                      targetElement.id = elementStructure.originalElementId || id;
                    }
                  } else {
                    node.parentNode.replaceChild(targetElement, node);
                  }
                }
              }
            }
            
            // Apply styles to the element
            if (targetElement) {
              // First remove any existing style tag
              const existingStyle = document.getElementById(`style-${targetElement.id}`);
              if (existingStyle) {
                existingStyle.remove();
              }

              // Apply new styles
              Object.entries(styles).forEach(([prop, value]) => {
                if (value) {
                  targetElement.style[prop] = value;
                }
              });

              // Create persistent styles
              applyStylesToElement(targetElement.id, styles);
              
              console.log(`✅ Styles applied to element ${targetElement.id}:`, styles);
            }
          }
        });
      }
    });

  } catch (error) {
    console.error("❌ Error fetching modifications:", error);
    if (retries > 0) {
      console.log(`🔄 Retrying... (${retries} attempts left)`);
      setTimeout(() => fetchModifications(retries - 1), 2000);
    }
  }
}

// Helper function to validate and clean modifications
function validateAndCleanModifications(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Remove duplicate style tags
  const styleTags = document.querySelectorAll(`style[id^="style-${elementId}"]`);
  if (styleTags.length > 1) {
    for (let i = 1; i < styleTags.length; i++) {
      styleTags[i].remove();
    }
  }

  // Clean up empty style tags
  const styleTag = document.getElementById(`style-${elementId}`);
  if (styleTag && styleTag.innerHTML.trim() === `#${elementId} { }`) {
    styleTag.remove();
  }
}

// Helper function to create style tag
function applyStylesToElement(elementId, styles) {
  if (!elementId || !styles) return;

  let styleTag = document.getElementById(`style-${elementId}`);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = `style-${elementId}`;
    document.head.appendChild(styleTag);
  }

  let cssText = `#${elementId} { `;
  Object.entries(styles).forEach(([prop, value]) => {
    if (value) {
      cssText += `${prop}: ${value} !important; `;
    }
  });
  cssText += "}";

  styleTag.innerHTML = cssText;
  console.log(`✅ Styles persisted for ${elementId}`);
}



function recreateModifiedElement(structure, styles) {
  const parentElement = structure.parentId ? 
      document.getElementById(structure.parentId) : 
      document.body;

  if (!parentElement) return;

  // First try to find existing element by ID
  let element = document.getElementById(structure.id);
  
  if (!element) {
      // Find the text node containing the content
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
          const textNode = textNodes[0];
          const parentNode = textNode.parentNode;
          
          // Check if the text is already wrapped in an em tag
          if (parentNode.tagName === 'A') {
              // Use the existing em tag
              element = parentNode;
              if (!element.id) {
                  element.id = structure.id;
              }
          } else {
              // Create new em tag only if not already wrapped
              element = document.createElement('a');
              element.id = structure.id;
              element.textContent = structure.content;
              textNode.parentNode.replaceChild(element, textNode);
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


async function saveModifications(elementId, css, elementStructure = null) {
  if (!pageId || !elementId || !css) {
    console.warn("⚠️ Missing required data to save modifications.");
    return;
  }

  const element = document.getElementById(elementId);
  
  // Generate a unique ID for this specific modification
  const uniqueId = `${elementId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const modificationData = {
    userId,
    token,
    widgetId,
    modifications: [{
      pageId,
      elements: [{
        elementId: uniqueId,
        css: {
          a: {
            id: uniqueId,
            ...css
          }
        },
        elementStructure: elementStructure || {
          type: 'a',
          content: element?.textContent || '',
          parentId: element?.parentElement?.id || null,
          originalElementId: elementId
        }
      }]
    }]
  };

  try {
    const response = await fetch("https://admin.squareplugin.com/api/v1/modifications", {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Changes Saved Successfully!", result);
    
    return result;
  } catch (error) {
    console.error("❌ Error saving modifications:", error);
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

                 <div class="squareCraft-flex squareCraft-col-span-6 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                      <div
                        class="squareCraft-flex squareCraft-px-2 squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                      
                        <p class="squareCraft-font-underline squareCraft-universal squareCraft-text-sm squareCraft-cursor-pointer squareCraft-text-center squareCraft-mx-auto elements-font-style" data-style="underline">U</p>
                        <div class="squareCraft-v-line"></div> 
                       
                        <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-px-1_5 squsareCraft-font-style squareCraft-cursor-pointer underline-element-font-style" width="12px"
                      src="https://fatin-webefo.github.io/squareCraft-plugin/public/dot.svg" alt="">
                      </div>
                  </div>

                  <div class="squareCraft-flex squareCraft-items-center squareCraft-justify-between">
                    <input type="number" id="squareCraftFontSize" pleaceholder="font-size" value="20" min="8" max="70" style="width: 80px; background-color: gray; color: white; border-radius: 4px; padding: 4px 10px 4px 4px;">

                    <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-px-1_5 squsareCraft-font-style squareCraft-cursor-pointer underline-element-font-size" width="12px"
                      src="https://fatin-webefo.github.io/squareCraft-plugin/public/dot.svg" alt="">
                  </div>
                 

              </div>
              

               <div style="margin:20px 10px;" class="squareCraft-flex squareCraft-items-center">
                <div>
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

                <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-px-1_5 squsareCraft-font-style squareCraft-cursor-pointer underline-element-font-weight" width="12px" src="https://fatin-webefo.github.io/squareCraft-plugin/public/dot.svg" alt="">
               </div>


              <div class="squareCraft-mt-2  squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 ">
                
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

  let lastSelectedFontfamilyItalic = null;

// document.addEventListener("mouseup", function () {
//     const selection = window.getSelection();
    
//     if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
//         let range = selection.getRangeAt(0);
//         let parentElement = range.commonAncestorContainer;

//         // If the selected text is a text node, get its parent element
//         if (parentElement.nodeType === Node.TEXT_NODE) {
//             parentElement = parentElement.parentElement;
//         }

//         // Check if the parent or an ancestor is a <strong> tag
//         const emElement = parentElement.closest("em");
        
//         if (emElement) {
//           lastSelectedFontfamilyItalic = emElement;
//             console.log("✅ Selected text inside <strong>: ", emElement.textContent);
//         } else {
//           lastSelectedFontfamilyItalic = null; // Reset if selection is outside <strong>
//         }
//     }
// });


// Selection Manager
const SelectionManager = {
  selectedParagraph: null,
  selectedLink: null,

  updateSelection(element) {
      const linkElement = element.closest('a');
      if (!linkElement) return;

      const paragraphElement = linkElement.closest('p');
      if (!paragraphElement) return;

      this.selectedParagraph = paragraphElement;
      this.selectedLink = linkElement;

      // Ensure all anchor tags in the paragraph have IDs
      const allAnchors = paragraphElement.querySelectorAll('a');
      allAnchors.forEach(anchor => {
          if (!anchor.id) {
              anchor.id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          }
      });

      console.log("✅ Selected:", {
          link: linkElement.textContent,
          paragraph: paragraphElement.textContent
      });
  },

  clear() {
      this.selectedParagraph = null;
      this.selectedLink = null;
  }
};



// Enhanced Style Manager
const StyleManager = {
  async applyStylesToParagraphAnchors(paragraphElement, styles) {
    if (!paragraphElement) return;

    const allAnchors = paragraphElement.querySelectorAll('a');
    if (!allAnchors.length) return;

    const modifications = [];

    for (const anchor of allAnchors) {
        // Ensure anchor has ID
        if (!anchor.id) {
            anchor.id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }

        // Get existing styles
        const existingStyles = this.getExistingStyles(anchor.id);

        // Merge new styles with existing styles, ensuring font-size is properly updated
        const mergedStyles = {
            ...existingStyles,
            ...styles
        };

        // Apply styles directly to the element
        Object.entries(styles).forEach(([prop, value]) => {
            if (value) {
                // Convert property name from kebab-case to camelCase for style application
                const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
                anchor.style[camelProp] = value;
            }
        });

        // Create or update style tag
        let styleTag = document.getElementById(`style-${anchor.id}`);
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = `style-${anchor.id}`;
            document.head.appendChild(styleTag);
        }

        let cssText = `#${anchor.id} { `;
        Object.entries(mergedStyles).forEach(([prop, value]) => {
            if (value) {
                cssText += `${prop}: ${value} !important; `;
            }
        });
        cssText += "}";
        styleTag.innerHTML = cssText;

        // Prepare modification for saving
        modifications.push({
            elementId: anchor.id,
            css: mergedStyles
        });
    }

    // Save all modifications
    for (const mod of modifications) {
        await saveModifications(mod.elementId, mod.css);
    }

    console.log(`✅ Styles applied to ${modifications.length} anchors in paragraph`);
},

getExistingStyles(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return {};

    const computedStyle = window.getComputedStyle(element);
    const relevantStyles = {};

    // List of style properties we want to track
    const trackProperties = [
        'font-size',
        'font-weight',
        'color',
        'text-decoration',
        'font-family'
    ];

    trackProperties.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && value !== 'initial' && value !== 'inherit') {
            relevantStyles[prop] = value;
        }
    });

    return relevantStyles;
}
};


function validateStyles(elementId, styles) {
  const element = document.getElementById(elementId);
  if (!element) return false;

  const computedStyle = window.getComputedStyle(element);
  let isValid = true;

  Object.entries(styles).forEach(([prop, value]) => {
      const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
      if (computedStyle[camelProp] !== value) {
          isValid = false;
      }
  });

  return isValid;
}

// Style Tracking System
const StyleTracker = {
  _styles: new Map(),

  setStyle(elementId, property, value) {
      if (!this._styles.has(elementId)) {
          this._styles.set(elementId, new Map());
      }
      this._styles.get(elementId).set(property, value);
  },

  getStyle(elementId, property) {
      if (!this._styles.has(elementId)) return null;
      return this._styles.get(elementId).get(property);
  },

  getAllStyles(elementId) {
      if (!this._styles.has(elementId)) return {};
      const styles = {};
      this._styles.get(elementId).forEach((value, prop) => {
          styles[prop] = value;
      });
      return styles;
  },

  clearStyles(elementId) {
      this._styles.delete(elementId);
  }
};



document.addEventListener("mouseup", function () {
  const selection = window.getSelection();
  
  if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
      let range = selection.getRangeAt(0);
      let parentElement = range.commonAncestorContainer;

      // If the selected text is a text node, get its parent element
      if (parentElement.nodeType === Node.TEXT_NODE) {
          parentElement = parentElement.parentElement;
      }

      // Check if the parent or an ancestor is an em tag
      const emElement = parentElement.closest("a");
      
      if (emElement) {
          // Generate a unique ID for this selection
          if (!emElement.id) {
              emElement.id = `a-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          }
          lastSelectedFontfamilyItalic = emElement;
          console.log("✅ Selected text inside <a>: ", emElement.textContent);
      } else {
          lastSelectedFontfamilyItalic = null;
      }
  }
});



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
      
      "font-weight": document.getElementById("squareCraftFontWeight").value, // Use selected font weight
      // "font-aligment-icon":
      //   document.document.querySelectorAll(".alignment-icon").value,
      "font-size":
        document.getElementById("squareCraftFontSize").value + "px",
      "line-height":
        document.getElementById("squareCraftLineHeight").value + "px",
      // "font-sizeText": document.getElementById("squareCraftFontSizeInput").value + "px",
      // "text-decoration": document.document.querySelectorAll(".elements-font-style").value,
      "text-decoration": textDecorationValue,
      "letter-spacing": document.querySelector('.squareCraft-Letter-spacing-input').value + "px",
      // "text-transform": document.querySelectorAll(
      //   ".squsareCraft-text-transform"
      // ).value,
      "color": document.getElementById("squareCraftTextColor").value,
      "text-transform": activeTransform || "none"
    };

    await saveModifications(selectedElement.id, css);
     
    if (lastSelectedItalicElementForFontSize && lastSelectedItalicElementForFontSize.id) {
      await saveModifications(lastSelectedItalicElement.id, {
          "font-size": document.getElementById("squareCraftFontSize").value + "px"
      });
  }

      if (lastSelectedFontWeightStrong && lastSelectedFontWeightStrong.id) {
        await saveModifications(lastSelectedFontWeightStrong.id, {
            "font-weight": css["font-weight"]
        });
    }

    if (lastSelectedUnderlineElement && lastSelectedUnderlineElement.id) {
      await saveModifications(lastSelectedUnderlineElement.id, {
          "text-decoration": css["text-decoration"]
      });
  }

    if (lastSelectedLink && lastSelectedLink.id) {
      await saveModifications(lastSelectedLink.id, {
          "color": css["color"]
      });
  }


  
  });


  // font weight code start here
  let lastSelectedFontWeightStrong = null;

  

  document.body.addEventListener("click", (event) => {
    let block = event.target.closest('[id^="block-"]');
    if (!block) {
        // Clicking outside - preserve existing styles
        if (selectedElement) {
            selectedElement.style.outline = "";
        }
        return;
    }

    // Store previous styles before changing selection
    if (selectedElement && selectedElement !== block) {
        // Preserve existing styles before switching
        const existingStyles = window.getComputedStyle(selectedElement);
        const stylesToKeep = {};
        ['font-size', 'font-weight', 'text-decoration', 'color'].forEach(prop => {
            if (existingStyles[prop]) {
                stylesToKeep[prop] = existingStyles[prop];
            }
        });
        applyStylesToElement(selectedElement.id, stylesToKeep);
    }

    // Update selection
    if (selectedElement) selectedElement.style.outline = "";
    selectedElement = block;
    selectedElement.style.outline = "2px dashed #EF7C2F";

    // Reapply stored styles to any modified elements within the block
    const modifiedElements = block.querySelectorAll('[id^="a-"]');
    modifiedElements.forEach(element => {
        const storedStyles = getStoredStyles(element.id);
        if (storedStyles) {
            applyStylesToElement(element.id, storedStyles);
        }
    });
});


// Style storage system
const styleStorage = new Map();

function storeStyles(elementId, styles) {
    styleStorage.set(elementId, styles);
}

function getStoredStyles(elementId) {
    return styleStorage.get(elementId);
}

// Modify the applyStylesToElement function
function applyStylesToElement(elementId, css) {
    if (!elementId || !css) return;
    
    // Store styles for future reference
    storeStyles(elementId, css);
    
    let styleTag = document.getElementById(`style-${elementId}`);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = `style-${elementId}`;
        document.head.appendChild(styleTag);
    }

    let cssText = `#${elementId} { `;
    Object.entries(css).forEach(([prop, value]) => {
        if (value) {
            cssText += `${prop}: ${value} !important; `;
        }
    });
    cssText += "}";

    styleTag.innerHTML = cssText;
}



// Track selected elements and parent paragraph
let selectedParagraph = null;
let lastSelectedLink = null;

// Modified selection tracking
// document.addEventListener("mouseup", function() {
//     const selection = window.getSelection();
//     if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
//         let range = selection.getRangeAt(0);
//         let container = range.commonAncestorContainer;
        
//         // If the container is a text node, get its parent element
//         if (container.nodeType === Node.TEXT_NODE) {
//             container = container.parentElement;
//         }
        
//         // Find the closest anchor tag and its parent paragraph
//         const linkElement = container.closest('a');
//         if (linkElement) {
//             const paragraphElement = linkElement.closest('p');
//             if (paragraphElement) {
//                 selectedParagraph = paragraphElement;
//                 lastSelectedLink = linkElement;
                
//                 // Ensure all anchor tags within the paragraph have IDs
//                 const allAnchors = paragraphElement.querySelectorAll('a');
//                 allAnchors.forEach(anchor => {
//                     if (!anchor.id) {
//                         anchor.id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//                     }
//                 });
                
//                 console.log("✅ Link and paragraph selected:", {
//                     linkText: linkElement.textContent,
//                     paragraphId: paragraphElement.id
//                 });
//             }
//         } else {
//             selectedParagraph = null;
//             lastSelectedLink = null;
//         }
//     }
// });

document.addEventListener("mouseup", function() {
  const selection = window.getSelection();
  if (!selection.rangeCount || selection.toString().trim().length === 0) {
      SelectionManager.clear();
      return;
  }

  let container = selection.getRangeAt(0).commonAncestorContainer;
  if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentElement;
  }

  SelectionManager.updateSelection(container);
});


// Modified function to apply styles to all anchors in a paragraph
async function applyStylesToAllAnchors(paragraphElement, css) {
  if (!paragraphElement) return;
  
  const allAnchors = paragraphElement.querySelectorAll('a');
  const modifications = [];
  
  for (const anchor of allAnchors) {
      // Ensure anchor has an ID
      if (!anchor.id) {
          anchor.id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      
      // Apply styles to this anchor
      applyStylesToElement(anchor.id, css);
      
      // Prepare modification for saving
      modifications.push({
          elementId: anchor.id,
          css: css
      });
  }
  
  // Save all modifications
  for (const mod of modifications) {
      await saveModifications(mod.elementId, mod.css);
  }
  
  console.log(`✅ Styles applied to ${modifications.length} anchors in paragraph`);
}

// Font size handler
// document.getElementById("squareCraftFontSize").addEventListener("input", async function() {
//   if (!SelectionManager.selectedParagraph || !SelectionManager.selectedLink) {
//       console.warn("⚠️ Please select a link first");
//       return;
//   }

//   const fontSize = this.value + "px";
//   await StyleManager.applyStylesToParagraphAnchors(SelectionManager.selectedParagraph, {
//       "font-size": fontSize
//   });
// });

//Font size handler with continuous update support
//Enhanced font size handler
document.getElementById("squareCraftFontSize").addEventListener("input", async function() {
  if (!SelectionManager.selectedParagraph || !SelectionManager.selectedLink) {
      console.warn("⚠️ Please select text within a link first");
      return;
  }

  // Get the new font size value
  const newSize = parseInt(this.value);
  
  // Validate the font size
  if (isNaN(newSize) || newSize < 8 || newSize > 70) {
      console.warn("⚠️ Invalid font size value");
      return;
  }

  // Get all anchor tags in the selected paragraph
  const allAnchors = SelectionManager.selectedParagraph.querySelectorAll('a');
  
  // Apply the new font size to all anchors
  for (const anchor of allAnchors) {
      // Ensure anchor has an ID
      if (!anchor.id) {
          anchor.id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Apply the font size directly to the element
      anchor.style.fontSize = `${newSize}px`;

      // Create or update the style tag
      let styleTag = document.getElementById(`style-${anchor.id}`);
      if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = `style-${anchor.id}`;
          document.head.appendChild(styleTag);
      }

      // Get existing styles
      const existingStyles = StyleManager.getExistingStyles(anchor.id);
      const updatedStyles = {
          ...existingStyles,
          'font-size': `${newSize}px`
      };

      // Apply updated styles
      let cssText = `#${anchor.id} { `;
      Object.entries(updatedStyles).forEach(([prop, value]) => {
          if (value) {
              cssText += `${prop}: ${value} !important; `;
          }
      });
      cssText += "}";
      styleTag.innerHTML = cssText;

      // Save the modification
      await saveModifications(anchor.id, updatedStyles);
  }

  console.log(`✅ Font size ${newSize}px applied to all links in paragraph`);
});



// Font weight handler
document.getElementById("squareCraftFontWeight").addEventListener("change", async function() {
  if (!SelectionManager.selectedParagraph || !SelectionManager.selectedLink) {
      console.warn("⚠️ Please select a link first");
      return;
  }

  const weight = this.value;
  await StyleManager.applyStylesToParagraphAnchors(SelectionManager.selectedParagraph, {
      "font-weight": weight
  });
});

// Text color handler
document.getElementById("squareCraftTextColor").addEventListener("input", async function() {
  if (!SelectionManager.selectedParagraph || !SelectionManager.selectedLink) {
      console.warn("⚠️ Please select a link first");
      return;
  }

  const color = this.value;
  document.getElementById("squareCraftColorHex").value = color.toUpperCase();
  
  await StyleManager.applyStylesToParagraphAnchors(SelectionManager.selectedParagraph, {
      "color": color
  });
});

// Text decoration handler
document.querySelectorAll(".elements-font-style").forEach(btn => {
  btn.addEventListener("click", async function() {
      if (!SelectionManager.selectedParagraph || !SelectionManager.selectedLink) {
          console.warn("⚠️ Please select a link first");
          return;
      }

      const styleType = this.dataset.style;
      if (styleType === "underline") {
          await StyleManager.applyStylesToParagraphAnchors(SelectionManager.selectedParagraph, {
              "text-decoration": "none"
          });
      }
  });
});

// Restore underline handler
document.querySelector(".underline-element-font-style").addEventListener("click", async function() {
  if (!SelectionManager.selectedParagraph || !SelectionManager.selectedLink) {
      console.warn("⚠️ Please select a link first");
      return;
  }

  await StyleManager.applyStylesToParagraphAnchors(SelectionManager.selectedParagraph, {
      "text-decoration": "underline"
  });
});

function cleanupStyles(paragraphElement) {
  if (!paragraphElement) return;

  const allAnchors = paragraphElement.querySelectorAll('a');
  allAnchors.forEach(anchor => {
      const styleTag = document.getElementById(`style-${anchor.id}`);
      if (styleTag) {
          styleTag.remove();
      }
  });
}

// Reset styles for all anchors in a paragraph
async function resetStylesForParagraph(paragraphElement, propertyToReset) {
  if (!paragraphElement) return;
  
  const allAnchors = paragraphElement.querySelectorAll('a');
  const modifications = [];
  
  for (const anchor of allAnchors) {
      // Remove the specified style property
      anchor.style.removeProperty(propertyToReset);
      
      // Get remaining styles
      const currentStyles = {};
      const computedStyle = window.getComputedStyle(anchor);
      Object.keys(computedStyle).forEach(key => {
          if (key !== propertyToReset && computedStyle[key] !== '') {
              currentStyles[key] = computedStyle[key];
          }
      });
      
      // Apply remaining styles and save
      applyStylesToElement(anchor.id, currentStyles, [propertyToReset]);
      modifications.push({
          elementId: anchor.id,
          css: currentStyles
      });
  }
  
  // Save all modifications
  for (const mod of modifications) {
      await saveModifications(mod.elementId, mod.css);
  }
  
  console.log(`✅ Style ${propertyToReset} reset for ${modifications.length} anchors`);
}



 
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
