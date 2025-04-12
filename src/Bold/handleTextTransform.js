function getCurrentTextType() {
    const activeTab = document.querySelector('.sc-activeTab-border');
    if (!activeTab) return null;
    
    const tabId = activeTab.id;
    if (tabId.startsWith('heading')) {
        return `h${tabId.replace('heading', '')}`;
    } else if (tabId.startsWith('paragraph')) {
        return `p${tabId.replace('paragraph', '')}`;
    }
    return null;
}

export function handleTextTransformClick(event = null, context = null) {
    // If no event is provided, find the active text transform button
    if (!event) {
        const activeButton = document.querySelector('[id^="scTextTransform"].sc-activeTab-border');
        if (!activeButton) return;
        
        // Create a fake event object
        event = {
            target: activeButton
        };
    }

    // If no context is provided, get it from the last clicked element
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
    const tagType = getCurrentTextType(); // e.g., 'h1', 'p'
    
    // Get the strong elements data
    const data = context.lastClickedElement.dataset.strongElementsByTag;
    if (!data || !tagType) return;
    
    const parsed = JSON.parse(data);
    const strongData = parsed[tagType];
    
    if (!strongData || strongData.count === 0) {
        console.warn(`No <strong> tags found inside ${tagType}`);
        return;
    }

    // Create a style string to apply only to strong tags inside the current tag type
    const styleId = `style-${blockId}-${tagType}-strong-texttransform`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }

    // Construct the style selector like: #block-abc h1 strong
    const css = `#${blockId} ${tagType} strong { text-transform: ${textTransform} !important; }`;
    styleTag.innerHTML = css;

    // Save to backend
    saveModifications(blockId, { 
        "text-transform": textTransform,
        "tag-type": tagType
    });

    // Update UI to show active state
    document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
        el.classList.remove('sc-activeTab-border');
        el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
}