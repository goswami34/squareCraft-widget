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

export function handleAllTextHighlightClick(event = null, context = null) {
  const { lastClickedElement, selectedSingleTextType, addPendingModification } =
    context;

  if (!event) {
    event = { target: document.getElementById("texHeightlistPalate") };
  }

  const texHighlightDiv = document.getElementById("texHeightlistPalate");

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

  let selectedHighlightColor = event?.selectedColor
    ? event.selectedColor
    : window.getComputedStyle(texHighlightDiv).backgroundColor;

  const selectorMap = {
    paragraph1: "p.sqsrte-large",
    paragraph2: "p:not(.sqsrte-large):not(.sqsrte-small)",
    paragraph3: "p.sqsrte-small",
    heading1: "h1",
    heading2: "h2",
    heading3: "h3",
    heading4: "h4",
  };

  const paragraphSelector = selectorMap[selectedSingleTextType] || "";

  const targetElements = block.querySelectorAll(`${paragraphSelector} `);
  if (!targetElements.length) {
    showNotification(
      `No ${selectedSingleTextType} tags found inside ${selectedSingleTextType}`,
      "error"
    );
    return;
  }

  console.log("✅ Applying highlight for selector:", paragraphSelector);

  const styleId = `style-${block.id}-${selectedSingleTextType}-highlight`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} {
        background-image: linear-gradient(to top, ${selectedHighlightColor} 50%, transparent 0%);
        display: inline;
      }
    `;

  addPendingModification(block.id, {
    "background-image": `linear-gradient(to top, ${selectedHighlightColor} 50%, transparent 0%)`,
    target: selectedSingleTextType,
  });

  showNotification(
    `Text highlight applied to: ${selectedSingleTextType}`,
    "success"
  );
}
