export   function highlightElement(element) {
    if (!element) return;

    if (lastHighlightedElement && lastHighlightedElement !== element) {
      lastHighlightedElement.style.animation = "";
    }

    element.style.animation = "borderGlow 1s infinite alternate";
    lastHighlightedElement = element; 

    if (!document.getElementById("borderGlowStyle")) {
      const style = document.createElement("style");
      style.id = "borderGlowStyle";
      style.innerHTML = `
        @keyframes borderGlow {
          0% { border: 2px solid red; }
          50% { border: 2px solid yellow; }
          100% { border: 2px solid red; }
        }
      `;
      document.head.appendChild(style);
    }
  }
