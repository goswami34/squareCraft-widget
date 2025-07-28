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

// Store pending font weight modifications locally (like font size controls)
const pendingFontWeightModifications = new Map();

export function handleAllFontWeightClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveTypographyAllModifications,
  } = context;

  if (!event) {
    event = { target: document.getElementById("squareCraftAllFontWeight") };
  }

  const fontWeight = event.target.value;

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

  let paragraphSelector = "";

  // 🎯 Correct mapping here - Fixed to handle all text types properly
  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
  } else if (selectedSingleTextType.startsWith("heading")) {
    paragraphSelector = `h${selectedSingleTextType.replace("heading", "")}`;
  } else {
    paragraphSelector = selectedSingleTextType; // fallback for h1, h2, h3, h4
  }

  console.log("✅ Applying font-weight for selector:", paragraphSelector);

  // Find target paragraphs or headings
  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // Remove all inline fontWeight from block and descendants
  block.querySelectorAll("*").forEach((el) => {
    el.style.fontWeight = "";
  });
  // Also clear on the block itself
  block.style.fontWeight = "";

  // Inject CSS to apply font-weight to all text in the block/paragraph/heading
  const styleId = `style-${block.id}-${selectedSingleTextType}-all-fontWeight`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }
  styleTag.innerHTML = `
    #${block.id} ${paragraphSelector},
    #${block.id} ${paragraphSelector} * {
      font-weight: ${fontWeight} !important;
    }
  `;

  // Create specific selector for better targeting
  let specificSelector = "";
  if (selectedSingleTextType === "paragraph1") {
    specificSelector = `#${block.id} p.sqsrte-large`;
  } else if (selectedSingleTextType === "paragraph2") {
    specificSelector = `#${block.id} p:not(.sqsrte-large):not(.sqsrte-small)`;
  } else if (selectedSingleTextType === "paragraph3") {
    specificSelector = `#${block.id} p.sqsrte-small`;
  } else if (selectedSingleTextType.startsWith("heading")) {
    const headingNumber = selectedSingleTextType.replace("heading", "");
    specificSelector = `#${block.id} h${headingNumber}`;
  } else {
    specificSelector = `#${block.id} ${selectedSingleTextType}`;
  }

  // ✅ ADD TO PENDING MODIFICATIONS FOR PUBLISH BUTTON
  console.log("📝 Adding font-weight modification to pending modifications...");

  // Store font weight modification locally (like font size controls)
  const fontWeightData = {
    "font-weight": fontWeight,
    target: selectedSingleTextType,
    selector: specificSelector,
  };

  pendingFontWeightModifications.set(block.id, fontWeightData);

  // Also add to global pending modifications for compatibility
  if (addPendingModification) {
    addPendingModification(block.id, fontWeightData, "typographyFontWeight");
  }

  console.log(
    "📝 Font-weight modification added to pending modifications. Click 'Publish' to save to database."
  );

  // Debug: Log the current pending modifications
  console.log(
    "🔍 Current pending font weight modifications:",
    pendingFontWeightModifications
  );
  console.log(
    "🔍 Pending font weight modifications size:",
    pendingFontWeightModifications.size
  );

  // Update active button - Fixed to target the correct element
  const clickedElement = event.target.closest('[id^="scFontWeight"]');
  if (clickedElement) {
    document.querySelectorAll('[id^="scFontWeight"]').forEach((el) => {
      el.classList.remove("sc-activeTab-border");
      el.classList.add("sc-inActiveTab-border");
    });
    clickedElement.classList.remove("sc-inActiveTab-border");
    clickedElement.classList.add("sc-activeTab-border");
  }

  showNotification(
    `✅ Font-weight applied to: ${selectedSingleTextType}`,
    "success"
  );
}

// Function to publish all pending font weight modifications (like font size controls)
const publishPendingFontWeightModifications = async (
  saveTypographyAllModifications
) => {
  if (pendingFontWeightModifications.size === 0) {
    console.log("No font weight changes to publish");
    return;
  }

  try {
    console.log(
      "🔄 Publishing font weight modifications:",
      pendingFontWeightModifications
    );

    for (const [blockId, fontWeightData] of pendingFontWeightModifications) {
      if (typeof saveTypographyAllModifications === "function") {
        console.log(
          "Publishing font weight for block:",
          blockId,
          fontWeightData
        );
        const result = await saveTypographyAllModifications(
          blockId,
          fontWeightData,
          fontWeightData.target
        );
        console.log("✅ Font weight modification result:", result);

        if (!result?.success) {
          throw new Error(
            `Failed to save font weight changes for block ${blockId}: ${
              result?.error || "Unknown error"
            }`
          );
        }
      } else {
        console.error(
          "❌ saveTypographyAllModifications function not available"
        );
        throw new Error("Typography save function not available");
      }
    }

    // Clear pending modifications after successful publish
    pendingFontWeightModifications.clear();
    console.log("✅ All font weight changes published successfully!");
    showNotification(
      "All font weight changes published successfully!",
      "success"
    );
  } catch (error) {
    console.error("❌ Failed to publish font weight modifications:", error);
    showNotification(
      `Failed to publish font weight changes: ${error.message}`,
      "error"
    );
    throw error;
  }
};

// ✅ INITIALIZE PUBLISH BUTTON FOR FONT WEIGHT (like font size controls)
export function initFontWeightPublishButton(saveTypographyAllModifications) {
  const publishButton = document.getElementById("publish");
  if (!publishButton) {
    console.warn("Publish button not found");
    return;
  }

  console.log("🔍 Found publish button for font weight:", publishButton);
  console.log(
    "🔍 saveTypographyAllModifications function:",
    typeof saveTypographyAllModifications
  );

  // Remove existing listener to avoid duplicates
  publishButton.removeEventListener(
    "click",
    publishButton.fontWeightPublishHandler
  );

  // Create new handler
  publishButton.fontWeightPublishHandler = async () => {
    try {
      console.log("🚀 Font weight publish handler triggered");

      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      await publishPendingFontWeightModifications(
        saveTypographyAllModifications
      );
    } catch (error) {
      console.error("Font weight publish error:", error);
      showNotification(error.message, "error");
    } finally {
      // Reset button state
      publishButton.disabled = false;
      publishButton.textContent = "Publish";
    }
  };

  // Add the handler
  publishButton.addEventListener(
    "click",
    publishButton.fontWeightPublishHandler
  );

  console.log("✅ Font weight publish button initialized");
}

// Export the publish function for external use
export { publishPendingFontWeightModifications };
