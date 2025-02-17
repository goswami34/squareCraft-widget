(
    async function parentHtmlTab() {
        const tabs = document.querySelectorAll(".tabHeader");
        const contentContainer = document.querySelector(".squareCraft-rounded-6px.squareCraft-mt-6");
        const activeIndicator = document.querySelector(".squareCraft-absolute"); // The moving indicator

        const tabData = {
            design: `
                 <div class="squareCraft-flex squareCraft-p-2 squareCraft-items-center squareCraft-justify-between">
        <div class="squareCraft-flex squareCraft-gap-2 squareCraft-items-center"><img loading="lazy"
                src="https://fatin-webefo.github.io/squareCraft-Plugin/public/T.svg" alt="">
            <p>Typography</p>
        </div>
        <img src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">
    </div>
    <div class="squareCraft-h-1px squareCraft-bg-3f3f3f"></div>
    <div
        class="squareCraft-flex squareCraft-px-2 squareCraft-mt-2 squareCraft-items-center squareCraft-justify-between">
        <div class="squareCraft-flex squareCraft-gap-2 squareCraft-items-center">
            <div class="toggle-container" id="toggleSwitch">
                <div class="toggle-bullet"></div>
            </div>
            <p id="toggleText" class="squareCraft-text-sm">Enable</p>
        </div>
        <div id="resetButton" 
        class="squareCraft-flex squareCraft-cursor-pointer squareCraft-items-center squareCraft-py-1px squareCraft-rounded-15px squareCraft-gap-2 squareCraft-bg-3f3f3f squareCraft-px-2">
        <p class="squareCraft-text-sm">Reset</p>
        <img id="resetIcon" 
            src="https://fatin-webefo.github.io/squareCraft-Plugin/public/reset.svg"
            width="12px" />
    </div>
    
    </div>
    <div class="squareCraft-h-1px squareCraft-mt-2 squareCraft-bg-3f3f3f"></div>
    <div class="squareCraft-mt-2">
        <div
            class="squareCraft-flex squareCraft-px-2 squareCraft-w-full squareCraft-items-center squareCraft-justify-between squareCraft-gap-2">
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

    <div class="squareCraft-mt-6 squareCraft-px-2 squareCraft-flex squareCraft-justify-between">
        <p class="squareCraft-text-sm">Text</p>
        <img src="https://fatin-webefo.github.io/squareCraft-Plugin/public/eye.svg" width="12px" />
    </div>

    <div class="squareCraft-mt-2 squareCraft-grid squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 squareCraft-px-2">
        <div id="squareCraft-font-family" class="squareCraft-flex squareCraft-col-span-8 squareCraft-cursor-pointer squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center squareCraft-h-full">
            <div class="squareCraft-bg-494949 squareCraft-w-full squareCraft-px-2 squareCraft-py-1px ">
                <p class="squareCraft-text-sm squareCraft-font-light">Sf Pro sans</p>
            </div>
            <div class="squareCraft-bg-3f3f3f squareCraft-px-2" style="height: 27px; padding: 0 8px;">
                <img class="squareCraft-h-full squareCraft-rotate-180" width="12px"
                    src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">

            </div>
        </div>
        <div class="squareCraft-flex squareCraft-justify-between squareCraft-col-span-4  squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-items-center squareCraft-h-full">
           <div class="squareCraft-flex squareCraft-items-center squareCraft-w-full">
            <div class=" squareCraft-bg-494949  squareCraft-px-2 squareCraft-w-full squareCraft-py-1px ">
                <p class="squareCraft-text-sm  squareCraft-font-light">14</p>
            </div>
            <div class="squareCraft-border-r   squareCraft-border-585858 squareCraft-h-full"></div>
            <div class="squareCraft-bg-494949  squareCraft-px-1 squareCraft-w-full squareCraft-py-1px ">
                <p class="squareCraft-text-sm squareCraft-font-light">px</p>
            </div>
           </div>
            <div class="squareCraft-bg-3f3f3f squareCraft-px-1" style="height: 27px; padding: 0 8px;">
                <img class=" squareCraft-rounded-6px squareCraft-rotate-180" width="12px"
                    src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">

            </div>
        </div>
    </div>


    <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 ">
        <div class="squareCraft-flex squareCraft-col-span-7 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center squareCraft-h-full">
            <div class="squareCraft-bg-494949 squareCraft-px-2 squareCraft-w-full  squareCraft-py-1px ">
                <p class="squareCraft-text-sm squareCraft-font-light">Regular</p>
            </div>
            <div class="squareCraft-bg-3f3f3f squareCraft-px-2" style="height: 27px; padding: 0 8px;">
                <img class="squareCraft-h-full squareCraft-rotate-180" width="12px"
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



    <div class="squareCraft-mt-2"> </div>
                `,
            advanced: `
                    <div class="squareCraft-flex squareCraft-p-2 squareCraft-items-center squareCraft-justify-between">
                        <p class="squareCraft-text-sm">Advanced Settings</p>
                    </div>
                    <div class="squareCraft-h-1px squareCraft-bg-3f3f3f"></div>
                `,
            presets: `
                    <div class="squareCraft-flex squareCraft-p-2 squareCraft-items-center squareCraft-justify-between">
                        <p class="squareCraft-text-sm">Preset Options</p>
                    </div>
                    <div class="squareCraft-h-1px squareCraft-bg-3f3f3f"></div>
                `
        };

        tabs.forEach(tab => {
            tab.addEventListener("click", function () {
                tabs.forEach(t => t.classList.remove("squareCraft-active-tab"));

                this.classList.add("squareCraft-active-tab");

                const selectedTab = this.textContent.trim().toLowerCase();
                contentContainer.innerHTML = tabData[selectedTab] || "";

                const tabRect = this.getBoundingClientRect();
                const parentRect = this.parentElement.getBoundingClientRect();
                activeIndicator.style.left = `${tabRect.left - parentRect.left}px`;
                activeIndicator.style.width = `${tabRect.width}px`;
            });
        });
        document.addEventListener("click", function (event) {
            const toggle = event.target.closest("#toggleSwitch");
            if (toggle) {
                const toggleText = document.getElementById("toggleText");
                toggle.classList.toggle("active");
                if (toggleText) {
                    toggleText.textContent = toggle.classList.contains("active") ? "Enabled" : "Enable";
                }
            }
        });

        document.addEventListener("click", function (event) {
            const resetButton = event.target.closest("#resetButton");
            if (resetButton) {
                const resetIcon = resetButton.querySelector("#resetIcon");
                if (resetIcon) {
                    resetIcon.classList.add("rotate-animation");
                    setTimeout(() => {
                        resetIcon.classList.remove("rotate-animation");
                    }, 1000);
                }
            }
        });


        // its the https://fatin-webefo.github.io/squareCraft-Plugin/src/html/parentHtml/parentHtmlTab.js
    }
)()