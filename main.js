$(document).ready(function () {
  gsap.config({ nullTargetWarn: false }); // gsap 플로그인 경고표시 무시
  const $visual = $(".visual");
  const $visualList = $visual.find(".visual-list");
  const $visualBtn = $visual.find(".visual_btn");
  const $rotatingSlider = document.querySelector(".rotating-slider ul"); // jquery 선택시 gsap 선택자 에러뜸
  const $rotatingItem = $visual.find("li.rotating_item");
  const $rotatingInner = $visual.find("li .inner");
  const $rotatingItemLength = $rotatingItem.length;
  const oneAngle = 360 / $rotatingItem.length;
  let currentIndex = 0; // 슬라이더에서 index 값으로 이용
  let slickBeforeState = false; // 방향키 풀면 방향키 컨트롤에서 꼬임

  $visualList.slick({
    slidesToShow: 1,
    prevArrow: $(".visual_prev"),
    nextArrow: $(".visual_next"),
    // fade: true,
    accessibility: false, // 방향키 컨트롤 true시 slide index 틀어짐
  });

  $(".rotating-slider").rotatingSlider({
      slideHeight: Math.min(80, window.innerWidth),
      slideWidth: Math.min(80, window.innerWidth),
  });

  $rotatingInner.each(function (i, v) {
    gsap.set(v, { rotation: changeNegative(i * oneAngle) });
  }); // 초기 inner rotate 셋팅

  function slickControl(operator, slideIndex) {
    const currentAngle = gsap.getProperty($rotatingSlider, "rotation");
    if (operator === "plus") {
      gsap.to($rotatingSlider, { duration: 0.5, rotation: currentAngle + oneAngle });
      $rotatingInner.each(function (i, v) {
        gsap.to(v, { duration: 0.5, rotation: changeNegative(currentAngle + (i + 1) * oneAngle) });
      });
    }
    if (operator === "minus") {
      gsap.to($rotatingSlider, { duration: 0.5, rotation: currentAngle - oneAngle });
      $rotatingInner.each(function (i, v) {
        gsap.to(v, { duration: 0.5, rotation: changeNegative(currentAngle + (i - 1) * oneAngle) });
      });
    }
    currentIndex = slideIndex;
  }

  $visualBtn.on("mousedown keydown", function () {
    slickBeforeState = true;
  });
  $visualBtn.on("mouseleave", function () {
    slickBeforeState = false;
  });

  $visualList.on("mousedown", function () {
    slickBeforeState = true;
  });
  $visualList.on("mouseup mouseleave", function () {
    slickBeforeState = false;
  });

  $visualList.on("beforeChange", function (event, slick, currentSlide, nextSlide) {
    if (slickBeforeState === true) {
      if (Math.abs(nextSlide - currentSlide) === 1) {
        direction = nextSlide - currentSlide > 0 ? "right" : "left";
      } else {
        direction = nextSlide - currentSlide > 0 ? "left" : "right";
      }
      if (direction === "right" && currentSlide !== nextSlide) {
        slickControl("minus", nextSlide);
      }
      if (direction === "left" && currentSlide !== nextSlide) {
        slickControl("plus", nextSlide);
      }
    }
  });

  function changeNegative(x) {
    //  음수로 변환 함수
    return x * -1;
  }

  function findApproximate(i, currentAngle) {
    // 근사값 추출
    const a = currentAngle + oneAngle * (currentIndex - i);
    const b = a + 360;
    const c = a - 360;
    const arr = [a, b, c];

    return arr.reduce(function (prev, curr) {
      return Math.abs(curr - currentAngle) < Math.abs(prev - currentAngle) ? curr : prev;
    });
  }

  $rotatingInner.click("click", function () {
    const $this = $(this);
    const index = $this.parent().index();
    const currentAngle = gsap.getProperty($rotatingSlider, "rotation"); //현재 rotation 값 가져오기
    const approximateValue = findApproximate(index, currentAngle);
    currentIndex = index;
    gsap.to($rotatingSlider, { duration: 0.5, rotation: approximateValue });

    $rotatingInner.each(function (i, v) {
      gsap.to(v, { duration: 0.5, rotation: changeNegative(approximateValue + i * oneAngle) });
    });

    $visualList.slick("slickGoTo", currentIndex);
  });

  function fallIntoPlace(currentRotate) {
    $rotatingInner.each(function (i, v) {
      gsap.set(v, { rotation: changeNegative(currentRotate + i * oneAngle) });
    });
  }

  Draggable.create($rotatingSlider, {
    type: "rotation",
    inertia: true,
    onDragStart: function () {
      $visualList.css("pointer-events", "none"); // 슬라이더랑 roate슬라이더 2중 클릭 방지
    },
    onDrag: function () {
      const roundAngle = Math.round(this.rotation / oneAngle) * oneAngle; // 개당각도 단위로 반올림
      fallIntoPlace(this.rotation);
    },
    onDragEnd: function () {
      $visualList.css("pointer-events", "auto");
      const roundAngle = Math.round(this.rotation / oneAngle) * oneAngle; // 개당각도 단위로 반올림
      gsap.to($rotatingSlider, { duration: 0.1, rotation: roundAngle }); // 타임 및 roatation 셋팅
      fallIntoPlace(roundAngle);
      if (roundAngle <= 0) {
        currentIndex = Math.abs((roundAngle / oneAngle) % $rotatingItemLength);
      } else {
        // roate가 양수 일 경우 45º(도씨)의 currentIndex 값이 7이 나오게 하라면 360도를 빼주면 됨.
        const cycle = parseInt(roundAngle / 360 + 1);
        currentIndex = ((cycle * 360 - roundAngle) / oneAngle) % $rotatingItemLength;
      }
      $visualList.slick("slickGoTo", currentIndex);
    },
  });
});
