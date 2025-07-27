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

// ✅ Apply data-sc-text-type to all elements in block
function applyDataTextTypeAttributes(block) {
  const allTextElements = block.querySelectorAll("h1, h2, h3, h4, p");

  allTextElements.forEach((el) => {
    if (el.classList.contains("sqsrte-large")) {
      el.setAttribute("data-sc-text-type", "paragraph1");
    } else if (el.classList.contains("sqsrte-small")) {
      el.setAttribute("data-sc-text-type", "paragraph3");
    } else if (el.tagName.toLowerCase() === "p") {
      el.setAttribute("data-sc-text-type", "paragraph2");
    } else if (el.tagName.toLowerCase() === "h1") {
      el.setAttribute("data-sc-text-type", "heading1");
    } else if (el.tagName.toLowerCase() === "h2") {
      el.setAttribute("data-sc-text-type", "heading2");
    } else if (el.tagName.toLowerCase() === "h3") {
      el.setAttribute("data-sc-text-type", "heading3");
    } else if (el.tagName.toLowerCase() === "h4") {
      el.setAttribute("data-sc-text-type", "heading4");
    }
  });
}

// ✅ Main align handler
export async function handleAllTextAlignClick(event = null, context = null) {
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

  const selector = typeToTag[selectedSingleTextType];
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

  addPendingModification(
    block.id,
    {
      "text-align": textAlign,
      target: selectedSingleTextType,
    },
    "typographyTextAlign"
  );

  // ✅ TRIGGER PUBLISH BUTTON FUNCTIONALITY
  if (window.handlePublish) {
    console.log(
      "🚀 Triggering publish functionality for text-align modification..."
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
          "✅ Publish completed successfully for text-align modification"
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
