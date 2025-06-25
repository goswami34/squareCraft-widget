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
  await saveLinkTextModifications(blockId, finalData);
}
