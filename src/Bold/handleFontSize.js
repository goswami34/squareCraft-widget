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

  let targetElements = [];

  if (selectedSingleTextType.startsWith("paragraph")) {
    const blockParagraphs = block.querySelectorAll("p");

    blockParagraphs.forEach(p => {
      const classList = p.classList;

      if (selectedSingleTextType === "paragraph1" && classList.contains("sqsrte-large")) {
        targetElements.push(p);
      } else if (selectedSingleTextType === "paragraph3" && classList.contains("sqsrte-small")) {
        targetElements.push(p);
      } else if (selectedSingleTextType === "paragraph2" && 
                !classList.contains("sqsrte-large") && 
                !classList.contains("sqsrte-small")) {
        targetElements.push(p);
      }
    });
  } else {
    targetElements = block.querySelectorAll(selectedSingleTextType);
  }

  if (!targetElements.length) {
    showNotification(`No ${selectedSingleTextType} found in block`, "error");
    return;
  }

  let strongFound = false;

  targetElements.forEach(targetElement => {
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

  // ✅ Corrected style generator
  const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  let paragraphSelector = "";
  let label = ""; // p1, p2, p3

  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
    label = "p1";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
    label = "p2";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
    label = "p3";
  } else {
    paragraphSelector = selectedSingleTextType;
  }

  // ✅ Now add data-sc-type filter
  let finalSelector = "";

  if (label) {
    if (selectedSingleTextType === "paragraph2") {
      finalSelector = `#${block.id} ${paragraphSelector}[data-sc-type="${label}"] strong`;
    } else {
      finalSelector = `#${block.id} ${paragraphSelector}[data-sc-type="${label}"] strong`;
    }
  } else {
    finalSelector = `#${block.id} ${paragraphSelector} strong`;
  }

  styleTag.innerHTML = `
    ${finalSelector} {
      font-size: ${fontSize} !important;
    }
  `;

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





  
  
  






