export function handleFontWeightLink(
  event,
  {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    showNotification,
  }
) {
  event.preventDefault();
  console.log("handleFontWeightLink called with:", {
    lastClickedElement,
    selectedSingleTextType,
  });

  if (!lastClickedElement) {
    showNotification("❌ Please select a block first.", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification(
      "❌ Please select a text type (h1, h2, p1 etc) first.",
      "error"
    );
    return;
  }

  const selectedFontWeight = event.target.value;
  console.log("Selected font weight:", selectedFontWeight);

  // Find all elements of the selected type within the block
  const elements = lastClickedElement.querySelectorAll(selectedSingleTextType);
  console.log("Found elements:", elements.length);

  if (elements.length === 0) {
    showNotification(
      `❌ No ${selectedSingleTextType} elements found in the selected block.`,
      "error"
    );
    return;
  }

  // Apply the font weight to each element
  elements.forEach((element) => {
    element.style.fontWeight = selectedFontWeight;
  });

  // Add the modification to the pending list
  addPendingModification({
    type: "font-weight",
    elementType: selectedSingleTextType,
    value: selectedFontWeight,
    blockId: lastClickedElement.id,
  });

  showNotification(
    `✅ Font weight updated for ${selectedSingleTextType} elements.`,
    "success"
  );
}
