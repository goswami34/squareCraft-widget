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

export function handleItalicFontWeightClick(event = null, context = null) {
  const { lastClickedElement, selectedSingleTextType, addPendingModification } =
    context;

  if (!event) {
    event = { target: document.getElementById("squareCraftItalicFontWeight") };
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
    return;
  }

  console.log("✅ Applying font-weight for selector:", paragraphSelector);

  // Find target paragraphs or headings
  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // First, remove any existing inline font-weight from all em/i elements
  block.querySelectorAll("em, i").forEach((el) => {
    el.style.fontWeight = "";
  });

  let italicFound = false;
  targetElements.forEach((tag) => {
    // Find ALL <em> and <i> elements within this tag
    const italics = tag.querySelectorAll("em, i");
    if (italics.length > 0) {
      italicFound = true;
      // Apply font-weight to ALL italic elements
      italics.forEach((el) => {
        el.style.fontWeight = fontWeight;
      });
    }
  });

  if (!italicFound) {
    showNotification(
      `No italic (<em> or <i>) inside ${selectedSingleTextType}`,
      "info"
    );
    return;
  }

  // Inject CSS for ALL <em> and <i> elements in the block
  const styleId = `style-${block.id}-${selectedSingleTextType}-italic-fontWeight`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // More specific CSS to ensure it applies to all italic elements
  styleTag.innerHTML = `
    #${block.id} ${paragraphSelector} em,
    #${block.id} ${paragraphSelector} i,
    #${block.id} em,
    #${block.id} i {
      font-weight: ${fontWeight} !important;
    }
  `;

  addPendingModification(block.id, {
    "font-weight": fontWeight,
    target: selectedSingleTextType,
  });

  showNotification(
    `Font-weight applied to all italic words in: ${selectedSingleTextType}`,
    "success"
  );
}
