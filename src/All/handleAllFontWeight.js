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

export async function handleAllFontWeightClick(event = null, context = null) {
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

  // ✅ DIRECT SAVE TO DATABASE
  if (saveTypographyAllModifications) {
    console.log("🚀 Directly saving font-weight modification to database...");

    const cssData = {
      "font-weight": fontWeight,
      target: selectedSingleTextType,
      selector: specificSelector,
    };

    try {
      const result = await saveTypographyAllModifications(
        block.id,
        cssData,
        selectedSingleTextType
      );

      if (result?.success) {
        console.log("✅ Font-weight modification saved successfully:", result);
        showNotification(
          `✅ Font-weight ${fontWeight} saved to database for ${selectedSingleTextType}`,
          "success"
        );
      } else {
        console.error(
          "❌ Failed to save font-weight modification:",
          result?.error
        );
        showNotification(
          `❌ Failed to save: ${result?.error || "Unknown error"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Error saving font-weight modification:", error);
      showNotification(`❌ Save error: ${error.message}`, "error");
    }
  } else {
    console.warn("⚠️ saveTypographyAllModifications function not available");
    // Fallback to pending modifications
    addPendingModification(
      block.id,
      {
        "font-weight": fontWeight,
        target: selectedSingleTextType,
        selector: specificSelector,
      },
      "typographyFontWeight"
    );
  }

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
