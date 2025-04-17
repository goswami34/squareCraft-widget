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

    // Find all strong tags within the selected block
    const strongTags = lastClickedElement.querySelectorAll('strong');
    if (strongTags.length === 0) {
        showNotification("No bold text found in the selected block", "error");
        return;
    }

    // Apply inline style
    const styleId = `style-${blockId}-strong-font-size`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }

    // Apply styles to all strong tags within the block
    const css = `#${blockId} strong {
        font-size: ${fontSize} !important;
    }`;
    styleTag.innerHTML = css;

    // Add to pending modifications
    addPendingModification(blockId, {
        "font-size": fontSize
    }, 'strong');

    // Update UI
    document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
        el.classList.remove('sc-activeTab-border');
        el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
    
    showNotification("Font size applied! Click Publish to save changes.", "info");
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

//     const selectedTextType = lastClickedElement.dataset.selectedTextType;
//     if (!selectedTextType) {
//         showNotification("Please select a text element first", "error");
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
//     const css = `#${blockId} ${selectedTextType} strong {
//         font-size: ${fontSize} !important;
//     }`;
//     styleTag.innerHTML = css;

//     // Add to pending modifications
//     addPendingModification(blockId, {
//         "font-size": fontSize,
//         "text-type": selectedTextType
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

//     if (!event) {
//         const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
//         if (!activeButton) return;
//         event = { target: activeButton };
//     }

//     const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
//     if (!clickedElement) return;

//     const fontSize = event.target.value + "px";

//     if (!lastClickedElement || !(lastClickedElement.tagName)) {
//         showNotification("Please click on a bold text (h2, p2, etc.) first before applying font size", "error");
//         console.warn("Last clicked element missing or invalid:", lastClickedElement);
//         return;
//     }

//     const tagName = lastClickedElement.tagName.toLowerCase();
//     if (!["h1","h2","h3","h4","p","p1","p2","p3"].includes(tagName)) {
//         showNotification("Please click on a bold text element first (h2, p2, etc.)", "error");
//         return;
//     }

//     const block = lastClickedElement.closest('[id^="block-"]');
//     if (!block) {
//         showNotification("Block not found for selected text element", "error");
//         return;
//     }

//     const blockId = block.id;
//     const selectedElementId = lastClickedElement.id || generateRandomIdForElement(lastClickedElement);

//     // Find only the <strong> tags inside the selected text
//     const strongTags = lastClickedElement.querySelectorAll('strong');
//     if (strongTags.length === 0) {
//         showNotification("No bold text found inside selected text element", "error");
//         return;
//     }

//     // Apply style only to selected strongs
//     const styleId = `style-${blockId}-${selectedElementId}-strong-font-size`;
//     let styleTag = document.getElementById(styleId);
//     if (!styleTag) {
//         styleTag = document.createElement("style");
//         styleTag.id = styleId;
//         document.head.appendChild(styleTag);
//     }

//     const css = `
//     #${blockId} #${selectedElementId} strong {
//         font-size: ${fontSize} !important;
//     }`;
//     styleTag.innerHTML = css;

//     // Save modification
//     addPendingModification(blockId, {
//         "font-size": fontSize,
//         "target": selectedElementId
//     }, 'strong');

//     // Update UI
//     document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
//         el.classList.remove('sc-activeTab-border');
//         el.classList.add('sc-inActiveTab-border');
//     });
//     clickedElement.classList.remove('sc-inActiveTab-border');
//     clickedElement.classList.add('sc-activeTab-border');

//     showNotification("Font size applied to bold text!", "success");
// }

// // Helper if no ID
// function generateRandomIdForElement(el) {
//     const randomId = "sc-elem-" + Math.random().toString(36).substr(2, 9);
//     el.id = randomId;
//     return randomId;
// }
