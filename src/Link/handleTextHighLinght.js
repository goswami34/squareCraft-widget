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

// handleTextHighlight.js
export function handleTextHighlight(
  event,
  {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    showNotification,
  }
) {
  event.preventDefault();
  console.log("handleTextHighlight called with:", {
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

  // Get the color input value
  const colorInput = document.getElementById("scTextHighLight");
  const selectedColor = colorInput.value;
  console.log("Selected highlight color:", selectedColor);

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

  // Apply highlight to all links within the selected elements
  elements.forEach((element) => {
    const links = element.querySelectorAll("a");
    links.forEach((link) => {
      // Create a unique ID for this link's highlight style
      const highlightId = `highlight-${lastClickedElement.id}-${selectedSingleTextType}-${link.textContent}`;

      // Create or update the style tag
      let styleTag = document.getElementById(highlightId);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = highlightId;
        document.head.appendChild(styleTag);
      }

      // Apply the highlight style
      styleTag.innerHTML = `
        #${lastClickedElement.id} ${selectedSingleTextType} a {
          background-image: linear-gradient(to top, ${selectedColor} 50%, transparent 0%);
          display: inline;
        }
      `;
    });
  });

  // Add the modification to the pending list
  addPendingModification({
    type: "text-highlight",
    elementType: selectedSingleTextType,
    value: selectedColor,
    blockId: lastClickedElement.id,
  });

  showNotification(
    `✅ Text highlight applied to links in ${selectedSingleTextType} elements.`,
    "success"
  );
}
