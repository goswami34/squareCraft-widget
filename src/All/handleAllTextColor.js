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

export function handleAllTextColorClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveTypographyAllModifications,
  } = context;

  if (!event) {
    event = { target: document.getElementById("textColorPalate") };
  }

  const textColorDiv = document.getElementById("textColorPalate");
  //   const textColor = window.getComputedStyle(textColorDiv).backgroundColor; // 🛠

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

  let textColor = null;

  if (event?.selectedColor) {
    // ✅ If manually passed selectedColor (from color picker)
    textColor = event.selectedColor;
  } else {
    // ✅ Otherwise get background color from div
    const textColorDiv = document.getElementById("textColorPalate");
    textColor = window.getComputedStyle(textColorDiv).backgroundColor;
  }

  let paragraphSelector = "";

  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
  } else if (selectedSingleTextType === "heading1") {
    paragraphSelector = "h1";
  } else if (selectedSingleTextType === "heading2") {
    paragraphSelector = "h2";
  } else if (selectedSingleTextType === "heading3") {
    paragraphSelector = "h3";
  } else if (selectedSingleTextType === "heading4") {
    paragraphSelector = "h4";
  } else {
    return;
  }

  console.log("✅ Applying text color for selector:", paragraphSelector);

  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  const styleId = `style-${block.id}-${selectedSingleTextType}-all-textColor`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} {
        color: ${textColor} !important;
      }
    `;

  // ✅ ADD TO PENDING MODIFICATIONS FOR PUBLISH BUTTON
  console.log("📝 Adding text color modification to pending modifications...");

  addPendingModification(
    block.id,
    {
      color: textColor,
      target: selectedSingleTextType,
    },
    "typographyTextColor"
  );

  console.log(
    "✅ Text color modification added to pending modifications. Click 'Publish' to save to database."
  );

  showNotification(
    `✅ Text color applied to: ${selectedSingleTextType}`,
    "success"
  );
}
