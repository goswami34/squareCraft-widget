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

// Main function to handle font family dropdown toggle
export function handleAllFontFamilyClick(event = null, context = null) {
  const fontSelect = document.getElementById("scFontSelect");
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );

  if (fontSelect && fontFamilyOptions) {
    // Toggle the dropdown
    fontFamilyOptions.classList.toggle("sc-hidden");
    console.log(
      "✅ Font family dropdown toggled:",
      !fontFamilyOptions.classList.contains("sc-hidden")
    );

    // Initialize font family controls if dropdown is now visible
    if (!fontFamilyOptions.classList.contains("sc-hidden")) {
      initTypographyFontFamilyControlsIfNeeded(context);
    }
  } else {
    console.warn("❌ Font family dropdown elements not found");
  }
}

// Function to initialize typography font family controls
function initTypographyFontFamilyControlsIfNeeded(context) {
  const lastClickedElement =
    context?.lastClickedElement || window.lastClickedElement;
  const selectedSingleTextType =
    context?.selectedSingleTextType || window.selectedSingleTextType;
  const addPendingModification =
    context?.addPendingModification || window.addPendingModification;

  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );

  // Check if fonts are already loaded
  if (fontFamilyOptions && fontFamilyOptions.children.length > 0) {
    console.log("✅ Fonts already loaded, skipping initialization");
    return;
  }

  // Import and initialize the font family controls
  import("./initTypographyFontFamilyControls.js")
    .then((module) => {
      const { initTypographyFontFamilyControls } = module;

      initTypographyFontFamilyControls(
        () => lastClickedElement,
        addPendingModification,
        showNotification,
        saveTypographyModifications
      );
    })
    .catch((err) => {
      console.error("Failed to load typography font family controls:", err);
    });
}

// Function to save typography modifications
function saveTypographyModifications(blockId, textType, styles) {
  // This function should save the typography modifications to your storage system
  console.log("Saving typography modifications:", {
    blockId,
    textType,
    styles,
  });

  // You can implement your save logic here
  // For example, save to localStorage, send to server, etc.
}

// Function to handle font family selection from dropdown
export function handleFontFamilySelection(fontFamily, context) {
  const lastClickedElement =
    context?.lastClickedElement || window.lastClickedElement;
  const selectedSingleTextType =
    context?.selectedSingleTextType || window.selectedSingleTextType;
  const addPendingModification =
    context?.addPendingModification || window.addPendingModification;

  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("Please select a text type first", "error");
    return;
  }

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

  if (!paragraphSelector) {
    showNotification("Please select a valid text type first", "error");
    return;
  }

  // Update the font name display
  const fontNameLabel = document.getElementById("scTypographyFontName");
  if (fontNameLabel) {
    fontNameLabel.innerText = fontFamily;
    fontNameLabel.style.fontFamily = `"${fontFamily}", sans-serif`;
  }

  // Apply style to DOM
  const styleId = `style-${block.id}-${selectedSingleTextType}-fontFamily`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
    #${block.id} ${paragraphSelector} {
      font-family: '${fontFamily}' !important;
    }
  `;

  // Save to pending modifications
  addPendingModification(block.id, {
    "font-family": fontFamily,
    target: selectedSingleTextType,
  });

  showNotification(
    `✅ Font family "${fontFamily}" applied to ${selectedSingleTextType}`,
    "success"
  );
}

// Initialize typography font family events (like button implementation)
export function initTypographyFontFamilyEvents(context) {
  const fontSelect = document.getElementById("scFontSelect");
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );

  if (fontSelect && fontFamilyOptions) {
    // Add click event listener to font select (like button implementation)
    fontSelect.addEventListener("click", (event) => {
      event.stopPropagation();
      handleAllFontFamilyClick(event, context);
    });

    // Close dropdown when clicking outside (like button implementation)
    document.addEventListener("click", (event) => {
      if (!fontSelect.contains(event.target)) {
        fontFamilyOptions.classList.add("sc-hidden");
      }
    });

    console.log("✅ Typography font family events initialized");
  } else {
    console.warn(
      "⚠️ Typography font family elements not found for event initialization"
    );
  }
}
