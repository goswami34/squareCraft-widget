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

// Store pending text transform modifications locally (like font size controls)
const pendingTextTransformModifications = new Map();

export function handleAllTextTransformClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    showNotification,
  } = context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scTextTransform"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedElement = event.target.closest('[id^="scTextTransform"]');
  if (!clickedElement) return;

  const textTransform = clickedElement.dataset.textTransform;

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

  console.log("✅ Applying text-transform for selector:", paragraphSelector);

  // Find target paragraphs or headings
  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // ✅ Dynamic CSS injection
  const styleId = `style-${block.id}-${selectedSingleTextType}-all-texttransform`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} {
        text-transform: ${textTransform} !important;
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

  // Store text transform modification locally (like font size controls)
  const textTransformData = {
    "text-transform": textTransform,
    target: selectedSingleTextType,
    selector: specificSelector,
  };

  pendingTextTransformModifications.set(block.id, textTransformData);

  // Also add to global pending modifications for compatibility
  if (addPendingModification) {
    addPendingModification(
      block.id,
      textTransformData,
      "typographyTextTransform"
    );
  }

  console.log(
    "📝 Text-transform modification added to pending modifications. Click 'Publish' to save to database."
  );

  // Debug: Log the current pending modifications
  console.log(
    "🔍 Current pending text transform modifications:",
    pendingTextTransformModifications
  );
  console.log(
    "🔍 Pending text transform modifications size:",
    pendingTextTransformModifications.size
  );

  // Update active button
  document.querySelectorAll('[id^="scTextTransform"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedElement.classList.remove("sc-inActiveTab-border");
  clickedElement.classList.add("sc-activeTab-border");

  showNotification(
    `Text-transform applied to bold words in: ${selectedSingleTextType}`,
    "success"
  );
}

// Function to publish all pending text transform modifications (like font size controls)
const publishPendingTextTransformModifications = async (
  saveTypographyAllModifications
) => {
  if (pendingTextTransformModifications.size === 0) {
    console.log("No text transform changes to publish");
    return;
  }

  try {
    console.log(
      "🔄 Publishing text transform modifications:",
      pendingTextTransformModifications
    );

    for (const [
      blockId,
      textTransformData,
    ] of pendingTextTransformModifications) {
      if (typeof saveTypographyAllModifications === "function") {
        console.log(
          "Publishing text transform for block:",
          blockId,
          textTransformData
        );
        const result = await saveTypographyAllModifications(
          blockId,
          textTransformData,
          textTransformData.target
        );
        console.log("✅ Text transform modification result:", result);

        if (!result?.success) {
          throw new Error(
            `Failed to save text transform changes for block ${blockId}: ${
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
    pendingTextTransformModifications.clear();
    console.log("✅ All text transform changes published successfully!");
    showNotification(
      "All text transform changes published successfully!",
      "success"
    );
  } catch (error) {
    console.error("❌ Failed to publish text transform modifications:", error);
    showNotification(
      `Failed to publish text transform changes: ${error.message}`,
      "error"
    );
    throw error;
  }
};

// ✅ INITIALIZE PUBLISH BUTTON FOR TEXT TRANSFORM (like font size controls)
export function initTextTransformPublishButton(saveTypographyAllModifications) {
  const publishButton = document.getElementById("publish");
  if (!publishButton) {
    console.warn("Publish button not found");
    return;
  }

  console.log("🔍 Found publish button for text transform:", publishButton);
  console.log(
    "🔍 saveTypographyAllModifications function:",
    typeof saveTypographyAllModifications
  );

  // Remove existing listener to avoid duplicates
  publishButton.removeEventListener(
    "click",
    publishButton.textTransformPublishHandler
  );

  // Create new handler
  publishButton.textTransformPublishHandler = async () => {
    try {
      console.log("🚀 Text transform publish handler triggered");

      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      await publishPendingTextTransformModifications(
        saveTypographyAllModifications
      );
    } catch (error) {
      console.error("Text transform publish error:", error);
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
    publishButton.textTransformPublishHandler
  );

  console.log("✅ Text transform publish button initialized");
}

// Export the publish function for external use
export { publishPendingTextTransformModifications };
