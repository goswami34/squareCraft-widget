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

// In handleFontWeightLink.js
// export function handleFontWeightLink(event, context) {
//   const {
//     lastClickedElement,
//     selectedSingleTextType,
//     addPendingModification,
//     showNotification,
//   } = context;

//   const fontWeightSelect = document.getElementById("squareCraftLinkFontWeight");
//   if (!fontWeightSelect) {
//     showNotification("Font weight selector not found.", "error");
//     return;
//   }

//   const fontWeight = fontWeightSelect.value;
//   if (!fontWeight) {
//     showNotification("Please select a font-weight.", "error");
//     return;
//   }

//   if (!lastClickedElement) {
//     showNotification("❌ Please select a block first.", "error");
//     return;
//   }

//   if (!selectedSingleTextType) {
//     showNotification("❌ Please select a text type (h1, h2, p1 etc).", "error");
//     return;
//   }

//   const block = lastClickedElement.closest('[id^="block-"]');
//   if (!block) {
//     showNotification("❌ Block not found.", "error");
//     return;
//   }

//   // ✅ Map text types to selectors
//   const typeMap = {
//     h1: "h1",
//     h2: "h2",
//     h3: "h3",
//     h4: "h4",
//     p1: "p.sqsrte-large",
//     p2: "p:not(.sqsrte-large):not(.sqsrte-small)",
//     p3: "p.sqsrte-small",
//   };

//   const selector = typeMap[selectedSingleTextType];
//   if (!selector) {
//     showNotification("❌ Invalid text type selected.", "error");
//     return;
//   }

//   const elements = block.querySelectorAll(selector);
//   if (!elements.length) {
//     showNotification(`No ${selectedSingleTextType} elements found.`, "error");
//     return;
//   }

//   let linkFound = false;
//   elements.forEach((el) => {
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
//       `ℹ️ No links (<a>) found inside ${selectedSingleTextType}`,
//       "info"
//     );
//     return;
//   }

//   // ✅ Apply persistent styles
//   const styleId = `style-${block.id}-${selectedSingleTextType}-link-fontweight`;
//   let styleTag = document.getElementById(styleId);
//   if (!styleTag) {
//     styleTag = document.createElement("style");
//     styleTag.id = styleId;
//     document.head.appendChild(styleTag);
//   }

//   styleTag.innerHTML = `
//     #${block.id} ${selector} a {
//       font-weight: ${fontWeight} !important;
//     }
//   `;

//   addPendingModification(
//     block.id,
//     {
//       "font-weight": fontWeight,
//       target: selectedSingleTextType,
//       tag: "a",
//     },
//     "link"
//   );

//   showNotification(
//     `✅ Font weight applied to link words in ${selectedSingleTextType}`,
//     "success"
//   );
// }

export function handleFontWeightLink(
  event,
  {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    showNotification,
  }
) {
  event.preventDefault();
  console.log("handleFontWeightLink called with:", {
    lastClickedElement,
    selectedSingleTextType,
  });

  if (!lastClickedElement) {
    showNotification("❌ Please select a block first.", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification(
      "❌ Please select a text type (h1, h2, p1 etc) first.",
      "error"
    );
    return;
  }

  const selectedFontWeight = event.target.value;
  console.log("Selected font weight:", selectedFontWeight);

  // Find all elements of the selected type within the block
  const elements = lastClickedElement.querySelectorAll(selectedSingleTextType);
  console.log("Found elements:", elements.length);

  if (elements.length === 0) {
    showNotification(
      `❌ No ${selectedSingleTextType} elements found in the selected block.`,
      "error"
    );
    return;
  }

  // Apply the font weight to each element
  elements.forEach((element) => {
    element.style.fontWeight = selectedFontWeight;
  });

  // Add the modification to the pending list
  addPendingModification({
    type: "font-weight",
    elementType: selectedSingleTextType,
    value: selectedFontWeight,
    blockId: lastClickedElement.id,
  });

  showNotification(
    `✅ Font weight updated for ${selectedSingleTextType} elements.`,
    "success"
  );
}
