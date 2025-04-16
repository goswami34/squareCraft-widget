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

    // Get the font size input element
    const fontSizeInput = document.getElementById('scFontSizeInput');
    if (!fontSizeInput) {
        console.error("Font size input element not found");
        return;
    }

    // Remove any existing event listeners to prevent duplicates
    const newFontSizeInput = fontSizeInput.cloneNode(true);
    fontSizeInput.parentNode.replaceChild(newFontSizeInput, fontSizeInput);

    // Add event listener for font size changes
    newFontSizeInput.addEventListener('input', async (event) => {
        if (!lastClickedElement) {
            showNotification("Please select a block first", "error");
            return;
        }

        const fontSize = event.target.value + "px";
        const blockId = lastClickedElement.id;

        // Create a style tag for this block's strong tags
        let styleTag = document.getElementById(`style-${blockId}-strong-fontsize`);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = `style-${blockId}-strong-fontsize`;
            document.head.appendChild(styleTag);
        }

        // Apply font-size to all strong tags within this block using CSS selector
        styleTag.innerHTML = `
            #${blockId} strong {
                font-size: ${fontSize} !important;
            }
        `;

        // Add to pending modifications
        addPendingModification(blockId, {
            "font-size": fontSize
        }, 'strong');

        showNotification("Font size applied! Click Publish to save changes.", "info");
    });
}