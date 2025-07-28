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

// Store pending text highlight modifications locally (like font size controls)
const pendingTextHighlightModifications = new Map();

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

  // Store text highlight modification locally (like font size controls)
  const textHighlightData = {
    "background-image": `linear-gradient(to top, ${selectedHighlightColor} 50%, transparent 0%)`,
    target: selectedSingleTextType,
    selector: specificSelector,
  };

  pendingTextHighlightModifications.set(block.id, textHighlightData);

  // Also add to global pending modifications for compatibility
  if (addPendingModification) {
    addPendingModification(
      block.id,
      textHighlightData,
      "typographyTextHighlight"
    );
  }

  console.log(
    "📝 Text highlight modification added to pending modifications. Click 'Publish' to save to database."
  );

  // Debug: Log the current pending modifications
  console.log(
    "🔍 Current pending text highlight modifications:",
    pendingTextHighlightModifications
  );
  console.log(
    "🔍 Pending text highlight modifications size:",
    pendingTextHighlightModifications.size
  );

  showNotification(
    `Text highlight applied to: ${selectedSingleTextType}`,
    "success"
  );
}

// Function to publish all pending text highlight modifications (like font size controls)
const publishPendingTextHighlightModifications = async (
  saveTypographyAllModifications
) => {
  if (pendingTextHighlightModifications.size === 0) {
    console.log("No text highlight changes to publish");
    return;
  }

  try {
    console.log(
      "🔄 Publishing text highlight modifications:",
      pendingTextHighlightModifications
    );

    for (const [
      blockId,
      textHighlightData,
    ] of pendingTextHighlightModifications) {
      if (typeof saveTypographyAllModifications === "function") {
        console.log(
          "Publishing text highlight for block:",
          blockId,
          textHighlightData
        );
        const result = await saveTypographyAllModifications(
          blockId,
          textHighlightData,
          textHighlightData.target
        );
        console.log("✅ Text highlight modification result:", result);

        if (!result?.success) {
          throw new Error(
            `Failed to save text highlight changes for block ${blockId}: ${
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
    pendingTextHighlightModifications.clear();
    console.log("✅ All text highlight changes published successfully!");
    showNotification(
      "All text highlight changes published successfully!",
      "success"
    );
  } catch (error) {
    console.error("❌ Failed to publish text highlight modifications:", error);
    showNotification(
      `Failed to publish text highlight changes: ${error.message}`,
      "error"
    );
    throw error;
  }
};

// ✅ INITIALIZE PUBLISH BUTTON FOR TEXT HIGHLIGHT (like font size controls)
export function initTextHighlightPublishButton(saveTypographyAllModifications) {
  const publishButton = document.getElementById("publish");
  if (!publishButton) {
    console.warn("Publish button not found");
    return;
  }

  console.log("🔍 Found publish button for text highlight:", publishButton);
  console.log(
    "🔍 saveTypographyAllModifications function:",
    typeof saveTypographyAllModifications
  );

  // Remove existing listener to avoid duplicates
  publishButton.removeEventListener(
    "click",
    publishButton.textHighlightPublishHandler
  );

  // Create new handler
  publishButton.textHighlightPublishHandler = async () => {
    try {
      console.log("🚀 Text highlight publish handler triggered");

      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      await publishPendingTextHighlightModifications(
        saveTypographyAllModifications
      );
    } catch (error) {
      console.error("Text highlight publish error:", error);
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
    publishButton.textHighlightPublishHandler
  );

  console.log("✅ Text highlight publish button initialized");
}

// Export the publish function for external use
export { publishPendingTextHighlightModifications };
