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

// export function handleAllFontSizeClick(event = null, context = null) {
//   const {
//     lastClickedElement,
//     selectedSingleTextType,
//     addPendingModification,
//     showNotification,
//     saveModifications,
//   } = context;

//   // Get the font size input
//   const fontSizeInput = document.getElementById("scAllFontSizeInput");
//   if (!fontSizeInput) return;

//   const fontSize = fontSizeInput.value + "px";

//   // Validate block selection
//   if (!lastClickedElement) {
//     showNotification("Please select a block first", "error");
//     return;
//   }

//   // Validate text type selection
//   if (!selectedSingleTextType) {
//     showNotification("Please select a text type first", "error");
//     return;
//   }

//   // Get the block element
//   const block = lastClickedElement.closest('[id^="block-"]');
//   if (!block) {
//     showNotification("Block not found", "error");
//     return;
//   }

//   const blockId = block.id;
//   console.log("🔍 blockId:", blockId);

//   // Set up the correct selector based on text type
//   let paragraphSelector = "";
//   switch (selectedSingleTextType) {
//     case "paragraph1":
//       paragraphSelector = "p.sqsrte-large";
//       break;
//     case "paragraph2":
//       paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
//       break;
//     case "paragraph3":
//       paragraphSelector = "p.sqsrte-small";
//       break;
//     case "heading1":
//     case "heading2":
//     case "heading3":
//     case "heading4":
//     case "heading5":
//     case "heading6":
//       paragraphSelector = `h${selectedSingleTextType.replace("heading", "")}`;
//       break;
//     default:
//       paragraphSelector = selectedSingleTextType;
//   }

//   // Apply font size directly to elements for immediate feedback
//   const elements = block.querySelectorAll(paragraphSelector);
//   elements.forEach((el) => {
//     el.style.fontSize = fontSize;
//   });

//   // Create or update style tag for persistence
//   const styleId = `style-${blockId}-${paragraphSelector}-fontsize`;
//   let styleTag = document.getElementById(styleId);

//   if (!styleTag) {
//     styleTag = document.createElement("style");
//     styleTag.id = styleId;
//     document.head.appendChild(styleTag);
//   }

//   styleTag.innerHTML = `
//       #${blockId} ${paragraphSelector} {
//         font-size: ${fontSize} !important;
//       }
//     `;

//   // Save the modification
//   addPendingModification(
//     blockId,
//     { "font-size": fontSize },
//     selectedSingleTextType
//   );

//   // Save to storage if available
//   if (typeof saveModifications === "function") {
//     saveModifications(blockId, { "font-size": fontSize });
//   }

//   // Show success notification
//   showNotification(
//     `✅ Font size applied to ${selectedSingleTextType}.`,
//     "success"
//   );
// }

export function handleAllFontSizeClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    saveModifications,
    addPendingModification,
    showNotification,
  } = context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scAllFontSizeInput"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedElement = event.target.closest('[id^="scAllFontSizeInput"]');
  if (!clickedElement) return;

  const fontSize = event.target.value + "px";

  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification(
      "Please select a text type (Heading or Paragraph)",
      "error"
    );
    return;
  }

  const block = lastClickedElement.closest('[id^="block-"]');
  if (!block) {
    showNotification("Block not found", "error");
    return;
  }

  // STEP 1️⃣: Correct selector for paragraph based on p1 / p2 / p3
  let paragraphSelector = "";

  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
  } else {
    paragraphSelector = selectedSingleTextType; // headings like h1, h2, h3, h4
  }

  console.log("🔍 paragraphSelector:", paragraphSelector);

  // STEP 2️⃣: Find correct paragraph inside the block
  const targetParagraphs = block.querySelectorAll(paragraphSelector);
  if (!targetParagraphs.length) {
    showNotification(
      `No paragraph found for ${selectedSingleTextType}`,
      "error"
    );
    return;
  }

  // STEP 4️⃣: Also apply CSS dynamically to ensure persistence after reload
  const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} {
        font-size: ${fontSize} !important;
      }
    `;

  addPendingModification(block.id, {
    "font-size": fontSize,
    target: selectedSingleTextType,
  });

  // STEP 5️⃣: Update UI highlighting
  document.querySelectorAll('[id^="scAllFontSizeInput"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedElement.classList.remove("sc-inActiveTab-border");
  clickedElement.classList.add("sc-activeTab-border");

  showNotification(
    `✅ Font size applied to bold text inside: ${selectedSingleTextType}`,
    "success"
  );
}
