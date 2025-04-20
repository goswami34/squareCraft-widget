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
//       lastClickedElement,
//       selectedSingleTextType,
//       saveModifications,
//       addPendingModification,
//       showNotification,
//     } = context;
  
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
  
//     const targetElements = block.querySelectorAll(selectedSingleTextType);
//     if (!targetElements.length) {
//       showNotification(`No ${selectedSingleTextType} found in block`, "error");
//       return;
//     }
  
//     let strongFound = false;
  
//     targetElements.forEach((targetElement) => {
//       const strongElements = targetElement.querySelectorAll("strong");
//       if (strongElements.length > 0) {
//         strongFound = true;
        
//         strongElements.forEach(strong => {
//           strong.style.fontSize = fontSize;
//         });
//       }
//     });
  
//     if (!strongFound) {
//       showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
//       return;
//     }
  
//     // --- ✅ Apply simple clean CSS without nth-of-type
//     const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
//     let styleTag = document.getElementById(styleId);
  
//     if (!styleTag) {
//       styleTag = document.createElement("style");
//       styleTag.id = styleId;
//       document.head.appendChild(styleTag);
//     }
  
//     styleTag.innerHTML = `
//       #${block.id} ${selectedSingleTextType} strong {
//         font-size: ${fontSize} !important;
//       }
//     `;
  
//     addPendingModification(block.id, {
//       "font-size": fontSize,
//       "target": selectedSingleTextType
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

// export function handleFontSize(event = null, context = null) {
//   const {
//     lastClickedElement,
//     selectedSingleTextType,
//     saveModifications,
//     addPendingModification,
//     showNotification,
//   } = context;

//   if (!event) {
//     const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
//     if (!activeButton) return;
//     event = { target: activeButton };
//   }

//   const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
//   if (!clickedElement) return;

//   const fontSize = event.target.value + "px";

//   if (!lastClickedElement) {
//     showNotification("Please select a block first", "error");
//     return;
//   }

//   if (!selectedSingleTextType) {
//     showNotification("Please select a text type (Heading or Paragraph)", "error");
//     return;
//   }

//   const block = lastClickedElement.closest('[id^="block-"]');
//   if (!block) {
//     showNotification("Block not found", "error");
//     return;
//   }

//   let targetElements = [];

//   if (selectedSingleTextType.startsWith("paragraph")) {
//     // 🛠 Find only correct paragraph
//     const blockParagraphs = block.querySelectorAll("p");

//     blockParagraphs.forEach(p => {
//       const classList = p.classList;

//       if (selectedSingleTextType === "paragraph1" && classList.contains("sqsrte-large")) {
//         targetElements.push(p);
//       } else if (selectedSingleTextType === "paragraph3" && classList.contains("sqsrte-small")) {
//         targetElements.push(p);
//       } else if (selectedSingleTextType === "paragraph2" && 
//                 !classList.contains("sqsrte-large") && 
//                 !classList.contains("sqsrte-small")) {
//         targetElements.push(p);
//       }
//     });
//   } else {
//     // 🛠 Normal h1, h2, h3, h4
//     targetElements = block.querySelectorAll(selectedSingleTextType);
//   }

//   if (!targetElements.length) {
//     showNotification(`No ${selectedSingleTextType} found in block`, "error");
//     return;
//   }

//   let strongFound = false;

//   targetElements.forEach(targetElement => {
//     const strongElements = targetElement.querySelectorAll("strong");
//     if (strongElements.length > 0) {
//       strongFound = true;
//       strongElements.forEach(strong => {
//         strong.style.fontSize = fontSize;
//       });
//     }
//   });

//   if (!strongFound) {
//     showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
//     return;
//   }

//   const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
//   let styleTag = document.getElementById(styleId);

//   if (!styleTag) {
//     styleTag = document.createElement("style");
//     styleTag.id = styleId;
//     document.head.appendChild(styleTag);
//   }

//   let paragraphSelector = "";

//   if (selectedSingleTextType === "paragraph1") {
//     paragraphSelector = `p.sqsrte-large`;
//   } else if (selectedSingleTextType === "paragraph2") {
//     paragraphSelector = `p:not(.sqsrte-large):not(.sqsrte-small)`;
//   } else if (selectedSingleTextType === "paragraph3") {
//     paragraphSelector = `p.sqsrte-small`;
//   } else {
//     paragraphSelector = selectedSingleTextType;
//   }

//   styleTag.innerHTML = `
//     #${block.id} ${paragraphSelector} strong {
//       font-size: ${fontSize} !important;
//     }
//   `;

//   addPendingModification(block.id, {
//     "font-size": fontSize,
//     "target": selectedSingleTextType
//   }, 'strong');

//   // Update UI active tab
//   document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
//     el.classList.remove('sc-activeTab-border');
//     el.classList.add('sc-inActiveTab-border');
//   });
//   clickedElement.classList.remove('sc-inActiveTab-border');
//   clickedElement.classList.add('sc-activeTab-border');

//   showNotification(`Font size applied to bold text inside: ${selectedSingleTextType}`, "success");
// }


// export function handleFontSize(event = null, context = null) {
//   const {
//     lastClickedElement,
//     selectedSingleTextType,
//     saveModifications,
//     addPendingModification,
//     showNotification,
//   } = context;

//   if (!event) {
//     const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
//     if (!activeButton) return;
//     event = { target: activeButton };
//   }

//   const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
//   if (!clickedElement) return;

//   const fontSize = event.target.value + "px";

//   if (!lastClickedElement) {
//     showNotification("Please select a block first", "error");
//     return;
//   }

//   if (!selectedSingleTextType) {
//     showNotification("Please select a text type (Heading or Paragraph)", "error");
//     return;
//   }

//   const block = lastClickedElement.closest('[id^="block-"]');
//   if (!block) {
//     showNotification("Block not found", "error");
//     return;
//   }

//   let targetElements = [];

//   if (selectedSingleTextType.startsWith("paragraph")) {
//     // 🎯 Instead of class, match data-sc-type attribute!
//     let typeLabel = selectedSingleTextType.replace("paragraph", "p"); // p1, p2, p3
//     targetElements = block.querySelectorAll(`p[data-sc-type="${typeLabel}"]`);
//   } else {
//     targetElements = block.querySelectorAll(selectedSingleTextType);
//   }

//   if (!targetElements.length) {
//     showNotification(`No ${selectedSingleTextType} found in block`, "error");
//     return;
//   }

//   let strongFound = false;

//   targetElements.forEach(targetElement => {
//     const strongElements = targetElement.querySelectorAll("strong");
//     if (strongElements.length > 0) {
//       strongFound = true;
//       strongElements.forEach(strong => {
//         strong.style.fontSize = fontSize;
//       });
//     }
//   });

//   if (!strongFound) {
//     showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
//     return;
//   }

//   // 🎯 Now generate final clean CSS
//   const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
//   let styleTag = document.getElementById(styleId);

//   if (!styleTag) {
//     styleTag = document.createElement("style");
//     styleTag.id = styleId;
//     document.head.appendChild(styleTag);
//   }

//   let finalSelector = "";

//   if (selectedSingleTextType.startsWith("paragraph")) {
//     let typeLabel = selectedSingleTextType.replace("paragraph", "p"); // p1, p2, p3
//     finalSelector = `#${block.id} p[data-sc-type="${typeLabel}"] strong`;
//   } else {
//     finalSelector = `#${block.id} ${selectedSingleTextType} strong`;
//   }

//   styleTag.innerHTML = `
//     ${finalSelector} {
//       font-size: ${fontSize} !important;
//     }
//   `;

//   addPendingModification(block.id, {
//     "font-size": fontSize,
//     "target": selectedSingleTextType
//   }, 'strong');

//   // Update UI
//   document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
//     el.classList.remove('sc-activeTab-border');
//     el.classList.add('sc-inActiveTab-border');
//   });
//   clickedElement.classList.remove('sc-inActiveTab-border');
//   clickedElement.classList.add('sc-activeTab-border');

//   showNotification(`Font size applied to bold text inside: ${selectedSingleTextType}`, "success");
// }


// export function handleFontSize(event = null, context = null) {
//   const {
//     lastClickedElement,
//     selectedSingleTextType,
//     saveModifications,
//     addPendingModification,
//     showNotification,
//   } = context;

//   if (!event) {
//     const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
//     if (!activeButton) return;
//     event = { target: activeButton };
//   }

//   const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
//   if (!clickedElement) return;

//   const fontSize = event.target.value + "px";

//   if (!lastClickedElement) {
//     showNotification("Please select a block first", "error");
//     return;
//   }

//   if (!selectedSingleTextType) {
//     showNotification("Please select a text type (Heading or Paragraph)", "error");
//     return;
//   }

//   const block = lastClickedElement.closest('[id^="block-"]');
//   if (!block) {
//     showNotification("Block not found", "error");
//     return;
//   }

//   let targetElements = [];

//   if (selectedSingleTextType.startsWith("paragraph")) {
//     const blockParagraphs = block.querySelectorAll("p");
//     blockParagraphs.forEach(p => {
//       if (selectedSingleTextType === "paragraph1" && p.classList.contains("sqsrte-large")) {
//         targetElements.push(p);
//       } else if (selectedSingleTextType === "paragraph3" && p.classList.contains("sqsrte-small")) {
//         targetElements.push(p);
//       } else if (selectedSingleTextType === "paragraph2" && 
//                  !p.classList.contains("sqsrte-large") && 
//                  !p.classList.contains("sqsrte-small")) {
//         targetElements.push(p);
//       }
//     });
//   } else {
//     targetElements = block.querySelectorAll(selectedSingleTextType);
//   }

//   if (!targetElements.length) {
//     showNotification(`No ${selectedSingleTextType} found in block`, "error");
//     return;
//   }

//   let strongFound = false;
//   targetElements.forEach(targetElement => {
//     const strongElements = targetElement.querySelectorAll("strong");
//     if (strongElements.length > 0) {
//       strongFound = true;
//       strongElements.forEach(strong => {
//         strong.style.fontSize = fontSize;
//       });
//     }
//   });

//   if (!strongFound) {
//     showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
//     return;
//   }

//   // --- ✅ Now generate the correct CSS selector
//   const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
//   let styleTag = document.getElementById(styleId);

//   if (!styleTag) {
//     styleTag = document.createElement("style");
//     styleTag.id = styleId;
//     document.head.appendChild(styleTag);
//   }

//   let paragraphSelector = "";

//   if (selectedSingleTextType === "paragraph1") {
//     paragraphSelector = "p.sqsrte-large";
//   } else if (selectedSingleTextType === "paragraph2") {
//     paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
//   } else if (selectedSingleTextType === "paragraph3") {
//     paragraphSelector = "p.sqsrte-small";
//   } else {
//     paragraphSelector = selectedSingleTextType;
//   }

//   styleTag.innerHTML = `
//     #${block.id} ${paragraphSelector} strong {
//       font-size: ${fontSize} !important;
//     }
//   `;

//   addPendingModification(block.id, {
//     "font-size": fontSize,
//     "target": selectedSingleTextType
//   }, 'strong');

//   // Update UI
//   document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
//     el.classList.remove('sc-activeTab-border');
//     el.classList.add('sc-inActiveTab-border');
//   });
//   clickedElement.classList.remove('sc-inActiveTab-border');
//   clickedElement.classList.add('sc-activeTab-border');

//   showNotification(`Font size applied to bold text inside: ${selectedSingleTextType}`, "success");
// }


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

  let paragraphSelector = "";

  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p1.sqsrte-large";
    console.log("🔍 paragraphSelector:", paragraphSelector);
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p2:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p3.sqsrte-small";
  } else {
    paragraphSelector = selectedSingleTextType;
  }

  console.log("🔍 paragraphSelector:", paragraphSelector);

  // --- ✅ Apply only CSS (no manual inline style on strong)
  const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
    #${block.id} ${paragraphSelector} strong {
      font-size: ${fontSize} !important;
    }
  `;

  // Save modifications
  addPendingModification(block.id, {
    "font-size": fontSize,
    "target": selectedSingleTextType
  }, 'strong');

  // Update UI
  document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
    el.classList.remove('sc-activeTab-border');
    el.classList.add('sc-inActiveTab-border');
  });
  clickedElement.classList.remove('sc-inActiveTab-border');
  clickedElement.classList.add('sc-activeTab-border');

  showNotification(`Font size applied to bold text inside: ${selectedSingleTextType}`, "success");
}





  
  
  






