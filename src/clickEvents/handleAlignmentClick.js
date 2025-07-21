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

  if (lastAppliedAlignment === textAlign) {
    applyStylesToElement(lastClickedElement, { "text-align": "" });
    setLastAppliedAlignment(null);

    if (lastActiveAlignmentElement) {
      lastActiveAlignmentElement.classList.remove("sc-activeTab-border");
      lastActiveAlignmentElement.classList.add("sc-inActiveTab-border");
    }
  } else {
    applyStylesToElement(lastClickedElement, { "text-align": textAlign });
    setLastAppliedAlignment(textAlign);

    if (lastActiveAlignmentElement && lastActiveAlignmentElement !== alignmentIcon) {
      lastActiveAlignmentElement.classList.remove("sc-activeTab-border");
      lastActiveAlignmentElement.classList.add("sc-inActiveTab-border");
    }

    alignmentIcon.classList.add("sc-activeTab-border");
    alignmentIcon.classList.remove("sc-inActiveTab-border");
    setLastActiveAlignmentElement(alignmentIcon);
  }

  const publishButton = document.getElementById("publish");
  if (publishButton) {
    publishButton.addEventListener("click", async () => {
      publishButton.textContent = "Publishing...";
      const pageId = document.querySelector("article[data-page-sections]")?.getAttribute("data-page-sections");
      if (!lastClickedElement || !lastAppliedAlignment || !pageId) return;

      const modificationData = {
        userId,
        token,
        widgetId,
        modifications: [{
          pageId,
          elements: [{
            elementId: lastClickedElement.id,
            css: { "text-align": lastAppliedAlignment }
          }]
        }]
      };

      try {
        const response = await fetch("https://admin.squareplugin.com/api/v1/modifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || localStorage.getItem("sc_auth_token")}`,
            "userId": userId,
            "pageId": pageId,
            "widget-id": widgetId,
          },
          body: JSON.stringify(modificationData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        publishButton.textContent = "Published";
      } catch (error) {
        console.error("❌ Error saving modifications:", error.message);
        publishButton.textContent = "Failed";
      }
    });
  }
}
