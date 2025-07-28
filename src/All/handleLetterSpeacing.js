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

// Store pending letter spacing modifications locally (like font size controls)
const pendingLetterSpacingModifications = new Map();

export function handleAllLetterSpacingClick(event = null, context = null) {
  const { lastClickedElement, selectedSingleTextType, addPendingModification } =
    context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scLetterSpacing"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedElement = event.target.closest('[id^="scLetterSpacing"]');
  if (!clickedElement) return;

  const letterSpacing = event.target.value + "px";

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

  console.log("✅ Applying letter-spacing for selector:", paragraphSelector);

  // Find target paragraphs or headings
  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // ✅ Dynamic CSS injection
  const styleId = `style-${block.id}-${selectedSingleTextType}-all-letterSpacing`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
          #${block.id} ${paragraphSelector} {
            letter-spacing: ${letterSpacing} !important;
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

  // Store letter spacing modification locally (like font size controls)
  const letterSpacingData = {
    "letter-spacing": letterSpacing,
    target: selectedSingleTextType,
    selector: specificSelector,
  };

  pendingLetterSpacingModifications.set(block.id, letterSpacingData);

  // Also add to global pending modifications for compatibility
  if (addPendingModification) {
    addPendingModification(
      block.id,
      letterSpacingData,
      "typographyLetterSpacing"
    );
  }

  console.log(
    "📝 Letter-spacing modification added to pending modifications. Click 'Publish' to save to database."
  );

  // Debug: Log the current pending modifications
  console.log(
    "🔍 Current pending letter spacing modifications:",
    pendingLetterSpacingModifications
  );
  console.log(
    "🔍 Pending letter spacing modifications size:",
    pendingLetterSpacingModifications.size
  );

  // Update active button
  document.querySelectorAll('[id^="scLetterSpacing"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedElement.classList.remove("sc-inActiveTab-border");
  clickedElement.classList.add("sc-activeTab-border");

  showNotification(
    `Letter-speacing applied to bold words in: ${selectedSingleTextType}`,
    "success"
  );
}

// Function to publish all pending letter spacing modifications (like font size controls)
const publishPendingLetterSpacingModifications = async (
  saveTypographyAllModifications
) => {
  if (pendingLetterSpacingModifications.size === 0) {
    console.log("No letter spacing changes to publish");
    return;
  }

  try {
    console.log(
      "🔄 Publishing letter spacing modifications:",
      pendingLetterSpacingModifications
    );

    for (const [
      blockId,
      letterSpacingData,
    ] of pendingLetterSpacingModifications) {
      if (typeof saveTypographyAllModifications === "function") {
        console.log(
          "Publishing letter spacing for block:",
          blockId,
          letterSpacingData
        );
        const result = await saveTypographyAllModifications(
          blockId,
          letterSpacingData,
          letterSpacingData.target
        );
        console.log("✅ Letter spacing modification result:", result);

        if (!result?.success) {
          throw new Error(
            `Failed to save letter spacing changes for block ${blockId}: ${
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
    pendingLetterSpacingModifications.clear();
    console.log("✅ All letter spacing changes published successfully!");
    showNotification(
      "All letter spacing changes published successfully!",
      "success"
    );
  } catch (error) {
    console.error("❌ Failed to publish letter spacing modifications:", error);
    showNotification(
      `Failed to publish letter spacing changes: ${error.message}`,
      "error"
    );
    throw error;
  }
};

// ✅ INITIALIZE PUBLISH BUTTON FOR LETTER SPACING (like font size controls)
export function initLetterSpacingPublishButton(saveTypographyAllModifications) {
  const publishButton = document.getElementById("publish");
  if (!publishButton) {
    console.warn("Publish button not found");
    return;
  }

  console.log("🔍 Found publish button for letter spacing:", publishButton);
  console.log(
    "🔍 saveTypographyAllModifications function:",
    typeof saveTypographyAllModifications
  );

  // Remove existing listener to avoid duplicates
  publishButton.removeEventListener(
    "click",
    publishButton.letterSpacingPublishHandler
  );

  // Create new handler
  publishButton.letterSpacingPublishHandler = async () => {
    try {
      console.log("🚀 Letter spacing publish handler triggered");

      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      await publishPendingLetterSpacingModifications(
        saveTypographyAllModifications
      );
    } catch (error) {
      console.error("Letter spacing publish error:", error);
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
    publishButton.letterSpacingPublishHandler
  );

  console.log("✅ Letter spacing publish button initialized");
}

// Export the publish function for external use
export { publishPendingLetterSpacingModifications };
