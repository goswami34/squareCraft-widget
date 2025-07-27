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

// Function to wait for typography elements to be available
function waitForTypographyElements() {
  return new Promise((resolve, reject) => {
    const checkElements = () => {
      const fontSelect = document.getElementById("scFontSelect");
      const fontFamilyOptions = document.getElementById(
        "scTypographyFontFamilyOptions"
      );

      if (fontSelect && fontFamilyOptions) {
        console.log("✅ Typography elements found");
        resolve({ fontSelect, fontFamilyOptions });
      } else {
        console.log("⏳ Waiting for typography elements...");
        setTimeout(checkElements, 100);
      }
    };

    checkElements();

    // Timeout after 10 seconds
    setTimeout(() => {
      reject(new Error("Typography elements not found after 10 seconds"));
    }, 10000);
  });
}

// Main function to handle font family dropdown toggle
export async function handleAllFontFamilyClick(event = null, context = null) {
  const fontSelect = document.getElementById("scFontSelect");
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );

  console.log("🔍 handleAllFontFamilyClick called");
  console.log("- fontSelect:", fontSelect ? "Found" : "Not found");
  console.log(
    "- fontFamilyOptions:",
    fontFamilyOptions ? "Found" : "Not found"
  );

  if (fontSelect && fontFamilyOptions) {
    // Toggle the dropdown
    const wasHidden = fontFamilyOptions.classList.contains("sc-hidden");
    fontFamilyOptions.classList.toggle("sc-hidden");
    const isNowHidden = fontFamilyOptions.classList.contains("sc-hidden");

    console.log("✅ Font family dropdown toggled:");
    console.log("- Was hidden:", wasHidden);
    console.log("- Is now hidden:", isNowHidden);
    console.log("- Dropdown is now:", isNowHidden ? "Hidden" : "Visible");

    // Initialize font family controls if dropdown is now visible
    if (!isNowHidden) {
      console.log("🔄 Initializing font family controls...");
      initTypographyFontFamilyControlsIfNeeded(context);
    }
  } else {
    console.warn("❌ Font family dropdown elements not found");
    console.log("- fontSelect element:", fontSelect);
    console.log("- fontFamilyOptions element:", fontFamilyOptions);
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
export async function handleFontFamilySelection(fontFamily, context) {
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
  addPendingModification(
    block.id,
    {
      "font-family": fontFamily,
      target: selectedSingleTextType,
    },
    "typographyFontFamily"
  );

  // ✅ TRIGGER PUBLISH BUTTON FUNCTIONALITY
  if (window.handlePublish) {
    console.log(
      "🚀 Triggering publish functionality for font-family modification..."
    );

    // Simulate publish button click
    const publishButton = document.getElementById("publish");
    if (publishButton) {
      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      try {
        await window.handlePublish();
        console.log(
          "✅ Publish completed successfully for font-family modification"
        );
      } catch (error) {
        console.error("❌ Error during publish:", error);
        showNotification(`❌ Publish error: ${error.message}`, "error");
      } finally {
        // Reset button state
        publishButton.disabled = false;
        publishButton.textContent = "Publish";
      }
    } else {
      console.warn(
        "⚠️ Publish button not found, calling handlePublish directly"
      );
      try {
        await window.handlePublish();
      } catch (error) {
        console.error("❌ Error calling handlePublish directly:", error);
      }
    }
  } else {
    console.warn("⚠️ handlePublish function not available globally");
  }

  showNotification(
    `✅ Font family "${fontFamily}" applied to ${selectedSingleTextType}`,
    "success"
  );
}

// Initialize typography font family events (like button implementation)
export function initTypographyFontFamilyEvents(context) {
  console.log("🔍 Initializing typography font family events...");

  // Wait for typography elements to be available
  waitForTypographyElements()
    .then(({ fontSelect, fontFamilyOptions }) => {
      console.log("✅ Typography elements found, adding event listeners...");

      // Add click event listener to font select (like button implementation)
      fontSelect.addEventListener("click", (event) => {
        console.log("🎯 Font select clicked!");
        event.stopPropagation();
        handleAllFontFamilyClick(event, context);
      });

      // Close dropdown when clicking outside (like button implementation)
      document.addEventListener("click", (event) => {
        if (!fontSelect.contains(event.target)) {
          fontFamilyOptions.classList.add("sc-hidden");
        }
      });

      console.log("✅ Typography font family events initialized successfully");
    })
    .catch((error) => {
      console.warn("⚠️ Could not initialize typography events:", error.message);

      // Retry after a delay
      setTimeout(() => {
        console.log("🔄 Retrying typography event initialization...");
        initTypographyFontFamilyEvents(context);
      }, 2000);
    });
}

// Simple manual fix function - call this if dropdown is not working
export function manualFixTypographyDropdown() {
  console.log("🔧 Manual fix: Setting up typography dropdown...");

  const fontSelect = document.getElementById("scFontSelect");
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );

  if (!fontSelect || !fontFamilyOptions) {
    console.error("❌ Manual fix failed - elements not found");
    return false;
  }

  // Remove any existing event listeners
  const newFontSelect = fontSelect.cloneNode(true);
  fontSelect.parentNode.replaceChild(newFontSelect, fontSelect);

  // Add simple click handler
  newFontSelect.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("🎯 Font select clicked (manual fix)");

    const isHidden = fontFamilyOptions.classList.contains("sc-hidden");

    if (isHidden) {
      // Show dropdown with forced styles
      fontFamilyOptions.classList.remove("sc-hidden");
      fontFamilyOptions.style.display = "block";
      fontFamilyOptions.style.opacity = "1";
      fontFamilyOptions.style.visibility = "visible";
      fontFamilyOptions.style.maxHeight = "240px";
      fontFamilyOptions.style.overflow = "auto";
      fontFamilyOptions.style.zIndex = "9999";
      console.log("✅ Dropdown forced to show");
    } else {
      // Hide dropdown
      fontFamilyOptions.classList.add("sc-hidden");
      fontFamilyOptions.style.display = "none";
      fontFamilyOptions.style.opacity = "0";
      fontFamilyOptions.style.visibility = "hidden";
      fontFamilyOptions.style.maxHeight = "0";
      fontFamilyOptions.style.overflow = "hidden";
      console.log("✅ Dropdown hidden");
    }

    // Initialize fonts if dropdown is now visible
    if (!fontFamilyOptions.classList.contains("sc-hidden")) {
      console.log("🔄 Loading fonts...");
      initTypographyFontFamilyControlsIfNeeded({
        lastClickedElement: document.querySelector('[id^="block-"]'),
        selectedSingleTextType: "paragraph1",
        addPendingModification: (blockId, modifications) => {
          console.log("Modification:", { blockId, modifications });
        },
      });
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!newFontSelect.contains(event.target)) {
      fontFamilyOptions.classList.add("sc-hidden");
      fontFamilyOptions.style.display = "none";
      fontFamilyOptions.style.opacity = "0";
      fontFamilyOptions.style.visibility = "hidden";
      fontFamilyOptions.style.maxHeight = "0";
      fontFamilyOptions.style.overflow = "hidden";
    }
  });

  console.log("✅ Manual fix applied - dropdown should now work");
  return true;
}
