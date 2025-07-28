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

// Store pending text color modifications locally (like font size controls)
const pendingTextColorModifications = new Map();

export function handleAllTextColorClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveTypographyAllModifications,
  } = context;

  if (!event) {
    event = { target: document.getElementById("textColorPalate") };
  }

  const textColorDiv = document.getElementById("textColorPalate");
  //   const textColor = window.getComputedStyle(textColorDiv).backgroundColor; // 🛠

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

  let textColor = null;

  if (event?.selectedColor) {
    // ✅ If manually passed selectedColor (from color picker)
    textColor = event.selectedColor;
  } else {
    // ✅ Otherwise get background color from div
    const textColorDiv = document.getElementById("textColorPalate");
    textColor = window.getComputedStyle(textColorDiv).backgroundColor;
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
  } else {
    return;
  }

  console.log("✅ Applying text color for selector:", paragraphSelector);

  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  const styleId = `style-${block.id}-${selectedSingleTextType}-all-textColor`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} {
        color: ${textColor} !important;
      }
    `;

  console.log("📝 Adding text color modification to pending modifications...");

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

  // Store text color modification locally (like font size controls)
  const textColorData = {
    color: textColor,
    target: selectedSingleTextType,
    selector: specificSelector,
  };

  pendingTextColorModifications.set(block.id, textColorData);

  // Also add to global pending modifications for compatibility
  if (addPendingModification) {
    addPendingModification(block.id, textColorData, "typographyTextColor");
  }

  console.log(
    "📝 Text color modification added to pending modifications. Click 'Publish' to save to database."
  );

  // Debug: Log the current pending modifications
  console.log(
    "🔍 Current pending text color modifications:",
    pendingTextColorModifications
  );
  console.log(
    "🔍 Pending text color modifications size:",
    pendingTextColorModifications.size
  );

  showNotification(
    `✅ Text color applied to: ${selectedSingleTextType}`,
    "success"
  );
}

// Function to publish all pending text color modifications (like font size controls)
const publishPendingTextColorModifications = async (
  saveTypographyAllModifications
) => {
  if (pendingTextColorModifications.size === 0) {
    console.log("No text color changes to publish");
    return;
  }

  try {
    console.log(
      "🔄 Publishing text color modifications:",
      pendingTextColorModifications
    );

    for (const [blockId, textColorData] of pendingTextColorModifications) {
      if (typeof saveTypographyAllModifications === "function") {
        console.log("Publishing text color for block:", blockId, textColorData);
        const result = await saveTypographyAllModifications(
          blockId,
          textColorData,
          textColorData.target
        );
        console.log("✅ Text color modification result:", result);

        if (!result?.success) {
          throw new Error(
            `Failed to save text color changes for block ${blockId}: ${
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
    pendingTextColorModifications.clear();
    console.log("✅ All text color changes published successfully!");
    showNotification(
      "All text color changes published successfully!",
      "success"
    );
  } catch (error) {
    console.error("❌ Failed to publish text color modifications:", error);
    showNotification(
      `Failed to publish text color changes: ${error.message}`,
      "error"
    );
    throw error;
  }
};

// ✅ INITIALIZE PUBLISH BUTTON FOR TEXT COLOR (like font size controls)
export function initTextColorPublishButton(saveTypographyAllModifications) {
  const publishButton = document.getElementById("publish");
  if (!publishButton) {
    console.warn("Publish button not found");
    return;
  }

  console.log("🔍 Found publish button for text color:", publishButton);
  console.log(
    "🔍 saveTypographyAllModifications function:",
    typeof saveTypographyAllModifications
  );

  // Remove existing listener to avoid duplicates
  publishButton.removeEventListener(
    "click",
    publishButton.textColorPublishHandler
  );

  // Create new handler
  publishButton.textColorPublishHandler = async () => {
    try {
      console.log("🚀 Text color publish handler triggered");

      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      await publishPendingTextColorModifications(
        saveTypographyAllModifications
      );
    } catch (error) {
      console.error("Text color publish error:", error);
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
    publishButton.textColorPublishHandler
  );

  console.log("✅ Text color publish button initialized");
}

// Export the publish function for external use
export { publishPendingTextColorModifications };
