function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `sc-notification sc-notification-${type}`;
  notification.textContent = message;

  // Add styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    borderRadius: "4px",
    color: "white",
    zIndex: "9999",
    animation: "fadeIn 0.3s ease-in-out",
    backgroundColor:
      type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3",
  });

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease-in-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

export function handleTextHighLinghtLink(event, context) {
  const {
    lastClickedElement,
    applyStylesToElement,
    saveLinkTextModifications,
  } = context;
  // Import and call the click event handler
  import("../Link/handleFontSizeLink.js")
    .then((module) => {
      module.handleLinkTextHighlightClick(
        event,
        lastClickedElement,
        applyStylesToElement,
        {
          ...context,
          addPendingModification: (blockId, css, tagType) => {
            // This will be handled by the main context
            console.log("Pending modification added for link text highlight");
          },
          showNotification: (message, type = "info") => {
            const notification = document.createElement("div");
            notification.className = `sc-notification sc-notification-${type}`;
            notification.textContent = message;

            // Add styles
            Object.assign(notification.style, {
              position: "fixed",
              top: "20px",
              right: "20px",
              padding: "10px 20px",
              borderRadius: "4px",
              color: "white",
              zIndex: "9999",
              animation: "fadeIn 0.3s ease-in-out",
              backgroundColor:
                type === "success"
                  ? "#4CAF50"
                  : type === "error"
                  ? "#f44336"
                  : "#2196F3",
            });

            document.body.appendChild(notification);

            // Remove after 3 seconds
            setTimeout(() => {
              notification.style.animation = "fadeOut 0.3s ease-in-out";
              setTimeout(() => notification.remove(), 300);
            }, 3000);
          },
        }
      );
    })
    .catch((error) => {
      console.error("Failed to load Bold text color click handler:", error);
    });
}
