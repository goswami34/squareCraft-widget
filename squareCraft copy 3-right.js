(async function squareCraft() {
  const widgetScript = document.getElementById("squarecraft-script");
  if (!widgetScript) {
    console.error(":x: Widget script not found! Ensure the script tag exists with id 'squarecraft-script'.");
    return;
  }

  const token = widgetScript.dataset?.token;
  const squareCraft_u_id = widgetScript.dataset?.uId; 
  const squareCraft_w_id = widgetScript.dataset?.wId; 
  const userId = localStorage.getItem("squareCraft_u_id");
  const widgetId = localStorage.getItem("squareCraft_w_id");
  
  if (token) {
      console.log("🔑 Token received:", token);
      localStorage.setItem("squareCraft_auth_token", token);
      document.cookie = `squareCraft_auth_token=${token}; path=/; domain=${location.hostname}; Secure; SameSite=Lax`;
    }

  if (squareCraft_u_id) {
      console.log("👤 User ID received:", squareCraft_u_id);
      localStorage.setItem("squareCraft_u_id", squareCraft_u_id);
      document.cookie = `squareCraft_u_id=${squareCraft_u_id}; path=.squarespace.com;`;

  }

  if (squareCraft_w_id) {
      console.log("🛠️ Widget ID received:", squareCraft_w_id);
      localStorage.setItem("squareCraft_w_id", squareCraft_w_id);
      document.cookie = `squareCraft_w_id=${squareCraft_w_id}; path=.squarespace.com;`;
  }
  
  const link = document.createElement("link");
  link.rel = "stylesheet";  
  link.type = "text/css";
  link.href = "https://fatin-webefo.github.io/squareCraft-Plugin/src/styles/parent.css";
  document.head.appendChild(link);

  const fontSizes = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36 , 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
  const LetterSpacing = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16., 17, 18, 19, 20, 21, 22, 23, 24, 25];
  let fontSizeOptions = '';
  for (let size of fontSizes) {
    fontSizeOptions += `<option value="${size}">${size}px</option>`;
  }


  if (token) localStorage.setItem("squareCraft_auth_token", token);
  if (userId) localStorage.setItem("squareCraft_u_id", userId);
  if (widgetId) localStorage.setItem("squareCraft_w_id", widgetId);

  let selectedElement = null;
  let appliedStyles = new Set();

  function getPageId() {
    let pageElement = document.querySelector("article[data-page-sections]");
    return pageElement ? pageElement.getAttribute("data-page-sections") : null;
  }

  let pageId = getPageId();
  if (!pageId) console.warn(":warning: No page ID found. Plugin may not work correctly.");

  function applyStylesToElement(elementId, css) {
    if (!elementId || !css) return;

    let styleTag = document.getElementById(`style-${elementId}`);
    if (styleTag) {
      styleTag.remove();  // Remove the old styles before adding new ones
    }

    styleTag = document.createElement("style");
    styleTag.id = `style-${elementId}`;
    document.head.appendChild(styleTag);

    let cssText = `#${elementId} { `;
    Object.keys(css).forEach(prop => {
        cssText += `${prop}: ${css[prop]} !important; `;
    });
    cssText += "}";
    

    if (css["border-radius"]) {
      cssText += `#${elementId} { overflow: hidden !important; }`;
    }

    styleTag.innerHTML = cssText;
    appliedStyles.add(elementId);
    console.log(`:white_check_mark: Styles Persisted for ${elementId}`);
  }

  async function fetchModifications(retries = 3) {
    if (!pageId) return;

    try {
        const response = await fetch(
            `https://webefo-backend.vercel.app/api/v1/get-modifications?userId=${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
                },
            }
        );

        const data = await response.json();

        console.log("📥 Get method", data);
        if (!data.modifications || data.modifications.length === 0) {
            console.warn("⚠️ No styles found for this page.");
            return;
        }

        data.modifications.forEach(({ pageId: storedPageId, elements }) => {
            if (storedPageId === pageId) {
                elements.forEach(({ elementId, css }) => {
                    applyStylesToElement(elementId, css);
                });
            }
        });

    } catch (error) {
        console.error("❌ Error fetching modifications:", error);
        if (retries > 0) {
            console.log(`🔄 Retrying fetch... (${retries} left)`);
            setTimeout(() => fetchModifications(retries - 1), 2000);
        }
    }
}


  async function saveModifications(elementId, css) {
    if (!pageId || !elementId || !css) {
      console.warn(":warning: Missing required data to save modifications.");
      return;
    }

    applyStylesToElement(elementId, css);
    console.log(":satellite_antenna: Saving modifications for:", { pageId, elementId, css });

    const modificationData = {
      userId,
      token,
      widgetId,
      modifications: [{ pageId, elements: [{ elementId, css }] }],
    };

    try {
      const response = await fetch("https://webefo-backend.vercel.app/api/v1/modifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
          "userId": userId,
          "pageId": pageId,
          "widget-id": widgetId,
        },
        body: JSON.stringify(modificationData),
      });

      console.log(":white_check_mark: Changes Saved Successfully!", await response.json());
    } catch (error) {
      console.error(":x: Error saving modifications:", error);
    }
  }



  function createWidget() {
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "squarecraft-widget-container";
    widgetContainer.classList.add(
        "squareCraft-fixed",
        "squareCraft-text-color-white", 
        "squareCraft-hidden",
        "squareCraft-universal",
        "squareCraft-z-9999",
        "squareCraft-top-25",
        "squareCraft-left-25"
    );

    widgetContainer.innerHTML = `
    <div
    class="squareCraft-p-4  squareCraft-border squareCraft-border-solid squareCraft-border-3d3d3d squareCraft-bg-color-2c2c2c squareCraft-rounded-15px squareCraft-w-300px">
        <div class="squareCraft-flex squareCraft-universal squareCraft-items-center squareCraft-justify-between">
            <img class="squareCraft-cursor-grabbing squareCraft-universal" src="https://i.ibb.co.com/pry1mVGD/Group-28-1.png" width="140px" />
            <div
                class="squareCraft-flex squareCraft-items-center squareCraft-rounded-15px squareCraft-gap-2 squareCraft-bg-color-3d3d3d squareCraft-py-1px squareCraft-px-2">
                <p class="squareCraft-text-sm squareCraft-p-0 squareCraft-universal">Auto Save</p>
                <img src="https://i.ibb.co.com/B2NjHwSq/redo-rectangle.png" width="16px" />
            </div>
        
        
        </div>
        <p class="squareCraft-text-sm squareCraft-mt-6 squareCraft-font-light">Lorem Ipsum is simply dummy text
            of the printing and typesetting industry.</p>
        <div
            class="squareCraft-mt-6  squareCraft-border-t squareCraft-border-dashed squareCraft-border-color-494949  squareCraft-w-full">
        </div>
        
        <div class="squareCraft-mt-6 squareCraft-flex  squareCraft-items-center squareCraft-universal">
            <p class="squareCraft-text-sm squareCraft-px-4 squareCraft-cursor-pointer tabHeader ">Design</p>
            <p class="squareCraft-text-sm squareCraft-px-4 squareCraft-cursor-pointer tabHeader">Advanced</p>
            <p class="squareCraft-text-sm squareCraft-px-4 squareCraft-cursor-pointer tabHeader">Presets</p>
        </div>
        
        <div
            class="squareCraft-border-t squareCraft-border-solid squareCraft-relative squareCraft-border-color-494949 squareCraft-w-full">
            <div
                class="squareCraft-absolute squareCraft-top-0 squareCraft-left-0 squareCraft-bg-colo-EF7C2F squareCraft-w-16 squareCraft-h-1px">
            </div>
        </div>
        
        <div
            class="squareCraft-rounded-6px squareCraft-mt-6  squareCraft-border squareCraft-border-solid squareCraft-border-EF7C2F squareCraft-bg-color-3d3d3d">
            <div class="squareCraft-flex squareCraft-p-2 squareCraft-items-center squareCraft-justify-between">
                <div class="squareCraft-flex squareCraft-gap-2 squareCraft-items-center"><img loading="lazy"
                        src="https://fatin-webefo.github.io/squareCraft-Plugin/public/T.svg" alt="">
                    <p class="squareCraft-universal">Typography</p>
                </div>
                <img src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">
            </div>
            <div class="squareCraft-h-1px squareCraft-bg-3f3f3f"></div>
            <div
                class="squareCraft-flex squareCraft-px-2   squareCraft-items-center squareCraft-justify-between">
                <div class="squareCraft-flex squareCraft-gap-2 squareCraft-items-center">
                    <div class="toggle-container" id="toggleSwitch">
                        <div class="toggle-bullet"></div>
                    </div>
                    <p id="toggleText" class="squareCraft-text-sm">Enable</p>
                </div>
                <div id="resetButton" 
                class="squareCraft-flex squareCraft-cursor-pointer squareCraft-items-center squareCraft-py-1px squareCraft-rounded-15px squareCraft-gap-2 squareCraft-bg-3f3f3f squareCraft-px-2">
                <p class="squareCraft-text-sm squareCraft-universal">Reset</p>
                <img id="resetIcon" 
                    src="https://fatin-webefo.github.io/squareCraft-Plugin/public/reset.svg"
                    width="12px" />
            </div>
            
            </div>
            <div class="squareCraft-h-1px  squareCraft-bg-3f3f3f"></div>
            <div class="squareCraft-mt-2">
                <div
                class="squareCraft-flex squareCraft-px-2  squareCraft-items-center squareCraft-justify-between squareCraft-gap-2">
                <div
                class="squareCraft-cursor-pointer squareCraft-bg-color-EF7C2F squareCraft-w-full squareCraft-font-light squareCraft-flex squareCraft-items-center squareCraft-text-sm squareCraft-py-1px squareCraft-rounded-6px squareCraft-text-color-white squareCraft-justify-center">
                    Normal</div>
                    <div
                    class="squareCraft-cursor-pointer squareCraft-bg-3f3f3f squareCraft-w-full squareCraft-text-color-white squareCraft-font-light squareCraft-flex squareCraft-text-sm squareCraft-py-1px squareCraft-rounded-6px squareCraft-items-center squareCraft-justify-center">
                    Hover</div>
                </div>
                <div class="squareCraft-px-4">
                    <div class="squareCraft-h-1px  squareCraft-mt-2 squareCraft-bg-3f3f3f"></div>
                </div>
            </div>
        
            <div class=" squareCraft-px-2  squareCraft-flex squareCraft-justify-between">
                <p class="squareCraft-text-sm ">Text</p>
                <img src="https://fatin-webefo.github.io/squareCraft-Plugin/public/eye.svg" width="12px" />
            </div>
        
            <div class="  squareCraft-grid squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 squareCraft-px-2">
                <div id="squareCraft-font-family" class="squareCraft-flex squareCraft-col-span-8 squareCraft-cursor-pointer squareCraft-rounded-6px squareCraft-justify-between squareCraft-universal squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center">
                    <div class="squareCraft-bg-494949 squareCraft-w-full squareCraft-px-2  squareCraft-universal">
                        <p class="squareCraft-text-sm squareCraft-universal squareCraft-font-light">Sf Pro sans</p>
                    </div>
                    <div class="squareCraft-bg-3f3f3f squareCraft-px-2" style="height: 27px; padding: 0 8px;">
                        <img class= squareCraft-rotate-180" width="12px"
                            src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">
        
                    </div>
                </div>
                <div class="squareCraft-flex squareCraft-text-color-white squareCraft-justify-between squareCraft-col-span-4  squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-items-center">
                    <div class="squareCraft-flex squareCraft-text-color-white squareCraft-items-center squareCraft-w-full">
            
                        <div class="squareCraft-flex squareCraft-text-color-white squareCraft-justify-between squareCraft-col-span-4 squareCraft-rounded-6px squareCraft-border quareCraft-universal squareCraft-border-solid squareCraft-border-585858 squareCraft-items-center ">
                
                            <div class="squareCraft-font-size-container squareCraft-flex squareCraft-justify-between squareCraft-items-center squareCraft-flex squareCraft-items-center squareCraft-border squareCraft-border-solid squareCraft-border-3d3d3d  squareCraft-rounded-6px ">
                    
                                <input type="text" id="squareCraftFontSizeInput" value="16" 
                                class="squareCraft-font-size-input squareCraft-font-light squareCraft-text-sm squareCraft-text-color-white 
                                squareCraft-bg-transparent squareCraft-w-full  squareCraft-py-1px squareCraft-font-light">
                            
                        
                                <div class="squareCraft-flex squareCraft-items-center squareCraft-justify-center squareCraft-items-center">
                                    <p class="squareCraft-flex squareCraft-font-light squareCraft-text-sm squareCraft-px-1_5 squareCraft-items-center squareCraft-justify-center squareCraft-items-center">
                                    px
                                </div>
                        
                                <div  class="squareCraft-bg-color-2c2c2c  squareCraft-roudned-r-md">
                                    <img id="squareCraftFontSizeDropdown" src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" class="squareCraft-mr-1 squareCraft-mb-1 squareCraft-ml-1 squareCraft-bg-color-2c2c2c squareCraft-rotate-180 squareCraft-px-1 squareCraft-mx-auto squareCraft-cursor-pointer" width="18px">
                                </div>
                            </div>
                    
                            <div id="squareCraftFontSizeOptions" class="squareCraft-hidden squareCraft-h-44 squareCraft-font-sm squareCraft-bg-3f3f3f squareCraft-w-20
                                squareCraft-rounded-6px squareCraft-border squareCraft-border-585858 squareCraft-absolute 
                                squareCraft-mt-1">
                                ${fontSizes?.map(size => `
                                    <div class="squareCraft-dropdown-item squareCraft-py-1px squareCraft-text-center  squareCraft-text-sm" 
                                        data-value="${size}">${size}</div>
                                `).join('')}
                            </div>
                        </div>
            
                    </div>
            
            
                    <div class="squareCraft-border-r squareCraft-border-585858 squareCraft-h-full"></div>
        
                </div>
            
            </div>
                
            <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 ">
                <div class="squareCraft-flex squareCraft-col-span-7 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center squareCraft-h-full">
                    <div class="squareCraft-bg-494949 squareCraft-px-2 squareCraft-w-full  squareCraft-py-1px ">
                        <p class="squareCraft-text-sm squareCraft-font-light">Regular</p>
                    </div>
                    <div class="squareCraft-bg-3f3f3f squareCraft-px-2" style="height: 27px; padding: 0 8px;">
                        <img class="squareCraft-h-full squareCraft-mx-auto squareCraft-rotate-180" width="10px"
                            src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">
        
                    </div>
                </div>
                <div class="squareCraft-flex squareCraft-justify-between squareCraft-col-span-4  squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-items-center squareCraft-h-full">
                <div class="squareCraft-flex squareCraft-mx-auto squareCraft-items-center squareCraft-justify-center">
                    <img class=" squareCraft-rounded-6px squareCraft-rotate-180" width="12px"
                    src="https://fatin-webefo.github.io/squareCraft-Plugin/public/dot.svg" alt="">
                </div>
                <div class="squareCraft-border-r   squareCraft-border-585858 squareCraft-h-full"></div>
                    <div class="squareCraft-flex squareCraft-mx-auto squareCraft-items-center squareCraft-justify-center squareCraft-border squareCraft-border-585858 squareCraft-w-13px squareCraft-border-solid squareCraft-h-13px">
        
                    </div>
                    <div class="squareCraft-border-r   squareCraft-border-585858 squareCraft-h-full"></div>
                    
                    <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-flex squareCraft-mx-auto squareCraft-items-center squareCraft-justify-center" width="12px"
                    src="https://fatin-webefo.github.io/squareCraft-Plugin/public/gap.svg" alt="">
                </div>
            </div>
                
            <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 ">
                <div class="squareCraft-flex squareCraft-col-span-5 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center squareCraft-h-full">
            <div
                class="squareCraft-flex squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                            <img id="squareCraftTextAlignLeft" data-align="left"
                                src="https://fatin-webefo.github.io/squareCraft-Plugin/public/alignment (1).svg"
                                class="squareCraft-cursor-pointer alignment-icon   squareCraft-mx-auto"  alt="">
                                <div class="squareCraft-v-line"></div>
                                <img id="squareCraftTextAlignRight" data-align="right"
                                src="https://fatin-webefo.github.io/squareCraft-Plugin/public/alignment (3).svg"
                                class="squareCraft-cursor-pointer alignment-icon    squareCraft-mx-auto"  alt="">
                        
                                <div class="squareCraft-v-line"></div>
                            
                                <img id="squareCraftTextAlignCenter" data-align="center"
                                src="https://fatin-webefo.github.io/squareCraft-Plugin/public/alignment (2).svg"
                                class="squareCraft-cursor-pointer alignment-icon    squareCraft-mx-auto"  alt="">
                                <div class="squareCraft-v-line"></div>
                            <img id="squareCraftTextAlignJustify" data-align="justify"
                                src="https://fatin-webefo.github.io/squareCraft-Plugin/public/alignment (4).svg"
                                class="squareCraft-cursor-pointer alignment-icon    squareCraft-mx-auto "  alt="">
                        </div>

                </div>


                <div class="squareCraft-flex squareCraft-text-color-white squareCraft-justify-between squareCraft-col-span-3 
                squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 
                squareCraft-items-center squareCraft-w-full squareCraft-h-full">
                <div class="squareCraft-Letter-spacing-container squareCraft-flex squareCraft-justify-between squareCraft-items-center squareCraft-flex squareCraft-items-center squareCraft-border 
                squareCraft-border-solid squareCraft-border-3d3d3d  squareCraft-rounded-6px 
                squareCraft-h-full">
                <input type="text" id="squareCraftLetterSpacingInput" value="15px" class="squareCraft-Letter-spacing-input squareCraft-font-light squareCraft-text-sm squareCraft-text-color-white 
                    squareCraft-bg-transparent squareCraft-w-full  squareCraft-py-1px squareCraft-font-light">
                <div class="">
                    <img id="squareCraftLetterSpacingDropdown"
                    src="https://fatin-webefo.github.io/squareCraft-Plugin/public/line-spacing.svg"
                    class=" squareCraft-px-1 squareCraft-ml-1 squareCraft-mx-auto squareCraft-cursor-pointer" width="18px">
                </div>
                </div>
                <div id="squareCraftLetterSpacingOptions" class="squareCraft-hidden squareCraft-h-44 squareCraft-font-sm squareCraft-bg-3f3f3f squareCraft-w-20
                squareCraft-rounded-6px squareCraft-border squareCraft-border-585858 squareCraft-absolute 
                squareCraft-mt-1">
                ${LetterSpacing?.map(gap => `
                <div class="squareCraft-dropdown-item squareCraft-py-1px squareCraft-text-center  squareCraft-text-sm"
                    data-value="${gap}">${gap}</div>
                `).join('')}
                </div>
                </div>

            </div>
                
            <button id="squareCraftPublish" style="width: 100%; padding: 10px; background: #EF7C2F; color: white;">
              Publish Changes
            </button>
        </div>
    
    </div>
    `;
    document.body.appendChild(widgetContainer);
    makeWidgetDraggable();
    setInterval(makeWidgetDraggable, 1000);

  
  }

function createWidgetIcon() {
    const widgetIcon = document.createElement("img");
    widgetIcon.id = "squarecraft-widget-icon";
    widgetIcon.src = "https://i.ibb.co.com/VpxFTKBz/Group-29.jpg"; // Icon URL

    // Apply custom SquareCraft class names
    widgetIcon.classList.add(
        "squareCraft-fixed", 
        "squareCraft-rounded-full", 
        "squareCraft-top-5", 
      
        "squareCraft-right-5",
        "squareCraft-w-40px", 
        "squareCraft-h-40px",  
        "squareCraft-cursor-pointer",
        "squareCraft-z-9999"
    );

    widgetIcon.addEventListener("click", function () {
        alert("Click on an element to open the widget.");
    });

    document.body.appendChild(widgetIcon);
}

  setInterval(makeWidgetDraggable, 1000);

  function makeWidgetDraggable() {
    const widget = document.getElementById("squarecraft-widget-container");
    const dragHandle = document.querySelector(".squareCraft-cursor-grabbing"); // Select your image

    if (!widget || !dragHandle) return;
    
    let offsetX, offsetY, isDragging = false;

    // When user clicks the drag handle (image), start dragging
    dragHandle.addEventListener("mousedown", (event) => {
        event.preventDefault(); // Prevent text selection
        isDragging = true;
        offsetX = event.clientX - widget.getBoundingClientRect().left;
        offsetY = event.clientY - widget.getBoundingClientRect().top;
        widget.style.transition = "none";
        widget.style.userSelect = "none"; // Prevent text selection while dragging
    });

    // Move the widget as user moves mouse
    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        
        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;
        
        // Prevent dragging outside the viewport
        newX = Math.max(0, Math.min(window.innerWidth - widget.offsetWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - widget.offsetHeight, newY));

        widget.style.left = `${newX}px`;
        widget.style.top = `${newY}px`;
    });

    // Stop dragging when mouse is released
    document.addEventListener("mouseup", () => {
        isDragging = false;
        widget.style.transition = "0.2s ease-out";
    });

    // console.log("✅ Dragging enabled.");
}

// Run after the widget is created
setTimeout(makeWidgetDraggable, 1000);



window.addEventListener("load", () => {
    setTimeout(makeWidgetDraggable, 500); // Wait for the widget to load
    createWidgetIcon();

});


  async function loadFontsWithPagination(page = 1, perPage = 20) {
    try {
        const response = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk");
        const data = await response.json();
        return data.items.slice((page - 1) * perPage, page * perPage); // Paginate fonts
    } catch (error) {
        console.error("❌ Error fetching Google Fonts:", error);
        return [];
    }
}



async function fontfamilies() {
  const response = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk");
  const data = await response.json();

  const fontDropdown = document.getElementById("squareCraft-font-family");
  const fontWeightDropdown = document.getElementById("squareCraftFontWeight");

  fontDropdown.style.position = "relative";
  fontDropdown.style.width = "100%";
  fontDropdown.style.border = "1px solid #585858";
  fontDropdown.style.borderRadius = "6px";
  fontDropdown.style.background = "#2c2c2c";
  fontDropdown.style.color = "white";
  fontDropdown.style.display = "flex";
  fontDropdown.style.alignItems = "center";
  fontDropdown.style.justifyContent = "space-between";
  fontDropdown.style.padding = "10px";
  fontDropdown.style.cursor = "pointer";

  let selectedFont = "Select a Font";  
  const selectedFontText = document.createElement("p");
  selectedFontText.textContent = selectedFont;
  selectedFontText.style.flexGrow = "1"; 
  selectedFontText.style.fontSize = "14px";

  // Dropdown arrow icon
  const dropdownArrow = document.createElement("img");
  dropdownArrow.src = "https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg";
  dropdownArrow.style.width = "12px";
  dropdownArrow.style.height = "12px";
  dropdownArrow.style.transform = "rotate(180deg)";

  fontDropdown.appendChild(selectedFontText);
  fontDropdown.appendChild(dropdownArrow);

  // Create dropdown list
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
  data.items.forEach(font => {
      const option = document.createElement("div");
      option.textContent = font.family;
      option.style.padding = "8px";
      option.style.cursor = "pointer";
      option.style.fontFamily = font.family;
      option.style.transition = "background 0.3s";
      option.style.color = "white";
      option.style.fontSize = "14px";

      // Hover effect
      option.addEventListener("mouseover", () => {
          option.style.background = "#444";
      });

      option.addEventListener("mouseout", () => {
          option.style.background = "transparent";
      });

      // Click event to select font
      // option.addEventListener("click", async () => {
      //     selectedFont = font.family;
      //     selectedFontText.textContent = selectedFont;
      //     selectedFontText.style.fontFamily = selectedFont;
      //     fontList.style.display = "none";

      //     // Apply font-family to selected element
      //     if (selectedElement) {
      //         selectedElement.style.fontFamily = selectedFont;
      //         let css = { "font-family": selectedFont };
      //         await saveModifications(selectedElement.id, css);
      //     }

      //     // Update font-weight dropdown based on selected font
      //     updateFontWeightDropdown(font.variants);
      // });
      option.addEventListener("click", async () => {
        selectedFont = font.family;
        selectedFontText.textContent = selectedFont;
        selectedFontText.style.fontFamily = selectedFont;
        fontList.style.display = "none";
    
        // Apply font-family to the selected element and all its child elements
        if (selectedElement) {
            let css = { "font-family": selectedFont };
            await saveModifications(selectedElement.id, css);
            applyStylesToElement(selectedElement.id, css);
        }
    });

      fontList.appendChild(option);
  });

  fontDropdown.appendChild(fontList);

  // Toggle dropdown on click
  fontDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
      fontList.style.display = fontList.style.display === "block" ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
      fontList.style.display = "none";
  });

  // Function to update font-weight dropdown dynamically
  function updateFontWeightDropdown(variants) {
      fontWeightDropdown.innerHTML = ""; // Clear existing options

      variants.forEach(variant => {
          let weight = variant === "regular" ? "400" : variant; // Convert "regular" to 400
          let option = document.createElement("option");
          option.value = weight;
          option.textContent = `Weight ${weight}`;
          fontWeightDropdown.appendChild(option);
      });
  }
}

// Call the function
fontfamilies();



  function attachEventListeners() {
    document.body.addEventListener("click", (event) => {
        let block = event.target.closest('[id^="block-"]');
        const widget = document.getElementById("squarecraft-widget-container");
    
        if (block) {
            document.querySelectorAll(".squareCraft-outline").forEach(el => {
                el.classList.remove("squareCraft-outline");
                el.style.outline = ""; 
            });
    
            block.classList.add("squareCraft-outline");
            block.style.outline = "2px dashed #EF7C2F"; 
            selectedElement = block;
    
            widget.classList.remove("squareCraft-hidden");
    
        } else if (!widget.contains(event.target)) {
            widget.classList.add("squareCraft-hidden");
        }
    });
    
    ;
    

    const fontSizeInput = document.getElementById("squareCraftFontSizeInput");
    const fontSizeDropdown = document.getElementById("squareCraftFontSizeDropdown");
    const fontSizeOptions = document.getElementById("squareCraftFontSizeOptions");

    fontSizeDropdown.addEventListener("click", function () {
      fontSizeOptions.classList.toggle("squareCraft-hidden");
    });

    fontSizeOptions.addEventListener("click", function (event) {
      if (!event.target.classList.contains("squareCraft-dropdown-item")) return;
      fontSizeInput.value = event.target.dataset.value;
      fontSizeOptions.classList.add("squareCraft-hidden");

      if (selectedElement) {
        let css = { "font-size": `${event.target.dataset.value}px` };
        applyStylesToElement(selectedElement.id, css);
        saveModifications(selectedElement.id, css);
      }
    });

    // fontSizeInput.addEventListener("input", function () {
    //   if (selectedElement) {
    //     let css = { "font-size": `${fontSizeInput.value}px` };
    //     applyStylesToElement(selectedElement.id, css);
    //     saveModifications(selectedElement.id, css);
    //   }
    // });

    fontSizeInput.addEventListener("input", () => {
      if (!selectedElement) {
        console.warn("No element selected for font-size update.");
        return;
      }
      const value = parseInt(fontSizeInput.value, 10);
      if (isNaN(value)) {
        console.warn("Invalid font-size value.");
        return;
      }
      const css = { "font-size": `${value}px` };
      applyStylesToElement(selectedElement.id, css);
      saveModifications(selectedElement.id, css);
    });
    

    const letterSpacingInput = document.getElementById("squareCraftLetterSpacingInput");
    const letterSpacingDropdown = document.getElementById("squareCraftLetterSpacingDropdown");
    const letterSpacingOptions = document.getElementById("squareCraftLetterSpacingOptions");

    letterSpacingDropdown.addEventListener("click", function () {
      letterSpacingOptions.classList.toggle("squareCraft-hidden");
    });

    letterSpacingOptions.addEventListener("click", function (event) {
      if (!event.target.classList.contains("squareCraft-dropdown-item")) return;
      letterSpacingInput.value = event.target.dataset.value;
      letterSpacingOptions.classList.add("squareCraft-hidden");

      if (selectedElement) {
        let css = { "letter-spacing": `${event.target.dataset.value}px` };
        applyStylesToElement(selectedElement.id, css);
        saveModifications(selectedElement.id, css);
      }
    });

    letterSpacingInput.addEventListener("input", function () {
      if (selectedElement) {
        let css = { "letter-spacing": `${letterSpacingInput.value}px` };
        applyStylesToElement(selectedElement.id, css);
        saveModifications(selectedElement.id, css);
      }
    });

    // Text Alignment Handling
    document.querySelectorAll(".alignment-icon").forEach(icon => {
      icon.addEventListener("click", async function () {
        if (!selectedElement) return;
        const alignment = this.getAttribute("data-align");

        let css = { "text-align": alignment };
        applyStylesToElement(selectedElement.id, css);
        await saveModifications(selectedElement.id, css);

        console.log(`✅ Applied text alignment: ${alignment} to ${selectedElement.id}`);
      });
    });
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
    let widgetContainer = document.getElementById("squarecraft-widget-container");

    console.log("Current URL:", currentURL);

    if (currentURL.includes("/#")) {
        console.log("✅ Widget is VISIBLE on the Code Injection page.");
        
        if (!widgetContainer) {
            createWidget(); 
            setTimeout(() => {
                widgetContainer = document.getElementById("squarecraft-widget-container");
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

    const fontSizeInput = document.getElementById("squareCraftFontSizeInput");
    const dropdownArrow = document.getElementById("squareCraftFontSizeDropdown");
    const dropdownOptions = document.getElementById("squareCraftFontSizeOptions");

    document.body.addEventListener("click", (event) => {
        let block = event.target.closest('[id^="block-"]');
        if (!block) return;

        if (selectedElement) selectedElement.style.outline = "";
        selectedElement = block;
        selectedElement.style.outline = "2px dashed #EF7C2F";

        let computedFontSize = window.getComputedStyle(selectedElement).fontSize;
        fontSizeInput.value = parseInt(computedFontSize, 10); 
    });

    dropdownArrow.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownOptions.classList.toggle("squareCraft-hidden");
    });

    dropdownOptions.addEventListener("click", function (event) {
        if (event.target.classList.contains("squareCraft-dropdown-item")) {
            fontSizeInput.value = event.target.dataset.value;
            dropdownOptions.classList.add("squareCraft-hidden");

            if (selectedElement) {
                let css = { "font-size": `${event.target.dataset.value}px` };
                applyStylesToElement(selectedElement.id, css);
                saveModifications(selectedElement.id, css);
            }
        }
    });

    document.addEventListener("click", function (event) {
        if (!dropdownArrow.contains(event.target) && !dropdownOptions.contains(event.target)) {
            dropdownOptions.classList.add("squareCraft-hidden");
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