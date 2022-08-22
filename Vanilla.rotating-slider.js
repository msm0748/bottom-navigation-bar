function rotatingSlider(element, options) {
    var rotatingSlider = {
        init: function (el) {
            this.$slider = el;
            this.$slidesContainer = this.$slider.children;
            this.$slides = this.$slidesContainer[0].children;

            this.settings = Object.assign(
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
                ((1 / Math.tan(halfAngleRadian)) * this.settings.slideWidth) /
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
            this.$slider.style.height = "auto";
            this.$slider.style.width = "auto";

            /* 컨테이너의 hieght, width 설정 */
            this.$slidesContainer[0].style.height = outerRadius * 2 + "px";
            this.$slidesContainer[0].style.width = outerRadius * 2 + "px";

            /* 컨테이너 transform, top 설정 */
            this.$slidesContainer[0].style.transform = "translateX(-50%)";
            this.$slidesContainer[0].style.top = upperArcHeight + "px";

            /* 각 슬라이드에 스타일 적용 */
            Array.from(this.$slides).forEach(
                function (el, i) {
                    var $slide = el;
                    /* 회전점으로부터의 거리 설정 */
                    $slide.style.transformOrigin =
                        "center " +
                        (innerRadius + this.settings.slideHeight) +
                        "px";

                    /* height, width 설정 */
                    $slide.style.height = this.settings.slideHeight + "px";
                    $slide.style.width = this.settings.slideWidth + "px";

                    /* top */
                    $slide.style.top = upperArcHeight + "px";

                    /* transform 설정 */
                    $slide.style.transform =
                        "translateX(-50%) rotate(" +
                        this.slideAngle * i +
                        "deg) translateY(-" +
                        upperArcHeight +
                        "px)";
                }.bind(this)
            );
        },

        validateMarkup: function () {
            if (
                this.$slider.classList.contains("rotating-slider") &&
                this.$slidesContainer.length === 1 &&
                this.$slides.length >= 2
            ) {
                this.markupIsValid = true;
            } else {
                this.$slider.style.display = "none";
                console.log("Markup for Rotating Slider is invalid.");
            }
        },
    };

    return rotatingSlider.init(document.querySelector(element));
}
