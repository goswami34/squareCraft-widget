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

export function handleAllFontSizeClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    showNotification,
    saveModifications,
  } = context;

  if (!lastClickedElement) {
    showNotification("❌ Please select a block first.", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("❌ Please select a text type (h1, h2, p1 etc).", "error");
    return;
  }

  const fontSizeInput = document.getElementById("scAllFontSizeInput");
  if (!fontSizeInput) {
    showNotification("❌ Font size input not found.", "error");
    return;
  }

  const fontSize = fontSizeInput.value + "px";
  const blockId = lastClickedElement.id;

  let selector = "";
  if (selectedSingleTextType.startsWith("h")) {
    selector = selectedSingleTextType;
  } else if (selectedSingleTextType === "p1") {
    selector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "p2") {
    selector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "p3") {
    selector = "p.sqsrte-small";
  }

  let styleTag = document.getElementById(
    `style-${blockId}-${selectedSingleTextType}-fontsize`
  );
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = `style-${blockId}-${selectedSingleTextType}-fontsize`;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${blockId} ${selector} {
        font-size: ${fontSize} !important;
      }
    `;

  addPendingModification(
    blockId,
    { "font-size": fontSize },
    selectedSingleTextType
  );

  if (typeof saveModifications === "function") {
    saveModifications(blockId, { "font-size": fontSize });
  }

  showNotification(
    `✅ Font size applied to ${selectedSingleTextType}.`,
    "success"
  );
}
