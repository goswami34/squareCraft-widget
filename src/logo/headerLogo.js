(async function headerLogo() {

    let retryCount = 0, maxRetries = 10;

    function addPluginIcon() {
        if (retryCount >= maxRetries) {
            return console.warn("🚨 Max retries reached. Stopping plugin injection.");
        }
        retryCount++;

        const adminToolbar = document.querySelector('[data-guidance-engine="guidance-engine-device-view-button-container"]')?.closest('ul');

        if (!adminToolbar) {
            console.warn("⚠️ Squarespace Admin Navbar not found. Retrying...");
            setTimeout(addPluginIcon, 1000);
            return;
        }
        if (document.getElementById("sc-icon-button")) {
            return console.warn("⚠️ Plugin Icon already exists.");
        }

        const listItem = document.createElement("li");
        listItem.className = "custom-plugin-icon";

        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "custom-plugin-wrapper";

        const pluginButton = document.createElement("button");
        pluginButton.id = "sc-icon-button";
        pluginButton.className = "custom-plugin-btn";
        pluginButton.setAttribute("aria-label", "My Plugin");
        pluginButton.setAttribute("data-test", "my-plugin-button");
        pluginButton.style.cssText = `
            width: 37px; height: 37px; border-radius: 4px; background-color: transparent;
            display: flex; justify-content: center; align-items: center; border: none;
            cursor: pointer; transition: opacity 0.3s ease-in-out, transform 0.2s ease-in-out;
            opacity: 0;
        `;

        const iconImage = document.createElement("img");
        iconImage.src = "https://i.ibb.co/LXKK6swV/Group-29.jpg"; 
        iconImage.alt = "Plugin Icon";
        iconImage.style.cssText = "width: 22px; height: 22px;";

        pluginButton.onmouseenter = () => pluginButton.style.transform = "scale(1.1)";
        pluginButton.onmouseleave = () => pluginButton.style.transform = "scale(1)";
        pluginButton.onclick = () => window.open("https://your-plugin-dashboard.com", "_blank");

        pluginButton.appendChild(iconImage);
        buttonWrapper.appendChild(pluginButton);
        listItem.appendChild(buttonWrapper);

        adminToolbar.appendChild(listItem);

        requestAnimationFrame(() => pluginButton.style.opacity = "1");

        retryCount = 0;
    }
    const observer = new MutationObserver(() => {
        if (!document.getElementById("sc-icon-button")) {
            addPluginIcon();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(addPluginIcon, 3000);
})();
