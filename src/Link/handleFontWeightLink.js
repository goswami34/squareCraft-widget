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

export function handleFontWeightLink(event, context) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveLinkTextModifications,
    showNotification,
  } = context;

  const fontWeightSelect = document.getElementById("squareCraftLinkFontWeight");
  if (!fontWeightSelect) {
    showNotification("Font weight selector not found.", "error");
    return;
  }

  const fontWeight = fontWeightSelect.value;
  if (!fontWeight) {
    showNotification("Please select a font-weight.", "error");
    return;
  }

  if (!lastClickedElement) {
    showNotification("❌ Please select a block first.", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("❌ Please select a text type (h1, h2, p1 etc).", "error");
    return;
  }

  // 🔁 Normalize text type to always use h1/h2/.../p1/p2/p3
  const normalizedType = selectedSingleTextType
    .replace("heading", "h")
    .replace("paragraph", "p");

  const typeMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    p1: "p.sqsrte-large",
    p2: "p:not(.sqsrte-large):not(.sqsrte-small)",
    p3: "p.sqsrte-small",
  };

  const selector = typeMap[normalizedType];
  if (!selector) {
    showNotification(
      "❌ Invalid text type selected: " + normalizedType,
      "error"
    );
    return;
  }

  console.log("selectedSingleTextType:", selectedSingleTextType);
  console.log("normalizedType:", normalizedType);

  const block = lastClickedElement.closest('[id^="block-"]');
  if (!block) {
    showNotification("❌ Block not found.", "error");
    return;
  }

  const elements = block.querySelectorAll(selector);
  if (!elements.length) {
    showNotification(`No ${normalizedType} elements found.`, "error");
    return;
  }

  let linkFound = false;
  elements.forEach((el) => {
    const links = el.querySelectorAll("a");
    if (links.length > 0) {
      linkFound = true;
      links.forEach((link) => {
        link.style.fontWeight = fontWeight;
      });
    }
  });

  if (!linkFound) {
    showNotification(
      `ℹ️ No links (<a>) found inside ${normalizedType}`,
      "info"
    );
    return;
  }

  const styleId = `style-${block.id}-${normalizedType}-link-fontweight`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
    #${block.id} ${selector} a {
      font-weight: ${fontWeight} !important;
    }
  `;

  // Create selector based on tag type
  let linkSelector = "";
  if (normalizedType === "p1") {
    linkSelector = `#${block.id} p.sqsrte-large a`;
  } else if (normalizedType === "p2") {
    linkSelector = `#${block.id} p:not(.sqsrte-large):not(.sqsrte-small) a`;
  } else if (normalizedType === "p3") {
    linkSelector = `#${block.id} p.sqsrte-small a`;
  } else if (normalizedType.startsWith("h")) {
    linkSelector = `#${block.id} ${normalizedType} a`;
  } else {
    linkSelector = `#${block.id} ${normalizedType} a`;
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
          "font-weight": fontWeight,
        },
      },
    },
    saveLinkTextModifications
  );

  showNotification(
    `✅ Font weight applied to link words in ${normalizedType}`,
    "success"
  );
}
