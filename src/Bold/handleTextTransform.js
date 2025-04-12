export function handleAlignmentClick(event, context) {
    const alignmentIcon = event.target.closest('#scTextAlignLeft, #scTextAlignCenter, #scTextAlignRight, #scTextAlignJustify');
    if (!alignmentIcon || !context.lastClickedElement) return;
  
    const {
      lastClickedElement,
      getTextType,
      applyStylesToElement,
      lastAppliedAlignment,
      setLastAppliedAlignment,
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement,
      lastClickedBlockId,
      userId,
      token,
      widgetId
    } = context;
  
    const textTags = lastClickedElement.querySelectorAll("h1, h2, h3, h4, p");
    textTags.forEach(el => {
      const tagName = el.tagName.toLowerCase();
      const result = getTextType(tagName, el);
  
    });
  
    const textAlign = alignmentIcon.dataset.align;
  
   
  }
  