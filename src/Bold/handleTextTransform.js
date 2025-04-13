// export function handleTextTransformClick(event = null, context = null) {
//     console.log("handleTextTransformClick", event, context);

//     const {
//         lastClickedElement,
//         getTextType,
//         applyStylesToElement,
//         lastAppliedAlignment,
//         setLastAppliedAlignment,
//         lastActiveAlignmentElement,
//         setLastActiveAlignmentElement,
//         lastClickedBlockId,
//         userId,
//         token,
//         widgetId
//       } = context;

//     if (!event) {
//         const activeButton = document.querySelector('[id^="scTextTransform"].sc-activeTab-border');
//         if (!activeButton) return;
//         event = { target: activeButton };
//     }

//     if (!context) {
//         const lastClickedElement = document.querySelector('.sc-selected');
//         if (!lastClickedElement) {
//             console.warn("⚠️ Please select a block first");
//             return;
//         }
//         context = {
//             lastClickedElement,
//             lastClickedBlockId: lastClickedElement.id
//         };
//     }

//     const clickedElement = event.target.closest('[id^="scTextTransform"]');
//     if (!clickedElement) return;

//     const textTransform = clickedElement.dataset.textTransform;
//     const blockId = context.lastClickedElement.id;
//     // const tagType = getCurrentTextType(); // h1, h2, p1, etc.
//     const rawType = getTextType(); // e.g. 'p1'

//     if (!rawType) {
//         console.warn("❌ No active text type found. Cannot apply text-transform.");
//         return;
//     }
//     let tagType = rawType;

//     // Map p1 → p, p2 → p, h1 → h1 etc.
//     if (rawType.startsWith('p')) tagType = 'p';
//     if (rawType.startsWith('h')) tagType = `h${rawType.replace('heading', '').replace('h', '')}`;


//     if (!tagType) return;

//     // ⛔️ Only apply if that tag type contains <strong> inside
//     const tagElement = context.lastClickedElement.querySelector(tagType);
//     if (!tagElement) {
//         console.warn(`🚫 Tag ${tagType} not found in selected block`);
//         return;
//     }

//     const strongTags = tagElement.querySelectorAll("strong");
//     if (strongTags.length === 0) {
//         console.warn(`🚫 No <strong> tags found inside ${tagType}`);
//         return;
//     }

//     // ✅ Create or update style tag
//     const styleId = `style-${blockId}-${tagType}-strong-texttransform`;
//     let styleTag = document.getElementById(styleId);
//     if (!styleTag) {
//         styleTag = document.createElement("style");
//         styleTag.id = styleId;
//         document.head.appendChild(styleTag);
//     }

//     const css = `
//         #${blockId} ${tagType} strong {
//             text-transform: ${textTransform} !important;
//         }
//     `;
//     styleTag.innerHTML = css;

//     // ✅ Save to backend
//     saveModifications(blockId, {
//         "text-transform": textTransform,
//         "tag-type": tagType
//     });

//     // ✅ Update tab UI
//     document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
//         el.classList.remove('sc-activeTab-border');
//         el.classList.add('sc-inActiveTab-border');
//     });
//     clickedElement.classList.remove('sc-inActiveTab-border');
//     clickedElement.classList.add('sc-activeTab-border');
// }


export function handleTextTransformClick(event = null, context = null) {
    console.log("handleTextTransformClick", event, context);
  
    const {
      lastClickedElement,
      applyStylesToElement,
      lastAppliedAlignment,
      setLastAppliedAlignment,
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement,
      lastClickedBlockId,
      userId,
      token,
      widgetId,
      saveModifications
    } = context;
  
    if (!event) {
      const activeButton = document.querySelector('[id^="scTextTransform"].sc-activeTab-border');
      if (!activeButton) return;
      event = { target: activeButton };
    }
  
    const clickedElement = event.target.closest('[id^="scTextTransform"]');
    if (!clickedElement) return;
  
    const textTransform = clickedElement.dataset.textTransform;
    const blockId = lastClickedElement?.id;
  
    if (!blockId || !lastClickedElement) {
      console.warn("⚠️ Please select a block first");
      return;
    }
  
    // ✅ Get the tag type from dataset.strongElementsByTag
    const data = lastClickedElement.dataset.strongElementsByTag;
    if (!data) {
      console.warn("⚠️ No bold tag data found on the selected block.");
      return;
    }
  
    let tagType = null;
    try {
      const parsed = JSON.parse(data);
      const tagKeys = Object.keys(parsed);
      tagType = tagKeys[0]; // take the first available tag (e.g. "h1", "p")
    } catch (err) {
      console.warn("❌ Failed to parse strongElementsByTag:", err);
      return;
    }
  
    if (!tagType) {
      console.warn("❌ No active text type found. Cannot apply text-transform.");
      return;
    }
  
    // ✅ Check if <strong> exists
    const tagElement = lastClickedElement.querySelector(tagType);
    if (!tagElement) {
      console.warn(`🚫 Tag <${tagType}> not found in selected block`);
      return;
    }
  
    const strongTags = tagElement.querySelectorAll("strong");
    if (strongTags.length === 0) {
      console.warn(`🚫 No <strong> tags found inside <${tagType}>`);
      return;
    }
  
    // ✅ Apply inline style
    const styleId = `style-${blockId}-${tagType}-strong-texttransform`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
  
    const css = `#${blockId} ${tagType} strong {
      text-transform: ${textTransform} !important;
    }`;
    styleTag.innerHTML = css;
  
    // ✅ Save to backend
    saveModifications(blockId, {
      "text-transform": textTransform,
      "tag-type": tagType
    });
  
    // ✅ Update UI tab state
    document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
      el.classList.remove('sc-activeTab-border');
      el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
  }
  
