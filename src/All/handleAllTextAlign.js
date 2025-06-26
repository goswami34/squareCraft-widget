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

export function handleAllTextAlignClick(event = null, context = null) {
  const { lastClickedElement, selectedSingleTextType, addPendingModification } =
    context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scTextAlign"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedElement = event.target.closest('[id^="scTextAlign"]');
  if (!clickedElement) return;

  const textAlign = clickedElement.dataset.align;

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
  // const targetElements = block.querySelectorAll(paragraphSelector);
  const allParagraphs = block.querySelectorAll("p");

  const targetElements = Array.from(allParagraphs).filter((p) => {
    if (selectedSingleTextType === "paragraph1") {
      return p.classList.contains("sqsrte-large");
    }
    if (selectedSingleTextType === "paragraph2") {
      return (
        !p.classList.contains("sqsrte-large") &&
        !p.classList.contains("sqsrte-small")
      );
    }
    if (selectedSingleTextType === "paragraph3") {
      return p.classList.contains("sqsrte-small");
    }
    return false;
  });

  console.log("targetElements", targetElements);

  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // ✅ Dynamic CSS injection
  const styleId = `style-${block.id}-${selectedSingleTextType}-all-textalign`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
        #${block.id} ${paragraphSelector} {
          text-align: ${textAlign} !important;
        }
      `;

  addPendingModification(block.id, {
    "text-align": textAlign,
    target: selectedSingleTextType,
  });

  // Update active button
  document.querySelectorAll('[id^="scTextAlign"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedElement.classList.remove("sc-inActiveTab-border");
  clickedElement.classList.add("sc-activeTab-border");

  showNotification(
    `Text-align applied to bold words in: ${selectedSingleTextType}`,
    "success"
  );
}
