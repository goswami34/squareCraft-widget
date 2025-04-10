(async function sc() {
    const widgetScript = document.getElementById("sc-script");
    if (!widgetScript) {
        console.error("❌ Widget script not found! Ensure the script tag exists with id 'sc-script'.");
        return;
    }

    const token = widgetScript.dataset?.token;
    const sc_u_id = widgetScript.dataset?.uId;
    const sc_w_id = widgetScript.dataset?.wId;

    if (token) {
        localStorage.setItem("sc_auth_token", token);
        document.cookie = `sc_auth_token=${token}; path=/; domain=${location.hostname}; Secure; SameSite=Lax`;
    }

    if (sc_u_id) {
        localStorage.setItem("sc_u_id", sc_u_id);
        document.cookie = `sc_u_id=${sc_u_id}; path=.squarespace.com;`;
    }

    if (sc_w_id) {
        localStorage.setItem("sc_w_id", sc_w_id);
        document.cookie = `sc_w_id=${sc_w_id}; path=.squarespace.com;`;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://goswami34.github.io/squareCraft-widget/src/styles/parent.css";
    document.head.appendChild(link);

    let widgetContainer = null;
    let widgetLoaded = false;

    async function createWidget() {
        console.log("📥 Fetching widget module...");
        try {
            const module = await import("https://goswami34.github.io/squareCraft-widget/html.js");
            if (module && module.html) {
                console.log("✅ HTML module loaded successfully!");

                if (!widgetContainer) {
                    widgetContainer = document.createElement("div");
                    widgetContainer.id = "sc-widget-container";
                    widgetContainer.classList.add("sc-fixed", "sc-text-color-white", "sc-universal", "sc-z-9999");
                    widgetContainer.innerHTML = module.html();
                    widgetContainer.style.display = "none";
                    document.body.appendChild(widgetContainer);

                    console.log("✅ Widget container added:", widgetContainer);
                    makeWidgetDraggable();
                    widgetLoaded = true;
                }
            } else {
                console.error("❌ Failed to retrieve the HTML function from module!");
            }
        } catch (error) {
            console.error("🚨 Error loading HTML module:", error);
        }
    }

    async function toggleWidgetVisibility(event) {
        event.stopPropagation();

        if (!widgetLoaded) {
            console.log("📥 Creating and displaying widget...");
            await createWidget();
        }

        if (widgetContainer) {
            widgetContainer.style.display = widgetContainer.style.display === "none" ? "block" : "none";
        }
    }

    document.addEventListener("click", (event) => {
        if (widgetContainer && widgetContainer.style.display === "block" && !widgetContainer.contains(event.target)) {
            widgetContainer.style.display = "none";
        }
    });



    function makeWidgetDraggable() {
        if (!widgetContainer) return;

        widgetContainer.style.position = "fixed";
        widgetContainer.style.cursor = "grab";
        widgetContainer.style.zIndex = "999";
        widgetContainer.style.left = "calc(100% - 250px)";
        widgetContainer.style.top = "100px";

        let offsetX = 0, offsetY = 0, isDragging = false;

        widgetContainer.addEventListener("mousedown", (event) => {
            if (event.target.tagName === "INPUT" || event.target.tagName === "SELECT" || event.target.isContentEditable) return;

            event.preventDefault();
            isDragging = true;

            offsetX = event.clientX - widgetContainer.getBoundingClientRect().left;
            offsetY = event.clientY - widgetContainer.getBoundingClientRect().top;

            document.addEventListener("mousemove", moveAt);
            document.addEventListener("mouseup", stopDragging);
        });

        function moveAt(event) {
            if (!isDragging) return;
            let newX = Math.max(0, Math.min(window.innerWidth - widgetContainer.offsetWidth, event.clientX - offsetX));
            let newY = Math.max(0, Math.min(window.innerHeight - widgetContainer.offsetHeight, event.clientY - offsetY));
            widgetContainer.style.left = `${newX}px`;
            widgetContainer.style.top = `${newY}px`;
        }

        function stopDragging() {
            isDragging = false;
            document.removeEventListener("mousemove", moveAt);
            document.removeEventListener("mouseup", stopDragging);
        }
    }

    function injectIcon() {
        const navContainer = parent.document.querySelector('ul.css-1tn5iw9');

        if (!navContainer) {
            console.warn("❌ Squarespace admin nav container not found.");
            return;
        }

        const iconSrc = localStorage.getItem("sc_icon") || "https://i.ibb.co.com/kg9fn02s/Frame-33.png";

        function createIcon() {
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
            icon.addEventListener("click", toggleWidgetVisibility);
            return icon;
        }

        navContainer.parentNode.insertBefore(createIcon(), navContainer);
        console.log("✅ sc icon injected into nav bar!");

        function injectIconIntoTargetElements() {
            console.log("🔄 Running injectIconIntoTargetElements...");
            const targets = parent.document.querySelectorAll(".tidILMJ7AVANuKwS:not(.sc-processed)");

            targets.forEach((element) => {
                element.classList.add("sc-processed");

                const parentContainer = element.closest(".css-rxv52q");
                if (!parentContainer) {
                    console.warn("❌ Parent container not found, skipping:", element);
                    return;
                }

                parentContainer.style.display = "flex";
                parentContainer.style.alignItems = "center";
                parentContainer.style.position = "relative";

                if (!parentContainer.parentElement.querySelector(".sc-admin-icon")) {
                    const clonedIcon = document.createElement("img");
                    clonedIcon.src = "https://i.ibb.co.com/kg9fn02s/Frame-33.png";
                    clonedIcon.alt = "sc";
                    clonedIcon.classList.add("sc-admin-icon");
                    clonedIcon.style.width = "40px";
                    clonedIcon.style.cursor = "pointer";
                    clonedIcon.style.height = "40px";
                    clonedIcon.style.borderRadius = "20%";
                    clonedIcon.style.cursor = "pointer";
                    clonedIcon.style.display = "inline-block";
                    clonedIcon.style.backgroundColor = "white";
                    clonedIcon.style.position = "absolute";
                    clonedIcon.style.top = "50%";
                    clonedIcon.style.left = "calc(100% + 10px)";
                    clonedIcon.style.transform = "translateY(-50%)";
                    parentContainer.parentElement.appendChild(clonedIcon);
                    parentContainer.addEventListener("click", toggleWidgetVisibility);

                }
            });
        }



        injectIconIntoTargetElements();

        const observer = new MutationObserver(() => {
            injectIconIntoTargetElements();
        });
        observer.observe(parent.document.body, { childList: true, subtree: true });
    }



    function waitForNavBar(attempts = 0) {
        if (attempts > 10) {
            console.error("❌ Failed to find Squarespace nav bar.");
            return;
        }
        const nav = parent.document.querySelector("ul.css-1tn5iw9");
        if (!nav) {
            setTimeout(() => waitForNavBar(attempts + 1), 500);
        } else {
            injectIcon();
        }
    }

    waitForNavBar();
})();
