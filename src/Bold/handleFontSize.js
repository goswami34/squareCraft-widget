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




// export function handleFontSize(event = null, context = null) {
//     const {
//         lastClickedElement,
//         saveModifications,
//         selectedElement,
//         setSelectedElement,
//         setLastClickedBlockId,
//         setLastClickedElement,
//         addPendingModification,
//         showNotification
//     } = context;

//     if (typeof saveModifications !== 'function') {
//         console.error("saveModifications function is not available");
//         showNotification("Error: Save functionality not available", "error");
//         return;
//     }

//     // First check if we're clicking on a block
//     let block = event?.target?.closest('[id^="block-"]');
//     if (block) {
//         // Handle block selection
//         if (selectedElement) selectedElement.style.outline = "";
//         setSelectedElement(block);
//         block.style.outline = "1px dashed #EF7C2F";
//         setLastClickedBlockId(block.id);
//         setLastClickedElement(block);
//         return;
//     }

//     // If no block was clicked, check for font size input
//     if (!event) {
//         const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
//         if (!activeButton) return;
//         event = { target: activeButton };
//     }

//     const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
//     if (!clickedElement) return;

//     const fontSize = event.target.value + "px";
//     const blockId = lastClickedElement?.id;

//     if (!blockId || !lastClickedElement) {
//         showNotification("Please select a block first", "error");
//         return;
//     }

//     // Find all strong tags within the selected block
//     const strongTags = lastClickedElement.querySelectorAll('strong');
//     if (strongTags.length === 0) {
//         showNotification("No bold text found in the selected block", "error");
//         return;
//     }

//     // Apply inline style
//     const styleId = `style-${blockId}-strong-font-size`;
//     let styleTag = document.getElementById(styleId);
//     if (!styleTag) {
//         styleTag = document.createElement("style");
//         styleTag.id = styleId;
//         document.head.appendChild(styleTag);
//     }

//     // Apply styles to all strong tags within the block
//     const css = `#${blockId} strong {
//         font-size: ${fontSize} !important;
//     }`;
//     styleTag.innerHTML = css;

//     // Add to pending modifications
//     addPendingModification(blockId, {
//         "font-size": fontSize
//     }, 'strong');

//     // Update UI
//     document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
//         el.classList.remove('sc-activeTab-border');
//         el.classList.add('sc-inActiveTab-border');
//     });
//     clickedElement.classList.remove('sc-inActiveTab-border');
//     clickedElement.classList.add('sc-activeTab-border');
    
//     showNotification("Font size applied! Click Publish to save changes.", "info");
// }


export function handleFontSize(event = null, context = null) {
    const {
        lastClickedElement,
        saveModifications,
        selectedElement,
        setSelectedElement,
        setLastClickedBlockId,
        setLastClickedElement,
        addPendingModification,
        showNotification,
        getTextType
    } = context;

    // Debug logging
    console.log('handleFontSize called with:', { event, lastClickedElement });

    if (typeof saveModifications !== 'function') {
        console.error("saveModifications function is not available");
        showNotification("Error: Save functionality not available", "error");
        return;
    }

    // First check if we're clicking on a block
    let block = event?.target?.closest('[id^="block-"]');
    if (block) {
        // Handle block selection
        if (selectedElement) selectedElement.style.outline = "";
        setSelectedElement(block);
        block.style.outline = "1px dashed #EF7C2F";
        setLastClickedBlockId(block.id);
        setLastClickedElement(block);
        return;
    }

    // If no block was clicked, check for font size input
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

    // Get the selected text type and tag from the block's dataset
    const selectedTextType = lastClickedElement.dataset.selectedTextType;
    const selectedElementTag = lastClickedElement.dataset.selectedElementTag;

    if (!selectedTextType || !selectedElementTag) {
        showNotification("Please click on a text element (heading or paragraph) first", "error");
        return;
    }

    // Find the corresponding element in the block
    const targetElement = lastClickedElement.querySelector(selectedElementTag);
    if (!targetElement) {
        showNotification("No matching text element found", "error");
        return;
    }

    // Verify the element type matches
    const result = getTextType(selectedElementTag, targetElement);
    if (!result || result.type !== selectedTextType) {
        showNotification("Text element type mismatch", "error");
        return;
    }

    // Find strong tags within the specific element
    const strongTags = targetElement.querySelectorAll('strong');
    if (strongTags.length === 0) {
        showNotification(`No bold text found in ${selectedTextType}`, "error");
        return;
    }

    // Apply inline style with specific selector
    const styleId = `style-${blockId}-${selectedTextType}-strong-font-size`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }

    // Apply styles only to strong tags within the specific element type
    const css = `#${blockId} ${selectedElementTag} strong {
        font-size: ${fontSize} !important;
    }`;
    styleTag.innerHTML = css;

    // Add to pending modifications
    addPendingModification(blockId, {
        "font-size": fontSize
    }, `${selectedTextType}-strong`);

    // Update UI
    document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
        el.classList.remove('sc-activeTab-border');
        el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
    
    showNotification(`Font size applied to ${selectedTextType} bold text! Click Publish to save changes.`, "info");
}