export function WidgetButtonAdvanceSection(){


    return `
 <div id="button-advance-section">
          <div class="sc-flex sc-p-2 sc-items-center sc-justify-between">
            <div class="sc-flex sc-gap-2 sc-items-center">
              <img
                loading="lazy"
                src="https://fatin-webefo.github.io/squareCraft-plugin/public/button-advance.png"
                width="19px"
                alt=""
              />
              <p class="sc-universal sc-roboto">Scroll Effects</p>
            </div>
            <img
              src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
              alt="sc-rotate-180"
            />
          </div>
          <div class="sc-h-1px sc-bg-3f3f3f"></div>
          <div
            class="sc-flex sc-px-2 sc-mt-2 sc-items-center sc-justify-between"
          >
            <div class="sc-flex sc-gap-2 sc-items-center">
              <div class="toggle-container" >
                <div class="toggle-bullet"></div>
              </div>
              <p class="sc-font-size-12 sc-universal sc-roboto">
                Enable
              </p>
            </div>
            <div
              class="sc-flex sc-gradiant-border sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-1 sc-px-2 sc-py-4px sc-bg sc-bg-454545"
            >
              <p
                class="sc-font-thin sc-universal sc-font-size-12 sc-font-size-11 sc-roboto"
              >
                Reset
              </p>
              <img
                src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                alt="reset"
              />
            </div>
          </div>
          <div class="sc-px-2 sc-mt-2 sc-flex-col sc-gap-2">
            <div class="sc-flex">
              <div
                id="button-advance-vertical"
                class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-w-full sc-rounded-4px"
              >
                <div class="sc-flex sc-items-center sc-gap-8px">
                  <img
                    width="13px"
                    src="https://fatin-webefo.github.io/squareCraft-plugin/public/button-advance/button-advance-vertical.svg"
                    loading="lazy"
                    alt=""
                  />
                  <p class="sc-roboto sc-font-size-14 sc-universal">Vertical</p>
                </div>
                <img
                  id="button-advance-vertical-arrow"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class=""
                  alt=""
                />
              </div>
            </div>

            <div
              id="button-advance-vertical-section"
              class="sc-bg-454545 sc-border sc-border-solid sc-border-EF7C2F sc-p-2 sc-rounded-4px"
            >
              <div class="sc-flex sc-flex-col sc-gap-2">
                <div class="sc-flex sc-gap-2 sc-items-center">
                  <p
                    class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                  >
                    Custom Timeline
                  </p>
                  <div
                    id="icon-size-reset"
                    class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                  >
                    <img
                      src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                      width="10"
                      alt="reset"
                    />
                  </div>
                </div>

                <div
                  class="sc-relative sc-mt-2 sc-h-2 sc-bg-F6F6F6 sc-rounded-15px"
                >
                  <div
                    id="timeline-start-fill"
                    class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    style="left: 0%; width: 0%"
                  ></div>
                  <div
                    id="timeline-end-fill"
                    class="sc-absolute sc-bg-F6B67B sc-h-2 sc-rounded-r-full"
                    style="right: 0%; width: 0%"
                  ></div>

                  <div
                    id="timeline-start-bullet"
                    class="sc-absolute sc-w-3 sc-h-3 sc-bg-color-EF7C2F sc-rounded-full sc-cursor-pointer sc-top-half"
                    style="left: 0%"
                  ></div>
                  <div
                    id="timeline-end-bullet"
                    class="sc-absolute sc-w-3 sc-h-3 sc-bg-F6B67B sc-rounded-full sc-cursor-pointer sc-top-half"
                    style="right: 0%"
                  ></div>
                </div>

                <div
                  class="sc-flex sc-mt-1 sc-justify-between sc-font-size-12 sc-text-gray-300"
                >
                  <p class="sc-universal sc-roboto">
                    Start <span id="timelineStartValue">0%</span>
                  </p>
                  <p class="sc-universal sc-roboto">
                    End <span id="timelineEndValue">0%</span>
                  </p>
                </div>
              </div>

              <div class="sc-w-full sc-mt-3">
                <div
                  class="sc-flex sc-w-full sc-items-center sc-justify-between"
                >
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                    >
                      Entry
                    </p>
                    <div
                      id="button-advance-entry-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>
                  <div
                    class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                  >
                    <p
                      id="button-advance-entry-count"
                      class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                    >
                      0px
                    </p>
                    <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                      <span
                        id="button-advance-entry-Increase"
                        class="sc-arrow-placeholder"
                      ></span>
                      <span
                        id="button-advance-entry-Decrease"
                        class="sc-arrow-placeholder sc-rotate-180"
                      ></span>
                    </div>
                  </div>
                </div>
                <div
                  id="button-advance-entry-Field"
                  class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                >
                  <div
                    id="button-advance-entry-Fill"
                    class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                  ></div>
                  <div
                    id="button-advance-entry-Bullet"
                    class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                  ></div>
                </div>
              </div>
              <div class="sc-w-full sc-mt-3">
                <div
                  class="sc-flex sc-w-full sc-items-center sc-justify-between"
                >
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                    >
                      Center
                    </p>
                    <div
                      id="button-advance-center-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>
                  <div
                    class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                  >
                    <p
                      id="button-advance-center-radiusCount"
                      class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                    >
                      0px
                    </p>
                    <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                      <span
                        id="button-advance-center-Increase"
                        class="sc-arrow-placeholder"
                      ></span>
                      <span
                        id="button-advance-center-Decrease"
                        class="sc-arrow-placeholder sc-rotate-180"
                      ></span>
                    </div>
                  </div>
                </div>
                <div
                  id="button-advance-center-radiusField"
                  class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                >
                  <div
                    id="button-advance-center-radiusFill"
                    class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                  ></div>
                  <div
                    id="button-advance-center-radiusBullet"
                    class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                  ></div>
                </div>
              </div>
              <div class="sc-w-full sc-mt-3">
                <div
                  class="sc-flex sc-w-full sc-items-center sc-justify-between"
                >
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                    >
                      Exit
                    </p>
                    <div
                      id="button-advance-exit-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>
                  <div
                    class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                  >
                    <p
                      id="button-advance-exit-radiusCount"
                      class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                    >
                      0px
                    </p>
                    <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                      <span
                        id="button-advance-exit-Increase"
                        class="sc-arrow-placeholder"
                      ></span>
                      <span
                        id="button-advance-exit-Decrease"
                        class="sc-arrow-placeholder sc-rotate-180"
                      ></span>
                    </div>
                  </div>
                </div>
                <div
                  id="button-advance-exit-radiusField"
                  class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                >
                  <div
                    id="button-advance-exit-radiusFill"
                    class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                  ></div>
                  <div
                    id="button-advance-exit-radiusBullet"
                    class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                  ></div>
                </div>
              </div>
              <div class="sc-w-full sc-mt-3">
                <div
                  class="sc-flex sc-w-full sc-items-center sc-justify-between"
                >
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                    >
                      Effect Speed
                    </p>
                    <div
                      id="button-advance-effectSpeed-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>
                  <div
                    class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                  >
                    <p
                      id="button-advance-effectSpeed-radiusCount"
                      class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                    >
                      0px
                    </p>
                    <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                      <span
                        id="button-advance-effectSpeed-Increase"
                        class="sc-arrow-placeholder"
                      ></span>
                      <span
                        id="button-advance-effectSpeed-Decrease"
                        class="sc-arrow-placeholder sc-rotate-180"
                      ></span>
                    </div>
                  </div>
                </div>
                <div
                  id="button-advance-effectSpeed-radiusField"
                  class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                >
                  <div
                    id="button-advance-effectSpeed-radiusFill"
                    class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                  ></div>
                  <div
                    id="button-advance-effectSpeed-radiusBullet"
                    class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                  ></div>
                </div>
              </div>

              <div class="sc-mt-6 sc-z-[99999]">
                <p class="sc-universal sc-roboto sc-font-size-12">
                  Effect Animation
                </p>

                <div
                  class="sc-flex sc-mt-2 sc-relative sc-items-center sc-z-[99999]"
                >
                  <div
                    class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-full"
                  >
                    <p class="sc-universal sc-roboto sc-font-size-12">None</p>
                  </div>

                  <div
                    class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-h-dropdown sc-scrollBar sc-border-EF7C2F sc-left-0 sc-top-[35px] sc-z-[99999]"
                  >
                    <div
                      class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-16 sc-bg-colo-EF7C2F-hover sc-cursor-pointer"
                      data-value="none"
                    >
                      None
                    </div>
                    <div
                      class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                      data-value="linear"
                    >
                      Linear
                    </div>
                    <div
                      class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                      data-value="ease-in"
                    >
                      ease-in
                    </div>
                    <div
                      class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                      data-value="ease-out"
                    >
                      ease-out
                    </div>
                  </div>

                  <div
                    class="sc-bg-color-2c2c2c sc-cursor-pointer sc-px-2_5 sc-py-0_5px"
                  >
                    <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                      <span class="sc-arrow-placeholder"></span>
                      <span class="sc-arrow-placeholder sc-rotate-180"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class=" ">
              <div
                id="button-advance-horizontal"
                class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px"
              >
                <div class="sc-flex sc-items-center sc-gap-8px">
                  <img
                    width="18px"
                    src="https://fatin-webefo.github.io/squareCraft-plugin/public/button-advance/button-advance-horizontal.svg"
                    loading="lazy"
                    alt=""
                  />
                  <p class="sc-roboto sc-font-size-14 sc-universal">
                    Horizontal
                  </p>
                </div>
                <img
                  id="button-advance-horizontal-arrow"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180"
                  alt=""
                />
              </div>
              <div
                id="button-advance-horizontal-section"
                class="sc-bg-454545 sc-hidden sc-mt-2 sc-border sc-border-solid sc-border-EF7C2F sc-p-2 sc-rounded-4px"
              >
                <div class="sc-flex sc-flex-col sc-gap-2">
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                    >
                      Custom Timeline
                    </p>
                    <div
                      id="icon-size-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>

                  <div
                    class="sc-relative sc-mt-2 sc-h-2 sc-bg-F6F6F6 sc-rounded-15px"
                  >
                    <div
                      id="timeline-start-fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                      style="left: 0%; width: 0%"
                    ></div>
                    <div
                      id="timeline-end-fill"
                      class="sc-absolute sc-bg-F6B67B sc-h-2 sc-rounded-r-full"
                      style="right: 0%; width: 0%"
                    ></div>

                    <div
                      id="timeline-start-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-color-EF7C2F sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="left: 0%"
                    ></div>
                    <div
                      id="timeline-end-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-F6B67B sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="right: 0%"
                    ></div>
                  </div>

                  <div
                    class="sc-flex sc-mt-1 sc-justify-between sc-font-size-12 sc-text-gray-300"
                  >
                    <p class="sc-universal sc-roboto">
                      Start <span id="timelineStartValue">0%</span>
                    </p>
                    <p class="sc-universal sc-roboto">
                      End <span id="timelineEndValue">0%</span>
                    </p>
                  </div>
                </div>

                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Entry
                      </p>
                      <div
                        id="button-advance-entry-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-entry-count"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-entry-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-entry-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-entry-Field"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-entry-Fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-entry-Bullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Center
                      </p>
                      <div
                        id="button-advance-center-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-center-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-center-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-center-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-center-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-center-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-center-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Exit
                      </p>
                      <div
                        id="button-advance-exit-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-exit-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-exit-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-exit-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-exit-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-exit-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-exit-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Effect Speed
                      </p>
                      <div
                        id="button-advance-effectSpeed-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-effectSpeed-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-effectSpeed-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-effectSpeed-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-effectSpeed-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-effectSpeed-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-effectSpeed-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>

                <div class="sc-mt-6 sc-z-[99999]">
                  <p class="sc-universal sc-roboto sc-font-size-12">
                    Effect Animation
                  </p>

                  <div
                    class="sc-flex sc-mt-2 sc-relative sc-items-center sc-z-[99999]"
                  >
                    <div
                      class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-full"
                    >
                      <p class="sc-universal sc-roboto sc-font-size-12">None</p>
                    </div>

                    <div
                      class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-h-dropdown sc-scrollBar sc-border-EF7C2F sc-left-0 sc-top-[35px] sc-z-[99999]"
                    >
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-16 sc-bg-colo-EF7C2F-hover sc-cursor-pointer"
                        data-value="none"
                      >
                        None
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="linear"
                      >
                        Linear
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-in"
                      >
                        ease-in
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-out"
                      >
                        ease-out
                      </div>
                    </div>

                    <div
                      class="sc-bg-color-2c2c2c sc-cursor-pointer sc-px-2_5 sc-py-0_5px"
                    >
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                        <span class="sc-arrow-placeholder"></span>
                        <span class="sc-arrow-placeholder sc-rotate-180"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class=" ">
              <div
                id="button-advance-opacity"
                class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px"
              >
                <div class="sc-flex sc-items-center sc-gap-8px">
                  <img
                    width="15px"
                    src="https://fatin-webefo.github.io/squareCraft-plugin/public/button-advance/button-advance-opacity.png"
                    loading="lazy"
                    alt=""
                  />
                  <p class="sc-roboto sc-font-size-14 sc-universal">Opacity</p>
                </div>
                <img
                  id="button-advance-opacity-arrow"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180"
                  alt=""
                />
              </div>
              <div
                id="button-advance-opacity-section"
                class="sc-bg-454545 sc-hidden sc-mt-2 sc-border sc-border-solid sc-border-EF7C2F sc-p-2 sc-rounded-4px"
              >
                <div class="sc-flex sc-flex-col sc-gap-2">
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                    >
                      Custom Timeline
                    </p>
                    <div
                      id="icon-size-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>

                  <div
                    class="sc-relative sc-mt-2 sc-h-2 sc-bg-F6F6F6 sc-rounded-15px"
                  >
                    <div
                      id="timeline-start-fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                      style="left: 0%; width: 0%"
                    ></div>
                    <div
                      id="timeline-end-fill"
                      class="sc-absolute sc-bg-F6B67B sc-h-2 sc-rounded-r-full"
                      style="right: 0%; width: 0%"
                    ></div>

                    <div
                      id="timeline-start-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-color-EF7C2F sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="left: 0%"
                    ></div>
                    <div
                      id="timeline-end-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-F6B67B sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="right: 0%"
                    ></div>
                  </div>

                  <div
                    class="sc-flex sc-mt-1 sc-justify-between sc-font-size-12 sc-text-gray-300"
                  >
                    <p class="sc-universal sc-roboto">
                      Start <span id="timelineStartValue">0%</span>
                    </p>
                    <p class="sc-universal sc-roboto">
                      End <span id="timelineEndValue">0%</span>
                    </p>
                  </div>
                </div>

                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Entry
                      </p>
                      <div
                        id="button-advance-entry-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-entry-count"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-entry-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-entry-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-entry-Field"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-entry-Fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-entry-Bullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Center
                      </p>
                      <div
                        id="button-advance-center-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-center-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-center-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-center-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-center-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-center-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-center-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Exit
                      </p>
                      <div
                        id="button-advance-exit-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-exit-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-exit-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-exit-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-exit-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-exit-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-exit-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Effect Speed
                      </p>
                      <div
                        id="button-advance-effectSpeed-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-effectSpeed-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-effectSpeed-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-effectSpeed-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-effectSpeed-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-effectSpeed-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-effectSpeed-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>

                <div class="sc-mt-6 sc-z-[99999]">
                  <p class="sc-universal sc-roboto sc-font-size-12">
                    Effect Animation
                  </p>

                  <div
                    class="sc-flex sc-mt-2 sc-relative sc-items-center sc-z-[99999]"
                  >
                    <div
                      class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-full"
                    >
                      <p class="sc-universal sc-roboto sc-font-size-12">None</p>
                    </div>

                    <div
                      class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-h-dropdown sc-scrollBar sc-border-EF7C2F sc-left-0 sc-top-[35px] sc-z-[99999]"
                    >
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-16 sc-bg-colo-EF7C2F-hover sc-cursor-pointer"
                        data-value="none"
                      >
                        None
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="linear"
                      >
                        Linear
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-in"
                      >
                        ease-in
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-out"
                      >
                        ease-out
                      </div>
                    </div>

                    <div
                      class="sc-bg-color-2c2c2c sc-cursor-pointer sc-px-2_5 sc-py-0_5px"
                    >
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                        <span class="sc-arrow-placeholder"></span>
                        <span class="sc-arrow-placeholder sc-rotate-180"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class=" ">
              <div
                id="button-advance-scale"
                class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px"
              >
                <div class="sc-flex sc-items-center sc-gap-8px">
                  <img
                    width="17px"
                    src="https://fatin-webefo.github.io/squareCraft-plugin/public/button-advance/button-advance-scale.png"
                    loading="lazy"
                    alt=""
                  />
                  <p class="sc-roboto sc-font-size-14 sc-universal">Scale</p>
                </div>
                <img
                  id="button-advance-scale-arro"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180"
                  alt=""
                />
              </div>
              <div
                id="button-advance-scale-section"
                class="sc-bg-454545 sc-hidden sc-mt-2 sc-border sc-border-solid sc-border-EF7C2F sc-p-2 sc-rounded-4px"
              >
                <div class="sc-flex sc-flex-col sc-gap-2">
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                    >
                      Custom Timeline
                    </p>
                    <div
                      id="icon-size-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>

                  <div
                    class="sc-relative sc-mt-2 sc-h-2 sc-bg-F6F6F6 sc-rounded-15px"
                  >
                    <div
                      id="timeline-start-fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                      style="left: 0%; width: 0%"
                    ></div>
                    <div
                      id="timeline-end-fill"
                      class="sc-absolute sc-bg-F6B67B sc-h-2 sc-rounded-r-full"
                      style="right: 0%; width: 0%"
                    ></div>

                    <div
                      id="timeline-start-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-color-EF7C2F sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="left: 0%"
                    ></div>
                    <div
                      id="timeline-end-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-F6B67B sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="right: 0%"
                    ></div>
                  </div>

                  <div
                    class="sc-flex sc-mt-1 sc-justify-between sc-font-size-12 sc-text-gray-300"
                  >
                    <p class="sc-universal sc-roboto">
                      Start <span id="timelineStartValue">0%</span>
                    </p>
                    <p class="sc-universal sc-roboto">
                      End <span id="timelineEndValue">0%</span>
                    </p>
                  </div>
                </div>

                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Entry
                      </p>
                      <div
                        id="button-advance-entry-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-entry-count"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-entry-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-entry-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-entry-Field"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-entry-Fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-entry-Bullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Center
                      </p>
                      <div
                        id="button-advance-center-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-center-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-center-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-center-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-center-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-center-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-center-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Exit
                      </p>
                      <div
                        id="button-advance-exit-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-exit-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-exit-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-exit-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-exit-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-exit-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-exit-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Effect Speed
                      </p>
                      <div
                        id="button-advance-effectSpeed-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-effectSpeed-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-effectSpeed-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-effectSpeed-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-effectSpeed-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-effectSpeed-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-effectSpeed-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>

                <div class="sc-mt-6 sc-z-[99999]">
                  <p class="sc-universal sc-roboto sc-font-size-12">
                    Effect Animation
                  </p>

                  <div
                    class="sc-flex sc-mt-2 sc-relative sc-items-center sc-z-[99999]"
                  >
                    <div
                      class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-full"
                    >
                      <p class="sc-universal sc-roboto sc-font-size-12">None</p>
                    </div>

                    <div
                      class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-h-dropdown sc-scrollBar sc-border-EF7C2F sc-left-0 sc-top-[35px] sc-z-[99999]"
                    >
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-16 sc-bg-colo-EF7C2F-hover sc-cursor-pointer"
                        data-value="none"
                      >
                        None
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="linear"
                      >
                        Linear
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-in"
                      >
                        ease-in
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-out"
                      >
                        ease-out
                      </div>
                    </div>

                    <div
                      class="sc-bg-color-2c2c2c sc-cursor-pointer sc-px-2_5 sc-py-0_5px"
                    >
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                        <span class="sc-arrow-placeholder"></span>
                        <span class="sc-arrow-placeholder sc-rotate-180"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="">
              <div
                id="button-advance-rotate"
                class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px"
              >
                <div class="sc-flex sc-items-center sc-gap-8px">
                  <img
                    width="17px"
                    src="https://fatin-webefo.github.io/squareCraft-plugin/public/button-advance/button-advance-rotate.png"
                    loading="lazy"
                    alt=""
                  />
                  <p class="sc-roboto sc-font-size-14 sc-universal">Rotate</p>
                </div>
                <img
                  id="button-advance-rotate-arrow"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180"
                  alt=""
                />
              </div>
              <div
                id="button-advance-rotate-section"
                class="sc-bg-454545 sc-hidden sc-mt-2 sc-border sc-border-solid sc-border-EF7C2F sc-p-2 sc-rounded-4px"
              >
                <div class="sc-flex sc-flex-col sc-gap-2">
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                    >
                      Custom Timeline
                    </p>
                    <div
                      id="icon-size-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>

                  <div
                    class="sc-relative sc-mt-2 sc-h-2 sc-bg-F6F6F6 sc-rounded-15px"
                  >
                    <div
                      id="timeline-start-fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                      style="left: 0%; width: 0%"
                    ></div>
                    <div
                      id="timeline-end-fill"
                      class="sc-absolute sc-bg-F6B67B sc-h-2 sc-rounded-r-full"
                      style="right: 0%; width: 0%"
                    ></div>

                    <div
                      id="timeline-start-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-color-EF7C2F sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="left: 0%"
                    ></div>
                    <div
                      id="timeline-end-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-F6B67B sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="right: 0%"
                    ></div>
                  </div>

                  <div
                    class="sc-flex sc-mt-1 sc-justify-between sc-font-size-12 sc-text-gray-300"
                  >
                    <p class="sc-universal sc-roboto">
                      Start <span id="timelineStartValue">0%</span>
                    </p>
                    <p class="sc-universal sc-roboto">
                      End <span id="timelineEndValue">0%</span>
                    </p>
                  </div>
                </div>

                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Entry
                      </p>
                      <div
                        id="button-advance-entry-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-entry-count"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-entry-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-entry-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-entry-Field"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-entry-Fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-entry-Bullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Center
                      </p>
                      <div
                        id="button-advance-center-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-center-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-center-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-center-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-center-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-center-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-center-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Exit
                      </p>
                      <div
                        id="button-advance-exit-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-exit-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-exit-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-exit-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-exit-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-exit-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-exit-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Effect Speed
                      </p>
                      <div
                        id="button-advance-effectSpeed-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-effectSpeed-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-effectSpeed-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-effectSpeed-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-effectSpeed-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-effectSpeed-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-effectSpeed-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>

                <div class="sc-mt-6 sc-z-[99999]">
                  <p class="sc-universal sc-roboto sc-font-size-12">
                    Effect Animation
                  </p>

                  <div
                    class="sc-flex sc-mt-2 sc-relative sc-items-center sc-z-[99999]"
                  >
                    <div
                      class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-full"
                    >
                      <p class="sc-universal sc-roboto sc-font-size-12">None</p>
                    </div>

                    <div
                      class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-h-dropdown sc-scrollBar sc-border-EF7C2F sc-left-0 sc-top-[35px] sc-z-[99999]"
                    >
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-16 sc-bg-colo-EF7C2F-hover sc-cursor-pointer"
                        data-value="none"
                      >
                        None
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="linear"
                      >
                        Linear
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-in"
                      >
                        ease-in
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-out"
                      >
                        ease-out
                      </div>
                    </div>

                    <div
                      class="sc-bg-color-2c2c2c sc-cursor-pointer sc-px-2_5 sc-py-0_5px"
                    >
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                        <span class="sc-arrow-placeholder"></span>
                        <span class="sc-arrow-placeholder sc-rotate-180"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="">
              <div   id="button-advance-blur"
                class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px"
              >
                <div class="sc-flex sc-items-center sc-gap-8px">
                  <img
                    width="15px"
                    src="https://fatin-webefo.github.io/squareCraft-plugin/public/button-advance/button-advance-blur.png"
                    loading="lazy"
                    alt=""
                  />
                  <p class="sc-roboto sc-font-size-14 sc-universal">Blur</p>
                </div>
                <img
                  id="button-advance-blur-arrow"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180"
                  alt=""
                />
              </div>
              <div
                id="button-advance-blur-section"
                class="sc-bg-454545 sc-hidden sc-mt-2 sc-border sc-border-solid sc-border-EF7C2F sc-p-2 sc-rounded-4px"
              >
                <div class="sc-flex sc-flex-col sc-gap-2">
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                    >
                      Custom Timeline
                    </p>
                    <div
                      id="icon-size-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>

                  <div
                    class="sc-relative sc-mt-2 sc-h-2 sc-bg-F6F6F6 sc-rounded-15px"
                  >
                    <div
                      id="timeline-start-fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                      style="left: 0%; width: 0%"
                    ></div>
                    <div
                      id="timeline-end-fill"
                      class="sc-absolute sc-bg-F6B67B sc-h-2 sc-rounded-r-full"
                      style="right: 0%; width: 0%"
                    ></div>

                    <div
                      id="timeline-start-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-color-EF7C2F sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="left: 0%"
                    ></div>
                    <div
                      id="timeline-end-bullet"
                      class="sc-absolute sc-w-3 sc-h-3 sc-bg-F6B67B sc-rounded-full sc-cursor-pointer sc-top-half"
                      style="right: 0%"
                    ></div>
                  </div>

                  <div
                    class="sc-flex sc-mt-1 sc-justify-between sc-font-size-12 sc-text-gray-300"
                  >
                    <p class="sc-universal sc-roboto">
                      Start <span id="timelineStartValue">0%</span>
                    </p>
                    <p class="sc-universal sc-roboto">
                      End <span id="timelineEndValue">0%</span>
                    </p>
                  </div>
                </div>

                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Entry
                      </p>
                      <div
                        id="button-advance-entry-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-entry-count"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-entry-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-entry-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-entry-Field"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-entry-Fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-entry-Bullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Center
                      </p>
                      <div
                        id="button-advance-center-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-center-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-center-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-center-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-center-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-center-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-center-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Exit
                      </p>
                      <div
                        id="button-advance-exit-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-exit-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-exit-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-exit-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-exit-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-exit-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-exit-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-w-full sc-mt-3">
                  <div
                    class="sc-flex sc-w-full sc-items-center sc-justify-between"
                  >
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-14"
                      >
                        Effect Speed
                      </p>
                      <div
                        id="button-advance-effectSpeed-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg-3f3f3f"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg-3f3f3f"
                    >
                      <p
                        id="button-advance-effectSpeed-radiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="button-advance-effectSpeed-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="button-advance-effectSpeed-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="button-advance-effectSpeed-radiusField"
                    class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="button-advance-effectSpeed-radiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="button-advance-effectSpeed-radiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>

                <div class="sc-mt-6 sc-z-[99999]">
                  <p class="sc-universal sc-roboto sc-font-size-12">
                    Effect Animation
                  </p>

                  <div
                    class="sc-flex sc-mt-2 sc-relative sc-items-center sc-z-[99999]"
                  >
                    <div
                      class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-full"
                    >
                      <p class="sc-universal sc-roboto sc-font-size-12">None</p>
                    </div>

                    <div
                      class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-h-dropdown sc-scrollBar sc-border-EF7C2F sc-left-0 sc-top-[35px] sc-z-[99999]"
                    >
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-16 sc-bg-colo-EF7C2F-hover sc-cursor-pointer"
                        data-value="none"
                      >
                        None
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="linear"
                      >
                        Linear
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-in"
                      >
                        ease-in
                      </div>
                      <div
                        class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover"
                        data-value="ease-out"
                      >
                        ease-out
                      </div>
                    </div>

                    <div
                      class="sc-bg-color-2c2c2c sc-cursor-pointer sc-px-2_5 sc-py-0_5px"
                    >
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                        <span class="sc-arrow-placeholder"></span>
                        <span class="sc-arrow-placeholder sc-rotate-180"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sc-mt-4"></div>
        </div>
    `;
}