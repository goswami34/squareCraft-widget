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
      backgroundColor: type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"
  });

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
      notification.style.animation = "fadeOut 0.3s ease-in-out";
      setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// In handleTextTransformClick function
export function handleTextTransformClick(event = null, context = null) {
    const {
        lastClickedElement,
        saveModifications,
        selectedElement,
        setSelectedElement,
        setLastClickedBlockId,
        setLastClickedElement,
        addPendingModification
    } = context;

    // Add a check for saveModifications
    if (typeof saveModifications !== 'function') {
        console.error("saveModifications function is not available");
        showNotification("Error: Save functionality not available", "error");
        return;
    }

    // First check if we're clicking on a block
    let block = event.target.closest('[id^="block-"]');
    if (block) {
        // Handle block selection
        if (selectedElement) selectedElement.style.outline = "";
        setSelectedElement(block);
        block.style.outline = "1px dashed #EF7C2F";
        setLastClickedBlockId(block.id);
        setLastClickedElement(block);
        return; // Return after handling block selection
    }

    // If no block was clicked, check for text transform button
    if (!event) {
        const activeButton = document.querySelector('[id^="scTextTransform"].sc-activeTab-border');
        if (!activeButton) return;
        event = { target: activeButton };
    }

    const clickedElement = event.target.closest('[id^="scTextTransform"]');
    if (!clickedElement) return;

    const textTransform = clickedElement.dataset.textTransform;
    const blockId = lastClickedElement?.id;

    if (!blockId || !lastClickedElement) {
        showNotification("Please select a block first", "error");
        return;
    }

    // Get the tag type from dataset.strongElementsByTag
    const data = lastClickedElement.dataset.strongElementsByTag;
    if (!data) {
        showNotification("No bold text found in the selected block", "error");
        return;
    }

    let tagType = null;
    try {
        const parsed = JSON.parse(data);
        const tagKeys = Object.keys(parsed);
        tagType = tagKeys[0];
    } catch (err) {
        showNotification("Failed to process text data", "error");
        return;
    }

    // Apply inline style
    const styleId = `style-${blockId}-${tagType}-strong-texttransform`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }

    const css = `#${blockId} ${tagType} strong {
        text-transform: ${textTransform} !important;
    }`;
    styleTag.innerHTML = css;

    // Save modifications with proper structure
    // saveModifications(blockId, {
    //     "text-transform": textTransform
    // }, 'strong').then(result => {
    //     if (result.success) {
    //         // Update UI tab state
    //         document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
    //             el.classList.remove('sc-activeTab-border');
    //             el.classList.add('sc-inActiveTab-border');
    //         });
    //         clickedElement.classList.remove('sc-inActiveTab-border');
    //         clickedElement.classList.add('sc-activeTab-border');
    //         showNotification("Text transform applied successfully!", "success");
    //     } else {
    //         showNotification(`Failed to save changes: ${result.error}`, "error");
    //     }
    // }).catch(error => {
    //     console.error("Error saving modifications:", error);
    //     showNotification("Failed to save changes", "error");
    // });

    addPendingModification(blockId, {
        "text-transform": textTransform
    }, 'strong');

    // Update UI immediately
    document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
        el.classList.remove('sc-activeTab-border');
        el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
    showNotification("Text transform applied! Click Publish to save changes.", "info");

}



  
