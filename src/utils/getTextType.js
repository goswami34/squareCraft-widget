export function getTextType(tagName, element) {
  console.log('getTextType called with:', { tagName, element });

    const classList = element?.classList || [];
    console.log('Element classList:', classList);

  
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
    console.log("No matching text type found");

    return null;
  }


