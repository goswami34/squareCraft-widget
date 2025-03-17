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



// 1. First, modify the fetchModifications function to properly handle strong elements
// async function fetchModifications(retries = 3) {
//   if (!pageId) return;

//   const token = localStorage.getItem("squareCraft_auth_token");
//   const userId = localStorage.getItem("squareCraft_u_id");
//   const widgetId = localStorage.getItem("squareCraft_w_id");

//   if (!token || !userId) {
//       console.warn("Missing authentication data");
//       return;
//   }

//   try {
//       const response = await fetch(
//           `https://webefo-backend.onrender.com/api/v1/get-modifications?userId=${userId}&widgetId=${widgetId}`,
//           {
//               method: "GET",
//               headers: {
//                   "Content-Type": "application/json",
//                   "Authorization": `Bearer ${token}`,
//               }
//           }
//       );

//       if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Retrieved modifications:", data);

//       if (!data.modifications || !Array.isArray(data.modifications)) {
//           console.warn("No modifications found or invalid format");
//           return;
//       }

//       // Apply modifications for current page
//       data.modifications.forEach(mod => {
//           if (mod.pageId === pageId) {
//               mod.elements.forEach(elem => {
//                   // Handle both span and strong elements
//                   const cssData = elem.css?.span || elem.css?.strong;
//                   if (cssData) {
//                       const { id, ...styles } = cssData;
//                       const element = document.getElementById(elem.elementId);
                      
//                       if (element) {
//                           // Apply styles to existing element
//                           Object.entries(styles).forEach(([prop, value]) => {
//                               element.style[prop] = value;
//                           });
//                       } else if (elem.elementStructure) {
//                           // Recreate modified element if it doesn't exist
//                           recreateModifiedElement(elem.elementStructure, styles);
//                       }
//                   }
//               });
//           }
//       });

//   } catch (error) {
//       console.error("Error fetching modifications:", error);
//       if (retries > 0) {
//           console.log(`Retrying... (${retries} attempts left)`);
//           setTimeout(() => fetchModifications(retries - 1), 2000);
//       }
//   }
// }

// // 2. Modify recreateModifiedElement to better handle text-transform
// function recreateModifiedElement(structure, styles) {
//   const parentElement = structure.parentId ? 
//       document.getElementById(structure.parentId) : 
//       document.body;

//   if (!parentElement) return;

//   // First try to find existing element by ID
//   let element = document.getElementById(structure.id);
  
//   if (!element) {
//       // If no element exists, create new one
//       element = document.createElement(structure.type || 'span');
//       element.id = structure.id;
//       element.className = structure.className || 'squareCraft-font-modified';
//       element.textContent = structure.content;

//       // Find where to insert the element
//       if (structure.content) {
//           const textNodes = [];
//           const walker = document.createTreeWalker(
//               parentElement,
//               NodeFilter.SHOW_TEXT,
//               {
//                   acceptNode: function(node) {
//                       return node.textContent.includes(structure.content) ?
//                           NodeFilter.FILTER_ACCEPT :
//                           NodeFilter.FILTER_REJECT;
//                   }
//               },
//               false
//           );

//           let node;
//           while (node = walker.nextNode()) {
//               textNodes.push(node);
//           }

//           if (textNodes.length > 0) {
//               textNodes[0].parentNode.replaceChild(element, textNodes[0]);
//           }
//       }
//   }

//   // Apply styles to the element
//   if (element) {
//       Object.entries(styles).forEach(([prop, value]) => {
//           element.style[prop] = value;
//       });
//   }
// }

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
          `https://webefo-backend.onrender.com/api/v1/get-modifications?userId=${userId}&widgetId=${widgetId}`,
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
                  // Handle both span and strong elements
                  const cssData = elem.css?.span || elem.css?.strong;
                  if (cssData) {
                      const { id, ...styles } = cssData;
                      const element = document.getElementById(elem.elementId);
                      
                      if (element) {
                          // If element exists, apply styles directly
                          Object.entries(styles).forEach(([prop, value]) => {
                              element.style[prop] = value;
                          });
                      } else if (elem.elementStructure) {
                          // Recreate modified element if it doesn't exist
                          recreateModifiedElement(elem.elementStructure, styles);
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

// 3. Update saveModifications to include proper structure for text-transform
async function saveModifications(elementId, css, elementStructure = null) {
  if (!pageId || !elementId || !css) {
      console.warn("⚠️ Missing required data to save modifications.");
      return;
  }

  const element = document.getElementById(elementId);
  const isStrong = element?.tagName.toLowerCase() === 'strong';

  const modificationData = {
      userId,
      token,
      widgetId,
      modifications: [{
          pageId,
          elements: [{
              elementId,
              css: {
                  [isStrong ? 'strong' : 'span']: {
                      id: elementId,
                      ...css
                  }
              },
              elementStructure: elementStructure || {
                  type: isStrong ? 'strong' : 'span',
                  className: 'squareCraft-font-modified',
                  content: element?.textContent || '',
                  parentId: element?.parentElement?.id || null
              }
          }]
      }]
  };

  try {
      const response = await fetch("https://webefo-backend.onrender.com/api/v1/modifications", {
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

      // Immediately fetch modifications to update the UI
      await fetchModifications();
      
      return result;
  } catch (error) {
      console.error("❌ Error saving modifications:", error);
  }
}

// 4. Add a function to validate and clean up modifications
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
                 <div class="squareCraft-flex squareCraft-col-span-5 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                    <div
                       class="squareCraft-flex squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                       <img id="squareCraftTextAlignLeft" data-align="left"
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/alignment (1).svg"
                          class="squareCraft-cursor-pointer alignment-icon   squareCraft-mx-auto"  alt="">
                       <div class="squareCraft-v-line"></div>
                       <img id="squareCraftTextAlignRight" data-align="right"
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/alignment (3).svg"
                          class="squareCraft-cursor-pointer alignment-icon    squareCraft-mx-auto"  alt="">
                       <div class="squareCraft-v-line"></div>
                       <img id="squareCraftTextAlignCenter" data-align="center"
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/alignment (2).svg"
                          class="squareCraft-cursor-pointer alignment-icon    squareCraft-mx-auto"  alt="">
                       <div class="squareCraft-v-line"></div>
                       <img id="squareCraftTextAlignJustify" data-align="justify"
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/alignment (4).svg"
                          class="squareCraft-cursor-pointer alignment-icon    squareCraft-mx-auto "  alt="">
                    </div>
                 </div>
              </div>


              <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2">
                 <div class="squareCraft-flex squareCraft-col-span-6 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                    <div
                       class="squareCraft-flex squareCraft-px-2 squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                      <p class="squareCraft-font-bold squareCraft-universal squareCraft-text-sm squareCraft-cursor-pointer elements-font-style" data-style="bold">B</p>
                       <div class="squareCraft-v-line"></div>
                      <p  class="squareCraft-font-italic squareCraft-universal  squareCraft-text-sm squareCraft-cursor-pointer squareCraft-text-center squareCraft-mx-auto elements-font-style" data-style="italic">I</p>
                       <div class="squareCraft-v-line"></div>
                     <p class="squareCraft-font-underline squareCraft-universal squareCraft-text-sm squareCraft-cursor-pointer squareCraft-text-center squareCraft-mx-auto elements-font-style" data-style="underline">U</p>
                       <div class="squareCraft-v-line"></div> 
                       <p  class="squareCraft-font-underline squareCraft-universal squareCraft-text-sm squareCraft-cursor-pointer squareCraft-text-center squareCraft-mx-auto elements-font-style" data-style="dotted">abc</p>
                        <div class="squareCraft-v-line"></div> 
                       <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-px-1_5 squsareCraft-font-style squareCraft-cursor-pointer" width="12px"
                     src="https://fatin-webefo.github.io/squareCraft-plugin/public/dot.svg" alt="">
                    </div>
                 </div>
              </div>


              <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2">
                 <div class="squareCraft-flex squareCraft-col-span-6 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center">
                    <div class="squareCraft-flex squareCraft-poppins squareCraft-items-center squareCraft-justify-between squareCraft-w-full">
                        <div class="squareCraft-flex squareCraft-poppins squareCraft-items-center squareCraft-justify-between squareCraft-w-full">
                            <p class="squsareCraft-text-transform squareCraft-cursor-pointer" data-transform="uppercase">AG</p>
                            <div class="squareCraft-v-line"></div>
                            <p class="squsareCraft-text-transform squareCraft-cursor-pointer" data-transform="lowercase">ag</p>
                            <div class="squareCraft-v-line"></div>
                            <p class="squsareCraft-text-transform squareCraft-cursor-pointer" data-transform="capitalize">Ag</p>
                            <div class="squareCraft-v-line"></div>
                            <img class="squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-px-1_5 squsareCraft-text-transform squareCraft-cursor-pointer" width="12px" src="https://fatin-webefo.github.io/squareCraft-plugin/public/dot.svg" alt="">
                        </div>
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
        const emElement = parentElement.closest("em");
        
        if (emElement) {
          lastSelectedFontfamilyItalic = emElement;
            console.log("✅ Selected text inside <strong>: ", emElement.textContent);
        } else {
          lastSelectedFontfamilyItalic = null; // Reset if selection is outside <strong>
        }
    }
});



async function fontfamilies() {
  const response = await fetch(
    "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk"
  );
  const data = await response.json();

  const fontDropdown = document.getElementById("squareCraft-font-family");
  const fontWeightDropdown = document.getElementById("squareCraftFontWeight");

  if (!fontDropdown || !fontWeightDropdown) {
    console.error("Dropdown elements not found!");
    return;
  }

  fontDropdown.style.position = "relative";
  fontDropdown.style.width = "100%";
  fontDropdown.style.border = "1px solid #585858";
  fontDropdown.style.borderRadius = "6px";
  fontDropdown.style.background = "#2c2c2c";
  fontDropdown.style.color = "white";
  fontDropdown.style.display = "flex";
  fontDropdown.style.alignItems = "center";
  fontDropdown.style.justifyContent = "space-between";
  fontDropdown.style.cursor = "pointer";

  let selectedFontText = document.createElement("p");
  selectedFontText.textContent = "Select a Font";
  selectedFontText.style.flexGrow = "1";
  selectedFontText.style.fontSize = "14px";
  selectedFontText.classList.add("squareCraft-universal");

  const dropdownArrow = document.createElement("img");
  dropdownArrow.src =
    "https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg";
  dropdownArrow.style.width = "12px";
  dropdownArrow.style.height = "12px";
  dropdownArrow.style.transform = "rotate(180deg)";

  fontDropdown.appendChild(selectedFontText);
  fontDropdown.appendChild(dropdownArrow);

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

  // Populate font-family dropdown
  data.items.forEach((font) => {
    const option = document.createElement("div");
    option.textContent = font.family;
    option.style.padding = "8px";
    option.style.cursor = "pointer";
    option.style.fontFamily = font.family;
    option.style.transition = "background 0.3s";
    option.style.color = "white";
    option.style.fontSize = "14px";

    option.addEventListener("mouseover", () => {
      option.style.background = "#444";
    });

    option.addEventListener("mouseout", () => {
      option.style.background = "transparent";
    });

    // option.addEventListener("click", async () => {
    //   if (!selectedElement) {
    //     console.warn("⚠️ No element selected.");
    //     return;
    //   }

    //   let selectedFont = font.family;
    //   selectedFontText.textContent = selectedFont;
    //   selectedFontText.style.fontFamily = selectedFont;
    //   fontList.style.display = "none";

    //   // Apply font-family immediately
    //   let css = { "font-family": selectedFont };
    //   applyStylesToElement(lastSelectedFontfamilyStrong.id, css);

    //   // Save modifications immediately without waiting
    //   await saveModifications(lastSelectedFontfamilyStrong.id, css);

    //   console.log("🎨 Applied font:", selectedFont, "to", selectedElement.id);

    //   // Update font-weight dropdown dynamically
    //   updateFontWeightDropdown(font.variants);
    // });

    option.addEventListener("click", async () => {
      if (!lastSelectedFontfamilyItalic) {
          console.warn("⚠️ Please select bold text to apply font-family");
          return;
      }
  
      let selectedFont = font.family;
      selectedFontText.textContent = selectedFont;
      selectedFontText.style.fontFamily = selectedFont;
      fontList.style.display = "none";
  
      // Ensure the strong element has an ID
      if (!lastSelectedFontfamilyItalic.id) {
        lastSelectedFontfamilyItalic.id = `font-family-${Date.now()}`;
      }
  
      // Store the original text before applying styles
      const originalText = lastSelectedFontfamilyItalic.textContent;
  
      // Apply font-family to the strong element
      let css = { "font-family": selectedFont };
      applyStylesToElement(lastSelectedFontfamilyItalic.id, css);
  
      // Save modifications using your existing function
      await saveModifications(lastSelectedFontfamilyItalic.id, css);
  
      console.log("🎨 Applied font:", selectedFont, "to bold text:", originalText);
  
      // Update font-weight dropdown dynamically
      updateFontWeightDropdown(font.variants);
  });

    fontList.appendChild(option);
  });

  fontDropdown.appendChild(fontList);

  fontDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
    fontList.style.display =
      fontList.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", () => {
    fontList.style.display = "none";
  });

  // **Function to Update Font Weight Dropdown**
  function updateFontWeightDropdown(variants) {
    fontWeightDropdown.innerHTML = ""; // Clear existing options

    if (!variants || variants.length === 0) {
      console.warn("No font weights found for the selected font.");
      fontWeightDropdown.innerHTML = `<option value="400" selected>Regular (400)</option>`;
      return;
    }

    variants.forEach((variant) => {
      let weight = variant === "regular" ? "400" : variant; // Convert "regular" to 400
      let option = document.createElement("option");
      option.value = weight;
      option.textContent = `Weight ${weight}`;
      fontWeightDropdown.appendChild(option);
    });
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
      // "text-decoration": document.document.querySelectorAll(".elements-font-style").value,
      "text-decoration": textDecorationValue,
      "letter-spacing": document.querySelector('.squareCraft-Letter-spacing-input').value + "px",
      // "text-transform": document.querySelectorAll(
      //   ".squsareCraft-text-transform"
      // ).value,
      "text-transform": activeTransform || "none"
    };

    await saveModifications(selectedElement.id, css);
    // await saveModifications(lastSelectedFontfamilyStrong.id, css);
      if (lastSelectedFontfamilyItalic && lastSelectedFontfamilyItalic.id) {
        // await saveModifications(lastSelectedFontfamilyStrong.id, css);
        await saveModifications(lastSelectedFontfamilyItalic.id, {
          "font-family": css["font-family"]
      });
    }


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

    if (lastSelectedLineHeightStrong && lastSelectedLineHeightStrong.id) {
      await saveModifications(lastSelectedLineHeightStrong.id, {
          "line-height": css["font-height"]
      });
    }

    // if (lastSelectedTextTransformItalicElement && lastSelectedTextTransformItalicElement.id) {
    //   await saveModifications(lastSelectedTextTransformItalicElement.id, {
    //     "text-transform": css["text-transform"]
    //   });
    // }
  //   if (lastSelectedItalicForTransform && lastSelectedItalicForTransform.id) {
  //     const activeTransformButton = document.querySelector(".squsareCraft-text-transform.active");
  //     const transform = activeTransformButton ? activeTransformButton.getAttribute("data-transform") : "none";
      
  //     await saveModifications(lastSelectedItalicForTransform.id, {
  //         "text-transform": transform
  //     });
  // }

  if (lastSelectedTextTransformItalicElement && lastSelectedTextTransformItalicElement.id) {
    await saveModifications(lastSelectedTextTransformItalicElement.id, css);
  }
  });


  // font weight code start here
//   let lastSelectedFontWeightStrong = null;

//   // 2. Update the mouseup event listener to track bold text selection for font-weight
//   document.addEventListener("mouseup", function () {
//       const selection = window.getSelection();
      
//       if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
//           let range = selection.getRangeAt(0);
//           let parentElement = range.commonAncestorContainer;
  
//           // If the selected text is a text node, get its parent element
//           if (parentElement.nodeType === Node.TEXT_NODE) {
//               parentElement = parentElement.parentElement;
//           }
  
//           // Check if the parent or an ancestor is a <strong> tag
//           const strongElement = parentElement.closest("em");
          
//           if (strongElement) {
//               lastSelectedFontWeightStrong = strongElement;
//               console.log("✅ Selected text inside <strong> for font-weight: ", strongElement.textContent);
//           } else {
//               lastSelectedFontWeightStrong = null;
//           }
//       }
//   });


//   document.getElementById("squareCraftFontWeight").addEventListener("change", async function() {
//     if (!lastSelectedFontWeightStrong) {
//         console.warn("⚠️ Please select bold text to apply font-weight");
//         return;
//     }

//     // Ensure the strong element has an ID
//     if (!lastSelectedFontWeightStrong.id) {
//         lastSelectedFontWeightStrong.id = `font-weight-${Date.now()}`;
//     }

//     const selectedWeight = this.value;
//     let css = { "font-weight": selectedWeight };

//     // Apply styles to the strong element
//     applyStylesToElement(lastSelectedFontWeightStrong.id, css);

//     // Save modifications
//     await saveModifications(lastSelectedFontWeightStrong.id, css);

//     console.log("🎨 Applied font-weight:", selectedWeight, "to bold text:", lastSelectedFontWeightStrong.textContent);
//   });


//   // font weight code end here

//     // Add this event listener for font-weight dropdown
//     // document
//     //   .getElementById("squareCraftFontWeight")
//     //   .addEventListener("change", () => {
//     //     if (selectedElement) {
//     //       let css = {
//     //         "font-weight": document.getElementById("squareCraftFontWeight")
//     //           .value,
//     //       };
//     //       applyStylesToElement(selectedElement.id, css);
//     //       saveModifications(selectedElement.id, css);
//     //     }
//     //   });

//     document.querySelectorAll(".alignment-icon").forEach((icon) => {
//       icon.addEventListener("click", async function () {
//         if (!selectedElement) return;
//         const alignment = this.getAttribute("data-align");
//         let css = { "text-align": alignment };
//         applyStylesToElement(selectedElement.id, css);
//         await saveModifications(selectedElement.id, css);
//         console.log(
//           `:white_check_mark: Applied text alignment: ${alignment} to ${selectedElement.id}`
//         );
//       });
//     });

  

//     document.querySelectorAll(".elements-font-style").forEach((btn) => {
//       btn.addEventListener("click", function () {
//         if (!selectedElement) {
//           console.warn("⚠️ No element selected to apply text decoration.fsdsd");
//           return;
//         }

//         let styleType = this.dataset.style;
//         let css = {};

//         if (styleType === "bold") {
//           let currentWeight = parseInt(
//             window.getComputedStyle(selectedElement).fontWeight,
//             10
//           );
//           css["font-weight"] = currentWeight >= 700 ? "900" : "700";
//         } else if (styleType === "italic") {
//           let currentStyle = window.getComputedStyle(selectedElement).fontStyle;
//           css["font-style"] = currentStyle === "italic" ? "italic" : "italic";
//         } else {
//           let currentDecoration =
//             window.getComputedStyle(selectedElement).textDecorationLine;
//           if (styleType === "underline") {
//             css["text-decoration"] = currentDecoration.includes("underline")
//               ? "none"
//               : "underline";
//           } else if (styleType === "dotted") {
//             css["text-decoration"] = currentDecoration.includes("dotted")
//               ? "none"
//               : "underline dotted";
//           } else if (styleType === "line-through") {
//             css["text-decoration"] = currentDecoration.includes("line-through")
//               ? "none"
//               : "line-through";
//           }
//         }

//         applyStylesToElement(selectedElement.id, css);
//         saveModifications(selectedElement.id, css);
//       });
//     });

//     const fontStyleUndoButton = document.querySelector(
//       ".squareCraft-rounded-6px.squareCraft-rotate-180.squareCraft-px-1_5.squsareCraft-font-style.squareCraft-cursor-pointer"
//     );

//     fontStyleUndoButton.addEventListener("click", async function () {
//       if (!selectedElement) return;

//       // Reset font styles
//       let css = {
//         "font-weight": "400", // Reset to Regular (default)
//         "font-style": "normal", // Reset to normal (default)
//         "text-decoration": "none", // Remove underline, dotted, or line-through
//       };

//       // Apply styles to the selected element
//       applyStylesToElement(selectedElement.id, css);

//       // Save the reset modifications
//       await saveModifications(selectedElement.id, css);

//       console.log("🛑 Font styles reset for:", selectedElement.id);
//     });

   


   
// let pendingChanges = {
//   fontSize: null,
//   selectedText: null,
//   selectedRange: null,
//   container: null
// };

// function clearPendingChanges() {
//   // Remove any temporary preview spans
//   document.querySelectorAll('[id^="squareCraft-temp-"]').forEach(span => {
//       if (span && span.parentNode) {
//           // Only remove if it matches our pending changes
//           if (pendingChanges.selectedText && span.textContent === pendingChanges.selectedText) {
//               const textNode = document.createTextNode(span.textContent);
//               span.parentNode.replaceChild(textNode, span);
//           }
//       }
//   });

//   // Reset pending changes object
//   pendingChanges = {
//       fontSize: null,
//       selectedText: null,
//       selectedRange: null,
//       container: null
//   };
// }



// //font-size start
// let lastSelectedText = null;
// let lastSelectedRange = null;

// let styleCache = new Map();

// // Update the mouseup event listener to store selection info
// document.addEventListener("mouseup", function() {
//     const selection = window.getSelection();
//     if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
//         lastSelectedText = selection.toString();
//         lastSelectedRange = selection.getRangeAt(0);
        
//         // Get the containing element
//         let container = lastSelectedRange.commonAncestorContainer;
//         if (container.nodeType === Node.TEXT_NODE) {
//             container = container.parentElement;
//         }
        
//         // Store the current styles
//         if (container) {
//             const computedStyle = window.getComputedStyle(container);
//             styleCache.set(container, {
//                 fontSize: computedStyle.fontSize,
//                 originalText: lastSelectedText
//             });
//         }
        
//         console.log("✅ Text Selected:", lastSelectedText);
//     }
// });

// let fontSizeModifiedElements = new Set();



// // Font size change handler
// document.getElementById("squareCraftFontSize").addEventListener("input", async function() {
//     if (!lastSelectedRange || !lastSelectedText) {
//         console.warn("⚠️ No text selected");
//         return;
//     }

//     const fontSize = this.value + "px";
    
//     try {
//         // Get the common ancestor container
//         let container = lastSelectedRange.commonAncestorContainer;
        
//         // If the container is a text node, get its parent element
//         if (container.nodeType === Node.TEXT_NODE) {
//             container = container.parentElement;
//         }

//         // Check if the container or its parent is a strong tag
//         let targetElement = container.tagName === 'EM' ? container : 
//                            container.closest('em');

//         // If no strong tag found but text is selected, use the immediate parent
//         if (!targetElement && container) {
//             targetElement = container;
//         }

//         if (targetElement) {
//             // Generate a unique ID if none exists
//             if (!targetElement.id) {
//                 targetElement.id = `text-mod-${Date.now()}`;
//             }

//             // Store this element as having font-size modification
//             fontSizeModifiedElements.add(targetElement.id);

//             // Apply font size directly to the existing element
//             targetElement.style.fontSize = fontSize;

//             // Store the applied style in our cache
//             styleCache.set(targetElement, {
//                 fontSize: fontSize,
//                 originalText: lastSelectedText
//             });

//             // Create CSS for persistent styling
//             let css = {
//                 "font-size": fontSize
//             };

//             // Apply styles using your existing function
//             applyStylesToElement(targetElement.id, css);

//             // Save to database
//             await saveModifications(targetElement.id, css);

//             console.log("✅ Font size modified and saved:", fontSize);
//         }
//     } catch (error) {
//         console.error("❌ Error applying font size:", error);
//     }
// });


// // Add a click event listener to maintain styles
// document.addEventListener("click", function(event) {
//     // Check if we have cached styles for any parent elements
//     let element = event.target;
//     while (element && element !== document.body) {
//         if (styleCache.has(element)) {
//             const cachedStyle = styleCache.get(element);
//             if (cachedStyle.fontSize) {
//                 element.style.fontSize = cachedStyle.fontSize;
//             }
//         }
//         element = element.parentElement;
//     }
// });

// // Optional: Clean up cache periodically
// function cleanStyleCache() {
//     for (let [element, styles] of styleCache.entries()) {
//         if (!document.contains(element)) {
//             styleCache.delete(element);
//         }
//     }
// }

// // Clean cache every minute
// setInterval(cleanStyleCache, 60000);

// // font-size end



//     // document
//     //   .getElementById("squareCraftLineHeight")
//     //   .addEventListener("input", function () {
//     //     if (selectedElement) {
//     //       let lineHeight = this.value + "px";
//     //       let css = { "line-height": lineHeight };
//     //       applyStylesToElement(selectedElement.id, css);
//     //       saveModifications(selectedElement.id, css);
//     //     }
//     //   });


//     let lastSelectedLineHeightStrong = null;

//     document.addEventListener("mouseup", function() {
//         const selection = window.getSelection();
//         if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
//             let range = selection.getRangeAt(0);
//             let container = range.commonAncestorContainer;
            
//             // If the container is a text node, get its parent
//             if (container.nodeType === Node.TEXT_NODE) {
//                 container = container.parentElement;
//             }
            
//             // Check if selection is within a strong tag
//             const strongElement = container.closest('strong');
//             if (strongElement) {
//                 lastSelectedLineHeightStrong = strongElement;
//                 console.log("✅ Selected text inside <strong> for line height:", strongElement.textContent);
//             } else {
//                 lastSelectedLineHeightStrong = null;
//             }
//         }
//     });


//     document.getElementById("squareCraftLineHeight").addEventListener("input", async function() {
//       const lineHeightValue = this.value;
//       if (!lineHeightValue) {
//           console.warn("⚠️ Please enter a valid line height value");
//           return;
//       }
  
//       // Use either the last selected bold text or the currently selected element
//       const targetElement = lastSelectedLineHeightStrong || selectedElement;
      
//       if (!targetElement) {
//           console.warn("⚠️ No element selected to apply line height");
//           return;
//       }
  
//       // Ensure the element has an ID
//       if (!targetElement.id) {
//           targetElement.id = `line-height-${Date.now()}`;
//       }
  
//       // Apply line height with 'px' unit and !important
//       const lineHeight = `${lineHeightValue}px`;
      
//       // Create a style element with !important
//       let styleTag = document.getElementById(`style-${targetElement.id}`);
//       if (!styleTag) {
//           styleTag = document.createElement("style");
//           styleTag.id = `style-${targetElement.id}`;
//           document.head.appendChild(styleTag);
//       }
  
//       // Apply styles with !important to both the target element and its paragraphs
//       styleTag.innerHTML = `
//           #${targetElement.id} { line-height: ${lineHeight} !important; }
//       `;
  
//       // Save modifications with !important
//       let css = { 
//           "line-height": `${lineHeight} !important`
//       };
      
//       await saveModifications(targetElement.id, css);
  
//       // Force a reflow to ensure styles are applied
//       targetElement.offsetHeight;
  
//       // Apply styles to all paragraphs within the element
//       const paragraphs = targetElement.getElementsByTagName('p');
//       for (let p of paragraphs) {
//           p.style.lineHeight = lineHeight;
//       }
  
//       console.log("✅ Applied line height:", lineHeight, "to element:", targetElement.id);
//   });

//     // Add this function to handle line height on page load
//     function applyLineHeightOnLoad() {
//       // Get all elements with line-height styles
//       const styleTags = document.querySelectorAll('style[id^="style-"]');
//       styleTags.forEach(styleTag => {
//           const elementId = styleTag.id.replace('style-', '');
//           const element = document.getElementById(elementId);
//           if (element) {
//               const computedStyle = window.getComputedStyle(element);
//               const lineHeight = computedStyle.lineHeight;
              
//               // Apply line height to all paragraphs within the element
//               const paragraphs = element.getElementsByTagName('p');
//               for (let p of paragraphs) {
//                   p.style.lineHeight = lineHeight;
//               }
//           }
//       });
//     }

//     // Add this to your existing window load event listener
//     window.addEventListener("load", async () => {
//       createWidget();
//       setTimeout(makeWidgetDraggable, 500);
//       setTimeout(attachEventListeners, 1500);
//       await fetchModifications();
//       // Add this line to apply line heights after modifications are fetched
//       setTimeout(applyLineHeightOnLoad, 2000);
//     });
    
//     // letter spacing start
//     function initializeLetterSpacing() {
//       const letterSpacingContainer = document.querySelector('.squareCraft-Letter-spacing-container');
//       const letterSpacingDropdown = document.getElementById('squareCraftLetterSpacingDropdown');
//       const letterSpacingOptions = document.getElementById('squareCraftLetterSpacingOptions');
//       const letterSpacingInput = document.querySelector('.squareCraft-Letter-spacing-input');
  
//       if (!letterSpacingContainer || !letterSpacingDropdown || !letterSpacingOptions || !letterSpacingInput) {
//           console.warn("⚠️ Letter spacing elements not found");
//           return;
//       }
  
//       // Toggle dropdown visibility
//       letterSpacingDropdown.addEventListener('click', (e) => {
//           e.stopPropagation();
//           letterSpacingOptions.classList.toggle('squareCraft-hidden');
//       });
  
//       // Handle option selection
//       letterSpacingOptions.querySelectorAll('.squareCraft-dropdown-item').forEach(option => {
//           option.addEventListener('click', async (e) => {
//               const value = e.target.dataset.value;
//               letterSpacingInput.value = value;
//               letterSpacingOptions.classList.add('squareCraft-hidden');
  
//               if (selectedElement) {
//                   // Apply letter spacing to the selected block
//                   let css = { "letter-spacing": `${value}px` };
//                   applyStylesToElement(selectedElement.id, css);
                  
//                   // Save modifications
//                   await saveModifications(selectedElement.id, css);
                  
//                   console.log("🎨 Applied letter spacing:", value, "px to block:", selectedElement.id);
//               } else {
//                   console.warn("⚠️ Please select a block to apply letter spacing");
//               }
//           });
//       });
  
//       // Handle manual input
//       letterSpacingInput.addEventListener('input', async function() {
//           if (!selectedElement) {
//               console.warn("⚠️ Please select a block to apply letter spacing");
//               return;
//           }
  
//           const value = this.value;
//           if (!value) return;
  
//           // Apply letter spacing to the selected block
//           let css = { "letter-spacing": `${value}px` };
//           applyStylesToElement(selectedElement.id, css);
          
//           // Save modifications
//           await saveModifications(selectedElement.id, css);
          
//           console.log("🎨 Applied letter spacing:", value, "px to block:", selectedElement.id);
//       });
  
//       // Close dropdown when clicking outside
//       document.addEventListener('click', (e) => {
//           if (!letterSpacingContainer.contains(e.target)) {
//               letterSpacingOptions.classList.add('squareCraft-hidden');
//           }
//       });
//   }

//     document.addEventListener("DOMContentLoaded", function() {
//       initializeLetterSpacing();
//     });

//     // letter spacing end



    // text-transform start

  let lastSelectedTextTransformItalicElement = null;

  document.addEventListener("mouseup", function () {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
        let range = selection.getRangeAt(0);
        let container = range.commonAncestorContainer;

        // If the container is a text node, get its parent
        if (container.nodeType === Node.TEXT_NODE) {
            container = container.parentElement;
        }

        // Look for closest italic element
        let textTransformElement = container.closest("em, i"); // Now supports both <em> and <i>
        if (textTransformElement) {
            lastSelectedTextTransformItalicElement = textTransformElement;
            console.log("✅ Selected italic text:", textTransformElement.textContent);
        } else {
            lastSelectedTextTransformItalicElement = null;
        }
    }
});


   
  
    let activeTransform = null;

    document.addEventListener("click", async function (event) {
      let target = event.target.closest(".squsareCraft-text-transform");
  
      if (!target) return;
  
      if (!lastSelectedTextTransformItalicElement) {
          console.warn("⚠️ No italic text selected");
          return;
      }
  
      // Remove active class from all transform buttons
      document.querySelectorAll(".squsareCraft-text-transform").forEach(btn => {
          btn.classList.remove("active");
      });
  
      // If clicking the undo button (dot icon)
      let transform = "none";
      if (!target.classList.contains("squareCraft-rotate-180")) {
          transform = target.getAttribute("data-transform");
          if (!transform) {
              console.warn("⚠️ No data-transform attribute found.");
              return;
          }
          target.classList.add("active");
      }
  
      // Ensure the italic element has an ID
      if (!lastSelectedTextTransformItalicElement.id) {
          lastSelectedTextTransformItalicElement.id = `text-transform-${Date.now()}`;
      }
  
      let css = { "text-transform": transform };
      console.log("🎨 Applying text-transform:", css);
  
      // Apply styles to the italic element
      applyStylesToElement(lastSelectedTextTransformItalicElement.id, css);
  
      // Save modifications
      await saveModifications(lastSelectedTextTransformItalicElement.id, css);
  
      console.log(`✅ Applied ${transform} to italic text:`, lastSelectedTextTransformItalicElement.textContent);
  });
  

  
    const undoButton = document.querySelector(
        ".squareCraft-rounded-6px.squareCraft-rotate-180.squareCraft-px-1_5.squsareCraft-text-transform.squareCraft-cursor-pointer"
      );

      undoButton.addEventListener("click", async function() {
        if (!lastSelectedTextTransformItalicElement) {
            console.warn("⚠️ No bold text selected");
            return;
        }

        let css = { "text-transform": "none" };
        
        // Apply reset styles
        applyStylesToElement(lastSelectedTextTransformItalicElement.id, css);
        
        // Save the reset state
        await saveModifications(lastSelectedTextTransformItalicElement.id, css);
        
        console.log("🔄 Reset text transform for bold text:", lastSelectedTextTransformItalicElement.textContent);
      });

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
