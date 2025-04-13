
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
      showNotification("Please select a block first", "error");
      return;
  }

  // Get the tag type from dataset.strongElementsByTag
  const data = lastClickedElement.dataset.strongElementsByTag;
  if (!data) {
      console.warn("⚠️ No bold tag data found on the selected block.");
      showNotification("No bold text found in the selected block", "error");
      return;
  }

  let tagType = null;
  try {
      const parsed = JSON.parse(data);
      const tagKeys = Object.keys(parsed);
      tagType = tagKeys[0]; // take the first available tag (e.g. "h1", "p")
  } catch (err) {
      console.warn("❌ Failed to parse strongElementsByTag:", err);
      showNotification("Failed to process text data", "error");
      return;
  }

  if (!tagType) {
      console.warn("❌ No active text type found. Cannot apply text-transform.");
      showNotification("No text type found", "error");
      return;
  }

  // Check if <strong> exists
  const tagElement = lastClickedElement.querySelector(tagType);
  if (!tagElement) {
      console.warn(`🚫 Tag <${tagType}> not found in selected block`);
      showNotification(`Tag <${tagType}> not found`, "error");
      return;
  }

  const strongTags = tagElement.querySelectorAll("strong");
  if (strongTags.length === 0) {
      console.warn(`🚫 No <strong> tags found inside <${tagType}>`);
      showNotification("No bold text found", "error");
      return;
  }

  // Apply inline style
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

  // Save to backend and handle the result
  // saveModifications(blockId, {
  //     "text-transform": textTransform,
  //     "tag-type": tagType
  // }).then(result => {
  //     if (result.success) {
  //         // Update UI tab state only after successful save
  //         document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
  //             el.classList.remove('sc-activeTab-border');
  //             el.classList.add('sc-inActiveTab-border');
  //         });
  //         clickedElement.classList.remove('sc-inActiveTab-border');
  //         clickedElement.classList.add('sc-activeTab-border');
  //     }
  // });
}


// function applyTextTransformToStrongTags(blockId, tagType, textTransform) {
//   // Get all strong tags within the specified tag type in the block
//   const block = document.getElementById(blockId);
//   if (!block) return;

//   const tagElements = block.getElementsByTagName(tagType);
//   if (!tagElements.length) return;

//   // Create a unique style ID for this block and tag type
//   const styleId = `style-${blockId}-${tagType}-strong`;
//   let styleTag = document.getElementById(styleId);
  
//   if (!styleTag) {
//       styleTag = document.createElement('style');
//       styleTag.id = styleId;
//       document.head.appendChild(styleTag);
//   }

//   // Apply text-transform only to strong tags within the specified tag type
//   styleTag.innerHTML = `
//       #${blockId} ${tagType} strong {
//           text-transform: ${textTransform} !important;
//       }
//   `;

//   // Save the modification
//   saveModifications(blockId, {
//       "text-transform": textTransform
//   }, tagType);
// }


// export function handleTextTransformClick(event, context) {
//   const { lastClickedElement, getTextType } = context;
//   if (!lastClickedElement) return;

//   const blockId = lastClickedElement.id;
//   const tagType = getTextType(); // This should return h1, h2, etc.
  
//   // Get the text-transform value from the clicked element
//   const textTransform = event.target.dataset.transform || 'none';
  
//   // Apply the text-transform only to strong tags within the current tag type
//   applyTextTransformToStrongTags(blockId, tagType, textTransform);
// }
  
