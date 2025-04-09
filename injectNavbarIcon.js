export function injectNavbarIcon() {
    function insertAdminIcon() {
        if (!parent.document.querySelector(".sc-admin-icon")) {
            const navContainer = parent.document.querySelector('ul.css-1tn5iw9');
            if (navContainer) {
                const iconSrc = localStorage.getItem("sc_icon") || "https://i.ibb.co.com/kg9fn02s/Frame-33.png";
                const icon = document.createElement("img");
                icon.src = iconSrc;
                icon.alt = "sc";
                icon.style.width = "30px";
                icon.style.height = "30px";
                icon.style.borderRadius = "20%";
                icon.style.marginRight = "6px";
                icon.style.cursor = "pointer";
                icon.style.display = "inline-block";
                icon.classList.add("sc-admin-icon", "sc-z-99999");

                navContainer.parentNode.insertBefore(icon, navContainer);

                const message = document.createElement("div");
                message.classList.add("sc-floating-message");
                message.innerHTML = `
                    <div class="sc-message-content">
                        ✅ SquareCraft installed!
                    </div>
                    <div class="sc-message-arrow"></div>
                `;

                message.style.position = "absolute";
                message.style.backgroundColor = "#2c2c2c";
                message.style.color = "white";
                message.style.padding = "10px 14px";
                message.style.borderRadius = "8px";
                message.style.fontSize = "12px";
                message.style.fontWeight = "400";
                message.style.zIndex = "99999";
                message.style.opacity = "1";
                message.style.transition = "opacity 0.5s ease-in-out, transform 0.3s ease-in-out";
                message.style.animation = "scFadeIn 0.5s ease-in-out";
                message.style.whiteSpace = "nowrap";
                message.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
                message.style.top = "60px";
                message.style.right = "10%";
                message.style.transform = "translateX(-17%)";

                navContainer.parentNode.insertBefore(message, navContainer);

                const messageArrow = message.querySelector(".sc-message-arrow");
                messageArrow.style.position = "absolute";
                messageArrow.style.top = "-8px";
                messageArrow.style.left = "50%";
                messageArrow.style.transform = "translateX(-50%)";
                messageArrow.style.width = "0";
                messageArrow.style.height = "0";
                messageArrow.style.borderLeft = "8px solid transparent";
                messageArrow.style.borderRight = "8px solid transparent";
                messageArrow.style.borderBottom = "8px solid #2c2c2c";

                setTimeout(() => {
                    message.style.opacity = "0";
                    setTimeout(() => message.remove(), 500);
                }, 5000);
            }
        }
    }

    function insertToolbarIcon() {
        const toolbarContainers = parent.document.querySelectorAll('div.js-section-toolbar');

        toolbarContainers.forEach(toolbarContainer => {
            if (!toolbarContainer.querySelector(".sc-toolbar")) {
                const iconSrc = localStorage.getItem("sc_icon") || "https://i.ibb.co.com/kg9fn02s/Frame-33.png";

                const scDiv = document.createElement("div");
                scDiv.classList.add("sc-toolbar");
                scDiv.style.display = "flex";
                scDiv.style.alignItems = "center";
                scDiv.style.border = "1px solid #E5E4E2";
                scDiv.style.background = "rgba(255, 127, 23, 0.06)";
                scDiv.style.borderRadius = "6px";
                scDiv.style.padding = "6px";
                scDiv.style.gap = "6px";

                scDiv.addEventListener("mouseenter", () => {
                    scDiv.style.backgroundColor = "rgba(177, 176, 176, 0.2)";
                });

                scDiv.addEventListener("mouseleave", () => {
                    scDiv.style.backgroundColor = "transparent";
                });

                const icon = document.createElement("img");
                icon.src = iconSrc;
                icon.alt = "sc";
                icon.style.width = "30px";
                icon.style.height = "30px";
                icon.style.borderRadius = "20%";
                icon.style.cursor = "pointer";

                const text = document.createElement("span");
                text.innerText = "SquareCraft";
                text.style.fontSize = "14px";
                text.style.fontWeight = "bold";
                text.style.cursor = "pointer";

                scDiv.appendChild(icon);
                scDiv.appendChild(text);

                toolbarContainer.appendChild(scDiv);
            }
        });
    }

    insertToolbarIcon();
    insertAdminIcon();

    const observer = new MutationObserver(() => {
        insertToolbarIcon();
    });

    observer.observe(parent.document.body, { childList: true, subtree: true });
}
