function getCurrentTextType() {
    const activeTab = document.querySelector('.sc-activeTab-border');
    if (!activeTab) return null;
  
    const tabId = activeTab.id;
    if (tabId.startsWith('heading')) {
      return `h${tabId.replace('heading', '')}`; // h1, h2, ...
    } else if (tabId.startsWith('paragraph')) {
      return `p${tabId.replace('paragraph', '')}`; // p1, p2, ...
    }
    return null;
}

export function handleTextTransformClick(event = null, context = null) {
    console.log("handleTextTransformClick", event, context);
    
    // If no event provided, find the active button
    if (!event) {
        const activeButton = document.querySelector('[id^="scTextTransform"].sc-activeTab-border');
        if (!activeButton) return;
        event = { target: activeButton };
    }

    // If no context provided, get it from the last clicked element
    if (!context) {
        const lastClickedElement = document.querySelector('.sc-selected');
        if (!lastClickedElement) {
            console.warn("⚠️ Please select a block first");
            return;
        }
        context = {
            lastClickedElement,
            lastClickedBlockId: lastClickedElement.id
        };
    }

    const clickedElement = event.target.closest('[id^="scTextTransform"]');
    if (!clickedElement) return;

    const textTransform = clickedElement.dataset.textTransform;
    const blockId = context.lastClickedElement.id;
    const rawTagType = getCurrentTextType();
    if (!rawTagType) return;

    // Create or update the style tag
    const styleId = `style-${blockId}-${rawTagType}-strong-texttransform`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }

    // Apply text-transform to strong tags within the current tag type
    const css = `
        #${blockId} ${rawTagType} strong {
            text-transform: ${textTransform} !important;
        }
    `;
    styleTag.innerHTML = css;

    // Save to backend
    saveModifications(blockId, {
        "text-transform": textTransform,
        "tag-type": rawTagType
    });

    // Update UI state
    document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
        el.classList.remove('sc-activeTab-border');
        el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
}