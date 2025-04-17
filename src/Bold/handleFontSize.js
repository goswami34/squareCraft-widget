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

    // Get the active tab to determine which element type we're targeting
    const activeTab = document.querySelector(".sc-activeTab-border");
    if (!activeTab) {
        showNotification("No text type selected", "error");
        return;
    }

    // Convert activeTab.id to element type (e.g., 'heading2' -> 'h2', 'paragraph2' -> 'p')
    let elementType = null;
    if (activeTab.id.startsWith('heading')) {
        elementType = `h${activeTab.id.replace('heading', '')}`;
    } else if (activeTab.id.startsWith('paragraph')) {
        elementType = 'p';
    }

    if (!elementType) {
        showNotification("Unable to determine element type", "error");
        return;
    }

    // Find strong tags within the specific element type
    const element = lastClickedElement.querySelector(elementType);
    if (!element) {
        showNotification(`No ${elementType} element found in this block`, "error");
        return;
    }

    const strongTags = element.querySelectorAll('strong');
    if (strongTags.length === 0) {
        showNotification(`No bold text found in ${elementType}`, "error");
        return;
    }

    // Apply inline style with specific selector
    const styleId = `style-${blockId}-${elementType}-strong-font-size`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }

    // Apply styles only to strong tags within the specific element type
    const css = `#${blockId} ${elementType} strong {
        font-size: ${fontSize} !important;
    }`;
    styleTag.innerHTML = css;

    // Add to pending modifications
    addPendingModification(blockId, {
        "font-size": fontSize
    }, `${elementType}-strong`);

    // Update UI
    document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
        el.classList.remove('sc-activeTab-border');
        el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
    
    showNotification(`Font size applied to ${elementType} bold text! Click Publish to save changes.`, "info");
}
