// ✅ Notification function
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `sc-notification sc-notification-${type}`;
  notification.textContent = message;

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

  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease-in-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Store pending text align modifications locally (like font size controls)
const pendingTextAlignModifications = new Map();

// ✅ Apply data-sc-text-type to all elements in block
// function applyDataTextTypeAttributes(block) {
//   const allTextElements = block.querySelectorAll("h1, h2, h3, h4, p");

//   allTextElements.forEach((el) => {
//     if (el.classList.contains("sqsrte-large")) {
//       el.setAttribute("data-sc-text-type", "paragraph1");
//     } else if (el.classList.contains("sqsrte-small")) {
//       el.setAttribute("data-sc-text-type", "paragraph3");
//     } else if (el.tagName.toLowerCase() === "p") {
//       el.setAttribute("data-sc-text-type", "paragraph2");
//     } else if (el.tagName.toLowerCase() === "h1") {
//       el.setAttribute("data-sc-text-type", "heading1");
//     } else if (el.tagName.toLowerCase() === "h2") {
//       el.setAttribute("data-sc-text-type", "heading2");
//     } else if (el.tagName.toLowerCase() === "h3") {
//       el.setAttribute("data-sc-text-type", "heading3");
//     } else if (el.tagName.toLowerCase() === "h4") {
//       el.setAttribute("data-sc-text-type", "heading4");
//     }
//   });
// }

function applyDataTextTypeAttributes(block) {
  const allTextElements = block.querySelectorAll("h1, h2, h3, h4, p");

  allTextElements.forEach((el) => {
    // ⚠️ Step 1: Remove any previous data-sc-text-type
    el.removeAttribute("data-sc-text-type");

    // ⚙️ Step 2: Apply new one based on logic
    const tag = el.tagName.toLowerCase();

    if (tag === "h1") {
      el.setAttribute("data-sc-text-type", "heading1");
    } else if (tag === "h2") {
      el.setAttribute("data-sc-text-type", "heading2");
    } else if (tag === "h3") {
      el.setAttribute("data-sc-text-type", "heading3");
    } else if (tag === "h4") {
      el.setAttribute("data-sc-text-type", "heading4");
    } else if (tag === "p") {
      if (el.classList.contains("sqsrte-large")) {
        el.setAttribute("data-sc-text-type", "paragraph1");
      } else if (el.classList.contains("sqsrte-small")) {
        el.setAttribute("data-sc-text-type", "paragraph3");
      } else {
        el.setAttribute("data-sc-text-type", "paragraph2");
      }
    }
  });
}

// ✅ Main align handler
export function handleAllTextAlignClick(event = null, context = null) {
  const { lastClickedElement, selectedSingleTextType, addPendingModification } =
    context;

  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("Please select a text type first", "error");
    return;
  }

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scTextAlign"].sc-activeTab-border'
    );
    if (!activeButton) {
      showNotification("Please select a text alignment option", "error");
      return;
    }
    event = { target: activeButton };
  }

  const clickedElement = event.target.closest('[id^="scTextAlign"]');
  if (!clickedElement) {
    showNotification("Please select a text alignment option", "error");
    return;
  }

  const textAlign = clickedElement.dataset.align;
  if (!textAlign) {
    showNotification("Invalid text alignment value", "error");
    return;
  }

  const block = lastClickedElement;

  applyDataTextTypeAttributes(block);

  // 🔍 Define tag + attribute mapping
  const typeToTag = {
    paragraph1: "p.sqsrte-large",
    paragraph2: "p:not(.sqsrte-large):not(.sqsrte-small)",
    paragraph3: "p.sqsrte-small",
    heading1: "h1",
    heading2: "h2",
    heading3: "h3",
    heading4: "h4",
  };

  // const selector = typeToTag[selectedSingleTextType];
  const selector = `[data-sc-text-type="${selectedSingleTextType}"]`;

  if (!selector) {
    showNotification(
      "Unsupported text type: " + selectedSingleTextType,
      "error"
    );
    return;
  }

  const elements = block.querySelectorAll(selector);
  if (!elements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // Clear inline style
  elements.forEach((el) => {
    el.style.textAlign = "";
  });

  // 💡 Inject highly specific CSS using data attributes
  const styleId = `style-${block.id}-${selectedSingleTextType}-textalign`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // ✅ Use data-sc-text-type attribute for specific targeting
  const specificSelector = `#${block.id} [data-sc-text-type="${selectedSingleTextType}"]`;

  styleTag.innerHTML = `
    ${specificSelector} {
      text-align: ${textAlign} !important;
    }
  `;

  console.log("📝 Adding text align modification to pending modifications...");

  // Create specific selector for better targeting
  let specificSelectorForDB = "";
  if (selectedSingleTextType === "paragraph1") {
    specificSelectorForDB = `#${block.id} p.sqsrte-large`;
  } else if (selectedSingleTextType === "paragraph2") {
    specificSelectorForDB = `#${block.id} p:not(.sqsrte-large):not(.sqsrte-small)`;
  } else if (selectedSingleTextType === "paragraph3") {
    specificSelectorForDB = `#${block.id} p.sqsrte-small`;
  } else if (selectedSingleTextType.startsWith("heading")) {
    const headingNumber = selectedSingleTextType.replace("heading", "");
    specificSelectorForDB = `#${block.id} h${headingNumber}`;
  } else {
    specificSelectorForDB = `#${block.id} ${selectedSingleTextType}`;
  }

  // Store text align modification locally (like font size controls)
  const textAlignData = {
    "text-align": textAlign,
    target: selectedSingleTextType,
    selector: specificSelectorForDB,
  };

  pendingTextAlignModifications.set(block.id, textAlignData);

  // Also add to global pending modifications for compatibility
  if (addPendingModification) {
    addPendingModification(block.id, textAlignData, "typographyTextAlign");
  }

  console.log(
    "📝 Text-align modification added to pending modifications. Click 'Publish' to save to database."
  );

  // Debug: Log the current pending modifications
  console.log(
    "🔍 Current pending text align modifications:",
    pendingTextAlignModifications
  );
  console.log(
    "🔍 Pending text align modifications size:",
    pendingTextAlignModifications.size
  );

  // UI state
  document.querySelectorAll('[id^="scTextAlign"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedElement.classList.remove("sc-inActiveTab-border");
  clickedElement.classList.add("sc-activeTab-border");

  showNotification(
    `Text-align "${textAlign}" applied to ${selectedSingleTextType}`,
    "success"
  );
}

// Function to publish all pending text align modifications (like font size controls)
const publishPendingTextAlignModifications = async (
  saveTypographyAllModifications
) => {
  if (pendingTextAlignModifications.size === 0) {
    console.log("No text align changes to publish");
    return;
  }

  try {
    console.log(
      "🔄 Publishing text align modifications:",
      pendingTextAlignModifications
    );

    for (const [blockId, textAlignData] of pendingTextAlignModifications) {
      if (typeof saveTypographyAllModifications === "function") {
        console.log("Publishing text align for block:", blockId, textAlignData);
        const result = await saveTypographyAllModifications(
          blockId,
          textAlignData,
          textAlignData.target
        );
        console.log("✅ Text align modification result:", result);

        if (!result?.success) {
          throw new Error(
            `Failed to save text align changes for block ${blockId}: ${
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
    pendingTextAlignModifications.clear();
    console.log("✅ All text align changes published successfully!");
    showNotification(
      "All text align changes published successfully!",
      "success"
    );
  } catch (error) {
    console.error("❌ Failed to publish text align modifications:", error);
    showNotification(
      `Failed to publish text align changes: ${error.message}`,
      "error"
    );
    throw error;
  }
};

// ✅ INITIALIZE PUBLISH BUTTON FOR TEXT ALIGN (like font size controls)
export function initTextAlignPublishButton(saveTypographyAllModifications) {
  const publishButton = document.getElementById("publish");
  if (!publishButton) {
    console.warn("Publish button not found");
    return;
  }

  console.log("🔍 Found publish button for text align:", publishButton);
  console.log(
    "🔍 saveTypographyAllModifications function:",
    typeof saveTypographyAllModifications
  );

  // Remove existing listener to avoid duplicates
  publishButton.removeEventListener(
    "click",
    publishButton.textAlignPublishHandler
  );

  // Create new handler
  publishButton.textAlignPublishHandler = async () => {
    try {
      console.log("🚀 Text align publish handler triggered");

      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      await publishPendingTextAlignModifications(
        saveTypographyAllModifications
      );
    } catch (error) {
      console.error("Text align publish error:", error);
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
    publishButton.textAlignPublishHandler
  );

  console.log("✅ Text align publish button initialized");
}

// Export the publish function for external use
export { publishPendingTextAlignModifications };
