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
    const rawTagType = getCurrentTextType(); // e.g., p1, h2
    if (!rawTagType) return;
  
    const tagMap = {
      p1: 'p',
      p2: 'p',
      p3: 'p',
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4'
    };
  
    const htmlTag = tagMap[rawTagType.toLowerCase()];
    if (!htmlTag) {
      console.warn("❌ Unknown tag type:", rawTagType);
      return;
    }
  
    // Check for <strong> tags inside the specific HTML tag
    const tagElements = context.lastClickedElement.querySelectorAll(htmlTag);
    let strongFound = false;
    tagElements.forEach(el => {
      const strongTags = el.querySelectorAll("strong");
      if (strongTags.length > 0) {
        strongFound = true;
      }
    });
  
    if (!strongFound) {
      console.warn(`No <strong> tags found inside ${htmlTag}`);
      return;
    }
  
    // Create or update the <style> tag
    const styleId = `style-${blockId}-${htmlTag}-strong-texttransform`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
  
    // Apply text-transform to only the <strong> inside the right tag
    const css = `
      #${blockId} ${htmlTag} strong {
        text-transform: ${textTransform} !important;
      }
    `;
    styleTag.innerHTML = css;
  
    // Save to backend
    saveModifications(blockId, {
      "text-transform": textTransform,
      "tag-type": rawTagType
    });
  
    // Update active UI state
    document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
      el.classList.remove('sc-activeTab-border');
      el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
  }
  