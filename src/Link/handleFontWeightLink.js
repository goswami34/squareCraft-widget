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
    backgroundColor:
      type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3",
  });

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease-in-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// export function handleFontWeightLink(event = null, context = null) {
//   const {
//     lastClickedElement,
//     selectedSingleTextType,
//     addPendingModification,
//     showNotification,
//   } = context;

//   // Get the font weight select element
//   const fontWeightSelect = document.getElementById("squareCraftLinkFontWeight");
//   if (!fontWeightSelect) {
//     showNotification(
//       "Font weight selector not found. Please go to Link section.",
//       "error"
//     );
//     return;
//   }

//   // Get the selected font weight value
//   const fontWeight = fontWeightSelect.value;
//   if (!fontWeight) {
//     showNotification("Please select a font-weight", "error");
//     return;
//   }

//   // Check if a block is selected
//   if (!lastClickedElement) {
//     showNotification("Please select a block first", "error");
//     return;
//   }

//   // Check if a text type is selected
//   if (!selectedSingleTextType) {
//     showNotification(
//       "Please select a text type (h1, h2, p1, etc) first.",
//       "error"
//     );
//     return;
//   }

//   // Get the block element
//   const block = lastClickedElement.closest('[id^="block-"]');
//   if (!block) {
//     showNotification("Block not found", "error");
//     return;
//   }

//   // Determine the selector based on text type
//   let paragraphSelector = "";
//   if (selectedSingleTextType === "paragraph1") {
//     paragraphSelector = "p.sqsrte-large";
//   } else if (selectedSingleTextType === "paragraph2") {
//     paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
//   } else if (selectedSingleTextType === "paragraph3") {
//     paragraphSelector = "p.sqsrte-small";
//   } else if (selectedSingleTextType === "heading1") {
//     paragraphSelector = "h1";
//   } else if (selectedSingleTextType === "heading2") {
//     paragraphSelector = "h2";
//   } else if (selectedSingleTextType === "heading3") {
//     paragraphSelector = "h3";
//   } else if (selectedSingleTextType === "heading4") {
//     paragraphSelector = "h4";
//   } else {
//     showNotification(
//       "Unknown selected type: " + selectedSingleTextType,
//       "error"
//     );
//     return;
//   }

//   // Find all matching elements in the block
//   const targetElements = block.querySelectorAll(paragraphSelector);
//   if (!targetElements.length) {
//     showNotification(
//       `No matching elements found for ${selectedSingleTextType}`,
//       "error"
//     );
//     return;
//   }

//   // Apply font weight to links
//   let linkFound = false;
//   targetElements.forEach((el) => {
//     const links = el.querySelectorAll("a");
//     if (links.length > 0) {
//       linkFound = true;
//       links.forEach((link) => {
//         link.style.fontWeight = fontWeight;
//       });
//     }
//   });

//   if (!linkFound) {
//     showNotification(
//       `No links (<a>) found inside ${selectedSingleTextType}`,
//       "info"
//     );
//     return;
//   }

//   // Create or update style tag
//   const styleId = `style-${block.id}-${selectedSingleTextType}-link-fontweight`;
//   let styleTag = document.getElementById(styleId);
//   if (!styleTag) {
//     styleTag = document.createElement("style");
//     styleTag.id = styleId;
//     document.head.appendChild(styleTag);
//   }

//   // Apply the style
//   styleTag.innerHTML = `
//       #${block.id} ${paragraphSelector} a {
//         font-weight: ${fontWeight} !important;
//       }
//     `;

//   // Save the modification
//   addPendingModification(
//     block.id,
//     {
//       "font-weight": fontWeight,
//       target: selectedSingleTextType,
//       tag: "a",
//     },
//     "link"
//   );

//   // Show success notification
//   showNotification(
//     `Font-weight applied to link words inside: ${selectedSingleTextType}`,
//     "success"
//   );
// }

// In handleFontWeightLink.js


// In handleFontWeightLink.js


// In handleFontWeightLink.js


// In handleFontWeightLink.js

// In handleFontWeightLink.js
// In handleFontWeightLink.js
export function handleFontWeightLink(event, context) {
  console.log("handleFontWeightLink called with context:", context);
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    showNotification
  } = context;

  // Get the font weight select element
  const fontWeightSelect = document.getElementById("squareCraftLinkFontWeight");
  if (!fontWeightSelect) {
    console.log("Font weight selector not found");
    showNotification("Font weight selector not found", "error");
    return;
  }

  // Get the selected font weight value
  const fontWeight = fontWeightSelect.value;
  console.log("Selected font weight:", fontWeight);

  // Check if a block is selected
  if (!lastClickedElement) {
    console.log("No block selected");
    showNotification("❌ Please select a block first", "error");
    return;
  }

  // Check if a text type is selected
  if (!selectedSingleTextType) {
    console.log("No text type selected");
    showNotification("❌ Please select a text type (h1, h2, p1 etc) first", "error");
    return;
  }

  // Get the block element
  const block = lastClickedElement.closest('[id^="block-"]');
  if (!block) {
    console.log("Block not found");
    showNotification("Block not found", "error");
    return;
  }

  // Map text types to selectors
  const selectorMap = {
    'h1': 'h1',
    'h2': 'h2',
    'h3': 'h3',
    'h4': 'h4',
    'p1': 'p.sqsrte-large',
    'p2': 'p:not(.sqsrte-large):not(.sqsrte-small)',
    'p3': 'p.sqsrte-small'
  };

  const selector = selectorMap[selectedSingleTextType];
  if (!selector) {
    console.log("Invalid text type:", selectedSingleTextType);
    showNotification("Invalid text type selected", "error");
    return;
  }

  console.log("Applying font weight to selector:", selector);

  // Find all matching elements in the block
  const targetElements = block.querySelectorAll(selector);
  if (!targetElements.length) {
    console.log("No matching elements found");
    showNotification(`No ${selectedSingleTextType} elements found in selected block`, "error");
    return;
  }

  // Apply font weight to links
  let linkFound = false;
  targetElements.forEach(el => {
    const links = el.querySelectorAll("a");
    if (links.length > 0) {
      linkFound = true;
      links.forEach(link => {
        link.style.fontWeight = fontWeight;
      });
    }
  });

  if (!linkFound) {
    console.log("No links found");
    showNotification(`No links found in ${selectedSingleTextType}`, "info");
    return;
  }

  // Create or update style tag
  const styleId = `style-${block.id}-${selectedSingleTextType}-link-fontweight`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // Apply the style
  styleTag.innerHTML = `
    #${block.id} ${selector} a {
      font-weight: ${fontWeight} !important;
    }
  `;

  // Save the modification
  addPendingModification(block.id, {
    "font-weight": fontWeight,
    target: selectedSingleTextType,
    tag: "a"
  }, "link");

  // Show success notification
  showNotification(`Font weight applied to links in ${selectedSingleTextType}`, "success");
}