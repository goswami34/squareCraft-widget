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
  console.log("handleItalicFontWeightClick called");
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

  const block = lastClickedElement;
  const fontWeight = event?.target?.value || "400";

  console.log("Block:", block);
  console.log("Selected text type:", selectedSingleTextType);
  console.log("Font weight:", fontWeight);

  // Determine paragraph selector based on selectedSingleTextType
  let paragraphSelector;
  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p";
  } else if (selectedSingleTextType === "paragraph4") {
    paragraphSelector = "p";
  } else if (selectedSingleTextType.startsWith("heading")) {
    paragraphSelector = `h${selectedSingleTextType.replace("heading", "")}`;
  } else {
    paragraphSelector = selectedSingleTextType;
  }

  // Find target paragraphs or headings
  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // First, remove any existing inline font-weight from all em/i elements
  targetElements.forEach((tag) => {
    tag.querySelectorAll("em, i").forEach((el) => {
      el.style.fontWeight = "";
    });
  });

  let italicFound = false;
  targetElements.forEach((tag) => {
    // Find ALL <em> and <i> elements within this tag
    const italics = tag.querySelectorAll("em, i");
    if (italics.length > 0) {
      italicFound = true;
      // Apply font-weight to each italic element
      italics.forEach((el) => {
        el.style.fontWeight = fontWeight;
      });
    }
  });

  if (!italicFound) {
    showNotification(
      `No italic (<em> or <i>) found inside ${selectedSingleTextType}`,
      "info"
    );
    return;
  }

  // Inject CSS to ensure the font-weight applies to all italic elements
  const styleId = `style-${block.id}-${selectedSingleTextType}-italic-fontWeight`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // More specific CSS to ensure it applies ONLY to italic elements
  styleTag.innerHTML = `
    #${block.id} ${paragraphSelector} em,
    #${block.id} ${paragraphSelector} i {
      font-weight: ${fontWeight} !important;
    }
  `;

  // Add to pending modifications
  addPendingModification(
    block.id,
    {
      target: selectedSingleTextType,
      "font-weight": fontWeight,
    },
    "italic"
  );

  showNotification(
    `Font weight ${fontWeight} applied to italic text in ${selectedSingleTextType}`,
    "success"
  );
}
