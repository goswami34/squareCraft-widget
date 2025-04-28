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

export function handleAllFontFamilyClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    showNotification,
  } = context;

  if (!event) {
    event = { target: document.getElementById("squareCraftAllFontFamily") };
  }

  const selectedFontFamily = event.target.value;

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

  //   const selectorMap = {
  //     paragraph1: "p.sqsrte-large",
  //     paragraph2: "p:not(.sqsrte-large):not(.sqsrte-small)",
  //     paragraph3: "p.sqsrte-small",
  //     heading1: "h1",
  //     heading2: "h2",
  //     heading3: "h3",
  //     heading4: "h4",
  //   };

  //   const paragraphSelector = selectorMap[selectedSingleTextType] || "";

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
    showNotification("Unknown text type", "error");
    return;
  }
  d;

  console.log("🔍 paragraphSelector:", paragraphSelector);

  if (!paragraphSelector) {
    showNotification("Selector not found", "error");
    return;
  }

  const styleId = `style-${block.id}-${selectedSingleTextType}-fontFamily`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} {
        font-family: '${selectedFontFamily}' !important;
      }
    `;

  addPendingModification(block.id, {
    "font-family": selectedFontFamily,
    target: selectedSingleTextType,
  });

  showNotification(
    `✅ Font family "${selectedFontFamily}" applied to ${selectedSingleTextType}`,
    "success"
  );
}
