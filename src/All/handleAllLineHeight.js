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

// Store pending line height modifications locally (like font size controls)
const pendingLineHeightModifications = new Map();

export function handleAllLineHeightClick(event = null, context = null) {
  const { lastClickedElement, selectedSingleTextType, addPendingModification } =
    context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scLineHeight"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedElement = event.target.closest('[id^="scLineHeight"]');
  if (!clickedElement) return;

  const lineHeight = event.target.value + "px";

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

  // 🎯 Correct mapping here
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
    showNotification(
      "Unknown selected type: " + selectedSingleTextType,
      "error"
    );
    return;
  }

  console.log("✅ Applying line-height for selector:", paragraphSelector);

  // Find target paragraphs or headings
  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // ✅ Dynamic CSS injection
  const styleId = `style-${block.id}-${selectedSingleTextType}-all-lineHeight`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
            #${block.id} ${paragraphSelector} {
              line-height: ${lineHeight} !important;
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

  // Store line height modification locally (like font size controls)
  const lineHeightData = {
    "line-height": lineHeight,
    target: selectedSingleTextType,
    selector: specificSelector,
  };

  pendingLineHeightModifications.set(block.id, lineHeightData);

  // Also add to global pending modifications for compatibility
  if (addPendingModification) {
    addPendingModification(block.id, lineHeightData, "typographyLineHeight");
  }

  console.log(
    "📝 Line-height modification added to pending modifications. Click 'Publish' to save to database."
  );

  // Debug: Log the current pending modifications
  console.log(
    "🔍 Current pending line height modifications:",
    pendingLineHeightModifications
  );
  console.log(
    "🔍 Pending line height modifications size:",
    pendingLineHeightModifications.size
  );

  // Update active button
  document.querySelectorAll('[id^="scLineHeight"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedElement.classList.remove("sc-inActiveTab-border");
  clickedElement.classList.add("sc-activeTab-border");

  showNotification(
    `Line-height applied to bold words in: ${selectedSingleTextType}`,
    "success"
  );
}

// Function to publish all pending line height modifications (like font size controls)
const publishPendingLineHeightModifications = async (
  saveTypographyAllModifications
) => {
  if (pendingLineHeightModifications.size === 0) {
    console.log("No line height changes to publish");
    return;
  }

  try {
    console.log(
      "🔄 Publishing line height modifications:",
      pendingLineHeightModifications
    );

    for (const [blockId, lineHeightData] of pendingLineHeightModifications) {
      if (typeof saveTypographyAllModifications === "function") {
        console.log(
          "Publishing line height for block:",
          blockId,
          lineHeightData
        );
        const result = await saveTypographyAllModifications(
          blockId,
          lineHeightData,
          lineHeightData.target
        );
        console.log("✅ Line height modification result:", result);

        if (!result?.success) {
          throw new Error(
            `Failed to save line height changes for block ${blockId}: ${
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
    pendingLineHeightModifications.clear();
    console.log("✅ All line height changes published successfully!");
    showNotification(
      "All line height changes published successfully!",
      "success"
    );
  } catch (error) {
    console.error("❌ Failed to publish line height modifications:", error);
    showNotification(
      `Failed to publish line height changes: ${error.message}`,
      "error"
    );
    throw error;
  }
};

// ✅ INITIALIZE PUBLISH BUTTON FOR LINE HEIGHT (like font size controls)
export function initLineHeightPublishButton(saveTypographyAllModifications) {
  const publishButton = document.getElementById("publish");
  if (!publishButton) {
    console.warn("Publish button not found");
    return;
  }

  console.log("🔍 Found publish button for line height:", publishButton);
  console.log(
    "🔍 saveTypographyAllModifications function:",
    typeof saveTypographyAllModifications
  );

  // Remove existing listener to avoid duplicates
  publishButton.removeEventListener(
    "click",
    publishButton.lineHeightPublishHandler
  );

  // Create new handler
  publishButton.lineHeightPublishHandler = async () => {
    try {
      console.log("🚀 Line height publish handler triggered");

      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      await publishPendingLineHeightModifications(
        saveTypographyAllModifications
      );
    } catch (error) {
      console.error("Line height publish error:", error);
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
    publishButton.lineHeightPublishHandler
  );

  console.log("✅ Line height publish button initialized");
}

// Export the publish function for external use
export { publishPendingLineHeightModifications };
