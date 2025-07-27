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

export async function handleAllTextTransformClick(
  event = null,
  context = null
) {
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

  addPendingModification(
    block.id,
    {
      "text-transform": textTransform,
      target: selectedSingleTextType,
    },
    "typographyTextTransform"
  );

  // ✅ TRIGGER PUBLISH BUTTON FUNCTIONALITY
  if (window.handlePublish) {
    console.log(
      "🚀 Triggering publish functionality for text-transform modification..."
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
          "✅ Publish completed successfully for text-transform modification"
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
