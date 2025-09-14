import { NavbarIconHtml } from "https://fatin-webefo.github.io/squareCraft-plugin/NavbarIconHtml.js";

export function injectNavbarIcon() {
  // Prevent multiple executions
  if (window.scIconInjected) {
    console.log("⚠️ SquareCraft icons already injected, skipping...");
    return;
  }
  window.scIconInjected = true;

  function insertAdminIcon() {
    if (!parent.document.querySelector(".sc-admin-icon-wrapper")) {
      const navContainer = parent.document.querySelector("ul.css-1tn5iw9");
      if (!navContainer) return;

      const iconSrc =
        localStorage.getItem("sc_icon") ||
        "https://fatin-webefo.github.io/squareCraft-plugin/public/squarecraft-only-logo.svg";

      const wrapper = parent.document.createElement("div");
      wrapper.classList.add("sc-admin-icon-wrapper");
      Object.assign(wrapper.style, {
        position: "relative",
        display: "inline-block",
        zIndex: "99999",
      });

      const icon = parent.document.createElement("img");
      icon.src = iconSrc;
      icon.alt = "sc";
      Object.assign(icon.style, {
        width: "30px",
        height: "30px",
        borderRadius: "20%",
        marginRight: "6px",
        marginTop: "8px",
        cursor: "pointer",
      });

      wrapper.appendChild(icon);
      navContainer.parentNode.insertBefore(wrapper, navContainer);

      let panel = null;

      icon.addEventListener("click", (e) => {
        e.stopPropagation();

        if (panel) {
          panel.remove();
          panel = null;
          return;
        }
        const mainWidget =
          parent.document.querySelector("#sc-widget-container") ||
          document.querySelector("#sc-widget-container");
        if (mainWidget && mainWidget.style.display !== "none") {
          mainWidget.style.display = "none";
        }

        panel = parent.document.createElement("div");
        panel.id = "sc-admin-panel";
        Object.assign(panel.style, {
          position: "absolute",
          top: "45px",
          right: "-10px",
          background: "#2c2c2c",
          borderRadius: "8px",
          padding: "0",
          zIndex: "99999",
          width: "320px",
          fontFamily: "'Poppins', sans-serif",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        });

        panel.innerHTML = NavbarIconHtml();
        wrapper.appendChild(panel);
        setTimeout(() => {
          import(
            "https://fatin-webefo.github.io/squareCraft-plugin/src/viewport/viewportToggle.js"
          )
            .then(({ viewportToggle }) => {
              viewportToggle();

              const viewportSection =
                parent.document.getElementById("viewport-sections");

              if (viewportSection) {
                viewportSection.querySelectorAll("img").forEach((img) => {
                  img.addEventListener("mousedown", (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  });
                  img.addEventListener("touchstart", (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  });
                });
              }
            })
            .catch((err) => {
              console.error("❌ Failed to load viewportToggle.js", err);
            });
        }, 0);
        const dragTarget = panel.querySelector("#icon-options");
        let isDragging = false;
        let offsetX = 0,
          offsetY = 0;

        dragTarget.style.cursor = "grab";

        const startDrag = (event) => {
          if (
            panel.querySelector("#viewport-sections")?.contains(event.target) ||
            event.target.closest(".sc-dropdown")
          )
            return;

          isDragging = true;
          event.preventDefault();

          const clientX = event.clientX || event.touches?.[0]?.clientX;
          const clientY = event.clientY || event.touches?.[0]?.clientY;
          const rect = panel.getBoundingClientRect();

          offsetX = clientX - rect.left;
          offsetY = clientY - rect.top;

          Object.assign(panel.style, {
            position: "fixed",
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            right: "unset",
            transform: "none",
            transition: "none",
            willChange: "left, top",
            pointerEvents: "none",
            userSelect: "none",
          });

          dragTarget.style.cursor = "grabbing";

          document.addEventListener("mousemove", dragMove);
          document.addEventListener("mouseup", stopDrag);
          document.addEventListener("touchmove", dragMove);
          document.addEventListener("touchend", stopDrag);
        };

        const dragMove = (event) => {
          if (!isDragging) return;

          const clientX = event.clientX || event.touches?.[0]?.clientX;
          const clientY = event.clientY || event.touches?.[0]?.clientY;

          const x = clientX - offsetX;
          const y = clientY - offsetY;

          panel.style.left = `${x}px`;
          panel.style.top = `${y}px`;
        };

        const stopDrag = () => {
          if (!isDragging) return;

          isDragging = false;
          dragTarget.style.cursor = "grab";

          Object.assign(panel.style, {
            transform: "none",
            willChange: "auto",
            pointerEvents: "auto",
            userSelect: "auto",
          });

          document.removeEventListener("mousemove", dragMove);
          document.removeEventListener("mouseup", stopDrag);
          document.removeEventListener("touchmove", dragMove);
          document.removeEventListener("touchend", stopDrag);
        };

        dragTarget.removeEventListener("mousedown", startDrag);
        dragTarget.removeEventListener("touchstart", startDrag);
        dragTarget.addEventListener("mousedown", startDrag);
        dragTarget.addEventListener("touchstart", startDrag);

        const handleOutsideClick = (e) => {
          if (!panel.contains(e.target) && !wrapper.contains(e.target)) {
            panel.remove();
            panel = null;
            document.removeEventListener("click", handleOutsideClick);
          }
        };

        setTimeout(() => {
          document.addEventListener("click", handleOutsideClick);
        }, 0);
      });

      const message = parent.document.createElement("div");
      message.innerHTML = `
        <div style="
          position: absolute;
          background-color: #2c2c2c;
          color: white;
          padding: 2rem 2rem;
          border-radius: 8px;
          z-index: 99999;
          opacity: 1;
          transition: opacity 0.5s ease-in-out;
          animation: scFadeIn 0.5s ease-in-out;
          white-space: nowrap;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
          top: 54px;
          left: 40%;
          transform: translateX(-50%);
        ">
          <div style="text-align: center;">
            <p style="font-size: 13px; font-weight: 300; color: #EF7C2F; margin: 0;">SquareCraft Edits Saved</p>
            <p style="font-weight: 300; font-size: 11px; margin: 4px 0 0;">
              Your SquareCraft Plugin has successfully injected<br> to the Current website
            </p>
          </div>
          <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/cross.png"
            width="14"
            style="position: absolute; top: 12px; right: 12px; cursor: pointer;" alt="">
          <div style="
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid #2c2c2c;
          "></div>
        </div>
      `;
      wrapper.appendChild(message);
      const innerMsg = message.querySelector("div");
      setTimeout(() => {
        innerMsg.style.opacity = "0";
        setTimeout(() => message.remove(), 500);
      }, 5000);
    }
  }

  function injectGlobalStylesheet() {
    const head = parent.document.head;
    if (!head.querySelector("#sc-style-link")) {
      const link = document.createElement("link");
      link.id = "sc-style-link";
      link.rel = "stylesheet";
      link.href =
        "https://fatin-webefo.github.io/squareCraft-plugin/src/styles/parent.css";
      head.appendChild(link);
      console.log("✅ CSS stylesheet loaded");
    }
  }

  function insertToolbarIcon() {
    const toolbarContainers = parent.document.querySelectorAll(
      ".tidILMJ7AVANuKwS, div[data-block-toolbar='true'], div[role='menu']"
    );

    console.log("🔍 Found toolbar containers:", toolbarContainers.length);

    toolbarContainers.forEach((toolbarContainer, index) => {
      // Check if this container already has a toolbar icon
      if (toolbarContainer.querySelector(".sc-toolbar")) {
        console.log(`⚠️ Container ${index} already has toolbar, skipping...`);
        return;
      }

      console.log(
        `🔍 Processing toolbar container ${index}:`,
        toolbarContainer
      );

      const iconSrc =
        localStorage.getItem("sc_icon") ||
        "https://fatin-webefo.github.io/squareCraft-plugin/public/squarecraft-only-logo.svg";

      const scDiv = document.createElement("div");
      scDiv.classList.add("sc-toolbar");
      scDiv.setAttribute("data-sc-toolbar", "true"); // Add unique identifier
      Object.assign(scDiv.style, {
        display: "flex",
        alignItems: "center",
        border: "1px solid #E5E4E2",
        background: "rgba(255, 127, 23, 0.06)",
        borderRadius: "6px",
        padding: "6px",
        gap: "6px",
        cursor: "pointer",
        position: "relative",
        zIndex: "99999",
        opacity: "1",
        visibility: "visible",
      });

      const icon = document.createElement("img");
      icon.src = iconSrc;
      icon.alt = "sc";
      Object.assign(icon.style, {
        width: "30px",
        height: "30px",
        borderRadius: "20%",
      });

      const text = document.createElement("span");
      text.innerText = "SquareCraft";
      Object.assign(text.style, {
        fontSize: "14px",
        fontWeight: "bold",
      });

      scDiv.appendChild(icon);
      scDiv.appendChild(text);
      toolbarContainer.appendChild(scDiv);

      console.log(`✅ Successfully created toolbar icon in container ${index}`);

      let sectionPanel = null;

      scDiv.addEventListener("click", async (e) => {
        e.stopPropagation();
        injectGlobalStylesheet();

        const mainWidget =
          parent.document.querySelector("#sc-widget-container") ||
          document.querySelector("#sc-widget-container");

        const adminPanel =
          parent.document.querySelector("#sc-admin-panel") ||
          document.querySelector("#sc-admin-panel");

        if (mainWidget) mainWidget.style.display = "none";
        if (adminPanel) adminPanel.remove();

        // Close panel if already open
        if (sectionPanel) {
          sectionPanel.remove();
          sectionPanel = null;
          document.removeEventListener("click", outsideClickHandler);
          return;
        }

        // Create panel
        sectionPanel = parent.document.createElement("div");
        sectionPanel.id = "sc-section-widget";
        sectionPanel.className =
          "sc-p-2 z-index-high sc-text-color-white sc-border sc-border-solid sc-border-3d3d3d sc-bg-color-2c2c2c sc-rounded-15px sc-w-300px";
        Object.assign(sectionPanel.style, {
          position: "fixed",
          top: "100px",
          left: "100px",
          zIndex: "99999",
        });

        const mod = await import(
          "https://fatin-webefo.github.io/squareCraft-plugin/ToolbarIconHtml.js"
        );
        sectionPanel.innerHTML = mod.ToolbarIconHtml();

        parent.document.body.appendChild(sectionPanel);

        const grab = sectionPanel.querySelector("#sc-grabbing");
        let isDragging = false;
        let offsetX = 0,
          offsetY = 0;

        grab.addEventListener("mousedown", (e) => {
          isDragging = true;
          const rect = sectionPanel.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          sectionPanel.style.pointerEvents = "none";

          document.addEventListener("mousemove", move);
          document.addEventListener("mouseup", stop);
        });

        function move(e) {
          if (!isDragging) return;
          sectionPanel.style.left = `${e.clientX - offsetX}px`;
          sectionPanel.style.top = `${e.clientY - offsetY}px`;
        }

        function stop() {
          isDragging = false;
          sectionPanel.style.pointerEvents = "auto";
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", stop);
        }

        // Outside click close
        function outsideClickHandler(e) {
          if (!sectionPanel.contains(e.target) && !scDiv.contains(e.target)) {
            sectionPanel.remove();
            sectionPanel = null;
            document.removeEventListener("click", outsideClickHandler);
          }
        }

        setTimeout(() => {
          document.addEventListener("click", outsideClickHandler);
        }, 0);
      });
    });
  }

  // Load CSS first
  injectGlobalStylesheet();

  // Wait a bit for CSS to load, then inject icons
  setTimeout(() => {
    insertToolbarIcon();
    insertAdminIcon();
  }, 500);

  // Only create one MutationObserver
  if (!window.scMutationObserver) {
    window.scMutationObserver = new MutationObserver(() => {
      // Only run if not already processing
      if (!window.scProcessingIcons) {
        window.scProcessingIcons = true;
        insertToolbarIcon();
        setTimeout(() => {
          window.scProcessingIcons = false;
        }, 1000);
      }
    });

    window.scMutationObserver.observe(parent.document.body, {
      childList: true,
      subtree: true,
    });
  }
}
