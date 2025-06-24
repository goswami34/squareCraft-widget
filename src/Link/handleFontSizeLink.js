const linkTextStyleMap = new Map();

// ✅ mergeAndSaveLinkTextStyles function similar to mergeAndSaveImageStyles
function mergeAndSaveLinkTextStyles(
  blockId,
  newStyles,
  saveLinkTextModifications
) {
  if (typeof saveLinkTextModifications !== "function") {
    console.warn(
      "❌ saveLinkTextModifications is not a function in mergeAndSaveLinkTextStyles()"
    );
    return;
  }

  // Get existing styles from the map
  const prevStyles = linkTextStyleMap.get(blockId) || {
    linkText: {
      selector: `#${blockId} a`,
      styles: {},
    },
  };

  // Merge the new styles with existing styles
  const mergedLinkTextStyles = {
    ...prevStyles.linkText.styles, // Keep existing styles
    ...(newStyles.linkText?.styles || {}), // Add new styles
  };

  const finalData = {
    linkText: {
      selector: prevStyles.linkText.selector,
      styles: mergedLinkTextStyles,
    },
  };

  // Save to map and database
  linkTextStyleMap.set(blockId, finalData);
  saveLinkTextModifications(blockId, finalData, "link");
}

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

export function handleFontSizeLink(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveLinkTextModifications,
    showNotification,
  } = context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scFontSizeInputLink"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedInput = event.target.closest('[id^="scFontSizeInputLink"]');
  if (!clickedInput) return;

  const fontSize = clickedInput.value + "px";

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

  // Correct Paragraph Selector Setup
  let paragraphSelector = "";
  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
  } else if (selectedSingleTextType.startsWith("heading")) {
    paragraphSelector = `h${selectedSingleTextType.replace("heading", "")}`;
  } else {
    paragraphSelector = selectedSingleTextType;
  }

  console.log("🔎 Applying font-size to links inside:", paragraphSelector);

  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(
      `No ${selectedSingleTextType} found inside block`,
      "error"
    );
    return;
  }

  let linkFound = false;

  targetElements.forEach((tag) => {
    const links = tag.querySelectorAll("a");
    if (links.length > 0) {
      linkFound = true;
      links.forEach((link) => {
        link.style.fontSize = fontSize;
      });
    }
  });

  if (!linkFound) {
    showNotification(`No link (<a>) inside ${selectedSingleTextType}`, "info");
    return;
  }

  // Dynamic CSS Inject
  const styleId = `style-${block.id}-${selectedSingleTextType}-link-fontsize`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} a {
        font-size: ${fontSize} !important;
      }
    `;

  // Create selector based on tag type
  let linkSelector = "";
  if (selectedSingleTextType === "paragraph1") {
    linkSelector = `#${block.id} p.sqsrte-large a`;
  } else if (selectedSingleTextType === "paragraph2") {
    linkSelector = `#${block.id} p:not(.sqsrte-large):not(.sqsrte-small) a`;
  } else if (selectedSingleTextType === "paragraph3") {
    linkSelector = `#${block.id} p.sqsrte-small a`;
  } else if (selectedSingleTextType.startsWith("heading")) {
    const headingNumber = selectedSingleTextType.replace("heading", "");
    linkSelector = `#${block.id} h${headingNumber} a`;
  } else {
    linkSelector = `#${block.id} ${selectedSingleTextType} a`;
  }

  // Get existing styles from the map
  const existingStyles = linkTextStyleMap.get(block.id)?.linkText?.styles || {};

  // Save to database while preserving existing styles
  mergeAndSaveLinkTextStyles(
    block.id,
    {
      linkText: {
        selector: linkSelector,
        styles: {
          ...existingStyles, // Preserve existing styles
          "font-size": fontSize,
        },
      },
    },
    saveLinkTextModifications
  );

  // Update Active Tab UI
  document.querySelectorAll('[id^="scFontSizeInputLink"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedInput.classList.remove("sc-inActiveTab-border");
  clickedInput.classList.add("sc-activeTab-border");

  showNotification(
    `✅ Font-size applied to Links inside ${selectedSingleTextType}`,
    "success"
  );
}
