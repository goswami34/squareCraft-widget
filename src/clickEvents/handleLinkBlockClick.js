export function handleLinkBlockClick(event, context) {
  const {
    getTextType,
    setSelectedElement,
    selectedElement,
    setLastClickedBlockId,
    setLastClickedElement,
    setLastAppliedAlignment,
    setLastActiveAlignmentElement,
    setSelectedTextType,
    setSelectedSingleTextType,
    selectedSingleTextType,
    lastClickedElement,
  } = context;

  let block = event.target.closest('[id^="block-"]');
  if (!block) return;

  if (selectedElement) selectedElement.style.outline = "";
  setSelectedElement(block);
  block.style.outline = "1px dashed #EF7C2F";

  setLastClickedBlockId(block.id);
  setLastClickedElement(block);

  //align code start here

  let appliedTextAlign = window.getComputedStyle(block).textAlign;
  if (!appliedTextAlign || appliedTextAlign === "start") {
    const nested = block.querySelector("h1,h2,h3,h4,p");
    if (nested) {
      appliedTextAlign = window.getComputedStyle(nested).textAlign;
    }
  }

  if (appliedTextAlign) {
    setLastAppliedAlignment(appliedTextAlign);

    const map = {
      left: "scTextAlignLeft",
      center: "scTextAlignCenter",
      right: "scTextAlignRight",
      justify: "scTextAlignJustify",
    };

    const activeIcon = document.getElementById(map[appliedTextAlign]);
    if (activeIcon) {
      activeIcon.classList.add("sc-activeTab-border");
      activeIcon.classList.remove("sc-inActiveTab-border");
      setLastActiveAlignmentElement(activeIcon);
    }
  }

  const innerTextElements = block.querySelectorAll("h1,h2,h3,h4,p");
  const allParts = [
    "heading1Part",
    "heading2Part",
    "heading3Part",
    "heading4Part",
    "paragraph1Part",
    "paragraph2Part",
    "paragraph3Part",
  ];
  const visibleParts = new Set();
  console.log("🔍 visibleParts:", visibleParts);

  innerTextElements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const result = getTextType(tag, el);
    if (result) {
      visibleParts.add(`${result.type}Part`);
      el.style.border = `1px solid ${result.borderColor}`;
      el.style.borderRadius = "4px";
      el.style.padding = "2px 4px";
    }

    //new added code start here
    if (tag === "p") {
      if (el.classList.contains("sqsrte-large")) {
        el.setAttribute("data-sc-type", "p1");
      } else if (el.classList.contains("sqsrte-small")) {
        el.setAttribute("data-sc-type", "p3");
      } else {
        el.setAttribute("data-sc-type", "p2");
      }
    }
  });

  allParts.forEach((id) => {
    const part = document.getElementById(id);
    if (part) {
      part.classList.toggle("sc-hidden", !visibleParts.has(id));
    }
  });

  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onmouseenter = () => {
      const b = document.getElementById(block.id);
      const t = typeId.startsWith("heading")
        ? `h${typeId.replace("heading", "")}`
        : "p";
      b.querySelectorAll(t).forEach((el) => {
        const r = getTextType(t, el);
        if (r?.type === typeId) {
          el.style.outline = `2px solid ${r.borderColor}`;
        }
      });
    };

    tab.onmouseleave = () => {
      const b = document.getElementById(block.id);
      b.querySelectorAll("h1,h2,h3,h4,p").forEach(
        (el) => (el.style.outline = "")
      );
    };
  });

  //align code end here

  const firstInnerTextElement = block.querySelector("h1,h2,h3,h4,p1,p2,p3");
  if (firstInnerTextElement) {
    const firstTag = firstInnerTextElement.tagName.toLowerCase();
    setSelectedSingleTextType(firstTag);
    console.log("✅ Default selected text type after block click:", firstTag);
  } else {
    setSelectedSingleTextType(null);
  }

  const innerText = block.querySelector("h1,h2,h3,h4,p1,p2,p3");
  if (innerText) {
    visibleParts.forEach((partId) => {
      const typeId = partId.replace("Part", "");
      const tab = document.getElementById(typeId);
      if (!tab) return;

      tab.onclick = () => {
        const clickedTag = typeId.startsWith("heading")
          ? `h${typeId.replace("heading", "")}`
          : typeId;
        console.log("🔍 clickedTag:", clickedTag);
        setSelectedSingleTextType(clickedTag);
        console.log("✅ Now selected text type:", clickedTag);
      };
    });
  } else {
    setSelectedSingleTextType(null);
  }

  // Consolidate all onclick handlers into one to prevent overriding
  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onclick = () => {
      // Set the correct clickedTag format
      const clickedTag = typeId.startsWith("heading")
        ? `heading${typeId.replace("heading", "")}`
        : `paragraph${typeId.replace("paragraph", "")}`;

      console.log("🔍 clickedTag:", clickedTag);
      setSelectedSingleTextType(clickedTag);
      console.log("✅ Now selected text type:", clickedTag);

      // Mark block as selected visually and logically
      const allBlocks = document.querySelectorAll('[id^="block-"]');
      allBlocks.forEach((b) => b.classList.remove("sc-selected"));
      block.classList.add("sc-selected");
      setLastClickedElement(block);

      // Highlight the selected tab for visual feedback
      document
        .querySelectorAll('[id^="heading"], [id^="paragraph"]')
        .forEach((t) => t.classList.remove("sc-selected-tab"));
      tab.classList.add("sc-selected-tab");

      // Focus font size input
      const linkFontSizeInput = document.getElementById(
        `scFontSizeInputLink-${typeId}`
      );
      if (linkFontSizeInput) {
        linkFontSizeInput.focus();
      }

      // Focus text transform input
      const fontSizeInput = document.getElementById(
        `squareCraftLink-text-transform-${typeId}`
      );
      if (fontSizeInput) {
        fontSizeInput.focus();
      }

      // Note: Font weight event listener is handled in main squareCraft.js
      // No need to set up duplicate event listener here
    };
  });

  //text high light code start here

  //Link section font size code start here
  // Removed duplicate loop - consolidated into main onclick handler above

  //Link section font size code end here

  //Link section text transform code start here
  // Removed duplicate loop - consolidated into main onclick handler above

  //Link section text transform code end here

  //text high light code start here
  // Removed duplicate loop - consolidated into main onclick handler above

  //Link section font weight code end here
}
