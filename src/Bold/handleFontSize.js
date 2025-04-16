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
    console.log("handleFontSize");
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

    // First check if we're clicking on a block
    let block = event?.target?.closest('[id^="block-"]');
    console.log(block);
    if (block) {
        // Handle block selection
        if (selectedElement) selectedElement.style.outline = "";
        setSelectedElement(block);
        block.style.outline = "1px dashed #EF7C2F";
        setLastClickedBlockId(block.id);
        setLastClickedElement(block);
        return;
    }

    // Get the font size input element
    const fontSizeInput = document.getElementById('scFontSizeInput');
    console.log(fontSizeInput);
    if (!fontSizeInput) {
        console.error("Font size input element not found");
        return;
    }

    // Remove any existing event listeners to prevent duplicates
    const newFontSizeInput = fontSizeInput.cloneNode(true);
    fontSizeInput.parentNode.replaceChild(newFontSizeInput, fontSizeInput);

    newFontSizeInput.addEventListener('input', async (event) => {
        if (!lastClickedElement) {
            showNotification("Please select a block first", "error");
            return;
        }

        const fontSize = event.target.value + "px";
        const blockId = lastClickedElement.id;

        // Get currently selected text type tab (e.g., h1, h2, p1)
        const activeTab = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
        console.log(activeTab);
        if (!activeTab) {
            showNotification("No text type selected", "error");
            return;
        }

        // Convert activeTab.id (like 'heading1') to tagName (e.g., h1)
        const activeTagType = getTextType(activeTab.id, lastClickedElement);
        if (!activeTagType) {
            showNotification("Unable to determine text type", "error");
            return;
        }

        // Check if the selected tag exists in the block
        const selectedTag = lastClickedElement.querySelector(activeTagType);
        if (!selectedTag) {
            showNotification(`No ${activeTagType} tag found in this block`, "error");
            return;
        }

        // Check for strong tags within the selected tag
        const strongTags = selectedTag.querySelectorAll('strong');
        if (strongTags.length === 0) {
            showNotification(`No bold text found in ${activeTagType}`, "error");
            return;
        }

        // Create or update style tag for this block's strong tags
        let styleTag = document.getElementById(`style-${blockId}-${activeTagType}-strong-fontsize`);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = `style-${blockId}-${activeTagType}-strong-fontsize`;
            document.head.appendChild(styleTag);
        }

        // Apply font-size only to strong tags within the selected tag
        styleTag.innerHTML = `
            #${blockId} ${activeTagType} strong {
                font-size: ${fontSize} !important;
            }
        `;

        // Add to pending modifications
        addPendingModification(blockId, {
            "font-size": fontSize
        }, `${activeTagType} strong`);

        showNotification(`Font size applied to bold text in ${activeTagType}!`, "success");
    });
}