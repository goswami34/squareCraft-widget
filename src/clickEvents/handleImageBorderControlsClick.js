export function handleImageBorderControlsClick(event, context) {
  const {
    getTextType,
    setSelectedElement,
    selectedElement,
    setLastClickedBlockId,
    setLastClickedElement,
    selectedSingleTextType,
    showNotification,
  } = context;

  const selectedImage = document.querySelector(".sc-selected-image");
  if (!selectedImage) {
    showNotification("Please select an image first", "error");
    return;
  }

  const block = selectedImage.closest('[id^="block-"]');
  if (!block) {
    showNotification("Parent block not found", "error");
    return;
  }

  if (selectedElement) selectedElement.style.outline = "";
  setSelectedElement(block);
  block.style.outline = "1px dashed #EF7C2F";

  setLastClickedBlockId(block.id);
  setLastClickedElement(block);

  // Optional: Sync UI with current border styles
  showNotification("Image block selected for border radius", "success");
}
