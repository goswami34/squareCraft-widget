// export function handleFontWeightFunClick(event = null, context = null) {
//     const {
//         lastClickedElement,
//         saveModifications,
//         selectedElement,
//         setSelectedElement,
//         setLastClickedBlockId,
//         setLastClickedElement,
//         addPendingModification,
//         getTextType
//     } = context;

//     // First check if we're clicking on a block
//     let block = event.target.closest('[id^="block-"]');
//     if (block) {
//         // Handle block selection
//         if (selectedElement) selectedElement.style.outline = "";
//         setSelectedElement(block);
//         block.style.outline = "1px dashed #EF7C2F";
//         setLastClickedBlockId(block.id);
//         setLastClickedElement(block);

//         // Check which tags exist in the block
//         const tags = ['h1', 'h2', 'h3', 'h4', 'p1', 'p2', 'p3'];
//         const existingTags = tags.filter(tag => block.querySelector(tag));
        
//         // Store the tag information in the block's dataset
//         const tagData = {};
//         existingTags.forEach(tag => {
//             const elements = block.querySelectorAll(`${tag} strong`);
//             if (elements.length > 0) {
//                 tagData[tag] = {
//                     count: elements.length,
//                     elements: Array.from(elements).map(el => el.textContent)
//                 };
//             }
//         });

//         block.dataset.strongElementsByTag = JSON.stringify(tagData);
//         return;
//     }

//     // Get the font weight select element
//     const fontWeightSelect = document.getElementById('squareCraftFontWeight');
//     if (!fontWeightSelect) {
//         console.error("Font weight select element not found");
//         return;
//     }

//     // Remove any existing event listeners to prevent duplicates
//     const newFontWeightSelect = fontWeightSelect.cloneNode(true);
//     fontWeightSelect.parentNode.replaceChild(newFontWeightSelect, fontWeightSelect);

//     // Add event listener for font weight changes
//     newFontWeightSelect.addEventListener('change', async (event) => {
//         if (!lastClickedElement) {
//             showNotification("Please select a block first", "error");
//             return;
//         }

//         const fontWeight = event.target.value;
//         const blockId = lastClickedElement.id;
        
//         // Get the current active tag type (h1, h2, etc.)
//         const currentTagType = getTextType();
//         if (!currentTagType) {
//             showNotification("Please select a text type first", "error");
//             return;
//         }

//         // Get the strong elements data for the current tag type
//         const data = lastClickedElement.dataset.strongElementsByTag;
//         if (!data) {
//             showNotification("No bold text found in the selected block", "error");
//             return;
//         }

//         try {
//             const parsed = JSON.parse(data);
//             const strongData = parsed[currentTagType];
            
//             if (!strongData || strongData.count === 0) {
//                 showNotification(`No <strong> tags found inside ${currentTagType}`, "error");
//                 return;
//             }

//             // Apply inline style
//             const styleId = `style-${blockId}-${currentTagType}-strong-fontweight`;
//             let styleTag = document.getElementById(styleId);
//             if (!styleTag) {
//                 styleTag = document.createElement("style");
//                 styleTag.id = styleId;
//                 document.head.appendChild(styleTag);
//             }

//             // Create CSS rule that targets strong tags within the current tag type
//             const css = `#${blockId} ${currentTagType} strong {
//                 font-weight: ${fontWeight} !important;
//             }`;
//             styleTag.innerHTML = css;

//             // Add to pending modifications
//             addPendingModification(blockId, {
//                 "font-weight": fontWeight
//             }, 'strong');

//             // Save modifications
//             try {
//                 await saveModifications(blockId, {
//                     "font-weight": fontWeight
//                 }, 'strong');
//                 showNotification("Font weight applied successfully!", "success");
//             } catch (error) {
//                 showNotification("Failed to save font weight changes", "error");
//                 console.error("Error saving font weight:", error);
//             }
//         } catch (err) {
//             showNotification("Failed to process text data", "error");
//             console.error("Error processing text data:", err);
//         }
//     });
// }


// function showNotification(message, type = "info") {
//     const notification = document.createElement("div");
//     notification.className = `sc-notification sc-notification-${type}`;
//     notification.textContent = message;
    
//     // Add styles
//     Object.assign(notification.style, {
//         position: "fixed",
//         top: "20px",
//         right: "20px",
//         padding: "10px 20px",
//         borderRadius: "4px",
//         color: "white",
//         zIndex: "9999",
//         animation: "fadeIn 0.3s ease-in-out",
//         backgroundColor: type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"
//     });
  
//     document.body.appendChild(notification);
  
//     // Remove after 3 seconds
//     setTimeout(() => {
//         notification.style.animation = "fadeOut 0.3s ease-in-out";
//         setTimeout(() => notification.remove(), 300);
//     }, 3000);
//   }
  
//   // In handleTextTransformClick function
//   export function handleFontWeightFunClick(event = null, context = null) {
//       const {
//           lastClickedElement,
//           saveModifications,
//           selectedElement,
//           setSelectedElement,
//           setLastClickedBlockId,
//           setLastClickedElement,
//           addPendingModification
//       } = context;
  
//       // Add a check for saveModifications
//       if (typeof saveModifications !== 'function') {
//           console.error("saveModifications function is not available");
//           showNotification("Error: Save functionality not available", "error");
//           return;
//       }
  
//       // First check if we're clicking on a block
//       let block = event.target.closest('[id^="block-"]');
//       if (block) {
//           // Handle block selection
//           if (selectedElement) selectedElement.style.outline = "";
//           setSelectedElement(block);
//           block.style.outline = "1px dashed #EF7C2F";
//           setLastClickedBlockId(block.id);
//           setLastClickedElement(block);
//           return; // Return after handling block selection
//       }
  
//       // If no block was clicked, check for text transform button
//       if (!event) {
//           const activeButton = document.querySelector('[id^="scFontWeight"].sc-activeTab-border');
//           if (!activeButton) return;
//           event = { target: activeButton };
//       }
  
//       const clickedElement = event.target.closest('[id^="scFontWeight"]');
//       if (!clickedElement) return;
  
//       const fontWeight = clickedElement.dataset.fontWeight;
//       const blockId = lastClickedElement?.id;
  
//       if (!blockId || !lastClickedElement) {
//           showNotification("Please select a block first", "error");
//           return;
//       }
  
//       // Get the tag type from dataset.strongElementsByTag
//       const data = lastClickedElement.dataset.strongElementsByTag;
//       if (!data) {
//           showNotification("No bold text found in the selected block", "error");
//           return;
//       }
  
//       let tagType = null;
//       try {
//           const parsed = JSON.parse(data);
//           const tagKeys = Object.keys(parsed);
//           tagType = tagKeys[0];
//       } catch (err) {
//           showNotification("Failed to process text data", "error");
//           return;
//       }
  
//       // Apply inline style
//       const styleId = `style-${blockId}-${tagType}-strong-texttransform`;
//       let styleTag = document.getElementById(styleId);
//       if (!styleTag) {
//           styleTag = document.createElement("style");
//           styleTag.id = styleId;
//           document.head.appendChild(styleTag);
//       }
  
//       const css = `#${blockId} ${tagType} strong {
//           text-transform: ${fontWeight} !important;
//       }`;
//       styleTag.innerHTML = css;
  
//       // Save modifications with proper structure
//       // saveModifications(blockId, {
//       //     "text-transform": textTransform
//       // }, 'strong').then(result => {
//       //     if (result.success) {
//       //         // Update UI tab state
//       //         document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
//       //             el.classList.remove('sc-activeTab-border');
//       //             el.classList.add('sc-inActiveTab-border');
//       //         });
//       //         clickedElement.classList.remove('sc-inActiveTab-border');
//       //         clickedElement.classList.add('sc-activeTab-border');
//       //         showNotification("Text transform applied successfully!", "success");
//       //     } else {
//       //         showNotification(`Failed to save changes: ${result.error}`, "error");
//       //     }
//       // }).catch(error => {
//       //     console.error("Error saving modifications:", error);
//       //     showNotification("Failed to save changes", "error");
//       // });
  
//       addPendingModification(blockId, {
//           "font-weight": fontWeight
//       }, 'strong');
  
//       // Update UI immediately
//       document.querySelectorAll('[id^="scfontWeight"]').forEach(el => {
//           el.classList.remove('sc-activeTab-border');
//           el.classList.add('sc-inActiveTab-border');
//       });
//       clickedElement.classList.remove('sc-inActiveTab-border');
//       clickedElement.classList.add('sc-activeTab-border');
//       showNotification("font weight applied! Click Publish to save changes.", "info");
  
//   }
  


export function handleFontWeightFunClick(event = null, context = null) {
    console.log("handleFontWeightFunClick");
    const {
        lastClickedElement,
        saveModifications,
        selectedElement,
        setSelectedElement,
        setLastClickedBlockId,
        setLastClickedElement,
        addPendingModification,
        getTextType
    } = context;

    // Get the font weight select element
    const fontWeightSelect = document.getElementById('squareCraftFontWeight');
    if (!fontWeightSelect) {
        console.error("Font weight select element not found");
        return;
    }

    // Add event listener for font weight changes
    fontWeightSelect.addEventListener('change', async (event) => {
        if (!lastClickedElement) {
            showNotification("Please select a block first", "error");
            return;
        }

        const fontWeight = event.target.value;
        console.log(fontWeight);
        const blockId = lastClickedElement.id;
        
        // Get the current active tag type (h1, h2, etc.)
        const currentTagType = getTextType();
        if (!currentTagType) {
            showNotification("Please select a text type first", "error");
            return;
        }

        // Create or update style tag
        const styleId = `style-${blockId}-${currentTagType}-strong-fontweight`;
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        // Create CSS rule that targets strong tags within the current tag type
        const css = `#${blockId} ${currentTagType} strong {
            font-weight: ${fontWeight} !important;
        }`;
        styleTag.innerHTML = css;

        // Add to pending modifications
        addPendingModification(blockId, {
            "font-weight": fontWeight
        }, 'strong');

        // Save modifications
        try {
            await saveModifications(blockId, {
                "font-weight": fontWeight
            }, 'strong');
            showNotification("Font weight applied successfully!", "success");
        } catch (error) {
            showNotification("Failed to save font weight changes", "error");
            console.error("Error saving font weight:", error);
        }
    });
}
  
    
  