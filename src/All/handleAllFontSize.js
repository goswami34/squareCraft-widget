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

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scFontSizeInputLink"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedInput = event.target.closest('[id^="scFontSizeInputLink"]');
  if (!clickedInput) return;

  const fontSize = clickedInput.value + "px";

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

  const blockId = lastClickedElement.id;

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

  console.log("🔎 Applying font-size to links inside:", paragraphSelector);

  let styleTag = document.getElementById(
    `style-${blockId}-${paragraphSelector}-fontsize`
  );
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = `style-${blockId}-${paragraphSelector}-fontsize`;
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
