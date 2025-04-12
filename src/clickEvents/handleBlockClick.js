export function handleBlockClick(event, context) {
    const {
      getTextType,
      setSelectedElement,
      selectedElement,
      setLastClickedBlockId,
      setLastClickedElement,
      setLastAppliedAlignment,
      setLastActiveAlignmentElement
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
        justify: "scTextAlignJustify"
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
      "heading1Part", "heading2Part", "heading3Part", "heading4Part",
      "paragraph1Part", "paragraph2Part", "paragraph3Part"
    ];
    const visibleParts = new Set();
  
    innerTextElements.forEach(el => {
      const tag = el.tagName.toLowerCase();
      const result = getTextType(tag, el);
      if (result) {
        visibleParts.add(`${result.type}Part`);
        el.style.border = `1px solid ${result.borderColor}`;
        el.style.borderRadius = "4px";
        el.style.padding = "2px 4px";
      }
    });
  
    allParts.forEach(id => {
      const part = document.getElementById(id);
      if (part) {
        part.classList.toggle("sc-hidden", !visibleParts.has(id));
      }
    });
  
    visibleParts.forEach(partId => {
      const typeId = partId.replace("Part", "");
      const tab = document.getElementById(typeId);
      if (!tab) return;
  
      tab.onmouseenter = () => {
        const b = document.getElementById(block.id);
        const t = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : "p";
        b.querySelectorAll(t).forEach(el => {
          const r = getTextType(t, el);
          if (r?.type === typeId) {
            el.style.outline = `2px solid ${r.borderColor}`;
          }
        });
      };
  
      tab.onmouseleave = () => {
        const b = document.getElementById(block.id);
        b.querySelectorAll("h1,h2,h3,h4,p").forEach(el => el.style.outline = "");
      };
    });

    //align code end here


    //font weight code start here
    
    //font weight code end here
  }
  