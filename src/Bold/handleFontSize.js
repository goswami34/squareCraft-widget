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

    // Get the active tab to determine which element type we're targeting
    const activeTab = document.querySelector(".sc-activeTab-border");
    console.log('Active tab:', activeTab);

    if (!activeTab) {
        showNotification("No text type selected", "error");
        return;
    }

    // Get all text elements in the block
    const textElements = lastClickedElement.querySelectorAll("h1, h2, h3, h4, p");
    console.log('Text elements found:', textElements);

    if (textElements.length === 0) {
        showNotification("No text elements found in this block", "error");
        return;
    }

    // Find the active text element type
    let activeElementType = null;
    let activeElement = null;

    for (const element of textElements) {
        const tagName = element.tagName.toLowerCase();
        console.log('Checking element:', tagName);
        
        const result = getTextType(tagName, element);
        console.log('getTextType result:', result);
        
        if (result && result.type === activeTab.id) {
            activeElementType = tagName;
            activeElement = element;
            console.log('Found matching element:', activeElementType);
            break;
        }
    }

    if (!activeElementType) {
        console.log('No matching element found. Active tab ID:', activeTab.id);
        showNotification("Unable to determine text type. Please select a valid heading or paragraph.", "error");
        return;
    }

    // Find strong tags within the specific element
    const strongTags = activeElement.querySelectorAll('strong');
    console.log('Strong tags found:', strongTags.length);

    if (strongTags.length === 0) {
        showNotification(`No bold text found in ${activeElementType}`, "error");
        return;
    }

    // Apply inline style with specific selector
    const styleId = `style-${blockId}-${activeElementType}-strong-font-size`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }

    // Apply styles only to strong tags within the specific element type
    const css = `#${blockId} ${activeElementType} strong {
        font-size: ${fontSize} !important;
    }`;
    styleTag.innerHTML = css;

    // Add to pending modifications
    addPendingModification(blockId, {
        "font-size": fontSize
    }, `${activeElementType}-strong`);

    // Update UI
    document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
        el.classList.remove('sc-activeTab-border');
        el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
    
    showNotification(`Font size applied to ${activeElementType} bold text! Click Publish to save changes.`, "info");
}