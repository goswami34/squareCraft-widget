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
  // Use global variables from squareCraft.js if context is not provided
  const lastClickedElement =
    context?.lastClickedElement || window.lastClickedElement;
  const selectedSingleTextType =
    context?.selectedSingleTextType || window.selectedSingleTextType;
  const addPendingModification =
    context?.addPendingModification || window.addPendingModification;

  // Toggle the font family dropdown
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );
  const fontSelect = document.getElementById("scFontSelect");

  if (fontFamilyOptions && fontSelect) {
    const isHidden = fontFamilyOptions.classList.contains("sc-hidden");

    // Hide all other dropdowns first
    document
      .querySelectorAll(
        ".sc-dropdown-options, #scTypographyFontWeightOptions, #scFontSizeOptions"
      )
      .forEach((dropdown) => {
        dropdown.classList.add("sc-hidden");
      });

    if (isHidden) {
      // Show the dropdown
      fontFamilyOptions.classList.remove("sc-hidden");
      console.log("✅ Font family dropdown opened");

      // Initialize font family controls if not already done
      initTypographyFontFamilyControlsIfNeeded(context);
    } else {
      // Hide the dropdown
      fontFamilyOptions.classList.add("sc-hidden");
      console.log("✅ Font family dropdown closed");
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

// Add click event listener to font select container
export function initTypographyFontFamilyEvents(context) {
  const fontSelect = document.getElementById("scFontSelect");
  if (fontSelect) {
    // Remove existing event listeners to prevent duplicates
    fontSelect.removeEventListener("click", handleFontSelectClick);

    // Add new event listener
    fontSelect.addEventListener("click", handleFontSelectClick);

    console.log("✅ Font select event listener initialized");
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", handleOutsideClick);
}

// Handle font select click
function handleFontSelectClick(event) {
  // Don't trigger if clicking on dropdown options
  if (
    event.target.closest("#scTypographyFontFamilyOptions") ||
    event.target.closest("#scTypographyFontWeightOptions")
  ) {
    return;
  }

  // Create context for the event
  const context = {
    lastClickedElement: window.lastClickedElement,
    selectedSingleTextType: window.selectedSingleTextType,
    addPendingModification: window.addPendingModification,
  };

  handleAllFontFamilyClick(event, context);
}

// Handle clicks outside dropdowns
function handleOutsideClick(event) {
  const fontSelect = document.getElementById("scFontSelect");
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );
  const fontWeightOptions = document.getElementById(
    "scTypographyFontWeightOptions"
  );

  if (!fontSelect?.contains(event.target)) {
    fontFamilyOptions?.classList.add("sc-hidden");
    fontWeightOptions?.classList.add("sc-hidden");
  }
}
