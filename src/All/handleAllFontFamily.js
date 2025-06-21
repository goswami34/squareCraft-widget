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
  const { lastClickedElement, selectedSingleTextType, addPendingModification } =
    context;

  if (!event) {
    event = { target: document.getElementById("squareCraftAllFontFamily") };
  }

  const selectedFontFamily = event.target.value;

  // if (!lastClickedElement) {
  //   showNotification("Please select a block first", "error");
  //   return;
  // }

  // if (!selectedSingleTextType) {
  //   showNotification("Please select a text type first", "error");
  //   return;
  // }

  //   const block = lastClickedElement.closest('[id^="block-"]');

  let block = lastClickedElement;
  if (!block || !block.id || !block.id.startsWith("block-")) {
    block = lastClickedElement?.closest('[id^="block-"]');
  }
  if (!block) {
    showNotification("Block not found", "error");
    return;
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
  }

  // Check if paragraphSelector is empty
  if (!paragraphSelector) {
    showNotification("Please select a valid text type first", "error");
    return;
  }

  // When a text type is selected
  const selectedElements = block.querySelectorAll(paragraphSelector);
  console.log("🔍 selectedElements:", selectedElements);
  if (selectedElements.length > 0) {
    const currentFontFamily = window.getComputedStyle(
      selectedElements[0]
    ).fontFamily;
    console.log("🔍 currentFontFamily:", currentFontFamily);
    // Update dropdown to show current font family
    const fontFamilyDropdown = document.getElementById(
      "squareCraftAllFontFamily"
    );
    if (fontFamilyDropdown) {
      // Find and select the matching option
      for (let i = 0; i < fontFamilyDropdown.options.length; i++) {
        if (fontFamilyDropdown.options[i].value === currentFontFamily) {
          fontFamilyDropdown.selectedIndex = i;
          break;
        }
      }
    }
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

  showNotification();
  // `✅ Font family "${selectedFontFamily}" applied to ${selectedSingleTextType}`,
  // "success"
}
