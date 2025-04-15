import { createHeadingDropdown } from 'https://goswami34.github.io/squareCraft-widget/generateHeadingDropdown.js';
import { getToggleState, setToggleState } from 'https://goswami34.github.io/squareCraft-widget/toggleState.js';


export function html() {

   const fontSizes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]
   const LetterSpacing = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]


   const htmlString = `
   <div
      class="sc-p-4 z-index-high sc-text-color-white sc-border sc-border-solid sc-border-3d3d3d sc-bg-color-2c2c2c sc-rounded-15px sc-w-300px">
      <div id="sc-grabbing" class="sc-cursor-grabbing sc-w-full">
         <div class="sc-flex sc-poppins sc-universal sc-items-center sc-justify-between">
            <img class="sc-cursor-grabbing sc-universal" src="https://i.ibb.co.com/pry1mVGD/Group-28-1.png"
               width="140px" />

         </div>
         <p class="sc-text-sm sc-mt-6 sc-poppins sc-font-light">Lorem Ipsum is simply
            dummy text
            of the printing and typesetting industry.
         </p>
      </div>
      <div class="sc-mt-6 sc-poppins sc-border-t sc-border-dashed sc-border-color-494949  sc-w-full">
      </div>
      <div class="sc-mt-6 sc-poppins sc-flex  sc-items-center sc-universal">
         <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader ">Design</p>
         <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader">Advanced</p>
         <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader">Presets</p>
      </div>
      <div class="sc-border-t sc-border-solid sc-relative  sc-border-color-494949 sc-w-full">
         <div class="sc-absolute sc-top-0 sc-left-0 sc-bg-colo-EF7C2F sc-w-16 sc-h-1px">
         </div>
      </div>
      <div
         class="sc-rounded-6px sc-h-350 sc-scrollBar sc-mt-6  sc-border sc-border-solid sc-border-EF7C2F sc-bg-color-3d3d3d">
         <div class="sc-flex sc-p-2 sc-items-center sc-justify-between">
            <div class="sc-flex sc-gap-2 sc-items-center">
               <img loading="lazy" src="https://goswami34.github.io/squareCraft-widget/public/T.svg" alt="">
               <p class="sc-universal sc-poppins">Typography</p>
            </div>
            <img src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg" alt="">
         </div>
         <div class="sc-h-1px sc-bg-3f3f3f"></div>
         <div class="sc-flex sc-px-2   sc-items-center sc-justify-between">
            <div class="sc-flex sc-gap-2 sc-items-center">
               <div class="toggle-container" id="toggleSwitch">
                  <div class="toggle-bullet"></div>
               </div>
               <p id="toggleText" class="sc-text-sm sc-poppins">Enable</p>
            </div>
           <div class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-1 sc-px-2 sc-py-1 sc-bg sc-bg-454545">
           <p class="sc-font-light sc-universal sc-text-sm sc-text-xs">Reset</p>
           <img src="https://goswami34.github.io/squareCraft-widget/public/reset.svg" alt="reset">
           </div>
         </div>
         <div class="sc-h-1px  sc-bg-3f3f3f"></div>
         <div class="sc-mt-2">
            <div class="sc-flex sc-poppins sc-px-2  sc-items-center sc-justify-between sc-gap-2">
               <div
                  class="sc-cursor-pointer sc-bg-color-EF7C2F sc-w-full sc-font-light sc-flex sc-items-center sc-text-sm sc-py-1 sc-rounded-6px sc-text-color-white sc-justify-center">
                  Normal
               </div>
               <div
                  class="sc-cursor-pointer sc-bg-3f3f3f sc-w-full sc-text-color-white sc-font-light sc-flex sc-text-sm sc-py-1 sc-rounded-6px sc-items-center sc-justify-center">
                  Hover
               </div>
            </div>
            <div class="sc-px-4">
               <div class="sc-h-1px  sc-mt-2 sc-bg-3f3f3f"></div>
            </div>
         </div>
         <div class=" sc-mt-2 sc-px-2 sc-flex sc-justify-between">
            <p class="sc-text-sm sc-universal sc-poppins sc-text-gray-300">Text</p>
            <img src="https://goswami34.github.io/squareCraft-widget/public/eye.svg" width="12px" />
         </div>

         <div>
            <div id="heading1Part" class="sc-hidden" >

               <div class="sc-flex  sc-mt-2 sc-px-2">

                  <div id="heading1"
                     class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-EF7C2F sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-w-full sc-rounded-6px">
                     <div class="sc-active-bar sc-rounded-l"></div>
                     <p class="sc-poppins  sc-universal sc-text-sm ">Heading-1</p>
                     <img id="heading1Arrow" src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg"
                        class="sc-rotate-180" alt="">
                  </div>
               </div>

               ${createHeadingDropdown('heading1Dropdown', fontSizes, LetterSpacing)}
            </div>


            <div id="heading2Part" class="sc-hidden">
               <div class="sc-flex sc-mt-2 sc-px-2">
                  <div id="heading2"
                     class="sc-bg-3f3f3f sc-flex sc-border-hover-EF7C2F sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-w-full sc-rounded-6px">
                     <p class="sc-poppins sc-universal sc-text-sm ">Heading-2</p>
                     <img id="heading2Arrow" src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg"
                        class="sc-rotate-180" alt="">
                  </div>
               </div>
               ${createHeadingDropdown('heading2Dropdown', fontSizes, LetterSpacing)}
            </div>

            <div id="heading3Part" class="sc-hidden">
               <div class="sc-flex sc-mt-2 sc-px-2">
                  <div id="heading3"
                     class="sc-bg-3f3f3f sc-flex sc-border-hover-EF7C2F sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-w-full sc-rounded-6px">
                     <p class="sc-poppins sc-universal sc-text-sm ">Heading-3</p>
                     <img id="heading3Arrow" src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg"
                        class="sc-rotate-180" alt="">
                  </div>
               </div>
               ${createHeadingDropdown('heading3Dropdown', fontSizes, LetterSpacing)}
            </div>

            <div id="heading4Part" class="sc-hidden">
               <div class="sc-flex sc-mt-2 sc-px-2">
                  <div id="heading4"
                     class="sc-bg-3f3f3f sc-flex sc-border-hover-EF7C2F sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-w-full sc-rounded-6px">
                     <p class="sc-poppins sc-universal sc-text-sm ">Heading-4</p>
                     <img id="heading4Arrow" src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg"
                        class="sc-rotate-180" alt="">
                  </div>
               </div>
               ${createHeadingDropdown('heading4Dropdown', fontSizes, LetterSpacing)}
            </div>

            <div id="paragraph1Part" class="sc-hidden">
               <div class="sc-flex sc-mt-2 sc-px-2">
                  <div id="paragraph1"
                     class="sc-bg-3f3f3f sc-flex sc-border-hover-EF7C2F sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-w-full sc-rounded-6px">
                     <p class="sc-poppins sc-universal sc-text-sm ">Paragraph-1</p>
                     <img id="paragraph1Arrow" src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg"
                        class="sc-rotate-180" alt="">
                  </div>
               </div>
               ${createHeadingDropdown('paragraph1Dropdown', fontSizes, LetterSpacing)}
            </div>

            <div id="paragraph2Part" class="sc-hidden">
               <div class="sc-flex sc-mt-2 sc-px-2">
                  <div id="paragraph2"
                     class="sc-bg-3f3f3f sc-flex sc-border-hover-EF7C2F sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-w-full sc-rounded-6px">
                     <p class="sc-poppins sc-universal sc-text-sm ">Paragraph-2</p>
                     <img id="paragraph2Arrow" src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg"
                        class="sc-rotate-180" alt="">
                  </div>
               </div>
               ${createHeadingDropdown('paragraph2Dropdown', fontSizes, LetterSpacing)}
            </div>

            <div id="paragraph3Part" class="sc-hidden">
               <div class="sc-flex sc-mt-2 sc-px-2">
                  <div id="paragraph3"
                     class="sc-bg-3f3f3f sc-flex sc-border-hover-EF7C2F sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-w-full sc-rounded-6px">
                     <p class="sc-poppins sc-universal sc-text-sm ">Paragraph-3</p>
                     <img id="paragraph3Arrow" src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg"
                        class="sc-rotate-180" alt="">
                  </div>
               </div>
               ${createHeadingDropdown('paragraph3Dropdown', fontSizes, LetterSpacing)}
            </div>
         </div>


         <div class="sc-mt-4"> </div>
      </div>
      <div class="sc-mt-4">
         <div class="sc-flex  sc-items-center sc-justify-between sc-gap-2">
            <div id="publish" class="sc-cursor-pointer sc-poppins sc-bg-color-EF7C2F sc-w-full sc-font-light sc-flex sc-items-center sc-text-sm sc-py-1 sc-rounded-6px sc-text-color-white sc-justify-center">
               Publish
            </div>
            <div
               class="sc-cursor-pointer sc-poppins sc-bg-3f3f3f sc-w-full sc-text-color-white sc-font-light sc-flex sc-text-sm sc-py-1 sc-rounded-6px sc-items-center sc-justify-center">
               Reset
            </div>
         </div>

      </div>
   </div>
    `;

   const parser = new DOMParser();
   const doc = parser.parseFromString(htmlString, "text/html");
   const isValidHTML = doc.body.children.length > 0;

   if (!isValidHTML) {
      console.error("❌ Error: Invalid HTML structure!");
      return "❌ Error: Invalid HTML structure!";
   }

   document.addEventListener("DOMContentLoaded", async function () {


      function addHeadingEventListeners() {
         const heading1 = document.getElementById("heading1");
         if (heading1) {
            heading1.addEventListener("mouseover", () => {
            });

            heading1.addEventListener("click", () => {
            });
         } else {
            console.error("❌ heading1 not found in DOM!");
         }
      }

      setTimeout(addHeadingEventListeners, 1000);
   });


   return htmlString;



}

let pageId = document.querySelector("article[data-page-sections]")?.getAttribute("data-page-sections");

// async function saveModifications(blockId, css) {
//    if (!pageId || !blockId || !css) {
//        console.warn("⚠️ Missing required data to save modifications.");
//        return {
//            success: false,
//            error: "Missing required data"
//        };
//    }

//    const userId = localStorage.getItem("sc_u_id");
//    const token = localStorage.getItem("sc_auth_token");
//    const widgetId = localStorage.getItem("sc_w_id");

//    if (!userId || !token || !widgetId) {
//        console.warn("⚠️ Missing authentication data");
//        return {
//            success: false,
//            error: "Missing authentication data"
//        };
//    }

//    const modificationData = {
//        userId,
//        token,
//        widgetId,
//        modifications: [{
//            pageId,
//            elements: [{
//                elementId: blockId,
//                css: {
//                    strong: {
//                        id: blockId,
//                        ...css
//                    }
//                },
//                elementStructure: {
//                    type: 'strong',
//                    content: document.getElementById(blockId)?.textContent || '',
//                    parentId: document.getElementById(blockId)?.parentElement?.id || null
//                }
//            }]
//        }]
//    };

//    try {
//        const response = await fetch("https://admin.squareplugin.com/api/v1/modifications", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                "Authorization": `Bearer ${token}`,
//            },
//            body: JSON.stringify(modificationData),
//        });

//        if (!response.ok) {
//            const errorData = await response.json();
//            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//        }

//        const result = await response.json();
//        console.log("✅ Changes Saved Successfully!", result);
       
//        // Show success notification
//        showNotification("Changes saved successfully!", "success");
       
//        return {
//            success: true,
//            data: result
//        };
//    } catch (error) {
//        console.error("❌ Error saving modifications:", error);
//        // Show error notification
//        showNotification(`Failed to save changes: ${error.message}`, "error");
       
//        return {
//            success: false,
//            error: error.message
//        };
//    }
//  }


// let block = event.target.closest('[id^="block-"]');
// let blockId = block?.id;


// async function saveModifications(blockId, css, tagType) {
//    if (!pageId || !blockId || !css) {
//        console.warn("⚠️ Missing required data to save modifications.");
//        return {
//            success: false,
//            error: "Missing required data"
//        };
//    }

//    const userId = localStorage.getItem("sc_u_id");
//    const token = localStorage.getItem("sc_auth_token");
//    const widgetId = localStorage.getItem("sc_w_id");

//    if (!userId || !token || !widgetId) {
//        console.warn("⚠️ Missing authentication data");
//        return {
//            success: false,
//            error: "Missing authentication data"
//        };
//    }

//    // Construct the modification data according to your database structure
//    const modificationData = {
//        userId,
//        token,
//        widgetId,
//        modifications: [{
//            pageId,
//            elements: [{
//                elementId: blockId, // This should be the block ID
//                css: {
//                    strong: {
//                        id: blockId, // This should match elementId
//                        ...css // This will include text-transform and other properties
//                    }
//                },
//                elementStructure: {
//                    type: 'strong',
//                    content: document.getElementById(blockId)?.textContent || '',
//                    parentId: document.getElementById(blockId)?.parentElement?.id || null
//                }
//            }]
//        }]
//    };

//    try {
//        const response = await fetch("https://admin.squareplugin.com/api/v1/modifications", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                "Authorization": `Bearer ${token}`,
//            },
//            body: JSON.stringify(modificationData),
//        });

//        if (!response.ok) {
//            const errorData = await response.json();
//            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//        }

//        const result = await response.json();
//        console.log("✅ Changes Saved Successfully!", result);
       
//        // Show success notification
//        showNotification("Changes saved successfully!", "success");
       
//        return {
//            success: true,
//            data: result
//        };
//    } catch (error) {
//        console.error("❌ Error saving modifications:", error);
//        // Show error notification
//        showNotification(`Failed to save changes: ${error.message}`, "error");
       
//        return {
//            success: false,
//            error: error.message
//        };
//    }
// }

async function saveModifications(blockId, css, tagType) {
   if (!pageId || !blockId || !css) {
       console.warn("⚠️ Missing required data to save modifications.");
       return {
           success: false,
           error: "Missing required data"
       };
   }

   const userId = localStorage.getItem("sc_u_id");
   const token = localStorage.getItem("sc_auth_token");
   const widgetId = localStorage.getItem("sc_w_id");

   if (!userId || !token || !widgetId) {
       console.warn("⚠️ Missing authentication data");
       return {
           success: false,
           error: "Missing authentication data"
       };
   }

   // Get existing modifications from localStorage
   let existingModifications = JSON.parse(localStorage.getItem('sc_modifications') || '[]');
   
   // Find if this page already has modifications
   let pageModifications = existingModifications.find(mod => mod.pageId === pageId);
   
   if (!pageModifications) {
       // Create new page modifications
       pageModifications = {
           pageId,
           elements: []
       };
       existingModifications.push(pageModifications);
   }

   // Find if this block already has modifications
   let blockModifications = pageModifications.elements.find(elem => elem.elementId === blockId);
   
   if (!blockModifications) {
       // Create new block modifications
       blockModifications = {
           elementId: blockId,
           css: {},
           elementStructure: null
       };
       pageModifications.elements.push(blockModifications);
   }

   // Update CSS for the block
   if (tagType === 'strong') {
       blockModifications.css.strong = {
           ...blockModifications.css.strong,
           ...css
       };
   } else if (tagType === 'span') {
       blockModifications.css.span = {
           id: `span-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
           ...css
       };
   } else {
       blockModifications.css[tagType] = {
           ...blockModifications.css[tagType],
           ...css
       };
   }

   // Save to localStorage
   localStorage.setItem('sc_modifications', JSON.stringify(existingModifications));

   const modificationData = {
       userId,
       token,
       widgetId,
       modifications: existingModifications
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
           const errorData = await response.json();
           throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
       }

       const result = await response.json();
       console.log("✅ Changes Saved Successfully!", result);
       
       showNotification("Changes saved successfully!", "success");
       
       return {
           success: true,
           data: result
       };
   } catch (error) {
       console.error("❌ Error saving modifications:", error);
       showNotification(`Failed to save changes: ${error.message}`, "error");
       
       return {
           success: false,
           error: error.message
       };
   }
}


function showNotification(message, type = "info") {
   const notification = document.createElement("div");
   notification.className = `sc-notification sc-notification-${type}`;
   notification.textContent = message;
   
   // Add styles
   Object.assign(notification.style, {
       position: "fixed",
       top: "20px",
       right: "20px",
       padding: "10px 20px",
       borderRadius: "4px",
       color: "white",
       zIndex: "9999",
       animation: "fadeIn 0.3s ease-in-out",
       backgroundColor: type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"
   });

   document.body.appendChild(notification);

   // Remove after 3 seconds
   setTimeout(() => {
       notification.style.animation = "fadeOut 0.3s ease-in-out";
       setTimeout(() => notification.remove(), 300);
   }, 3000);
}


export function initToggleSwitch() {
   const toggleSwitch = document.getElementById("toggleSwitch");
   const toggleText = document.getElementById("toggleText");
   const toggleBullet = toggleSwitch?.querySelector(".toggle-bullet");
   if (!toggleSwitch || !toggleText || !toggleBullet) {
     console.log(":hourglass_flowing_sand: Waiting for toggle elements...");
     return;
   }
   let isEnabled = getToggleState();
   const updateToggleUI = () => {
     if (!toggleSwitch || !toggleBullet || !toggleText) return;
     if (isEnabled) {
       toggleSwitch.style.backgroundColor = "#EF7C2F";
       toggleBullet.style.left = "auto";
       toggleBullet.style.right = "1.5px";
       toggleText.textContent = "Enable";
     } else {
       toggleSwitch.style.backgroundColor = "#747372";
       toggleBullet.style.left = "2px";
       toggleBullet.style.right = "auto";
       toggleText.textContent = "Disable";
     }
   };
   updateToggleUI();
   toggleSwitch.addEventListener("click", () => {
     isEnabled = !isEnabled;
     setToggleState(isEnabled);
     updateToggleUI();
   });
 }

//  async function handlePublish() {
//    const modifiedStyles = [];
   
//    // Collect all modified styles
//    document.querySelectorAll('style[id*="texttransform"]').forEach(styleTag => {
//        const blockId = styleTag.id.split('-')[1];
//        const tagType = styleTag.id.split('-')[2];
//        const cssText = styleTag.innerHTML;
//        const textTransform = cssText.match(/text-transform:\s*([^;]+)/)?.[1];

//        if (blockId && tagType && textTransform) {
//            modifiedStyles.push({
//                blockId,
//                tagType,
//                textTransform
//            });
//        }
//    });

//    if (modifiedStyles.length === 0) {
//        showNotification("No changes to publish", "info");
//        return;
//    }

//    // Save each modification
//    for (const style of modifiedStyles) {
//       //  const result = await saveModifications(style.blockId, {
//       //      "text-transform": style.textTransform,
//       //      "tag-type": style.tagType
//       //  });

//       const result = await saveModifications(style.blockId, {
//          "text-transform": style.textTransform
//       }, style.tagType);

//        if (!result.success) {
//            showNotification(`Failed to save changes for block ${style.blockId}`, "error");
//            return;
//        }
//    }

//    showNotification("All changes published successfully!", "success");
// }
 

 // Add this new function to handle publish button click
 
 async function handlePublish() {
   const modifiedStyles = [];
   
   // Collect all modified styles
   document.querySelectorAll('style[id*="texttransform"]').forEach(styleTag => {
       const blockId = styleTag.id.split('-')[1];
       const tagType = styleTag.id.split('-')[2];
       const cssText = styleTag.innerHTML;
       const textTransform = cssText.match(/text-transform:\s*([^;]+)/)?.[1];

       if (blockId && tagType && textTransform) {
           modifiedStyles.push({
               blockId,
               tagType,
               css: {
                   "text-transform": textTransform
               }
           });
       }
   });

   if (modifiedStyles.length === 0) {
       showNotification("No changes to publish", "info");
       return;
   }

   // Save each modification
   for (const style of modifiedStyles) {
       const result = await saveModifications(style.blockId, style.css, style.tagType);
       
       if (!result.success) {
           showNotification(`Failed to save changes for block ${style.blockId}`, "error");
           return;
       }
   }

   showNotification("All changes published successfully!", "success");
}
 
 export function initPublishButton() {
   const publishButton = document.getElementById('publish');
   if (!publishButton) {
       console.warn("Publish button not found");
       return;
   }

   publishButton.addEventListener('click', async () => {
       try {
           // Show loading state
           publishButton.disabled = true;
           publishButton.textContent = "Publishing...";

           // Call the handlePublish function from squareCraft.js
           await handlePublish();

       } catch (error) {
           showNotification(error.message, "error");
       } finally {
           // Reset button state
           publishButton.disabled = false;
           publishButton.textContent = "Publish";
       }
   });
}
 
 
 
 
 
 
