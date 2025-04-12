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

    if (!event) {
        const activeButton = document.querySelector('[id^="scTextTransform"].sc-activeTab-border');
        if (!activeButton) return;
        event = { target: activeButton };
    }

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
    // const tagType = getCurrentTextType(); // h1, h2, p1, etc.
    const rawType = getCurrentTextType(); // e.g. 'p1'
    let tagType = rawType;

    // Map p1 → p, p2 → p, h1 → h1 etc.
    if (rawType.startsWith('p')) tagType = 'p';
    if (rawType.startsWith('h')) tagType = `h${rawType.replace('heading', '').replace('h', '')}`;


    if (!tagType) return;

    // ⛔️ Only apply if that tag type contains <strong> inside
    const tagElement = context.lastClickedElement.querySelector(tagType);
    if (!tagElement) {
        console.warn(`🚫 Tag ${tagType} not found in selected block`);
        return;
    }

    const strongTags = tagElement.querySelectorAll("strong");
    if (strongTags.length === 0) {
        console.warn(`🚫 No <strong> tags found inside ${tagType}`);
        return;
    }

    // ✅ Create or update style tag
    const styleId = `style-${blockId}-${tagType}-strong-texttransform`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }

    const css = `
        #${blockId} ${tagType} strong {
            text-transform: ${textTransform} !important;
        }
    `;
    styleTag.innerHTML = css;

    // ✅ Save to backend
    saveModifications(blockId, {
        "text-transform": textTransform,
        "tag-type": tagType
    });

    // ✅ Update tab UI
    document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
        el.classList.remove('sc-activeTab-border');
        el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
}
