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
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    showNotification,
  } = context;

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
  console.log("Block:", block);
  console.log("Selected text type:", selectedSingleTextType);
  console.log("Text align:", textAlign);

  // Determine paragraph selector based on selectedSingleTextType
  let paragraphSelector;
  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
  } else if (selectedSingleTextType.startsWith("heading")) {
    paragraphSelector = `h${selectedSingleTextType.replace("heading", "")}`;
  } else {
    showNotification(
      "Unknown selected type: " + selectedSingleTextType,
      "error"
    );
    return;
  }

  console.log("✅ Applying text-align for selector:", paragraphSelector);

  // Find target paragraphs or headings
  // const targetElements = block.querySelectorAll(paragraphSelector);
  let targetElements = [];

  if (selectedSingleTextType.startsWith("paragraph")) {
    const allParagraphs = block.querySelectorAll("p");

    targetElements = Array.from(allParagraphs).filter((p) => {
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
  } else {
    targetElements = block.querySelectorAll(paragraphSelector);
  }

  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // Remove any existing inline text-align from target elements
  targetElements.forEach((el) => {
    el.style.textAlign = "";
  });

  // ✅ Dynamic CSS injection - apply to specific elements only
  const styleId = `style-${block.id}-${selectedSingleTextType}-all-textalign`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // More specific CSS selector to target only the selected text type
  styleTag.innerHTML = `
    #${block.id} ${paragraphSelector} {
      text-align: ${textAlign} !important;
    }
  `;

  addPendingModification(
    block.id,
    {
      "text-align": textAlign,
      target: selectedSingleTextType,
    },
    "all"
  );

  // Update active button
  document.querySelectorAll('[id^="scTextAlign"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedElement.classList.remove("sc-inActiveTab-border");
  clickedElement.classList.add("sc-activeTab-border");

  showNotification(
    `Text-align ${textAlign} applied to ${selectedSingleTextType}`,
    "success"
  );
}
