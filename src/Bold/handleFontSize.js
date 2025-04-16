export function handleFontSize(event = null, context = null) {
    const {
        lastClickedElement,
        getTextType,
        saveModifications,
        addPendingModification
    } = context;

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
        if (!data) return;
        
        const parsed = JSON.parse(data);
        const strongData = parsed[currentTagType];
        
        if (!strongData || strongData.count === 0) {
            console.warn(`No <strong> tags found inside ${currentTagType}`);
            return;
        }

        // Create or update style tag
        const styleId = `style-${blockId}-${currentTagType}-strong-fontsize`;
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        // Create CSS rule that targets strong tags within the current tag type
        const css = `#${blockId} ${currentTagType} strong {
            font-size: ${fontSize} !important;
        }`;
        styleTag.innerHTML = css;

        // Add to pending modifications
        addPendingModification(blockId, {
            "font-size": fontSize
        }, 'strong');

        // Save modifications
        try {
            await saveModifications(blockId, {
                "font-size": fontSize
            }, 'strong');
            showNotification("Font size applied successfully!", "success");
        } catch (error) {
            showNotification("Failed to save font size changes", "error");
            console.error("Error saving font size:", error);
        }
    });
}