(async function amitVai() {
    const widgetScript = document.getElementById("sc-script");
    if (!widgetScript) {
        console.error(
            ":x: Widget script not found! Ensure the script tag exists with id 'sc-script'."
        );
        return;
    }

    const token = widgetScript.dataset?.token;
    const sc_u_id = widgetScript.dataset?.uId;
    const sc_w_id = widgetScript.dataset?.wId;
    const userId = localStorage.getItem("sc_u_id");
    const widgetId = localStorage.getItem("sc_w_id");

    if (token) {
        console.log("🔑 Token received:", token);
        localStorage.setItem("sc_auth_token", token);
        document.cookie = `sc_auth_token=${token}; path=/; domain=${location.hostname}; Secure; SameSite=Lax`;
    }

    if (sc_u_id) {
        console.log("👤 User ID received:", sc_u_id);
        localStorage.setItem("sc_u_id", sc_u_id);
        document.cookie = `sc_u_id=${sc_u_id}; path=.squarespace.com;`;
    }

    if (sc_w_id) {
        console.log("🛠️ Widget ID received:", sc_w_id);
        localStorage.setItem("sc_w_id", sc_w_id);
        document.cookie = `sc_w_id=${sc_w_id}; path=.squarespace.com;`;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href =
        "https://goswami34.github.io/squareCraft-widget/src/styles/parent.css";
    document.head.appendChild(link);

    const fontSizes = [
        8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
        46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    ];
    const LetterSpacing = [
        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
        23, 24, 25,
    ];
    let fontSizeOptions = "";
    for (let size of fontSizes) {
        fontSizeOptions += `<option value="${size}">${size}px</option>`;
    }

    if (token) localStorage.setItem("sc_auth_token", token);
    if (userId) localStorage.setItem("sc_u_id", userId);
    if (widgetId) localStorage.setItem("sc_w_id", widgetId);

    let selectedElement = null;
    let span = null;
    let appliedStyles = new Set();

    function getPageId() {
        let pageElement = document.querySelector("article[data-page-sections]");
        return pageElement ? pageElement.getAttribute("data-page-sections") : null;
    }

    let pageId = getPageId();
    if (!pageId)
        console.warn(":warning: No page ID found. Plugin may not work correctly.");


    function applyStylesToElement(elementId, css) {
        if (!elementId || !css) return;

        let styleTag = document.getElementById(`style-${elementId}`);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = `style-${elementId}`;
            document.head.appendChild(styleTag);
        }

        let cssText = `#${elementId} { `;
        Object.keys(css).forEach((prop) => {
            cssText += `${prop}: ${css[prop]} !important; `;
        });
        cssText += "}";

        styleTag.innerHTML = cssText;
        console.log(`✅ Styles Persisted for ${elementId}`);
    }


    async function fetchModifications(retries = 3) {
        if (!pageId) return;

        try {
            const response = await fetch(
                `https://webefo-backend.onrender.com/api/v1/get-modifications?userId=${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token || localStorage.getItem("sc_auth_token")}`,
                    },
                }
            );

            const data = await response.json();
            console.log("📥 Retrieved Data from Database:", data);

            if (!data.modifications || data.modifications.length === 0) {
                console.warn("⚠️ No saved styles found for this page.");
                return;
            }

            // Loop through retrieved styles and apply them
            data.modifications.forEach(({ pageId: storedPageId, elements }) => {
                if (storedPageId === pageId) {
                    elements.forEach(({ elementId, css, elementStructure }) => {
                        if (elementStructure && elementStructure.fullContent) {
                            const parentElement = document.getElementById(elementStructure.parentId);
                            if (parentElement) {
                                parentElement.innerHTML = elementStructure.fullContent; // Restore full content
                            }
                        }

                        // Apply saved modifications
                        if (css && css.span) {
                            let existingSpan = document.getElementById(css.span.id);

                            if (!existingSpan && elementStructure) {
                                const walker = document.createTreeWalker(
                                    document.body,
                                    NodeFilter.SHOW_TEXT,
                                    {
                                        acceptNode: function (node) {
                                            return node.textContent.includes(elementStructure.content)
                                                ? NodeFilter.FILTER_ACCEPT
                                                : NodeFilter.FILTER_REJECT;
                                        }
                                    }
                                );

                                let textNode;
                                while (textNode = walker.nextNode()) {
                                    if (textNode.textContent.includes(elementStructure.content)) {
                                        const span = document.createElement('span');
                                        span.id = css.span.id;
                                        span.className = elementStructure.className || 'sc-font-modified';
                                        span.textContent = elementStructure.content;

                                        Object.entries(css.span).forEach(([prop, value]) => {
                                            if (prop !== 'id') {
                                                span.style[prop] = value;
                                            }
                                        });

                                        textNode.parentNode.replaceChild(span, textNode);
                                        console.log(`✅ Recreated span with ID ${span.id} and applied styles`);
                                        break;
                                    }
                                }
                            } else if (existingSpan) {
                                Object.entries(css.span).forEach(([prop, value]) => {
                                    if (prop !== 'id') {
                                        existingSpan.style[prop] = value;
                                    }
                                });
                                console.log(`✅ Applied styles to existing span ${existingSpan.id}`);
                            }
                        }
                    });
                }
            });

        } catch (error) {
            console.error("❌ Error Fetching Modifications:", error);
            if (retries > 0) {
                console.log(`🔄 Retrying fetch... (${retries} attempts left)`);
                setTimeout(() => fetchModifications(retries - 1), 2000);
            }
        }
    }


    const observer = new MutationObserver(() => {
        console.log("🔄 Edit Mode Detected. Reapplying modifications...");
        fetchModifications();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function findTextNodeByContent(element, searchText) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                return node.textContent.includes(searchText)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            },
        });

        return walker.nextNode();
    }

    window.addEventListener("load", async () => {
        createWidget(); // Ensure the widget is created
        setTimeout(makeWidgetDraggable, 500);
        setTimeout(attachEventListeners, 1500);

        await fetchModifications(); // ✅ Fetch and apply modifications
    });


    async function saveModifications(elementId, css, elementStructure = null) {
        if (!pageId || !elementId || !css) {
            console.warn("⚠️ Missing required data to save modifications.");
            return;
        }

        const parentElement = document.getElementById(elementId)?.parentElement;
        const fullContent = parentElement ? parentElement.innerHTML : "";

        const modificationData = {
            userId,
            token,
            widgetId,
            modifications: [{
                pageId,
                elements: [{
                    elementId,
                    css: {
                        span: {
                            id: elementId,
                            ...css
                        }
                    },
                    elementStructure: elementStructure || {
                        type: 'span',
                        className: 'sc-font-modified',
                        content: document.getElementById(elementId)?.textContent || '',
                        parentId: parentElement?.id || null,
                        fullContent: fullContent // Store the full sentence
                    }
                }]
            }]
        };

        try {
            const response = await fetch("https://webefo-backend.onrender.com/api/v1/modifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token || localStorage.getItem("sc_auth_token")}`,
                    "userId": userId,
                    "pageId": pageId,
                    "widget-id": widgetId,
                },
                body: JSON.stringify(modificationData),
            });

            const result = await response.json();
            console.log("✅ Changes Saved Successfully!", result);
            return result;
        } catch (error) {
            console.error("❌ Error saving modifications:", error);
        }
    }



    async function resetModifications() {
        const userId = localStorage.getItem("sc_u_id");
        const token = localStorage.getItem("sc_auth_token");
        const widgetId = localStorage.getItem("sc_w_id");
        const pageId = getPageId(); // Ensure pageId is retrieved

        if (!userId || !token || !widgetId || !pageId) {
            console.warn(
                "⚠️ Missing required parameters: userId, token, widgetId, or pageId."
            );
            return;
        }

        try {
            const requestData = {
                userId: userId,
                token: token,
                widgetId: widgetId,
                pageId: pageId,
            };

            const response = await fetch(
                "https://webefo-backend.vercel.app/api/v1/modifications/elements",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestData), // ✅ Send required data in the request body
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Error resetting modifications:", errorData);
                return;
            }

            console.log("✅ Modifications reset successfully!");

            // Step 2: Remove all injected styles
            document
                .querySelectorAll("style[id^='style-']")
                .forEach((styleTag) => styleTag.remove());

            // Step 3: Clear stored data in localStorage (only UI-related, not user credentials)
            localStorage.removeItem("sc_auth_token");
            localStorage.removeItem("sc_u_id");
            localStorage.removeItem("sc_w_id");

            // Step 4: Reset UI elements to default values
            document.getElementById("scFontSize").value = "16";
            document.getElementById("scFontWeight").value = "400";

            console.log("🎯 Reset complete. All styles and elements removed.");
        } catch (error) {
            console.error("❌ Error resetting modifications:", error);
        }
    }

    function createWidget() {
        const widgetContainer = document.createElement("div");
        widgetContainer.id = "sc-widget-container";
        widgetContainer.classList.add(
            "sc-fixed",
            "sc-text-color-white",
            "sc-universal",
            "sc-z-99999"
        );
        widgetContainer.style.display = "none"; // Hide the widget by default

        widgetContainer.innerHTML = `
            <div
                class="sc-p-4  sc-text-color-white sc-border sc-border-solid sc-border-3d3d3d sc-bg-color-2c2c2c sc-rounded-15px sc-w-300px">
                <div class="sc-flex sc-poppins sc-universal sc-items-center sc-justify-between">
                    <img class="sc-cursor-grabbing sc-universal" src="https://i.ibb.co.com/pry1mVGD/Group-28-1.png" width="140px" />
                
                </div>
                <p class="sc-text-sm sc-mt-6 sc-poppins sc-font-light">Lorem Ipsum is simply dummy text
                    of the printing and typesetting industry.
                </p>
                <div
                    class="sc-mt-6 sc-poppins sc-border-t sc-border-dashed sc-border-color-494949  sc-w-full">
                </div>
                <div class="sc-mt-6 sc-poppins sc-flex  sc-items-center sc-universal">
                    <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader ">Design</p>
                    <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader">Advanced</p>
                    <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader">Presets</p>
                </div>
                <div
                    class="sc-border-t sc-border-solid sc-relative sc-border-color-494949 sc-w-full">
                    <div
                    class="sc-absolute sc-top-0 sc-left-0 sc-bg-colo-EF7C2F sc-w-16 sc-h-1px">
                    </div>
                </div>
                <div
                    class="sc-rounded-6px  sc-mt-6  sc-border sc-border-solid sc-border-EF7C2F sc-bg-color-3d3d3d">
                    <div class="sc-flex sc-p-2 sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                        <img loading="lazy"
                            src="https://goswami34.github.io/squareCraft-widget/public/T.svg" alt="">
                        <p class="sc-universal sc-poppins">Typography</p>
                    </div>
                    <img src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg" alt="">
                    </div>
                    <div class="sc-h-1px sc-bg-3f3f3f"></div>
                    <div
                    class="sc-flex sc-px-2   sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                        <div class="toggle-container" id="toggleSwitch">
                            <div class="toggle-bullet"></div>
                        </div>
                        <p id="toggleText" class="sc-text-sm sc-poppins">Enable</p>
                    </div>
                    </div>
                    <div class="sc-h-1px  sc-bg-3f3f3f"></div>
    
    
                    <div class="sc-mt-2">
                    <div
                        class="sc-flex sc-poppins sc-px-2  sc-items-center sc-justify-between sc-gap-2">
                        <div
                            class="sc-cursor-pointer sc-bg-color-EF7C2F sc-w-full sc-font-light sc-flex sc-items-center sc-text-sm sc-py-1px sc-rounded-6px sc-text-color-white sc-justify-center">
                            Normal
                        </div>
                        <div
                            class="sc-cursor-pointer sc-bg-3f3f3f sc-w-full sc-text-color-white sc-font-light sc-flex sc-text-sm sc-hover sc-py-1px sc-rounded-6px sc-items-center sc-justify-center">
                            Hover
                        </div>
                    </div>
                    <div class="sc-px-4">
                        <div class="sc-h-1px  sc-mt-2 sc-bg-3f3f3f"></div>
                    </div>
                    </div>
    
    
                    <div class=" sc-mt-2 sc-px-2 sc-flex sc-justify-between">
                    <p class="sc-text-sm sc-universal sc-poppins">Text</p>
                    <img src="https://goswami34.github.io/squareCraft-widget/public/eye.svg" width="12px" />
                    </div>
                    <div class="sc-mt-2  sc-grid sc-w-full sc-grid-cols-12 sc-gap-2 sc-px-2" >
    
                    <div id="sc-font-family" 
                        class="sc-flex  sc-bg-494949 sc-h-9 sc-col-span-7 sc-cursor-pointer sc-rounded-6px sc-justify-between sc-border sc-border-solid sc-border-585858 sc-rounded-6px sc-items-center "> 
                    </div>
    
                    <div>
                        <input type="number" id="scFontSize" pleaceholder="font-size" value="20" min="10" max="50" style="width: 80px; background-color: gray; color: white; border-radius: 4px; padding: 4px 10px 4px 4px;">
                    </div>
                    
    
                    </div>
    
                    
    
                    <div style="margin:20px 10px;">
                    <label style="font-size: 12px;">Font Weight:</label>
                    <select id="scFontWeight" style="width: 100%; padding: 6px; background: #2c2c2c; color: white; border: 1px solid #585858; border-radius: 6px; margin:4px;">
                        <option value="100">Thin (100)</option>
                        <option value="200">Extra Light (200)</option>
                        <option value="300">Light (300)</option>
                        <option value="400" selected>Regular (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semi Bold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">Extra Bold (800)</option>
                        <option value="900">Black (900)</option>
                    </select>
                    </div>
    
    
                    <div class="sc-mt-2  sc-grid sc-px-2 sc-w-full sc-grid-cols-12 sc-gap-2 ">
                    
                    </div>
    
                    <div class="sc-mt-2 sc-grid sc-px-2 sc-w-full sc-grid-cols-12 sc-gap-2 ">
                    <div class="sc-flex sc-col-span-5 sc-justify-between sc-border sc-border-solid sc-border-585858 sc-rounded-6px sc-items-center ">
                        <div
                            class="sc-flex sc-items-center sc-justify-between sc-w-full ">
                            <img id="scTextAlignLeft" data-align="left"
                                src="https://goswami34.github.io/squareCraft-widget/public/alignment (1).svg"
                                class="sc-cursor-pointer alignment-icon   sc-mx-auto"  alt="">
                            <div class="sc-v-line"></div>
                            <img id="scTextAlignRight" data-align="right"
                                src="https://goswami34.github.io/squareCraft-widget/public/alignment (3).svg"
                                class="sc-cursor-pointer alignment-icon    sc-mx-auto"  alt="">
                            <div class="sc-v-line"></div>
                            <img id="scTextAlignCenter" data-align="center"
                                src="https://goswami34.github.io/squareCraft-widget/public/alignment (2).svg"
                                class="sc-cursor-pointer alignment-icon    sc-mx-auto"  alt="">
                            <div class="sc-v-line"></div>
                            <img id="scTextAlignJustify" data-align="justify"
                                src="https://goswami34.github.io/squareCraft-widget/public/alignment (4).svg"
                                class="sc-cursor-pointer alignment-icon    sc-mx-auto "  alt="">
                        </div>
                    </div>
    
    
                    <div class="sc-flex sc-text-color-white sc-justify-between sc-col-span-3 
                        sc-rounded-6px sc-border sc-border-solid sc-border-585858 
                        sc-items-center sc-w-full ">
                        <div class="sc-Letter-spacing-container sc-flex sc-justify-between sc-items-center sc-flex sc-items-center sc-border 
                            sc-border-solid sc-border-3d3d3d  sc-rounded-6px 
                            ">
                            <input type="text" id="scLineHeight" value="15" class="sc-Letter-spacing-input sc-font-light sc-text-sm sc-text-color-white 
                                sc-bg-transparent sc-w-full  sc-py-1px sc-font-light">
                            <div class="">
                                <img id="scLetterSpacingDropdown"
                                src="https://goswami34.github.io/squareCraft-widget/public/line-spacing.svg"
                                class=" sc-px-1 sc-ml-1 sc-mx-auto sc-cursor-pointer" >
                            </div>
                        </div>
                        <div id="scLetterSpacingOptions" class="sc-hidden sc-h-44 sc-font-sm sc-bg-3f3f3f sc-w-20
                            sc-rounded-6px sc-border sc-border-585858 sc-absolute 
                            sc-mt-1">
                            ${LetterSpacing?.map(
            (gap) => `
                            <div class="sc-dropdown-item sc-py-1px sc-text-center  sc-text-sm"
                                data-value="${gap}">${gap}</div>
                            `
        ).join("")}
                        </div>   
                    </div>
                    </div>
    
    
                    <div class="sc-mt-2 sc-grid sc-px-2 sc-w-full sc-grid-cols-12 sc-gap-2">
                    <div class="sc-flex sc-col-span-6 sc-justify-between sc-border sc-border-solid sc-border-585858 sc-rounded-6px sc-items-center ">
                        <div
                            class="sc-flex sc-px-2 sc-items-center sc-justify-between sc-w-full ">
                            <p class="sc-font-bold sc-universal sc-text-sm sc-cursor-pointer elements-font-style" data-style="bold">B</p>
                            <div class="sc-v-line"></div>
                            <p  class="sc-font-italic sc-universal  sc-text-sm sc-cursor-pointer sc-text-center sc-mx-auto elements-font-style" data-style="italic">I</p>
                            <div class="sc-v-line"></div>
                        <p class="sc-font-underline sc-universal sc-text-sm sc-cursor-pointer sc-text-center sc-mx-auto elements-font-style" data-style="underline">U</p>
                            <div class="sc-v-line"></div> 
                            <p  class="sc-font-underline sc-universal sc-text-sm sc-cursor-pointer sc-text-center sc-mx-auto elements-font-style" data-style="dotted">abc</p>
                            <div class="sc-v-line"></div> 
                            <img class=" sc-rounded-6px sc-rotate-180 sc-px-1_5 squsareCraft-font-style sc-cursor-pointer" width="12px"
                        src="https://goswami34.github.io/squareCraft-widget/public/dot.svg" alt="">
                        </div>
                    </div>
                    </div>
    
    
                    <div class="sc-mt-2 sc-grid sc-px-2 sc-w-full sc-grid-cols-12 sc-gap-2">
                    <div class="sc-flex sc-col-span-6 sc-justify-between sc-border sc-border-solid sc-border-585858 sc-rounded-6px sc-items-center">
                        <div
                            class="sc-flex sc-poppins  sc-items-center sc-justify-between sc-w-full ">
                            <p class=" sc-mx-2 sc-w-full sc-text-center sc-universal sc-text-sm squsareCraft-text-transform sc-cursor-pointer" data-transform="uppercase">AG</p>
                            <div class="sc-v-line"></div>
                            <p class=" sc-universal  sc-text-sm sc-text-center sc-w-full sc-mx-auto squsareCraft-text-transform sc-cursor-pointer" data-transform="lowercase">ag</p>
                            <div class="sc-v-line"></div>
                            <p class=" sc-universal  sc-text-sm sc-text-center sc-w-full sc-mx-auto squsareCraft-text-transform sc-cursor-pointer" data-transform="capitalize">Ag</p>
                            <div class="sc-v-line"></div>
                            <img class=" sc-rounded-6px sc-rotate-180 sc-px-1_5 squsareCraft-text-transform sc-cursor-pointer" width="12px"
                        src="https://goswami34.github.io/squareCraft-widget/public/dot.svg" alt="">
                        </div>
                    </div>
                    </div>
                
        
                
                    <div class="sc-mt-2"> </div>
                </div>
                <div class="sc-mt-4">
                    <div
                    class="sc-flex  sc-items-center sc-justify-between sc-gap-2">
                    <button id="scPublish" style="width: 100%; padding: 10px; background: #EF7C2F; color: white;">
                        Publish Changes
                    </button>
                    
                    <button id="scReset" style="width: 100%; padding: 10px; background: #9f988e; color: white;">
                        cancle
                    </button>
                    </div>
                
                </div>
            </div>
            `;
        document.documentElement.appendChild(widgetContainer);
        makeWidgetDraggable();
        setInterval(makeWidgetDraggable, 1000);
    }

    function createWidgetIcon() {
        if (document.getElementById("sc-widget-icon")) return;

        const widgetIcon = document.createElement("img");
        widgetIcon.id = "sc-widget-icon";
        widgetIcon.src = "https://i.ibb.co.com/pry1mVGD/Group-28-1.png"; // Icon URL

        widgetIcon.classList.add(
            "sc-absolute",
            "sc-top-5",
            "sc-rounded-md",
            "sc-px-2",
            "sc-w-16",
            "sc-py-1",
            "sc-bg-color-2c2c2c",
            "sc-right-5",
            "sc-cursor-pointer",
            "sc-z-9999"
        );

        widgetIcon.addEventListener("click", function () {
            alert("Click on an element to open the widget.");
        });

        document.body.appendChild(widgetIcon);
    }

    setInterval(makeWidgetDraggable, 1000);

    function makeWidgetDraggable() {
        const widget = document.getElementById("sc-widget-container");

        if (!widget) {
            console.warn(":x: Widget not found.");
            return;
        }
        widget.style.position = "fixed";
        widget.style.cursor = "grab";
        widget.style.zIndex = "999";

        let offsetX = 0,
            offsetY = 0,
            isDragging = false;

        widget.addEventListener("mousedown", (event) => {
            if (
                event.target.tagName === "INPUT" ||
                event.target.tagName === "SELECT" ||
                event.target.isContentEditable
            ) {
                return;
            }

            event.preventDefault();
            isDragging = true;

            offsetX = event.clientX - widget.getBoundingClientRect().left;
            offsetY = event.clientY - widget.getBoundingClientRect().top;

            widget.style.transition = "none";
            widget.style.userSelect = "none";
            widget.style.cursor = "grabbing";

            document.addEventListener("mousemove", moveAt);
            document.addEventListener("mouseup", stopDragging);
        });

        function moveAt(event) {
            if (!isDragging) return;

            let newX = event.clientX - offsetX;
            let newY = event.clientY - offsetY;
            newX = Math.max(
                0,
                Math.min(window.innerWidth - widget.offsetWidth, newX)
            );
            newY = Math.max(
                0,
                Math.min(window.innerHeight - widget.offsetHeight, newY)
            );

            widget.style.left = `${newX}px`;
            widget.style.top = `${newY}px`;
        }

        function stopDragging() {
            isDragging = false;
            widget.style.cursor = "grab";
            document.removeEventListener("mousemove", moveAt);
            document.removeEventListener("mouseup", stopDragging);

            // Save last position in localStorage
            localStorage.setItem("widget_X", widget.style.left);
            localStorage.setItem("widget_Y", widget.style.top);
        }

        // Restore last saved position
        let lastX = localStorage.getItem("widget_X");
        let lastY = localStorage.getItem("widget_Y");
        if (lastX && lastY) {
            widget.style.left = lastX;
            widget.style.top = lastY;
        } else {
            widget.style.left = "50px"; // Default position
            widget.style.top = "50px";
        }
    }

    makeWidgetDraggable();

    setTimeout(makeWidgetDraggable, 1000);

    window.addEventListener("load", () => {
        setTimeout(makeWidgetDraggable, 500); // Wait for the widget to load
        createWidgetIcon();
    });
    window.addEventListener("load", async () => {
        await fetchModifications();
        createWidget(); // Ensure widget is created first
        setTimeout(makeWidgetDraggable, 500); // Apply draggability after it's added to DOM
        setTimeout(attachEventListeners, 1500);
    });

    async function loadFontsWithPagination(page = 1, perPage = 20) {
        try {
            const response = await fetch(
                "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk"
            );
            const data = await response.json();
            return data.items.slice((page - 1) * perPage, page * perPage); // Paginate fonts
        } catch (error) {
            console.error("❌ Error fetching Google Fonts:", error);
            return [];
        }
    }

    async function fontfamilies() {
        const response = await fetch(
            "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk"
        );
        const data = await response.json();

        const fontDropdown = document.getElementById("sc-font-family");
        const fontWeightDropdown = document.getElementById("scFontWeight");

        if (!fontDropdown || !fontWeightDropdown) {
            console.error("Dropdown elements not found!");
            return;
        }

        fontDropdown.style.position = "relative";
        fontDropdown.style.width = "100%";
        fontDropdown.style.border = "1px solid #585858";
        fontDropdown.style.borderRadius = "6px";
        fontDropdown.style.background = "#2c2c2c";
        fontDropdown.style.color = "white";
        fontDropdown.style.display = "flex";
        fontDropdown.style.alignItems = "center";
        fontDropdown.style.justifyContent = "space-between";
        fontDropdown.style.cursor = "pointer";

        let selectedFontText = document.createElement("p");
        selectedFontText.textContent = "Select a Font";
        selectedFontText.style.flexGrow = "1";
        selectedFontText.style.fontSize = "14px";
        selectedFontText.classList.add("sc-universal");

        const dropdownArrow = document.createElement("img");
        dropdownArrow.src =
            "https://goswami34.github.io/squareCraft-widget/public/arrow.svg";
        dropdownArrow.style.width = "12px";
        dropdownArrow.style.height = "12px";
        dropdownArrow.style.transform = "rotate(180deg)";

        fontDropdown.appendChild(selectedFontText);
        fontDropdown.appendChild(dropdownArrow);

        const fontList = document.createElement("div");
        fontList.style.position = "absolute";
        fontList.style.top = "100%";
        fontList.style.left = "0";
        fontList.style.width = "100%";
        fontList.style.background = "#2c2c2c";
        fontList.style.border = "1px solid #585858";
        fontList.style.borderRadius = "6px";
        fontList.style.overflowY = "auto";
        fontList.style.maxHeight = "200px";
        fontList.style.display = "none";
        fontList.style.zIndex = "1000";

        // Populate font-family dropdown
        data.items.forEach((font) => {
            const option = document.createElement("div");
            option.textContent = font.family;
            option.style.padding = "8px";
            option.style.cursor = "pointer";
            option.style.fontFamily = font.family;
            option.style.transition = "background 0.3s";
            option.style.color = "white";
            option.style.fontSize = "14px";

            option.addEventListener("mouseover", () => {
                option.style.background = "#444";
            });

            option.addEventListener("mouseout", () => {
                option.style.background = "transparent";
            });

            option.addEventListener("click", async () => {
                if (!selectedElement) {
                    console.warn("⚠️ No element selected.");
                    return;
                }

                let selectedFont = font.family;
                selectedFontText.textContent = selectedFont;
                selectedFontText.style.fontFamily = selectedFont;
                fontList.style.display = "none";

                // Apply font-family immediately
                let css = { "font-family": selectedFont };
                applyStylesToElement(selectedElement.id, css);

                // Save modifications immediately without waiting
                saveModifications(selectedElement.id, css);

                console.log("🎨 Applied font:", selectedFont, "to", selectedElement.id);

                // Update font-weight dropdown dynamically
                updateFontWeightDropdown(font.variants);
            });

            fontList.appendChild(option);
        });

        fontDropdown.appendChild(fontList);

        fontDropdown.addEventListener("click", (event) => {
            event.stopPropagation();
            fontList.style.display =
                fontList.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", () => {
            fontList.style.display = "none";
        });

        // **Function to Update Font Weight Dropdown**
        function updateFontWeightDropdown(variants) {
            fontWeightDropdown.innerHTML = ""; // Clear existing options

            if (!variants || variants.length === 0) {
                console.warn("No font weights found for the selected font.");
                fontWeightDropdown.innerHTML = `<option value="400" selected>Regular (400)</option>`;
                return;
            }

            variants.forEach((variant) => {
                let weight = variant === "regular" ? "400" : variant; // Convert "regular" to 400
                let option = document.createElement("option");
                option.value = weight;
                option.textContent = `Weight ${weight}`;
                fontWeightDropdown.appendChild(option);
            });
        }
    }

    fontfamilies();

    function attachEventListeners() {
        document.body.addEventListener("click", (event) => {
            let block = event.target.closest('[id^="block-"]');
            if (!block) return;

            if (selectedElement) selectedElement.style.outline = "";
            selectedElement = block;
            selectedElement.style.outline = "2px dashed #EF7C2F";

            console.log(`✅ Selected Element: ${selectedElement.id}`);
        });

        document
            .getElementById("scPublish")
            .addEventListener("click", async () => {
                if (!selectedElement) {
                    console.warn("⚠️ No element selected.");
                    return;
                }

                let css = {
                    "font-family": document
                        .getElementById("sc-font-family")
                        .querySelector("p").textContent,
                    "font-weight": document.getElementById("scFontWeight").value, // Use selected font weight
                    "font-aligment-icon":
                        document.document.querySelectorAll(".alignment-icon").value,
                    "font-size":
                        document.getElementById("scFontSize").value + "px",
                    "line-height":
                        document.getElementById("scLineHeight").value + "px",
                    // "font-sizeText": document.getElementById("scFontSizeInput").value + "px",
                    // "text-decoration": document.document.querySelectorAll(".elements-font-style").value,
                    "text-decoration": textDecorationValue,
                    "text-transform": document.querySelectorAll(
                        ".squsareCraft-text-transform"
                    ).value,
                };

                await saveModifications(selectedElement.id, css);
            });

        // Add this event listener for font-weight dropdown
        document
            .getElementById("scFontWeight")
            .addEventListener("change", () => {
                if (selectedElement) {
                    let css = {
                        "font-weight": document.getElementById("scFontWeight")
                            .value,
                    };
                    applyStylesToElement(selectedElement.id, css);
                    saveModifications(selectedElement.id, css);
                }
            });

        document.querySelectorAll(".alignment-icon").forEach((icon) => {
            icon.addEventListener("click", async function () {
                if (!selectedElement) return;
                const alignment = this.getAttribute("data-align");
                let css = { "text-align": alignment };
                applyStylesToElement(selectedElement.id, css);
                await saveModifications(selectedElement.id, css);
                console.log(
                    `:white_check_mark: Applied text alignment: ${alignment} to ${selectedElement.id}`
                );
            });
        });

        // Font style (Bold, Italic, Underline, etc.)
        document.querySelectorAll(".elements-font-style").forEach((btn) => {
            btn.addEventListener("click", function () {
                if (!selectedElement) {
                    console.warn("⚠️ No element selected to apply text decoration.fsdsd");
                    return;
                }

                let styleType = this.dataset.style;
                let css = {};

                if (styleType === "bold") {
                    let currentWeight = parseInt(
                        window.getComputedStyle(selectedElement).fontWeight,
                        10
                    );
                    css["font-weight"] = currentWeight >= 700 ? "900" : "700";
                } else if (styleType === "italic") {
                    let currentStyle = window.getComputedStyle(selectedElement).fontStyle;
                    css["font-style"] = currentStyle === "italic" ? "italic" : "italic";
                } else {
                    let currentDecoration =
                        window.getComputedStyle(selectedElement).textDecorationLine;
                    if (styleType === "underline") {
                        css["text-decoration"] = currentDecoration.includes("underline")
                            ? "none"
                            : "underline";
                    } else if (styleType === "dotted") {
                        css["text-decoration"] = currentDecoration.includes("dotted")
                            ? "none"
                            : "underline dotted";
                    } else if (styleType === "line-through") {
                        css["text-decoration"] = currentDecoration.includes("line-through")
                            ? "none"
                            : "line-through";
                    }
                }

                applyStylesToElement(selectedElement.id, css);
                saveModifications(selectedElement.id, css);
            });
        });

        const fontStyleUndoButton = document.querySelector(
            ".sc-rounded-6px.sc-rotate-180.sc-px-1_5.squsareCraft-font-style.sc-cursor-pointer"
        );

        fontStyleUndoButton.addEventListener("click", async function () {
            if (!selectedElement) return;

            // Reset font styles
            let css = {
                "font-weight": "400", // Reset to Regular (default)
                "font-style": "normal", // Reset to normal (default)
                "text-decoration": "none", // Remove underline, dotted, or line-through
            };

            // Apply styles to the selected element
            applyStylesToElement(selectedElement.id, css);

            // Save the reset modifications
            await saveModifications(selectedElement.id, css);

            console.log("🛑 Font styles reset for:", selectedElement.id);
        });


        // Add this at the top level of your script with other variables
        let lastSelectedText = null;
        let lastSelectedRange = null;

        // Update the mouseup event listener
        document.addEventListener("mouseup", function () {
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
                lastSelectedText = selection.toString();
                lastSelectedRange = selection.getRangeAt(0);
                console.log("✅ Text Selected:", lastSelectedText);
            }
        });

        document.getElementById("scFontSize").addEventListener("input", async function () {
            if (!lastSelectedRange || !lastSelectedText) {
                console.warn("⚠️ No text selected");
                return;
            }

            const fontSize = this.value + "px";

            try {
                // Get the parent paragraph or containing element
                const container = lastSelectedRange.commonAncestorContainer.parentElement;

                // Store the full content before modification
                const fullContent = container.innerHTML;

                // Create span element
                const span = document.createElement("span");
                span.id = `sc-mod-${Date.now()}`;
                span.className = "sc-font-modified";
                span.style.fontSize = fontSize;
                span.textContent = lastSelectedText;

                // Create element structure with context
                const elementStructure = {
                    type: 'span',
                    className: 'sc-font-modified',
                    content: lastSelectedText,
                    parentId: container.id,
                    fullContent: fullContent,
                    startOffset: lastSelectedRange.startOffset,
                    endOffset: lastSelectedRange.endOffset
                };

                // Replace selected text with span
                lastSelectedRange.deleteContents();
                lastSelectedRange.insertNode(span);

                // Save to database with proper structure
                await saveModifications(
                    span.id,
                    { "font-size": fontSize },
                    elementStructure
                );

                console.log("✅ Font size modified and saved:", fontSize);
            } catch (error) {
                console.error("❌ Error applying font size:", error);
            }
        });


        document
            .getElementById("scLineHeight")
            .addEventListener("input", function () {
                if (selectedElement) {
                    let lineHeight = this.value + "px";
                    let css = { "line-height": lineHeight };
                    applyStylesToElement(selectedElement.id, css);
                    saveModifications(selectedElement.id, css);
                }
            });

        document
            .querySelectorAll(".squsareCraft-text-transform")
            .forEach((textTransform) => {
                textTransform.addEventListener("click", async function () {
                    if (!selectedElement) return;
                    const transform = this.getAttribute("data-transform");
                    let css = { "text-transform": transform };
                    applyStylesToElement(selectedElement.id, css);
                    await saveModifications(selectedElement.id, css);
                });
            });

        const undoButton = document.querySelector(
            ".sc-rounded-6px.sc-rotate-180.sc-px-1_5.squsareCraft-text-transform.sc-cursor-pointer"
        );

        undoButton.addEventListener("click", async function () {
            if (!selectedElement) return;

            // Remove text-transform property by setting it to 'none'
            let css = { "text-transform": "none" };

            // Apply styles to the element
            applyStylesToElement(selectedElement.id, css);

            // Remove saved modifications for text-transform
            await saveModifications(selectedElement.id, css);

            console.log("🛑 Text transform removed for:", selectedElement.id);
        });

        //   hover code start here
        const hoverButton = document.querySelector(
            ".sc-cursor-pointer.sc-bg-3f3f3f.sc-hover"
        );
        hoverButton.addEventListener("click", function () {
            if (!selectedElement) {
                console.warn("⚠️ No element selected to apply hover effect.");
                return;
            }

            const elementId = selectedElement.id;
            if (!elementId) return;

            console.log("🎨 Hover mode activated for:", elementId);

            // Define the hover effect styles
            const hoverCSS = {
                "background-color": "#ff5733", // Change background color on hover
                transition: "background-color 0.3s ease-in-out",
            };

            // Remove old hover styles if any
            let existingHoverStyle = document.getElementById(
                `hover-style-${elementId}`
            );
            if (existingHoverStyle) existingHoverStyle.remove();

            // Create a new style element for hover effect
            const styleTag = document.createElement("style");
            styleTag.id = `hover-style-${elementId}`;
            styleTag.innerHTML = `
                #${elementId}:hover {
                    background-color: ${hoverCSS["background-color"]} !important;
                    transition: ${hoverCSS["transition"]};
                }
            `;
            document.head.appendChild(styleTag);

            // Save modifications to the backend
            saveModifications(elementId, { ":hover": hoverCSS });

            console.log("✨ Hover effect applied to:", elementId);
        });

        // Attach event listener to the reset button
        document
            .getElementById("scReset")
            .addEventListener("click", async () => {
                const confirmReset = confirm(
                    "Are you sure you want to reset all modifications?"
                );
                if (confirmReset) {
                    await resetModifications();
                }
            });

        //   document.getElementById("scFontSizeInput").addEventListener("input", function () {
        //     if (selectedElement) {
        //         let fontSize = this.value + "px";
        //         let css = { "font-size": fontSize };
        //         applyStylesToElement(selectedElement.id, css);
        //         saveModifications(selectedElement.id, css);
        //     }
        // });
    }

    document.addEventListener("DOMContentLoaded", function () {
        createWidgetIcon();

        makeWidgetDraggable();
        function insertCustomAdminIcon() {
            const adminNavbar = document.querySelector("[data-test='editor-header']"); // Target the Squarespace admin navbar

            if (!adminNavbar) {
                console.warn("Admin navbar not found. Retrying...");
                setTimeout(insertCustomAdminIcon, 1000); // Retry in case the page hasn't fully loaded
                return;
            }

            if (document.getElementById("customAdminIcon")) return;

            const customIcon = document.createElement("img");
            customIcon.src = "https://i.ibb.co.com/VpxFTKBz/Group-29.jpg"; // Your icon URL
            customIcon.id = "customAdminIcon";
            customIcon.style.cursor = "pointer";
            customIcon.style.marginLeft = "15px"; // Adjust spacing
            customIcon.style.width = "32px"; // Icon size
            customIcon.style.height = "32px";

            customIcon.addEventListener("click", function () {
                alert("Custom Plugin Clicked!");
            });

            adminNavbar.appendChild(customIcon);
            console.log("✅ Custom admin icon added!");
        }

        insertCustomAdminIcon();
        function checkURL() {
            const currentURL = window.location.href;
            let widgetContainer = document.getElementById(
                "sc-widget-container"
            );

            console.log("Current URL:", currentURL);

            if (currentURL.includes("/#")) {
                console.log("✅ Widget is VISIBLE on the Code Injection page.");

                if (!widgetContainer) {
                    createWidget();
                    setTimeout(() => {
                        widgetContainer = document.getElementById(
                            "sc-widget-container"
                        );
                        if (widgetContainer) makeWidgetDraggable();
                    }, 500);
                } else {
                    widgetContainer.style.display = "block";
                    makeWidgetDraggable();
                }
            } else {
                console.log("❌ Widget is HIDDEN on other pages.");
                if (widgetContainer) widgetContainer.style.display = "none";
            }
        }

        checkURL();
        setInterval(checkURL, 1000);
        setInterval(makeWidgetDraggable, 1000);

        createWidget();
        makeWidgetDraggable();
        attachEventListeners();
        fetchModifications();
        makeWidgetDraggable();

        // const fontSizeInput = document.getElementById("scFontSizeInput");
        // const dropdownArrow = document.getElementById("scFontSizeDropdown");
        // const dropdownOptions = document.getElementById("scFontSizeOptions");

        const fontSize = document.getElementById("scFontSize");
        const dropdownArrow = document.getElementById(
            "scFontSizeDropdown"
        );
        const dropdownOptions = document.getElementById(
            "scFontSizeOptions"
        );

        document.body.addEventListener("click", (event) => {
            let block = event.target.closest('[id^="block-"]');
            if (!block) return;

            if (selectedElement) {
                selectedElement.style.fontSize = fontSizes + "px";
            }

            selectedElement = block;
            selectedElement.style.outline = "2px dashed #EF7C2F";

            let computedFontSize = window.getComputedStyle(selectedElement).fontSize;
            fontSizeInput.value = parseInt(computedFontSize, 10);
        });

        dropdownArrow.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdownOptions.classList.toggle("sc-hidden");
        });

        dropdownOptions.addEventListener("click", function (event) {
            if (event.target.classList.contains("sc-dropdown-item")) {
                fontSizeInput.value = event.target.dataset.value;
                dropdownOptions.classList.add("sc-hidden");

                if (selectedElement) {
                    let css = { "font-size": `${event.target.dataset.value}px` };
                    applyStylesToElement(selectedElement.id, css);
                    saveModifications(selectedElement.id, css);
                }
            }
        });

        document.addEventListener("click", function (event) {
            if (
                !dropdownArrow.contains(event.target) &&
                !dropdownOptions.contains(event.target)
            ) {
                dropdownOptions.classList.add("sc-hidden");
            }
        });

        fontSizeInput.addEventListener("input", function () {
            if (selectedElement) {
                let css = { "font-size": `${fontSizeInput.value}px` };
                applyStylesToElement(selectedElement.id, css);
                saveModifications(selectedElement.id, css);
            }
        });
    });
})();
