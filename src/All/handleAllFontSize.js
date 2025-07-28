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

// Store pending font size modifications locally (like shadow controls)
const pendingFontSizeModifications = new Map();

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

  // Store font size modification locally (like shadow controls)
  const fontSizeData = {
    "font-size": fontSize,
    target: selectedSingleTextType,
    selector: specificSelector,
  };

  pendingFontSizeModifications.set(block.id, fontSizeData);

  // Also add to global pending modifications for compatibility
  if (addPendingModification) {
    addPendingModification(block.id, fontSizeData, "typographyFontSize");
  }

  console.log(
    "📝 Font size modification added to pending modifications. Click 'Publish' to save to database."
  );

  // Debug: Log the current pending modifications
  console.log(
    "🔍 Current pending font size modifications:",
    pendingFontSizeModifications
  );
  console.log(
    "🔍 Pending font size modifications size:",
    pendingFontSizeModifications.size
  );

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

// Function to publish all pending font size modifications (like shadow controls)
const publishPendingFontSizeModifications = async (
  saveTypographyAllModifications
) => {
  if (pendingFontSizeModifications.size === 0) {
    console.log("No font size changes to publish");
    return;
  }

  try {
    console.log(
      "🔄 Publishing font size modifications:",
      pendingFontSizeModifications
    );

    for (const [blockId, fontSizeData] of pendingFontSizeModifications) {
      if (typeof saveTypographyAllModifications === "function") {
        console.log("Publishing font size for block:", blockId, fontSizeData);
        const result = await saveTypographyAllModifications(
          blockId,
          fontSizeData,
          fontSizeData.target
        );
        console.log("✅ Font size modification result:", result);

        if (!result?.success) {
          throw new Error(
            `Failed to save font size changes for block ${blockId}: ${
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
    pendingFontSizeModifications.clear();
    console.log("✅ All font size changes published successfully!");
    showNotification(
      "All font size changes published successfully!",
      "success"
    );
  } catch (error) {
    console.error("❌ Failed to publish font size modifications:", error);
    showNotification(
      `Failed to publish font size changes: ${error.message}`,
      "error"
    );
    throw error;
  }
};

// ✅ INITIALIZE PUBLISH BUTTON FOR FONT SIZE (like shadow controls)
export function initFontSizePublishButton(saveTypographyAllModifications) {
  const publishButton = document.getElementById("publish");
  if (!publishButton) {
    console.warn("Publish button not found");
    return;
  }

  console.log("🔍 Found publish button:", publishButton);
  console.log(
    "🔍 saveTypographyAllModifications function:",
    typeof saveTypographyAllModifications
  );

  // Remove existing listener to avoid duplicates
  publishButton.removeEventListener(
    "click",
    publishButton.fontSizePublishHandler
  );

  // Create new handler
  publishButton.fontSizePublishHandler = async () => {
    try {
      console.log("🚀 Font size publish handler triggered");

      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      await publishPendingFontSizeModifications(saveTypographyAllModifications);
    } catch (error) {
      console.error("Font size publish error:", error);
      showNotification(error.message, "error");
    } finally {
      // Reset button state
      publishButton.disabled = false;
      publishButton.textContent = "Publish";
    }
  };

  // Add the handler
  publishButton.addEventListener("click", publishButton.fontSizePublishHandler);

  console.log("✅ Font size publish button initialized");
}

// Export the publish function for external use
export { publishPendingFontSizeModifications };
