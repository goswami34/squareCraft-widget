// export function handleBlockClick(event, context) {
//     const {
//       getTextType,
//       setSelectedElement,
//       selectedElement,
//       setLastClickedBlockId,
//       setLastClickedElement,
//       setLastAppliedAlignment,
//       setLastActiveAlignmentElement
//     } = context;
  
//     let block = event.target.closest('[id^="block-"]');
//     if (!block) return;
  
//     if (selectedElement) selectedElement.style.outline = "";
//     setSelectedElement(block);
//     block.style.outline = "1px dashed #EF7C2F";
  
//     setLastClickedBlockId(block.id);
//     setLastClickedElement(block);
    

//     //align code start here
  
//     let appliedTextAlign = window.getComputedStyle(block).textAlign;
//     if (!appliedTextAlign || appliedTextAlign === "start") {
//       const nested = block.querySelector("h1,h2,h3,h4,p");
//       if (nested) {
//         appliedTextAlign = window.getComputedStyle(nested).textAlign;
//       }
//     }
  
//     if (appliedTextAlign) {
//       setLastAppliedAlignment(appliedTextAlign);
  
//       const map = {
//         left: "scTextAlignLeft",
//         center: "scTextAlignCenter",
//         right: "scTextAlignRight",
//         justify: "scTextAlignJustify"
//       };
  
//       const activeIcon = document.getElementById(map[appliedTextAlign]);
//       if (activeIcon) {
//         activeIcon.classList.add("sc-activeTab-border");
//         activeIcon.classList.remove("sc-inActiveTab-border");
//         setLastActiveAlignmentElement(activeIcon);
//       }
//     }
  
//     const innerTextElements = block.querySelectorAll("h1,h2,h3,h4,p");
//     const allParts = [
//       "heading1Part", "heading2Part", "heading3Part", "heading4Part",
//       "paragraph1Part", "paragraph2Part", "paragraph3Part"
//     ];
//     const visibleParts = new Set();
  
//     innerTextElements.forEach(el => {
//       const tag = el.tagName.toLowerCase();
//       const result = getTextType(tag, el);
//       if (result) {
//         visibleParts.add(`${result.type}Part`);
//         el.style.border = `1px solid ${result.borderColor}`;
//         el.style.borderRadius = "4px";
//         el.style.padding = "2px 4px";
//       }
//     });
  
//     allParts.forEach(id => {
//       const part = document.getElementById(id);
//       if (part) {
//         part.classList.toggle("sc-hidden", !visibleParts.has(id));
//       }
//     });
  
//     visibleParts.forEach(partId => {
//       const typeId = partId.replace("Part", "");
//       const tab = document.getElementById(typeId);
//       if (!tab) return;
  
//       tab.onmouseenter = () => {
//         const b = document.getElementById(block.id);
//         const t = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : "p";
//         b.querySelectorAll(t).forEach(el => {
//           const r = getTextType(t, el);
//           if (r?.type === typeId) {
//             el.style.outline = `2px solid ${r.borderColor}`;
//           }
//         });
//       };
  
//       tab.onmouseleave = () => {
//         const b = document.getElementById(block.id);
//         b.querySelectorAll("h1,h2,h3,h4,p").forEach(el => el.style.outline = "");
//       };
//     });

//     //align code end here


//     //bold section font size code start here
//     const textElements = block.querySelectorAll("h1, h2, h3, h4, p");

//     // Process each text element
//     textElements.forEach(el => {
//         const tag = el.tagName.toLowerCase();
//         const result = getTextType(tag, el);
//         if (result) {
//             el.style.border = `1px solid ${result.borderColor}`;
//             el.style.borderRadius = "4px";
//             el.style.padding = "2px 4px";

//             // Add click handler for text element selection
//             el.addEventListener('click', (e) => {
//                 e.stopPropagation();
                
//                 // Remove active class from all font size inputs
//                 document.querySelectorAll('[id^="scFontSizeInput"]').forEach(input => {
//                     input.classList.remove('sc-activeTab-border');
//                     input.classList.add('sc-inActiveTab-border');
//                 });

//                 // Add active class to the corresponding font size input
//                 const fontSizeInput = document.getElementById(`scFontSizeInput-${result.type}`);
//                 if (fontSizeInput) {
//                     fontSizeInput.classList.remove('sc-inActiveTab-border');
//                     fontSizeInput.classList.add('sc-activeTab-border');
                    
//                     // Store the selected text type and element in the block's dataset
//                     block.dataset.selectedTextType = result.type;
//                     block.dataset.selectedElementTag = tag;
                    
//                     // Also store the selected element itself for reference
//                     block.dataset.selectedElement = el.id;
                    
//                     // Log for debugging
//                     console.log('Selected text element:', {
//                         type: result.type,
//                         tag: tag,
//                         element: el,
//                         blockId: block.id
//                     });
//                 } else {
//                     console.error(`Font size input not found for type: ${result.type}`);
//                 }
//             });
//         }
//     });
//     //bold section font size code end here



//     //font weight code start here
//     // In handleBlockClick.js
//     const strongElementsByTag = {};
//     innerTextElements.forEach(el => {
//       const tag = el.tagName.toLowerCase();
//       const strongTags = el.querySelectorAll('strong');
//       if (strongTags.length > 0) {
//         // Instead of storing the DOM elements, store just the count and text content
//         strongElementsByTag[tag] = {
//           count: strongTags.length,
//           texts: Array.from(strongTags).map(strong => strong.textContent)
//         };
//       }
//     });

//     // Store the strong elements data in the block's dataset
//     block.dataset.strongElementsByTag = JSON.stringify(strongElementsByTag);
//     //font weight code end here
    
//   }
  


export function handleBlockClick(event, context) {
  const {
    getTextType,
    setSelectedElement,
    selectedElement,
    setLastClickedBlockId,
    setLastClickedElement,
    setLastActiveAlignmentElement,
    setLastAppliedAlignment,
  } = context;

  // Find the nearest block
  let block = event.target.closest('[id^="block-"]');
  if (!block) return;

  // Remove outline from previous selected
  if (selectedElement) selectedElement.style.outline = "";

  // Highlight new block
  setSelectedElement(block);
  block.style.outline = "1px dashed #EF7C2F";
  setLastClickedBlockId(block.id);
  setLastClickedElement(block);

  // ----------------------------------
  // Handle text alignment detection
  // ----------------------------------
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

  // ----------------------------------
  // Handle text type detection
  // ----------------------------------
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

      // -------------------------------
      // Handle clicking on h1-h4, p
      // -------------------------------
      el.addEventListener('click', (e) => {
        e.stopPropagation();

        // Remove active classes from all font-size inputs
        document.querySelectorAll('[id^="scFontSizeInput"]').forEach(input => {
          input.classList.remove('sc-activeTab-border');
          input.classList.add('sc-inActiveTab-border');
        });

        // Highlight the clicked font-size input
        const fontSizeInput = document.getElementById(`scFontSizeInput-${result.type}`);
        if (fontSizeInput) {
          fontSizeInput.classList.remove('sc-inActiveTab-border');
          fontSizeInput.classList.add('sc-activeTab-border');
        }

        // Save the selected text element
        block.dataset.selectedTextType = result.type;             // example: heading2
        block.dataset.selectedElementTag = tag;                   // example: h2
        block.dataset.selectedElementId = el.id || '';            // if id exists
        context.lastClickedTextElement = el;                      // 💥 very important (new)
      });
    }
  });

  // ----------------------------------
  // Hide/Show text parts in widget
  // ----------------------------------
  allParts.forEach(id => {
    const part = document.getElementById(id);
    if (part) {
      part.classList.toggle("sc-hidden", !visibleParts.has(id));
    }
  });

  // ----------------------------------
  // Hover effect for text tabs
  // ----------------------------------
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

  // ----------------------------------
  // Handle bold (strong) element detection
  // ----------------------------------
  const strongElementsByTag = {};
  innerTextElements.forEach(el => {
    const tag = el.tagName.toLowerCase();
    const strongTags = el.querySelectorAll('strong');
    if (strongTags.length > 0) {
      strongElementsByTag[tag] = {
        count: strongTags.length,
        texts: Array.from(strongTags).map(strong => strong.textContent)
      };
    }
  });

  // Save strong tag info into dataset
  block.dataset.strongElementsByTag = JSON.stringify(strongElementsByTag);
}
