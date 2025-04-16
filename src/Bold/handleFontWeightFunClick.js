export function handleFontWeightFunClick(event = null, context = null) {
    const {
        lastClickedElement,
        saveModifications,
        selectedElement,
        setSelectedElement,
        setLastClickedBlockId,
        setLastClickedElement,
        addPendingModification
    } = context;

    // First check if we're clicking on a block
    let block = event.target.closest('[id^="block-"]');
    if (block) {
        // Handle block selection
        if (selectedElement) selectedElement.style.outline = "";
        setSelectedElement(block);
        block.style.outline = "1px dashed #EF7C2F";
        setLastClickedBlockId(block.id);
        setLastClickedElement(block);
        return;
    }

    // Get the font weight select element
    const fontWeightSelect = document.getElementById('squareCraftFontWeight');
    if (!fontWeightSelect) {
        console.error("Font weight select element not found");
        return;
    }

    // Add event listener for font weight changes
    fontWeightSelect.addEventListener('change', async (event) => {
        if (!lastClickedElement) {
            showNotification("Please select a block first", "error");
            return;
        }

        const fontWeight = event.target.value;
        const blockId = lastClickedElement.id;
        
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
        const styleId = `style-${blockId}-${tagType}-strong-fontweight`;
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        const css = `#${blockId} ${tagType} strong {
            font-weight: ${fontWeight} !important;
        }`;
        styleTag.innerHTML = css;

        // Add to pending modifications
        addPendingModification(blockId, {
            "font-weight": fontWeight
        }, 'strong');

        // Save modifications
        try {
            await saveModifications(blockId, {
                "font-weight": fontWeight
            }, 'strong');
            showNotification("Font weight applied successfully!", "success");
        } catch (error) {
            showNotification("Failed to save font weight changes", "error");
            console.error("Error saving font weight:", error);
        }
    });
}