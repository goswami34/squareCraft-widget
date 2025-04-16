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

export function handleFontSize(event = null, context = null) {
    const {
        lastClickedElement,
        getTextType,
        saveModifications,
        selectedElement,
        setSelectedElement,
        setLastClickedBlockId,
        setLastClickedElement,
        addPendingModification,
        showNotification
    } = context;

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
        const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
        if (!activeButton) return;
        event = { target: activeButton };
    }

    const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
    if (!clickedElement) return;

    const fontSize = event.target.value + "px";
    const blockId = lastClickedElement?.id;

    if (!blockId || !lastClickedElement) {
        showNotification("Please select a block first", "error");
        return;
    }

    // Get the tag type from dataset.strongElementsByTag
    // const data = lastClickedElement.number.strongElementsByTag;
    // if (!data) {
    //     showNotification("No bold text found in the selected block", "error");
    //     return;
    // }

    // Get currently selected text type tab (e.g., h1, h2, p1)
    const activeTab = document.querySelector(".sc-activeTab-border");
    if (!activeTab) {
        showNotification("No text type selected", "error");
        return;
    }

    // Convert activeTab.id (like 'heading1') to tagName (e.g., h1)
    const activeTagType = (activeTab.id, lastClickedElement);
    if (!activeTagType) {
        showNotification("Unable to determine text type", "error");
        return;
    }

    const selectedTag = lastClickedElement.querySelector(activeTagType);
    if (!selectedTag) {
        showNotification(`No ${activeTagType} tag found in this block`, "error");
        return;
    }

    const strongTags = selectedTag.querySelectorAll('strong');
    if (strongTags.length === 0) {
        showNotification(`No bold text found in ${activeTagType}`, "error");
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
    const styleId = `style-${blockId}-${tagType}-strong-font-size`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }

    const css = `#${blockId} ${tagType} strong {
        font-size: ${fontSize} !important;
    }`;
    styleTag.innerHTML = css;


    addPendingModification(blockId, {
        "font-size": fontSize
    }, 'strong');

    // Update UI immediately
    document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
        el.classList.remove('sc-activeTab-border');
        el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
    showNotification("font size applied! Click Publish to save changes.", "info");

}
