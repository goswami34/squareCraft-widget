export function handleFontSize(event = null, context = null) {
    const {
        lastClickedElement,
        getTextType,
        saveModifications,
        selectedElement,
        setSelectedElement,
        setLastClickedBlockId,
        setLastClickedElement,
        addPendingModification
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
        
        // Get the current active tag type (h1, h2, etc.)
        const currentTagType = getTextType();
        if (!currentTagType) {
            showNotification("Please select a text type first", "error");
            return;
        }

        // Get the strong elements data
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

        // Create or update style tag
        const styleId = `style-${blockId}-${tagType}-strong-fontsize`;
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        // Create CSS rule that targets strong tags within the current tag type
        const css = `#${blockId} ${tagType} strong {
            font-size: ${fontSize} !important;
        }`;
        styleTag.innerHTML = css;

        // Add to pending modifications
        addPendingModification(blockId, {
            "font-size": fontSize
        }, 'strong');

        showNotification("Font size applied! Click Publish to save changes.", "info");
    });
}