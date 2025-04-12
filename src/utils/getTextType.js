export function getTextType(tagName, element) {
    const classList = element?.classList || [];
  
    if (tagName === "h1") return { type: "heading1", borderColor: "#EF7C2F" };
    if (tagName === "h2") return { type: "heading2", borderColor: "#EF7C2F" };
    if (tagName === "h3") return { type: "heading3", borderColor: "#EF7C2F" };
    if (tagName === "h4") return { type: "heading4", borderColor: "#EF7C2F" };
  
    if (tagName === "p") {
      if (classList.contains("sqsrte-large")) {
        return { type: "paragraph1", borderColor: "#EF7C2F" };
      } else if (classList.contains("sqsrte-small")) {
        return { type: "paragraph3", borderColor: "#EF7C2F" };
      } else {
        return { type: "paragraph2", borderColor: "#EF7C2F" };
      }
    }
  
    console.log("Element classList:", classList);
    return null;
  }
  

// export function getTextType(tagName = null, element = null) {
//   const activeTab = document.querySelector('.sc-activeTab-border');

//   if (activeTab) {
//     const tabId = activeTab.id;
//     if (tabId.startsWith('heading')) return `h${tabId.replace('heading', '')}`;
//     if (tabId.startsWith('paragraph')) return 'p';
//   }

//   // fallback if no tab is active (like on text-transform click)
//   if (element && element.dataset.strongElementsByTag) {
//     try {
//       const parsed = JSON.parse(element.dataset.strongElementsByTag);
//       const found = Object.keys(parsed)[0]; // use first available (e.g., 'h1', 'p')
//       return found;
//     } catch (e) {
//       console.warn("Could not parse dataset.strongElementsByTag");
//     }
//   }

//   return null;
// }