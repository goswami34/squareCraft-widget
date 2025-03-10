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

  // function applyStylesToElement(elementId, css) {
  //   if (!elementId || !css) return;

  //   let styleTag = document.getElementById(`style-${elementId}`);
  //   if (!styleTag) { // Only create a new style if it doesn’t exist
  //     styleTag = document.createElement("style");
  //     styleTag.id = `style-${elementId}`;
  //     document.head.appendChild(styleTag);
  // }

  //   styleTag = document.createElement("style");
  //   styleTag.id = `style-${elementId}`;
  //   document.head.appendChild(styleTag);

  //   let cssText = `#${elementId}, #${elementId} h1, #${elementId} h2, #${elementId} h3, #${elementId} h4, #${elementId} h5, #${elementId} p, #${elementId} span { `;

  //   Object.keys(css).forEach(prop => {
  //       cssText += `${prop}: ${css[prop]} !important; `;
  //   });
  //   cssText += "}";

  //   if (css["border-radius"]) {
  //     cssText += `#${elementId} { overflow: hidden !important; }`;
  //   }

  //   styleTag.innerHTML = cssText;
  //   appliedStyles.add(elementId);
  //   console.log(`:white_check_mark: Styles Persisted for ${elementId}`);
  // }

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

  

  // async function fetchModifications(retries = 3) {
  //     if (!pageId) return;

  //     try {
  //         const response = await fetch(
  //             `https://webefo-backend.vercel.app/api/v1/get-modifications?userId=${userId}`,
  //             {
  //                 method: "GET",
  //                 headers: {
  //                     "Content-Type": "application/json",
  //                     "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
  //                 },
  //             }
  //         );

  //         const data = await response.json();
  //         console.log("📥 Retrieved Data from Database:", data);

  //         if (!data.modifications || data.modifications.length === 0) {
  //             console.warn("⚠️ No saved styles found for this page.");
  //             return;
  //         }

  //         // Loop through retrieved styles and apply them
  //         data.modifications.forEach(({ pageId: storedPageId, elements }) => {
  //             if (storedPageId === pageId) {
  //                 elements.forEach(({ elementId, css, elementStructure }) => {
  //                     let element = document.getElementById(elementId);

  //                     if (!element && elementStructure && elementStructure.type === 'span') {
  //                         // If element is missing, find it dynamically
  //                         element = findTextNodeByContent(document.body, elementStructure.content);
  //                         if (element) {
  //                             let span = document.createElement('span');
  //                             span.id = elementId;
  //                             span.className = elementStructure.className;
  //                             span.innerHTML = elementStructure.content;
  //                             Object.assign(span.style, css);
  //                             element.parentNode.replaceChild(span, element);
  //                         }
  //                     }

  //                     if (element) {
  //                         // Apply the stored CSS
  //                         applyStylesToElement(element.id, css);
  //                         console.log(`✅ Applied saved styles to ${element.id}`);
  //                     }
  //                 });
  //             }
  //         });

  //     } catch (error) {
  //         console.error("❌ Error Fetching Modifications:", error);
  //         if (retries > 0) {
  //             console.log(`🔄 Retrying fetch... (${retries} attempts left)`);
  //             setTimeout(() => fetchModifications(retries - 1), 2000);
  //         }
  //     }
  // }

  async function fetchModifications(retries = 3) {
    if (!pageId) return;

    try {
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

        const data = await response.json();
        console.log("📥 Retrieved Data from Database:", data);

        if (!data.modifications || data.modifications.length === 0) {
            console.warn("⚠️ No saved styles found for this page.");
            return;
        }

        // Loop through retrieved styles and apply them
        data.modifications.forEach(({ pageId: storedPageId, elements }) => {
            if (storedPageId === pageId) {
                elements.forEach(({ elementId, css, elementStructure }) => {
                    // Check if we have span-specific CSS
                    if (css && css.span) {
                        let existingSpan = document.getElementById(css.span.id);
                        
                        if (!existingSpan && elementStructure) {
                            // Find text nodes containing our content
                            const walker = document.createTreeWalker(
                                document.body,
                                NodeFilter.SHOW_TEXT,
                                {
                                    acceptNode: function(node) {
                                        return node.textContent.includes(elementStructure.content)
                                            ? NodeFilter.FILTER_ACCEPT
                                            : NodeFilter.FILTER_REJECT;
                                    }
                                }
                            );

                            let textNode;
                            while (textNode = walker.nextNode()) {
                                if (textNode.textContent.includes(elementStructure.content)) {
                                    // Create new span
                                    const span = document.createElement('span');
                                    span.id = css.span.id;
                                    span.className = elementStructure.className || 'squareCraft-font-modified';
                                    span.textContent = elementStructure.content;

                                    // Apply stored CSS properties
                                    Object.entries(css.span).forEach(([prop, value]) => {
                                        if (prop !== 'id') {
                                            span.style[prop] = value;
                                        }
                                    });

                                    // Replace text node with our span
                                    textNode.parentNode.replaceChild(span, textNode);
                                    console.log(`✅ Recreated span with ID ${span.id} and applied styles`);
                                    break;
                                }
                            }
                        } else if (existingSpan) {
                            // Apply styles to existing span
                            Object.entries(css.span).forEach(([prop, value]) => {
                                if (prop !== 'id') {
                                    existingSpan.style[prop] = value;
                                }
                            });
                            console.log(`✅ Applied styles to existing span ${existingSpan.id}`);
                        }
                    }
                });
            }
        });

    } catch (error) {
        console.error("❌ Error Fetching Modifications:", error);
        if (retries > 0) {
            console.log(`🔄 Retrying fetch... (${retries} attempts left)`);
            setTimeout(() => fetchModifications(retries - 1), 2000);
        }
    }
}

// async function fetchModifications(retries = 3) {
//     if (!pageId) return;

//     try {
//         const response = await fetch(
//             `https://webefo-backend.vercel.app/api/v1/get-modifications?userId=${userId}`,
//             {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
//                 },
//             }
//         );

//         const data = await response.json();
//         console.log("📥 Retrieved Data from Database:", data);

//         if (!data.modifications || data.modifications.length === 0) {
//             console.warn("⚠️ No saved styles found for this page.");
//             return;
//         }

//         // Loop through retrieved styles and apply them
//         data.modifications.forEach(({ pageId: storedPageId, elements }) => {
//             if (storedPageId === pageId) {
//                 elements.forEach(({ elementId, css, elementStructure }) => {
//                     if (css && css.span && elementStructure) {
//                         // Find or create parent element
//                         let parentElement = elementStructure.parentId ? 
//                             document.getElementById(elementStructure.parentId) : 
//                             document.querySelector(`${elementStructure.parentTagName || 'p'}:contains("${elementStructure.content}")`);

//                         if (parentElement) {
//                             // If we have the full content, restore it first
//                             if (elementStructure.fullContent) {
//                                 // Temporarily store the full content
//                                 const tempDiv = document.createElement('div');
//                                 tempDiv.innerHTML = elementStructure.fullContent;
                                
//                                 // Find the specific text to modify
//                                 const textToModify = elementStructure.content;
//                                 const regex = new RegExp(textToModify, 'g');
                                
//                                 // Replace the text with the styled span
//                                 tempDiv.innerHTML = tempDiv.innerHTML.replace(regex, `<span id="${css.span.id}" class="${elementStructure.className}">${textToModify}</span>`);
                                
//                                 // Update the parent element
//                                 parentElement.innerHTML = tempDiv.innerHTML;
                                
//                                 // Apply styles to the span
//                                 const span = document.getElementById(css.span.id);
//                                 if (span) {
//                                     Object.entries(css.span).forEach(([prop, value]) => {
//                                         if (prop !== 'id') {
//                                             span.style[prop] = value;
//                                         }
//                                     });
//                                 }
                                
//                                 console.log(`✅ Restored content and applied styles to ${css.span.id}`);
//                             }
//                         }
//                     }
//                 });
//             }
//         });

//     } catch (error) {
//         console.error("❌ Error Fetching Modifications:", error);
//         if (retries > 0) {
//             setTimeout(() => fetchModifications(retries - 1), 2000);
//         }
//     }
// }

// Add this before the fetchModifications function
Document.prototype.querySelector = (function(querySelector) {
    return function(selector) {
        if (selector.includes(':contains')) {
            const [tagName, text] = selector.split(':contains(');
            const searchText = text.slice(1, -2); // Remove quotes and closing parenthesis
            
            const elements = this.getElementsByTagName(tagName || '*');
            for (let element of elements) {
                if (element.textContent.includes(searchText)) {
                    return element;
                }
            }
            return null;
        }
        return querySelector.call(this, selector);
    };
})(Document.prototype.querySelector);

  // Listen for changes in edit mode
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

  // async function saveModifications(elementId, css, elementStructure = null) {
  //     if (!pageId || !elementId || !css) {
  //         console.warn(":warning: Missing required data to save modifications.");
  //         return;
  //     }

  //     // Apply styles immediately
  //     applyStylesToElement(elementId, css);
  //     console.log(":satellite_antenna: Saving modifications for:", { pageId, elementId, css, elementStructure });

  //     const modificationData = {
  //         userId,
  //         token,
  //         widgetId,
  //         modifications: [{
  //             pageId,
  //             elements: [{
  //                 elementId,
  //                 css,
  //                 elementStructure
  //             }]
  //         }]
  //     };

  //     try {
  //         const response = await fetch("https://webefo-backend.vercel.app/api/v1/modifications", {
  //             method: "POST",
  //             headers: {
  //                 "Content-Type": "application/json",
  //                 "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
  //                 "userId": userId,
  //                 "pageId": pageId,
  //                 "widget-id": widgetId,
  //             },
  //             body: JSON.stringify(modificationData),
  //         });

  //         console.log(":white_check_mark: Changes Saved Successfully!", await response.json());
  //     } catch (error) {
  //         console.error(":x: Error saving modifications:", error);
  //     }
  // }

  // async function saveModifications(elementId, css, elementStructure = null) {
  //     if (!pageId || !elementId || !css) {
  //         console.warn(":warning: Missing required data to save modifications.");
  //         return;
  //     }

  //     console.log(":satellite_antenna: Saving modifications for:", { pageId, elementId, css, elementStructure });

  //     const modificationData = {
  //         userId,
  //         token,
  //         widgetId,
  //         modifications: [{
  //             pageId,
  //             elements: [{
  //                 elementId,
  //                 css,
  //                 elementStructure
  //             }]
  //         }]
  //     };

  //     try {
  //         const response = await fetch("https://webefo-backend.vercel.app/api/v1/modifications", {
  //             method: "POST",
  //             headers: {
  //                 "Content-Type": "application/json",
  //                 "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
  //                 "userId": userId,
  //                 "pageId": pageId,
  //                 "widget-id": widgetId,
  //             },
  //             body: JSON.stringify(modificationData),
  //         });

  //         console.log(":white_check_mark: Changes Saved Successfully!", await response.json());
  //     } catch (error) {
  //         console.error(":x: Error saving modifications:", error);
  //     }
  // }

  async function saveModifications(elementId, css, elementStructure = null) {
    if (!pageId || !elementId || !css) {
        console.warn("⚠️ Missing required data to save modifications.");
        return;
    }

    // Create the proper structure for span elements
    const modificationData = {
        userId,
        token,
        widgetId,
        modifications: [{
            pageId,
            elements: [{
                elementId,
                css: {
                    span: {
                        id: elementId,
                        ...css
                    }
                },
                elementStructure: elementStructure || {
                    type: 'span',
                    className: 'squareCraft-font-modified',
                    content: document.getElementById(elementId)?.textContent || '',
                    parentId: document.getElementById(elementId)?.parentElement?.id || null
                }
            }]
        }]
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

        const result = await response.json();
        console.log("✅ Changes Saved Successfully!", result);
        return result;
    } catch (error) {
        console.error("❌ Error saving modifications:", error);
    }
}

// async function saveModifications(elementId, css, elementStructure = null) {
//     if (!pageId || !elementId || !css) {
//         console.warn("⚠️ Missing required data to save modifications.");
//         return;
//     }

//     // Get the parent paragraph content
//     const element = document.getElementById(elementId);
//     const parentParagraph = element?.closest('p') || element?.parentElement;
//     const fullContent = parentParagraph?.innerHTML || '';

//     // Create the proper structure for span elements
//     const modificationData = {
//         userId,
//         token,
//         widgetId,
//         modifications: [{
//             pageId,
//             elements: [{
//                 elementId,
//                 css: {
//                     span: {
//                         id: elementId,
//                         ...css
//                     }
//                 },
//                 elementStructure: {
//                     type: 'span',
//                     className: 'squareCraft-font-modified',
//                     content: document.getElementById(elementId)?.textContent || '',
//                     parentId: parentParagraph?.id || null,
//                     fullContent: fullContent,
//                     parentTagName: parentParagraph?.tagName?.toLowerCase() || 'p'
//                 }
//             }]
//         }]
//     };

//     try {
//         const response = await fetch("https://webefo-backend.vercel.app/api/v1/modifications", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
//                 "userId": userId,
//                 "pageId": pageId,
//                 "widget-id": widgetId,
//             },
//             body: JSON.stringify(modificationData),
//         });

//         const result = await response.json();
//         console.log("✅ Changes Saved Successfully!", result);
//         return result;
//     } catch (error) {
//         console.error("❌ Error saving modifications:", error);
//     }
// }

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
              
                

                 <div class="squareCraft-flex squareCraft-justify-between squareCraft-col-span-4  squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-items-center ">
                    <div class="squareCraft-flex squareCraft-mx-auto squareCraft-items-center squareCraft-justify-center">
                       <img class=" squareCraft-rounded-6px squareCraft-rotate-180" width="12px"
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/dot.svg" alt="">
                    </div>
                      <div class="squareCraft-v-line"></div>
                    <div class="squareCraft-flex squareCraft-mx-auto squareCraft-items-center squareCraft-justify-center squareCraft-border squareCraft-border-585858 squareCraft-w-13px squareCraft-border-solid squareCraft-h-13px">
                    </div>
                      <div class="squareCraft-v-line"></div>
                    <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-flex squareCraft-mx-auto squareCraft-items-center squareCraft-justify-center" width="12px"
                       src="https://fatin-webefo.github.io/squareCraft-plugin/public/gap.svg" alt="">
                 </div>
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


                 <div class="squareCraft-flex squareCraft-text-color-white squareCraft-justify-between squareCraft-col-span-3 
                    squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 
                    squareCraft-items-center squareCraft-w-full ">
                    <div class="squareCraft-Letter-spacing-container squareCraft-flex squareCraft-justify-between squareCraft-items-center squareCraft-flex squareCraft-items-center squareCraft-border 
                       squareCraft-border-solid squareCraft-border-3d3d3d  squareCraft-rounded-6px 
                       ">
                       <input type="text" id="squareCraftLineHeight" value="15" class="squareCraft-Letter-spacing-input squareCraft-font-light squareCraft-text-sm squareCraft-text-color-white 
                          squareCraft-bg-transparent squareCraft-w-full  squareCraft-py-1px squareCraft-font-light">
                       <div class="">
                          <img id="squareCraftLetterSpacingDropdown"
                             src="https://fatin-webefo.github.io/squareCraft-plugin/public/line-spacing.svg"
                             class=" squareCraft-px-1 squareCraft-ml-1 squareCraft-mx-auto squareCraft-cursor-pointer" >
                       </div>
                    </div>
                    <div id="squareCraftLetterSpacingOptions" class="squareCraft-hidden squareCraft-h-44 squareCraft-font-sm squareCraft-bg-3f3f3f squareCraft-w-20
                       squareCraft-rounded-6px squareCraft-border squareCraft-border-585858 squareCraft-absolute 
                       squareCraft-mt-1">
                       ${LetterSpacing?.map(
                         (gap) => `
                       <div class="squareCraft-dropdown-item squareCraft-py-1px squareCraft-text-center  squareCraft-text-sm"
                          data-value="${gap}">${gap}</div>
                       `
                       ).join("")}
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

      option.addEventListener("click", async () => {
        if (!selectedElement) {
          console.warn("⚠️ No element selected.");
          return;
        }

        let selectedFont = font.family;
        selectedFontText.textContent = selectedFont;
        selectedFontText.style.fontFamily = selectedFont;
        fontList.style.display = "none";

        // Apply font-family immediately
        let css = { "font-family": selectedFont };
        applyStylesToElement(selectedElement.id, css);

        // Save modifications immediately without waiting
        saveModifications(selectedElement.id, css);

        console.log("🎨 Applied font:", selectedFont, "to", selectedElement.id);

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
          "font-aligment-icon":
            document.document.querySelectorAll(".alignment-icon").value,
          "font-size":
            document.getElementById("squareCraftFontSize").value + "px",
          "line-height":
            document.getElementById("squareCraftLineHeight").value + "px",
          // "font-sizeText": document.getElementById("squareCraftFontSizeInput").value + "px",
          // "text-decoration": document.document.querySelectorAll(".elements-font-style").value,
          "text-decoration": textDecorationValue,
          "text-transform": document.querySelectorAll(
            ".squsareCraft-text-transform"
          ).value,
        };

        await saveModifications(selectedElement.id, css);
      });

    // Add this event listener for font-weight dropdown
    document
      .getElementById("squareCraftFontWeight")
      .addEventListener("change", () => {
        if (selectedElement) {
          let css = {
            "font-weight": document.getElementById("squareCraftFontWeight")
              .value,
          };
          applyStylesToElement(selectedElement.id, css);
          saveModifications(selectedElement.id, css);
        }
      });

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

    // Font style (Bold, Italic, Underline, etc.)
    document.querySelectorAll(".elements-font-style").forEach((btn) => {
      btn.addEventListener("click", function () {
        if (!selectedElement) {
          console.warn("⚠️ No element selected to apply text decoration.fsdsd");
          return;
        }

        let styleType = this.dataset.style;
        let css = {};

        if (styleType === "bold") {
          let currentWeight = parseInt(
            window.getComputedStyle(selectedElement).fontWeight,
            10
          );
          css["font-weight"] = currentWeight >= 700 ? "900" : "700";
        } else if (styleType === "italic") {
          let currentStyle = window.getComputedStyle(selectedElement).fontStyle;
          css["font-style"] = currentStyle === "italic" ? "italic" : "italic";
        } else {
          let currentDecoration =
            window.getComputedStyle(selectedElement).textDecorationLine;
          if (styleType === "underline") {
            css["text-decoration"] = currentDecoration.includes("underline")
              ? "none"
              : "underline";
          } else if (styleType === "dotted") {
            css["text-decoration"] = currentDecoration.includes("dotted")
              ? "none"
              : "underline dotted";
          } else if (styleType === "line-through") {
            css["text-decoration"] = currentDecoration.includes("line-through")
              ? "none"
              : "line-through";
          }
        }

        applyStylesToElement(selectedElement.id, css);
        saveModifications(selectedElement.id, css);
      });
    });

    const fontStyleUndoButton = document.querySelector(
      ".squareCraft-rounded-6px.squareCraft-rotate-180.squareCraft-px-1_5.squsareCraft-font-style.squareCraft-cursor-pointer"
    );

    fontStyleUndoButton.addEventListener("click", async function () {
      if (!selectedElement) return;

      // Reset font styles
      let css = {
        "font-weight": "400", // Reset to Regular (default)
        "font-style": "normal", // Reset to normal (default)
        "text-decoration": "none", // Remove underline, dotted, or line-through
      };

      // Apply styles to the selected element
      applyStylesToElement(selectedElement.id, css);

      // Save the reset modifications
      await saveModifications(selectedElement.id, css);

      console.log("🛑 Font styles reset for:", selectedElement.id);
    });

    // document.getElementById("squareCraftFontSize").addEventListener("input", function () {
    //     if (selectedElement) {
    //         let fontSize = this.value + "px";

    //         span = document.createElement("span");
    //         span.style.fontSize = fontSize;
    //         span.innerHTML = selectedElement.toString(); // Wrap the selected text
    //         span.classList.add("squareCraft-font-modified");

    //         selectedElement.deleteContents(); // Remove original text
    //         selectedElement.insertNode(span); // Insert wrapped text with new font size

    //         console.log(`📝 Applied font-size ${fontSize} to selected text.`);
    //         // Ensure span has a unique ID for saving
    //         if (!span.id) {
    //             span.id = `squareCraft-mod-${Date.now()}`; // Assign unique ID
    //         }

    //         // **Save the modification to database**
    //         let css = { "font-size": fontSize };
    //         applyStylesToElement(span.id, css); // Apply styles persistently
    //         saveModifications(span.id, css); // Save changes
    //         }
    // });

    // let selectedTextRange = null;

    // document.addEventListener("mouseup", function () {
    //     let selection = window.getSelection();
    //     if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
    //         selectedTextRange = selection.getRangeAt(0);
    //         console.log("✅ Text Selected:", selection.toString());
    //     }
    // });

    // document.getElementById("squareCraftFontSize").addEventListener("input", async function() {
    //     if (selectedTextRange) {
    //         let fontSize = this.value + "px";

    //         // Create a span element
    //         let span = document.createElement("span");
    //         span.id = `squareCraft-mod-${Date.now()}`; // Ensure unique ID
    //         span.style.fontSize = fontSize;
    //         span.classList.add("squareCraft-font-modified");
    //         span.innerHTML = selectedTextRange.toString();

    //         // Get parent element before replacing content
    //         let parentElement = selectedTextRange.startContainer.parentElement;

    //         // Replace selected text with the new span
    //         selectedTextRange.deleteContents();
    //         selectedTextRange.insertNode(span);

    //         console.log(`📝 Applied font-size ${fontSize} to selected text.`);

    //         // **Store the span structure**
    //         const elementStructure = {
    //             type: 'span',
    //             className: 'squareCraft-font-modified',
    //             content: span.innerHTML,
    //             parentId: parentElement.id // Store the parent ID
    //         };

    //         // **Save the modification to the database**
    //         saveModifications(span.id, { "font-size": fontSize }, elementStructure);
    //     }
    // });

    // Add this at the top level of your script with other variables
    let lastSelectedText = null;
    let lastSelectedRange = null;

    // Update the mouseup event listener
    document.addEventListener("mouseup", function () {
      const selection = window.getSelection();
      if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
        lastSelectedText = selection.toString();
        lastSelectedRange = selection.getRangeAt(0);
        console.log("✅ Text Selected:", lastSelectedText);
      }
    });

    // Update the font size event listener
    // document.getElementById("squareCraftFontSize").addEventListener("input", async function() {
    //     if (!lastSelectedRange || !lastSelectedText) {
    //         console.warn("⚠️ No text selected");
    //         return;
    //     }

    //     const fontSize = this.value + "px";

    //     try {
    //         // Create span element
    //         const span = document.createElement("span");
    //         span.id = `squareCraft-mod-${Date.now()}`;
    //         span.className = "squareCraft-font-modified";

    //         // Get parent element info
    //         const parentElement = lastSelectedRange.commonAncestorContainer.parentElement;
    //         const parentId = parentElement ? parentElement.id : null;

    //         // Create element structure
    //         const elementStructure = {
    //             type: 'span',
    //             className: 'squareCraft-font-modified',
    //             content: lastSelectedText,
    //             parentId: parentId
    //         };

    //         // Apply styles
    //         span.style.fontSize = fontSize;

    //         // Replace selected text with span
    //         lastSelectedRange.deleteContents();
    //         lastSelectedRange.insertNode(span);
    //         span.textContent = lastSelectedText;

    //         // Save to database
    //         await saveModifications(
    //             span.id,
    //             { "font-size": fontSize },
    //             elementStructure
    //         );

    //         console.log("✅ Font size modified and saved:", fontSize);
    //     } catch (error) {
    //         console.error("❌ Error applying font size:", error);
    //     }
    // });

    // document.getElementById("squareCraftFontSize").addEventListener("input", async function () {
    //     if (!lastSelectedRange || !lastSelectedText) {
    //         console.warn("⚠️ No text selected");
    //         return;
    //     }

    //     const fontSize = this.value + "px";

    //     try {
    //         const span = document.createElement("span");
    //         span.id = `squareCraft-mod-${Date.now()}`;
    //         span.className = "squareCraft-font-modified";
    //         span.style.fontSize = fontSize;
    //         span.textContent = lastSelectedText;

    //         const parentElement = lastSelectedRange.commonAncestorContainer.parentElement;
    //         const parentId = parentElement ? parentElement.id : null;

    //         // Create element structure
    //         const elementStructure = {
    //             type: 'span',
    //             className: 'squareCraft-font-modified',
    //             content: lastSelectedText,
    //             parentId: parentId
    //         };

    //         lastSelectedRange.deleteContents();
    //         lastSelectedRange.insertNode(span);

    //         // Save to database
    //         await saveModifications(
    //             span.id,
    //             { "span": { "id": span.id, "font-size": fontSize } },
    //             elementStructure
    //         );

    //         console.log("✅ Font size modified and saved:", fontSize);
    //     } catch (error) {
    //         console.error("❌ Error applying font size:", error);
    //     }
    // });

    // document.getElementById("squareCraftFontSize").addEventListener("input", async function() {
    //     if (!lastSelectedRange || !lastSelectedText) {
    //         console.warn("⚠️ No text selected");
    //         return;
    //     }
    
    //     const fontSize = this.value + "px";
        
    //     try {
    //         // Create span element
    //         const span = document.createElement("span");
    //         span.id = `squareCraft-mod-${Date.now()}`;
    //         span.className = "squareCraft-font-modified";
    //         span.style.fontSize = fontSize;
    //         span.textContent = lastSelectedText;
    
    //         // Get parent element info
    //         const parentElement = lastSelectedRange.commonAncestorContainer.parentElement;
    //         const parentId = parentElement ? parentElement.id : null;
    
    //         // Create element structure
    //         const elementStructure = {
    //             type: 'span',
    //             className: 'squareCraft-font-modified',
    //             content: lastSelectedText,
    //             parentId: parentId
    //         };
    
    //         // Replace selected text with span
    //         lastSelectedRange.deleteContents();
    //         lastSelectedRange.insertNode(span);
    
    //         // Save to database with proper structure
    //         await saveModifications(
    //             span.id,
    //             { "font-size": fontSize },
    //             elementStructure
    //         );
    
    //         console.log("✅ Font size modified and saved:", fontSize);
    //     } catch (error) {
    //         console.error("❌ Error applying font size:", error);
    //     }
    // });

    document.getElementById("squareCraftFontSize").addEventListener("input", async function() {
        if (!lastSelectedRange || !lastSelectedText) {
            console.warn("⚠️ No text selected");
            return;
        }
    
        const fontSize = this.value + "px";
        
        try {
            // Get the parent paragraph or containing element
            const container = lastSelectedRange.commonAncestorContainer.parentElement;
            
            // Store the full content before modification
            const fullContent = container.innerHTML;
            
            // Create span element
            const span = document.createElement("span");
            span.id = `squareCraft-mod-${Date.now()}`;
            span.className = "squareCraft-font-modified";
            span.style.fontSize = fontSize;
            span.textContent = lastSelectedText;
    
            // Create element structure with context
            const elementStructure = {
                type: 'span',
                className: 'squareCraft-font-modified',
                content: lastSelectedText,
                parentId: container.id,
                fullContent: fullContent,
                startOffset: lastSelectedRange.startOffset,
                endOffset: lastSelectedRange.endOffset
            };
    
            // Replace selected text with span
            lastSelectedRange.deleteContents();
            lastSelectedRange.insertNode(span);
    
            // Save to database with proper structure
            await saveModifications(
                span.id,
                { "font-size": fontSize },
                elementStructure
            );
    
            console.log("✅ Font size modified and saved:", fontSize);
        } catch (error) {
            console.error("❌ Error applying font size:", error);
        }
    });

    document
      .getElementById("squareCraftLineHeight")
      .addEventListener("input", function () {
        if (selectedElement) {
          let lineHeight = this.value + "px";
          let css = { "line-height": lineHeight };
          applyStylesToElement(selectedElement.id, css);
          saveModifications(selectedElement.id, css);
        }
      });

    document
      .querySelectorAll(".squsareCraft-text-transform")
      .forEach((textTransform) => {
        textTransform.addEventListener("click", async function () {
          if (!selectedElement) return;
          const transform = this.getAttribute("data-transform");
          let css = { "text-transform": transform };
          applyStylesToElement(selectedElement.id, css);
          await saveModifications(selectedElement.id, css);
        });
      });

    const undoButton = document.querySelector(
      ".squareCraft-rounded-6px.squareCraft-rotate-180.squareCraft-px-1_5.squsareCraft-text-transform.squareCraft-cursor-pointer"
    );

    undoButton.addEventListener("click", async function () {
      if (!selectedElement) return;

      // Remove text-transform property by setting it to 'none'
      let css = { "text-transform": "none" };

      // Apply styles to the element
      applyStylesToElement(selectedElement.id, css);

      // Remove saved modifications for text-transform
      await saveModifications(selectedElement.id, css);

      console.log("🛑 Text transform removed for:", selectedElement.id);
    });

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

    //   document.getElementById("squareCraftFontSizeInput").addEventListener("input", function () {
    //     if (selectedElement) {
    //         let fontSize = this.value + "px";
    //         let css = { "font-size": fontSize };
    //         applyStylesToElement(selectedElement.id, css);
    //         saveModifications(selectedElement.id, css);
    //     }
    // });
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

    document.body.addEventListener("click", (event) => {
      let block = event.target.closest('[id^="block-"]');
      if (!block) return;

      if (selectedElement) {
        selectedElement.style.fontSize = fontSizes + "px";
      }

      selectedElement = block;
      selectedElement.style.outline = "2px dashed #EF7C2F";

      let computedFontSize = window.getComputedStyle(selectedElement).fontSize;
      fontSizeInput.value = parseInt(computedFontSize, 10);
    });

    dropdownArrow.addEventListener("click", function (event) {
      event.stopPropagation();
      dropdownOptions.classList.toggle("squareCraft-hidden");
    });

    dropdownOptions.addEventListener("click", function (event) {
      if (event.target.classList.contains("squareCraft-dropdown-item")) {
        fontSizeInput.value = event.target.dataset.value;
        dropdownOptions.classList.add("squareCraft-hidden");

        if (selectedElement) {
          let css = { "font-size": `${event.target.dataset.value}px` };
          applyStylesToElement(selectedElement.id, css);
          saveModifications(selectedElement.id, css);
        }
      }
    });

    document.addEventListener("click", function (event) {
      if (
        !dropdownArrow.contains(event.target) &&
        !dropdownOptions.contains(event.target)
      ) {
        dropdownOptions.classList.add("squareCraft-hidden");
      }
    });

    fontSizeInput.addEventListener("input", function () {
      if (selectedElement) {
        let css = { "font-size": `${fontSizeInput.value}px` };
        applyStylesToElement(selectedElement.id, css);
        saveModifications(selectedElement.id, css);
      }
    });
  });
})();
