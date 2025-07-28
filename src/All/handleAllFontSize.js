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

export async function handleAllFontSizeClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    saveTypographyAllModifications,
    addPendingModification,
    showNotification,
  } = context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scAllFontSizeInput"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedElement = event.target.closest('[id^="scAllFontSizeInput"]');
  if (!clickedElement) return;

  const fontSize = event.target.value + "px";

  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification(
      "Please select a text type (Heading or Paragraph)",
      "error"
    );
    return;
  }

  const block = lastClickedElement.closest('[id^="block-"]');
  if (!block) {
    showNotification("Block not found", "error");
    return;
  }

  // STEP 1️⃣: Correct selector for paragraph based on p1 / p2 / p3
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
    paragraphSelector = selectedSingleTextType; // headings like h1, h2, h3, h4
  }

  console.log("🔍 paragraphSelector:", paragraphSelector);

  // STEP 2️⃣: Find correct paragraph inside the block
  const targetParagraphs = block.querySelectorAll(paragraphSelector);
  if (!targetParagraphs.length) {
    showNotification(
      `No paragraph found for ${selectedSingleTextType}`,
      "error"
    );
    return;
  }

  // STEP 4️⃣: Also apply CSS dynamically to ensure persistence after reload
  const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} {
        font-size: ${fontSize} !important;
      }
    `;

  console.log("📝 Adding font size modification to pending modifications...");

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

  addPendingModification(
    block.id,
    {
      "font-size": fontSize,
      target: selectedSingleTextType,
      selector: specificSelector,
    },
    "typographyFontSize"
  );

  // ✅ ADD TO PENDING MODIFICATIONS ONLY
  console.log(
    "📝 Font size modification added to pending modifications. Click 'Publish' to save to database."
  );

  // Debug: Log the current pending modifications
  if (window.pendingModifications) {
    console.log(
      "🔍 Current pending modifications:",
      window.pendingModifications
    );
    console.log(
      "🔍 Pending modifications size:",
      window.pendingModifications.size
    );
  }

  // STEP 5️⃣: Update UI highlighting
  document.querySelectorAll('[id^="scAllFontSizeInput"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedElement.classList.remove("sc-inActiveTab-border");
  clickedElement.classList.add("sc-activeTab-border");

  showNotification(
    `✅ Font size applied to bold text inside: ${selectedSingleTextType}`,
    "success"
  );
}

// ✅ COMPLETE PUBLISH FUNCTIONALITY FOR TYPOGRAPHY
export async function handleTypographyPublish() {
  console.log(
    "🚀 handleTypographyPublish called - Processing all typography modifications..."
  );

  // Check if there are any pending modifications
  if (
    typeof window.pendingModifications === "undefined" ||
    window.pendingModifications.size === 0
  ) {
    showNotification("No typography changes to publish", "info");
    return;
  }

  // Show loading state on publish button
  const publishButton = document.getElementById("publish");
  if (publishButton) {
    publishButton.disabled = true;
    publishButton.textContent = "Publishing...";
  }

  try {
    console.log(
      "🔄 Publishing typography modifications:",
      window.pendingModifications
    );

    // Debug: Log all entries in pendingModifications
    if (window.pendingModifications.size > 0) {
      console.log("🔍 All pending typography modifications:");
      for (const [
        blockId,
        modifications,
      ] of window.pendingModifications.entries()) {
        console.log(`Block ${blockId}:`, modifications);
      }
    }

    // Check if saveTypographyAllModifications is available
    if (!window.saveTypographyAllModifications) {
      console.error(
        "❌ saveTypographyAllModifications not available on window object"
      );
      throw new Error(
        "Typography save function not available. Please refresh the page."
      );
    }

    // Save each pending typography modification
    for (const [
      blockId,
      modifications,
    ] of window.pendingModifications.entries()) {
      for (const mod of modifications) {
        let result;

        // Handle typography-specific modifications
        switch (mod.tagType) {
          case "typographyAll":
          case "typographyFontFamily":
          case "typographyFontSize":
          case "typographyFontWeight":
          case "typographyLineHeight":
          case "typographyTextAlign":
          case "typographyTextColor":
          case "typographyTextHighlight":
          case "typographyTextTransform":
          case "typographyLetterSpacing":
            console.log("🎨 Processing typography modification:", {
              tagType: mod.tagType,
              blockId,
              css: mod.css,
              target: mod.target,
              textType: mod.textType,
            });

            try {
              // Use the typography-specific save function
              result = await window.saveTypographyAllModifications(
                blockId,
                mod.css,
                mod.target || mod.textType
              );
              console.log("✅ Typography modification result:", result);
            } catch (saveError) {
              console.error(
                "❌ Error saving typography modification:",
                saveError
              );
              throw new Error(
                `Failed to save ${mod.tagType}: ${saveError.message}`
              );
            }
            break;
          default:
            console.warn(
              "❌ Unknown tagType in pendingModifications:",
              mod.tagType
            );
            continue;
        }

        if (!result?.success) {
          throw new Error(
            `Failed to save typography changes for block ${blockId}: ${
              result?.error || "Unknown error"
            }`
          );
        }
      }
    }

    // Clear pending modifications after successful save
    window.pendingModifications.clear();
    showNotification(
      "All typography changes published successfully!",
      "success"
    );
  } catch (error) {
    console.error("❌ Error in handleTypographyPublish:", error);
    showNotification(error.message, "error");
  } finally {
    // Reset button state
    if (publishButton) {
      publishButton.disabled = false;
      publishButton.textContent = "Publish";
    }
  }
}

// ✅ INITIALIZE PUBLISH BUTTON FOR TYPOGRAPHY
export function initTypographyPublishButton() {
  // This function is no longer needed since the main publish button in squareCraft.js handles typography
  console.log(
    "ℹ️ Typography publish button initialization skipped - using main publish handler"
  );
}
