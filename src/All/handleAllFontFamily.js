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

  // Toggle the font family dropdown
  const fontFamilyOptions = document.getElementById("scTypographyFontFamilyOptions");
  const fontSelect = document.getElementById("scFontSelect");
  
  if (fontFamilyOptions && fontSelect) {
    const isHidden = fontFamilyOptions.classList.contains("sc-hidden");
    
    // Hide all other dropdowns first
    document.querySelectorAll('.sc-dropdown-options').forEach(dropdown => {
      dropdown.classList.add("sc-hidden");
    });
    
    if (isHidden) {
      fontFamilyOptions.classList.remove("sc-hidden");
      // Initialize font family controls if not already done
      initTypographyFontFamilyControlsIfNeeded(context);
    } else {
      fontFamilyOptions.classList.add("sc-hidden");
    }
  }
}

// Function to initialize typography font family controls
function initTypographyFontFamilyControlsIfNeeded(context) {
  const { lastClickedElement, selectedSingleTextType, addPendingModification } = context;
  
  // Import and initialize the font family controls
  import('./initTypographyFontFamilyControls.js').then(module => {
    const { initTypographyFontFamilyControls } = module;
    
    initTypographyFontFamilyControls(
      () => lastClickedElement,
      addPendingModification,
      showNotification,
      saveTypographyModifications
    );
  }).catch(err => {
    console.error("Failed to load typography font family controls:", err);
  });
}

// Function to save typography modifications
function saveTypographyModifications(blockId, textType, styles) {
  // This function should save the typography modifications to your storage system
  console.log("Saving typography modifications:", { blockId, textType, styles });
  
  // You can implement your save logic here
  // For example, save to localStorage, send to server, etc.
}

// Function to handle font family selection from dropdown
export function handleFontFamilySelection(fontFamily, context) {
  const { lastClickedElement, selectedSingleTextType, addPendingModification } = context;

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

  showNotification(`✅ Font family "${fontFamily}" applied to ${selectedSingleTextType}`, "success");
}

// Add click event listener to font select container
export function initTypographyFontFamilyEvents(context) {
  const fontSelect = document.getElementById("scFontSelect");
  if (fontSelect) {
    fontSelect.addEventListener("click", (event) => {
      // Don't trigger if clicking on dropdown options
      if (event.target.closest('#scTypographyFontFamilyOptions') || 
          event.target.closest('#scTypographyFontWeightOptions')) {
        return;
      }
      
      handleAllFontFamilyClick(event, context);
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    const fontSelect = document.getElementById("scFontSelect");
    const fontFamilyOptions = document.getElementById("scTypographyFontFamilyOptions");
    const fontWeightOptions = document.getElementById("scTypographyFontWeightOptions");
    
    if (!fontSelect?.contains(event.target)) {
      fontFamilyOptions?.classList.add("sc-hidden");
      fontWeightOptions?.classList.add("sc-hidden");
    }
  });
}
