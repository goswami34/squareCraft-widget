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




// export function handleItalicTextTransformClick(event = null, context = null) {
//   const {
//     lastClickedElement,
//     selectedSingleTextType,
//     addPendingModification,
//     saveModifications,
//   } = context;

//   if (!event) {
//     const activeButton = document.querySelector(
//       '[id^="scTextTransform"].sc-activeTab-border'
//     );
//     if (!activeButton) return;
//     event = { target: activeButton };
//   }

//   // Get the clicked transform button
//   const clickedTransform = event.target.closest('[data-text-transform]');
//   console.log("🔎 Clicked transform:", clickedTransform);
//   if (!clickedTransform) return;

//   // Get the text transform value from the data attribute
//   const textTransform = clickedTransform.getAttribute('data-text-transform');
//   console.log("🔎 Text transform:", textTransform);

//   if (!lastClickedElement) {
//     showNotification("Please select a block first", "error");
//     return;
//   }

//   if (!selectedSingleTextType) {
//     showNotification("Please select a text type first", "error");
//     return;
//   }

//   const block = lastClickedElement.closest('[id^="block-"]');
//   if (!block) {
//     showNotification("Block not found", "error");
//     return;
//   }

//   // Correct Paragraph Selector Setup
//   let paragraphSelector = "";
//   if (selectedSingleTextType === "paragraph1") {
//     paragraphSelector = "p.sqsrte-large";
//   } else if (selectedSingleTextType === "paragraph2") {
//     paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
//   } else if (selectedSingleTextType === "paragraph3") {
//     paragraphSelector = "p.sqsrte-small";
//   } else if (selectedSingleTextType.startsWith("heading")) {
//     paragraphSelector = `h${selectedSingleTextType.replace("heading", "")}`;
//   } else {
//     paragraphSelector = selectedSingleTextType;
//   }

//   // Check if there are any em tags in the selected elements
//   const targetElements = block.querySelectorAll(paragraphSelector);
//   if (!targetElements.length) {
//     showNotification(
//       `No ${selectedSingleTextType} found inside block`,
//       "error"
//     );
//     return;
//   }

//   let hasEmTags = false;
//   targetElements.forEach(element => {
//     if (element.querySelector('em')) {
//       hasEmTags = true;
//     }
//   });

//   if (!hasEmTags) {
//     showNotification(`No italic text (<em>) found in ${selectedSingleTextType}`, "info");
//     return;
//   }

//   // Dynamic CSS Inject
//   const styleId = `style-${block.id}-${selectedSingleTextType}-italic-texttransform`;
//   let styleTag = document.getElementById(styleId);

//   if (!styleTag) {
//     styleTag = document.createElement("style");
//     styleTag.id = styleId;
//     document.head.appendChild(styleTag);
//   }

//   // Apply text-transform only to em tags within the selected elements
//   styleTag.innerHTML = `
//     #${block.id} ${paragraphSelector} em {
//       text-transform: ${textTransform} !important;
//     }
//   `;

//   // Save Modification (for API persistence)
//   addPendingModification(
//     block.id,
//     {
//       "text-transform": textTransform,
//       target: selectedSingleTextType,
//     },
//     "em"
//   );

//   // Update Active Tab UI
//   document.querySelectorAll('[data-text-transform]').forEach((el) => {
//     el.classList.remove("sc-activeTab-border");
//     el.classList.add("sc-inActiveTab-border");
//   });
//   clickedTransform.classList.remove("sc-inActiveTab-border");
//   clickedTransform.classList.add("sc-activeTab-border");

//   showNotification(
//     `✅ Text transform applied to italic text in ${selectedSingleTextType}`,
//     "success"
//   );
// }


export function handleItalicTextTransformClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveModifications,
  } = context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scTextTransform"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  // Get the clicked transform button
  const clickedTransform = event.target.closest('[data-text-transform]');
  console.log("🔎 Clicked transform:", clickedTransform);
  if (!clickedTransform) return;

  // Get the text transform value from the data attribute
  const textTransform = clickedTransform.getAttribute('data-text-transform');
  console.log("🔎 Text transform:", textTransform);

  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("Please select a text type first", "error");
    return;
  }

  const block = lastClickedElement.closest('[id^="block-"]');
  if (!block) {
    showNotification("Block not found", "error");
    return;
  }

  // Correct Paragraph Selector Setup
  let paragraphSelector = "";
  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
  } else if (selectedSingleTextType.startsWith("heading")) {
    paragraphSelector = `h${selectedSingleTextType.replace("heading", "")}`;
  } else {
    paragraphSelector = selectedSingleTextType;
  }

  // Check if there are any em tags in the selected elements
  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(
      `No ${selectedSingleTextType} found inside block`,
      "error"
    );
    return;
  }

  let hasEmTags = false;
  targetElements.forEach(element => {
    if (element.querySelector('em')) {
      hasEmTags = true;
    }
  });

  console.log("🔎 Has em tags:", hasEmTags);

  if (!hasEmTags) {
    showNotification(`No italic text (<em>) found in ${selectedSingleTextType}`, "info");
    return;
  }

  // Dynamic CSS Inject with correct selector
  const styleId = `style-${block.id}-${selectedSingleTextType}-italic-texttransform`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // Correct CSS selector to target only em tags within the paragraph
  styleTag.innerHTML = `
    #${block.id} ${paragraphSelector} em {
      text-transform: ${textTransform} !important;
    }
  `;

  // Save Modification (for API persistence)
  addPendingModification(
    block.id,
    {
      "text-transform": textTransform,
      target: selectedSingleTextType,
    },
    "em"
  );

  // Update Active Tab UI
  document.querySelectorAll('[data-text-transform]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedTransform.classList.remove("sc-inActiveTab-border");
  clickedTransform.classList.add("sc-activeTab-border");

  showNotification(
    `✅ Text transform applied to italic text in ${selectedSingleTextType}`,
    "success"
  );
}




