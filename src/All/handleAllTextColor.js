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

export async function handleAllTextColorClick(event = null, context = null) {
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

  // ✅ ADD TO PENDING MODIFICATIONS FOR PUBLISH BUTTON
  console.log("📝 Adding text color modification to pending modifications...");

  addPendingModification(
    block.id,
    {
      color: textColor,
      target: selectedSingleTextType,
    },
    "typographyTextColor"
  );

  // ✅ TRIGGER PUBLISH BUTTON FUNCTIONALITY
  if (window.handlePublish) {
    console.log(
      "🚀 Triggering publish functionality for text color modification..."
    );

    // Simulate publish button click
    const publishButton = document.getElementById("publish");
    if (publishButton) {
      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      try {
        await window.handlePublish();
        console.log(
          "✅ Publish completed successfully for text color modification"
        );
      } catch (error) {
        console.error("❌ Error during publish:", error);
        showNotification(`❌ Publish error: ${error.message}`, "error");
      } finally {
        // Reset button state
        publishButton.disabled = false;
        publishButton.textContent = "Publish";
      }
    } else {
      console.warn(
        "⚠️ Publish button not found, calling handlePublish directly"
      );
      try {
        await window.handlePublish();
      } catch (error) {
        console.error("❌ Error calling handlePublish directly:", error);
      }
    }
  } else {
    console.warn("⚠️ handlePublish function not available globally");
  }

  showNotification(
    `✅ Text color applied to: ${selectedSingleTextType}`,
    "success"
  );
}
