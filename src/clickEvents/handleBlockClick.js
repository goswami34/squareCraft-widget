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
    document.body.addEventListener("click", (event) => {
      let block = event.target.closest('[id^="block-"]');
      if (!block) return;
    
      if (selectedElement) selectedElement.style.outline = "";
      selectedElement = block;
      selectedElement.style.outline = "2px dashed #EF7C2F";
    
      // Find all strong elements within the clicked block
      const strongElements = block.querySelectorAll('strong');
      console.log(`✅ Selected Block: ${block.id} with ${strongElements.length} bold words`);
    });
    
    
    document.getElementById("squareCraftFontWeight").addEventListener("change", async function() {
      if (!selectedElement) {
          console.warn("⚠️ No block selected");
          return;
      }
    
      const selectedWeight = this.value;
      const blockId = selectedElement.id;
    
      // Create a style tag for this block's strong tags
      let styleTag = document.getElementById(`style-${blockId}-strong`);
      if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = `style-${blockId}-strong`;
          document.head.appendChild(styleTag);
      }
    
      // Apply font-weight to all strong tags within this block using CSS selector
      styleTag.innerHTML = `
          #${blockId} strong {
              font-weight: ${selectedWeight} !important;
          }
      `;
    
      // Save modifications using the block ID
      const css = {
          "font-weight": selectedWeight
      };
    
      await saveModifications(blockId, css);
    
      console.log(`✅ Applied font-weight: ${selectedWeight} to all bold words in block: ${blockId}`);
    });
    
    async function applySavedStyles() {
      const savedStyles = await fetchModifications();
      if (!savedStyles) return;
    
      savedStyles.forEach(style => {
          const blockId = style.elementId;
          const weight = style.css["font-weight"];
          
          if (weight) {
              let styleTag = document.getElementById(`style-${blockId}-strong`);
              if (!styleTag) {
                  styleTag = document.createElement("style");
                  styleTag.id = `style-${blockId}-strong`;
                  document.head.appendChild(styleTag);
              }
              
              styleTag.innerHTML = `
                  #${blockId} strong {
                      font-weight: ${weight} !important;
                  }
              `;
          }
      });
    }
    
    window.addEventListener("load", async () => {
      await applySavedStyles();
    });
    
    //font weight code end here
  }
  