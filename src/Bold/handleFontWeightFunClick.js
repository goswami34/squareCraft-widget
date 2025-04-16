// export function handleFontWeightFunClick(event = null, context = null) {
//     const {
//         lastClickedElement,
//         saveModifications,
//         selectedElement,
//         setSelectedElement,
//         setLastClickedBlockId,
//         setLastClickedElement,
//         addPendingModification,
//         getTextType
//     } = context;

//     // Get the font weight select element
//     const fontWeightSelect = document.getElementById('squareCraftFontWeight');
//     if (!fontWeightSelect) {
//         console.error("Font weight select element not found");
//         return;
//     }

//     // Remove any existing event listeners to prevent duplicates
//     const newFontWeightSelect = fontWeightSelect.cloneNode(true);
//     fontWeightSelect.parentNode.replaceChild(newFontWeightSelect, fontWeightSelect);

//     // Add event listener for font weight changes
//     newFontWeightSelect.addEventListener('change', async (event) => {
//         if (!lastClickedElement) {
//             showNotification("Please select a block first", "error");
//             return;
//         }

//         const fontWeight = event.target.value;
//         const blockId = lastClickedElement.id;
        
//         // Get the current active tag type (h1, h2, etc.)
//         const currentTagType = getTextType();
//         if (!currentTagType) {
//             showNotification("Please select a text type first", "error");
//             return;
//         }

//         // Create or update style tag
//         const styleId = `style-${blockId}-${currentTagType}-strong-fontweight`;
//         let styleTag = document.getElementById(styleId);
//         if (!styleTag) {
//             styleTag = document.createElement("style");
//             styleTag.id = styleId;
//             document.head.appendChild(styleTag);
//         }

//         // Create CSS rule that targets strong tags within the current tag type
//         const css = `#${blockId} ${currentTagType} strong {
//             font-weight: ${fontWeight} !important;
//         }`;
//         styleTag.innerHTML = css;

//         // Add to pending modifications
//         addPendingModification(blockId, {
//             "font-weight": fontWeight
//         }, 'strong');

//         // Save modifications
//         try {
//             await saveModifications(blockId, {
//                 "font-weight": fontWeight
//             }, 'strong');
//             showNotification("Font weight applied successfully!", "success");
//         } catch (error) {
//             showNotification("Failed to save font weight changes", "error");
//             console.error("Error saving font weight:", error);
//         }
//     });
// }


export function handleFontWeightFunClick(event = null, context = null) {
    console.log("handleFontWeightFunClick called with context:", context);
    
    const {
        lastClickedElement,
        saveModifications,
        selectedElement,
        setSelectedElement,
        setLastClickedBlockId,
        setLastClickedElement,
        addPendingModification,
        getTextType
    } = context;

    // Get the font weight select element
    const fontWeightSelect = document.getElementById('squareCraftFontWeight');
    console.log("Font weight select element found:", !!fontWeightSelect);
    
    if (!fontWeightSelect) {
        console.error("Font weight select element not found");
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

    // Remove any existing event listeners
    const newFontWeightSelect = fontWeightSelect.cloneNode(true);
    fontWeightSelect.parentNode.replaceChild(newFontWeightSelect, fontWeightSelect);

    // Add click event listener to the select element
    newFontWeightSelect.addEventListener('click', (e) => {
        console.log("Select clicked");
        e.stopPropagation();
    });

    // Add mousedown event to prevent event bubbling
    newFontWeightSelect.addEventListener('mousedown', (e) => {
        console.log("Select mousedown");
        e.stopPropagation();
    });

    // Add change event listener
    newFontWeightSelect.addEventListener('change', async (e) => {
        console.log("Font weight change event triggered");
        console.log("Selected value:", e.target.value);
        console.log("Last clicked element:", lastClickedElement);
        
        if (!lastClickedElement) {
            console.log("No last clicked element");
            showNotification("Please select a block first", "error");
            return;
        }

        const fontWeight = e.target.value;
        const blockId = lastClickedElement.id;
        console.log("Block ID:", blockId);
        
        // Get the current active tag type (h1, h2, etc.)
        const currentTagType = getTextType();
        console.log("Current tag type:", currentTagType);
        
        if (!currentTagType) {
            console.log("No current tag type");
            showNotification("Please select a text type first", "error");
            return;
        }

        // Create or update style tag
        const styleId = `style-${blockId}-${currentTagType}-strong-fontweight`;
        console.log("Style ID:", styleId);
        
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
            console.log("Created new style tag");
        }

        // Create CSS rule that targets strong tags within the current tag type
        const css = `#${blockId} ${currentTagType} strong {
            font-weight: ${fontWeight} !important;
        }`;
        console.log("Applying CSS:", css);
        
        styleTag.innerHTML = css;

        // Add to pending modifications
        addPendingModification(blockId, {
            "font-weight": fontWeight
        }, 'strong');
        console.log("Added to pending modifications");

        // Save modifications
        try {
            await saveModifications(blockId, {
                "font-weight": fontWeight
            }, 'strong');
            console.log("Font weight saved successfully");
            showNotification("Font weight applied successfully!", "success");
        } catch (error) {
            console.error("Error saving font weight:", error);
            showNotification("Failed to save font weight changes", "error");
        }
    });

    // Add focus event listener
    newFontWeightSelect.addEventListener('focus', (e) => {
        console.log("Select focused");
        e.stopPropagation();
    });

    // Add blur event listener
    newFontWeightSelect.addEventListener('blur', (e) => {
        console.log("Select blurred");
        e.stopPropagation();
    });
}