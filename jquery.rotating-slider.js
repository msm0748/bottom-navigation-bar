(function ($) {
    $.fn.rotatingSlider = function (options) {
        var rotatingSlider = {
            init: function (el) {
                this.$slider = $(el);
                this.$slidesContainer = this.$slider.children("ul.slides");
                this.$slides = this.$slidesContainer.children("li");

                this.settings = $.extend(
                    {
                        slideHeight: "",
                        slideWidth: "",
                    },
                    options
                );

                this.slideAngle = 360 / this.$slides.length;
                this.markupIsValid = false;

                this.validateMarkup();
                if (this.markupIsValid) {
                    this.renderSlider();
                }
            },

            

            renderSlider: function () {
                var halfAngleRadian = ((this.slideAngle / 2) * Math.PI) / 180;
                var innerRadius =
                    ((1 / Math.tan(halfAngleRadian)) *
                        this.settings.slideWidth) /
                    2;
                var outerRadius = Math.sqrt(
                    Math.pow(innerRadius + this.settings.slideHeight, 2) +
                        Math.pow(this.settings.slideWidth / 2, 2)
                );
                upperArcHeight =
                    outerRadius - (innerRadius + this.settings.slideHeight);
                lowerArcHeight =
                    innerRadius - innerRadius * Math.cos(halfAngleRadian);

                /* 슬라이더의 height, width 설정 */
                this.$slider.css("height", "auto");
                this.$slider.css("width", "auto");

                /* 컨테이너의 hieght, width 설정 */
                this.$slidesContainer.css("height", outerRadius * 2 + "px");
                this.$slidesContainer.css("width", outerRadius * 2 + "px");

                /* 컨테이너 transform, top 설정 */
                this.$slidesContainer.css("transform", "translateX(-50%)");
                this.$slidesContainer.css("top", "-" + upperArcHeight + "px");

                /* 각 슬라이드에 스타일 적용 */
                this.$slides.each(
                    function (i, el) {
                        var $slide = $(el);
                        /* 회전점으로부터의 거리 설정 */
                        $slide.css(
                            "transform-origin",
                            "center " +
                                (innerRadius + this.settings.slideHeight) +
                                "px"
                        );

                        /* height, width 설정 */
                        $slide.css("height", this.settings.slideHeight + "px");
                        $slide.css("width", this.settings.slideWidth + "px");

                        /* top */
                        $slide.css("top", upperArcHeight + "px");

                        /* transform 설정 */
                        $slide.css(
                            "transform",
                            "translateX(-50%) rotate(" +
                                this.slideAngle * i +
                                "deg) translateY(-" +
                                upperArcHeight +
                                "px)"
                        );
                    }.bind(this)
                );
            },

            validateMarkup: function () {
                if (
                    this.$slider.hasClass("rotating-slider") &&
                    this.$slidesContainer.length === 1 &&
                    this.$slides.length >= 2
                ) {
                    this.markupIsValid = true;
                } else {
                    this.$slider.css("display", "none");
                    console.log("Markup for Rotating Slider is invalid.");
                }
            },
        };

        return this.each(function () {
            rotatingSlider.init(this);
        });
    };
})(jQuery);
