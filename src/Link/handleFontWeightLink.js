const linkTextStyleMap = new Map();

// ✅ mergeAndSaveLinkTextStyles function similar to mergeAndSaveImageStyles
async function mergeAndSaveLinkTextStyles(
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

  // Use the new selector if provided, otherwise keep the existing one
  const finalSelector =
    newStyles.linkText?.selector || prevStyles.linkText.selector;

  // Merge the new styles with existing styles
  const mergedLinkTextStyles = {
    ...prevStyles.linkText.styles, // Keep existing styles
    ...(newStyles.linkText?.styles || {}), // Add new styles
  };

  const finalData = {
    linkText: {
      selector: finalSelector,
      styles: mergedLinkTextStyles,
    },
  };

  console.log("🔍 Merging styles:", {
    prevStyles: prevStyles.linkText.styles,
    newStyles: newStyles.linkText?.styles,
    mergedStyles: mergedLinkTextStyles,
    finalSelector,
  });

  // Save to map and database
  linkTextStyleMap.set(blockId, finalData);
  await saveLinkTextModifications(blockId, finalData);
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
