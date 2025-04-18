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




// export function handleFontSize(event = null, context = null) {
//     const {
//         lastClickedElement,
//         selectedSingleTextType,
//         setSelectedSingleTextType,
//         saveModifications,
//         setSelectedElement,
//         setLastClickedBlockId,
//         setLastClickedElement,
//         addPendingModification,
//         showNotification,
//         selectedTextElement
//     } = context;

//     if (typeof saveModifications !== 'function') {
//         console.error("saveModifications function is not available");
//         showNotification("Error: Save functionality not available", "error");
//         return;
//     }

//     if (!event) {
//         const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
//         if (!activeButton) return;
//         event = { target: activeButton };
//     }

//     const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
//     if (!clickedElement) return;

//     const fontSize = event.target.value + "px";

//     if (!lastClickedElement) {
//         showNotification("Please select a block first", "error");
//         return;
//     }

//     // 🛠 Fix: if no text type selected, auto-pick first visible one
//     let updatedSelectedTextType = selectedSingleTextType;
//     if (!updatedSelectedTextType) {
//         const activeTab = document.querySelector('.sc-activeTab-border');
//         if (activeTab) {
//             const activeId = activeTab.id;
//             if (activeId.startsWith("heading")) {
//                 const num = activeId.replace("heading", "");
//                 updatedSelectedTextType = `h${num}`;
//             } else if (activeId.startsWith("paragraph")) {
//                 updatedSelectedTextType = "p"; // paragraph always p
//             }
//             if (updatedSelectedTextType) {
//                 setSelectedSingleTextType(updatedSelectedTextType);
//                 console.log("✅ Auto selected text type:", updatedSelectedTextType);
//             }
//         }
//     }

//     if (!updatedSelectedTextType) {
//         showNotification("⚡ Please click a text type tab (Heading or Paragraph) first", "error");
//         return;
//     }

//     const block = lastClickedElement.closest('[id^="block-"]');
//     if (!block) {
//         showNotification("Block not found", "error");
//         return;
//     }
//     if (!selectedTextElement) {
//         showNotification("Please select a text type", "error");
//         return;
//       }
      
//       let strongElements = selectedTextElement.querySelectorAll("strong");
//       strongElements.forEach(strong => {
//         strong.style.fontSize = fontSize;
//       });
      

//     const blockId = block.id;
//     const styleId = `style-${blockId}-${updatedSelectedTextType}-strong-font-size`;
//     let styleTag = document.getElementById(styleId);

//     if (!styleTag) {
//         styleTag = document.createElement("style");
//         styleTag.id = styleId;
//         document.head.appendChild(styleTag);
//     }

//     const css = `
//         #${blockId} ${updatedSelectedTextType} strong {
//             font-size: ${fontSize} !important;
//         }
//     `;

//     styleTag.innerHTML = css;

//     addPendingModification(blockId, {
//         "font-size": fontSize,
//         "target": updatedSelectedTextType
//     }, 'strong');

//     // UI update
//     document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
//         el.classList.remove('sc-activeTab-border');
//         el.classList.add('sc-inActiveTab-border');
//     });
//     clickedElement.classList.remove('sc-inActiveTab-border');
//     clickedElement.classList.add('sc-activeTab-border');

//     showNotification(`Font size applied to bold text inside: ${updatedSelectedTextType}`, "success");
// }

// export function handleFontSize(event = null, context = null) {
//     const {
//         lastClickedElement,
//         selectedSingleTextType,
//         setSelectedSingleTextType,
//         saveModifications,
//         setSelectedElement,
//         setLastClickedBlockId,
//         setLastClickedElement,
//         addPendingModification,
//         showNotification,
//         selectedTextElement
//     } = context;

//     if (typeof saveModifications !== 'function') {
//         console.error("saveModifications function is not available");
//         showNotification("Error: Save functionality not available", "error");
//         return;
//     }

//     if (!event) {
//         const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
//         if (!activeButton) return;
//         event = { target: activeButton };
//     }

//     const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
//     if (!clickedElement) return;

//     const fontSize = event.target.value + "px";

//     if (!lastClickedElement) {
//         showNotification("Please select a block first", "error");
//         return;
//     }

//     const block = lastClickedElement.closest('[id^="block-"]');
//     if (!block) {
//         showNotification("Block not found", "error");
//         return;
//     }

//     // Get all text elements within the block
//     const textElements = block.querySelectorAll('h1, h2, h3, h4, p');
//     if (textElements.length === 0) {
//         showNotification("No text elements found in block", "error");
//         return;
//     }

//     // Create a single style tag for all text types
//     const blockId = block.id;
//     const styleId = `style-${blockId}-strong-font-size`;
//     let styleTag = document.getElementById(styleId);

//     if (!styleTag) {
//         styleTag = document.createElement("style");
//         styleTag.id = styleId;
//         document.head.appendChild(styleTag);
//     }

//     // Build CSS for all text types
//     let css = '';
//     textElements.forEach(textElement => {
//         const tagName = textElement.tagName.toLowerCase();
//         const strongElements = textElement.querySelectorAll("strong");
        
//         if (strongElements.length > 0) {
//             css += `
//                 #${blockId} ${tagName} strong {
//                     font-size: ${fontSize} !important;
//                 }
//             `;
            
//             // Apply font size directly to strong elements
//             strongElements.forEach(strong => {
//                 strong.style.fontSize = fontSize;
//             });
//         }
//     });

//     if (css) {
//         styleTag.innerHTML = css;

//         // Add pending modification for each text type with strong elements
//         textElements.forEach(textElement => {
//             const tagName = textElement.tagName.toLowerCase();
//             if (textElement.querySelectorAll("strong").length > 0) {
//                 addPendingModification(blockId, {
//                     "font-size": fontSize,
//                     "target": tagName
//                 }, 'strong');
//             }
//         });

//         // UI update
//         document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
//             el.classList.remove('sc-activeTab-border');
//             el.classList.add('sc-inActiveTab-border');
//         });
//         clickedElement.classList.remove('sc-inActiveTab-border');
//         clickedElement.classList.add('sc-activeTab-border');

//         showNotification(`Font size applied to bold text in all text elements`, "success");
//     } else {
//         showNotification("No bold text found in the block", "info");
//     }
// }


// export function handleFontSize(event = null, context = null) {
//     const {
//       lastClickedElement,
//       selectedSingleTextType,
//       setSelectedSingleTextType,
//       saveModifications,
//       setSelectedElement,
//       setLastClickedBlockId,
//       setLastClickedElement,
//       addPendingModification,
//       showNotification,
//       selectedTextElement
//     } = context;
  
//     if (typeof saveModifications !== 'function') {
//       console.error("saveModifications function is not available");
//       showNotification("Error: Save functionality not available", "error");
//       return;
//     }
  
//     if (!event) {
//       const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
//       if (!activeButton) return;
//       event = { target: activeButton };
//     }
  
//     const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
//     if (!clickedElement) return;
  
//     const fontSize = event.target.value + "px";
  
//     if (!lastClickedElement) {
//       showNotification("Please select a block first", "error");
//       return;
//     }
  
//     if (!selectedSingleTextType) {
//       showNotification("Please select a text type (Heading or Paragraph)", "error");
//       return;
//     }
  
//     const block = lastClickedElement.closest('[id^="block-"]');
//     if (!block) {
//       showNotification("Block not found", "error");
//       return;
//     }
  
//     // 🎯 Only select the selectedSingleTextType
//     // const targetElements = block.querySelectorAll(selectedSingleTextType);
//     // if (!targetElements) {
//     //   showNotification(`No ${selectedSingleTextType} found in block`, "error");
//     //   return;
//     // }
  
//     // // const strongElements = targetElement.querySelectorAll("strong");
//     // // if (strongElements.length === 0) {
//     // //   showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
//     // //   return;
//     // // }
  
//     // // // Apply font size to all strong elements inside selected tag
//     // // strongElements.forEach(strong => {
//     // //   strong.style.fontSize = fontSize;
//     // // });

//     // let strongFound = false;

//     // targetElements.forEach(targetElement => {
//     //   const strongElements = targetElement.querySelectorAll("strong");
//     //   if (strongElements.length > 0) {
//     //     strongFound = true;
//     //     strongElements.forEach(strong => {
//     //       strong.style.fontSize = fontSize;
//     //     });
//     //   }
//     // });
  
//     // if (!strongFound) {
//     //   showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
//     //   return;
//     // }
  
//     // const blockId = block.id;
//     // const styleId = `style-${blockId}-${selectedSingleTextType}-strong-font-size`;
//     // let styleTag = document.getElementById(styleId);
  
//     // if (!styleTag) {
//     //   styleTag = document.createElement("style");
//     //   styleTag.id = styleId;
//     //   document.head.appendChild(styleTag);
//     // }
  
//     // // Apply CSS only to selected text type
//     // const css = `
//     //   #${blockId} ${selectedSingleTextType} strong {
//     //     font-size: ${fontSize} !important;
//     //   }
//     // `;
  
//     // styleTag.innerHTML = css;
  
//     // addPendingModification(blockId, {
//     //   "font-size": fontSize,
//     //   "target": selectedSingleTextType
//     // }, 'strong');


//     const targetElements = block.querySelectorAll(selectedSingleTextType);
//     if (!targetElements || targetElements.length === 0) {
//         showNotification(`No ${selectedSingleTextType} found in block`, "error");
//         return;
//     }

//     let strongFound = false;

//     // Apply font size to strong elements within each target element
//     targetElements.forEach(targetElement => {
//         const strongElements = targetElement.querySelectorAll("strong");
//         if (strongElements.length > 0) {
//             strongFound = true;
//             strongElements.forEach(strong => {
//                 strong.style.fontSize = fontSize;
//             });
//         }
//     });

//     if (!strongFound) {
//         showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
//         return;
//     }

//     const blockId = block.id;
//     // Create a unique style ID that includes the text type
//     const styleId = `style-${blockId}-${selectedSingleTextType}-strong-font-size`;
//     let styleTag = document.getElementById(styleId);

//     if (!styleTag) {
//         styleTag = document.createElement("style");
//         styleTag.id = styleId;
//         document.head.appendChild(styleTag);
//     }

//     // Apply CSS only to strong elements within the selected text type
//     const css = `
//         #${blockId} ${selectedSingleTextType} strong {
//             font-size: ${fontSize} !important;
//         }
//     `;

//     styleTag.innerHTML = css;

//     // Save the modification with the specific text type
//     addPendingModification(blockId, {
//         "font-size": fontSize,
//         "target": selectedSingleTextType
//     }, 'strong');

  
//     // UI update
//     document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
//       el.classList.remove('sc-activeTab-border');
//       el.classList.add('sc-inActiveTab-border');
//     });
//     clickedElement.classList.remove('sc-inActiveTab-border');
//     clickedElement.classList.add('sc-activeTab-border');
  
//     showNotification(`Font size applied to bold text inside: ${selectedSingleTextType}`, "success");
//   }
  

export function handleFontSize(event = null, context = null) {
    const {
      lastClickedElement,
      selectedSingleTextType,
      saveModifications,
      addPendingModification,
      showNotification,
    } = context;
  
    if (!event) {
      const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
      if (!activeButton) return;
      event = { target: activeButton };
    }
  
    const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
    if (!clickedElement) return;
  
    const fontSize = event.target.value + "px";
  
    if (!lastClickedElement) {
      showNotification("Please select a block first", "error");
      return;
    }
  
    if (!selectedSingleTextType) {
      showNotification("Please select a text type (Heading or Paragraph)", "error");
      return;
    }
  
    const block = lastClickedElement.closest('[id^="block-"]');
    if (!block) {
      showNotification("Block not found", "error");
      return;
    }
  
    const targetElements = block.querySelectorAll(selectedSingleTextType);
    if (!targetElements.length) {
      showNotification(`No ${selectedSingleTextType} found in block`, "error");
      return;
    }
  
    let strongFound = false;
  
    targetElements.forEach((targetElement) => {
      const strongElements = targetElement.querySelectorAll("strong");
      if (strongElements.length > 0) {
        strongFound = true;
        
        strongElements.forEach(strong => {
          strong.style.fontSize = fontSize;
        });
      }
    });
  
    if (!strongFound) {
      showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
      return;
    }
  
    // --- ✅ Apply simple clean CSS without nth-of-type
    const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
    let styleTag = document.getElementById(styleId);
  
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
  
    styleTag.innerHTML = `
      #${block.id} ${selectedSingleTextType} strong {
        font-size: ${fontSize} !important;
      }
    `;
  
    addPendingModification(block.id, {
      "font-size": fontSize,
      "target": selectedSingleTextType
    }, 'strong');
  
    // UI update
    document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
      el.classList.remove('sc-activeTab-border');
      el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
  
    showNotification(`Font size applied to bold text inside: ${selectedSingleTextType}`, "success");
  }
  
  
  






