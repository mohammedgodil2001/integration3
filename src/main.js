import "./css/reset.css";
import "./css/style.css";
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
const draggable = document.querySelectorAll(".draggable");
const stamp = document.querySelector(".stamp");
let normal_paper = document.querySelector(".normal_paper");
const paper = document.querySelector(".normal_paper");
let printed_paper_section = document.querySelector(".printed_paper_section");
let resetButton = document.querySelector(".reset-button");
const isTablet = window.matchMedia("(min-width: 45rem)");
const thirty_one = window.matchMedia("(min-width: 31rem)");
const isfifty_three_breakPoint = window.matchMedia("(min-width: 53rem)");
const thousand_pixels = window.matchMedia("(min-width: 62.5rem)");
const sixty_eight = window.matchMedia("(min-width: 68rem)");
const seventy_five = window.matchMedia("(min-width: 75rem)");
const eight_one = window.matchMedia("(min-width: 81rem)");
let Dragging = false;

const setupAnimations = () => {
  gsap.to(".spark__figure", {
    x: "-81vw",
    scrollTrigger: {
      trigger: ".spark",
      start: "top 40%",
      scrub: true,
    },
  });

  const book_handing = gsap.timeline({
    scrollTrigger: {
      trigger: ".card_two",
      start: "top 1%",
      end: "+=20%",
      scrub: true,
    },
  });

  book_handing.to(".hand_giving", {
    x: "15.5rem",
    ease: "power2.out",
    duration: 1,
  });

  book_handing.to(".book_inHand", {
    opacity: 1,
    ease: "power2.out",
    duration: 1,
  });

  book_handing.to(".hand_receiving", {
    x: "-18rem",
    ease: "power2.out",
    duration: 1,
  });

  book_handing.to(".book_inHand", {
    y: "6rem",
    ease: "power2.out",
    duration: 1,
  });
};

const setupPanelPinning = () => {
  const panel1 = document.querySelector(".panel1");
  ScrollTrigger.create({
    trigger: panel1,
    start: "top top",

    pin: true,
    // markers: true,
    pinSpacing: false,
  });

  const panel2 = document.querySelector(".panel2");
  ScrollTrigger.create({
    trigger: panel2,
    start: "top top",
    end: "+=100%",

    markers: {
      startColor: "purple",
      endColor: "purple",
    },
  });
};

// const draggable = document.querySelectorAll(".draggable");
// const stamp = document.querySelector(".stamp");
// let normal_paper = document.querySelector(".normal_paper");
// const paper = document.querySelector(".normal_paper");
// let printed_paper_section = document.querySelector(".printed_paper_section");
// let resetButton = document.querySelector(".reset-button");
// const isTablet = window.matchMedia("(min-width: 45rem)");
// const thirty_one = window.matchMedia("(min-width: 31rem)");
// const isfifty_three_breakPoint = window.matchMedia("(min-width: 53rem)");
// const thousand_pixels = window.matchMedia("(min-width: 62.5rem)");
// const sixty_eight = window.matchMedia("(min-width: 68rem)");
// const seventy_five = window.matchMedia("(min-width: 75rem)");
// const eight_one = window.matchMedia("(min-width: 81rem)");

if (eight_one.matches) {
  gsap.to(".horizontal-scroll__image--plantin", {
    x: "14rem",
    scrollTrigger: {
      trigger: ".horizontal-scroll__content",
      start: "top top",
      toggleActions: "play none reverse restart",
    },
  });
}

const addDragListeners = () => {
  stamp.addEventListener("touchmove", (e) => {
    e.preventDefault();
    stamp.style.position = "absolute";

    if (eight_one.matches) {
      stamp.style.right = "0";
      stamp.style.top = "3rem";
    } else if (seventy_five.matches) {
      stamp.style.left = "21.5rem";
      stamp.style.top = "3rem";
    } else if (sixty_eight.matches) {
      stamp.style.left = "19rem";
      stamp.style.top = "3rem";
    } else if (thousand_pixels.matches) {
      stamp.style.left = "17rem";
      stamp.style.top = "3rem";
    } else if (isfifty_three_breakPoint.matches) {
      stamp.style.left = "14rem";
      stamp.style.top = "3rem";
    } else if (isTablet.matches) {
      stamp.style.left = "11rem";
      stamp.style.top = "3rem";
    } else if (thirty_one.matches) {
      stamp.style.left = "7.5rem";
      stamp.style.top = "3rem";
    } else {
      stamp.style.left = "5rem";
      stamp.style.top = "2rem";
    }
  });

  stamp.addEventListener("touchend", () => {
    animateStampOnPaper();
    document.querySelector(".hand_pointing").style.display = "none";
  });

  stamp.addEventListener("mousedown", (e) => {
    e.preventDefault();
    Dragging = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.querySelector(".hand_pointing").style.display = "none";
  });

  document.addEventListener("mouseup", () => {
    if (Dragging) {
      animateStampOnPaper();
      Dragging = false;
    }
    document.removeEventListener("mousemove", handleMouseMove);
  });
};

function animateStampOnPaper() {
  stamp.style.animation = "moveUpDown 2s ease-in-out";

  setTimeout(() => {
    stamp.style.display = "none";
    normal_paper.src = "/integration3/printed_paper.png";

    normal_paper.style.transform = "scale(1.2)";
    printed_paper_section.style.paddingBottom = "2rem";
    normal_paper.style.paddingTop = "1.5rem";
    resetButton.style.display = "block";
  }, 1500);
}

// let Dragging = false;

const tryAgainButton = () => {
  resetButton.addEventListener("click", () => {
    stamp.style.display = "block";
    stamp.style.position = "";
    stamp.style.left = "";
    stamp.style.top = "";
    stamp.style.animation = "";
    resetButton.style.display = "none";

    normal_paper.src = "/integration3/normal_paper.png";

    normal_paper.style.transform = "";
    printed_paper_section.style.paddingBottom = "";
    normal_paper.style.paddingTop = "";
    Dragging = false;
    document.querySelector(".hand_pointing").style.display = "block";
  });
};

// stamp.addEventListener("mousedown", (e) => {
//   e.preventDefault();
//   Dragging = true;
//   document.addEventListener("mousemove", handleMouseMove);
//   document.querySelector(".hand_pointing").style.display = "none";
// });

// document.addEventListener("mouseup", () => {
//   if (Dragging) {
//     animateStampOnPaper();
//     Dragging = false;
//   }
//   document.removeEventListener("mousemove", handleMouseMove);
// });

const handleMouseMove = (e) => {
  stamp.style.position = "absolute";
  stamp.style.left = "0";
  stamp.style.top = "3rem";
};

const dragArea = document.querySelector(".drag-area");
const dropZones = document.querySelectorAll(".drop-zone");

const draggables = document.querySelectorAll(".draggable");

draggables.forEach((draggable) => {
  draggable.addEventListener("touchmove", (e) => {
    e.preventDefault();
  });
});

const drake = dragula([dragArea, ...dropZones], {
  revertOnSpill: true,
});

drake.on("drop", (el, target, source, sibling) => {
  if (!target || !target.classList.contains("drop-zone")) {
    return;
  }

  const matchValue = target.dataset.match;
  const draggedMatchValue = el.dataset.match;

  if (matchValue === draggedMatchValue) {
    el.classList.add("matched_item");
    target.appendChild(el);
    target.classList.add("correct");
    setTimeout(() => target.classList.remove("correct"), 1000);
  } else {
    source.appendChild(el);
    target.classList.add("incorrect");
    setTimeout(() => target.classList.remove("incorrect"), 1000);
  }
});

const path = document.querySelector("#path");
const pathLength = path.getTotalLength();

gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

gsap.to(path, {
  strokeDashoffset: 0,
  scrollTrigger: {
    trigger: ".timeline",
    start: "top top",
    end: `+=${pathLength}px`,
    scrub: true,
    markers: false,
  },
  ease: "none",
});

const timelineItems = document.querySelectorAll(".timeline__item");

timelineItems.forEach((item) => {
  const text = item.querySelector(".timeline__content");
  const image = item.querySelector(".timeline__media");
  const dataElement = item.querySelector(".data");

  if (dataElement) {
    gsap.fromTo(
      dataElement,
      { textContent: 0 },
      {
        textContent: 25000,
        duration: 4,
        ease: "power1.inOut",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none play reverse",
        },
        onUpdate: function () {
          dataElement.textContent = Math.floor(
            dataElement.textContent
          ).toLocaleString();
        },
      }
    );
  }

  gsap.fromTo(
    text,
    { opacity: 0, y: "2rem" },
    {
      opacity: 1,
      y: "0",
      duration: 1,
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );

  gsap.fromTo(
    image,
    { opacity: 0, y: "2.5rem" },
    {
      opacity: 1,
      y: "0",
      duration: 1,
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );
});

gsap.matchMedia().add({
  "(min-width: 45rem)": function () {
    timelineItems.forEach((item) => {
      const text = item.querySelector(".timeline__content");
      const image = item.querySelector(".timeline__media");

      gsap.fromTo(
        text,
        { y: "4rem" },
        {
          y: "0",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        image,
        { opacity: 0, y: "5rem" },
        {
          opacity: 1,
          y: "0",
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    });
  },
});

gsap.set(".section-plantin__image--two", {
  rotate: -211,
});

gsap.to(".section-plantin__image--two", {
  top: "20rem",
  rotate: -157,
  scrollTrigger: {
    trigger: ".section-plantin",
    start: "top top",
    end: "bottom top",
    toggleActions: "play none reverse restart",
  },
});

gsap.fromTo(
  ".section-book__image--hand-one",
  { x: "-10vw" },
  {
    x: "2rem",

    scrollTrigger: {
      trigger: ".section-book",
      start: "top top",
      end: "+=1000",
      toggleActions: "play none reverse restart",

      scrub: true,
    },
  }
);

gsap.fromTo(
  ".section-book__image--hand-two",
  { x: "10vw" },
  {
    x: "-2rem",
    scrollTrigger: {
      trigger: ".section-book",
      start: "top top",
      end: "+=1000",
      toggleActions: "play none reverse restart",

      scrub: true,
    },
  }
);

gsap.to(".horizontal-scroll__image--moretus", {
  x: "0rem",
  scrollTrigger: {
    trigger: ".horizontal-scroll__content",
    start: "top top",
    toggleActions: "play none reverse restart",
  },
});

gsap.to(".museum-visit__image-file", {
  x: "0",
  scrollTrigger: {
    trigger: ".museum-visit",
    start: "top top",
    toggleActions: "play none reverse restart",
  },
});

const arialingDiv = document.querySelector(".arialing");
const garamondDiv = document.querySelector(".garamond");
let feedback_for_font = document.querySelector(".feedback_for_font");

if (arialingDiv) {
}
arialingDiv.addEventListener("click", (event) => {
  arialingDiv.classList.add("arial_div_click_color");
  garamondDiv.classList.remove("arial_div_click_color");
  event.stopPropagation();
  feedback_for_font.textContent =
    "You chose Arial! 67% of users prefer this modern typeface for its clean look.";
});

if (garamondDiv) {
  garamondDiv.addEventListener("click", (event) => {
    arialingDiv.classList.remove("arial_div_click_color");
    garamondDiv.classList.add("arial_div_click_color");
    event.stopPropagation();
    feedback_for_font.textContent =
      "You chose Garamond! 33% of users also prefer this elegant typeface for its timeless design.";
  });
}

const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");

// prevBtn.addEventListener("click", goPrevPage);
// nextBtn.addEventListener("click", goNextPage);

let currentLocation = 1;
let numOfPapers = 2;
let maxLocation = numOfPapers;

const openBook = () => {
  book.style.transformOrigin = "center";
  book.style.transform = "translateX(50%) scale(1.2)";
};

const closeBook = () => {
  book.style.transform = "translateX(50%)";
  book.style.transition = "transform 0.5s ease";
};

const goNextPage = () => {
  nextBtn.style.animation = "none";
  prevBtn.disabled = false;
  if (currentLocation < maxLocation) {
    if (currentLocation === 1) {
      if (window.innerWidth <= 720) {
        openBook();
      }
      paper1.classList.add("flipped");
      paper1.style.zIndex = 1;
    }
    currentLocation++;
  }
};

const goPrevPage = () => {
  prevBtn.disabled = true;
  nextBtn.style.animation = "pulse 1.5s infinite";
  if (currentLocation > 1) {
    switch (currentLocation) {
      case 2:
        closeBook(true);
        paper1.classList.remove("flipped");
        paper1.style.zIndex = 3;
        break;
    }

    currentLocation--;
  }
};

prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

// const init = () => {
//   const $nav = document.querySelector(".nav");
//   const $navButton = document.querySelector(".nav__button");
//   const $navList = document.querySelector(".nav__list");
//   const $iconLink = document.querySelector("#iconlink");
//   const listItems = $navList.querySelectorAll("li a");
//   const closing__button = document.querySelector(".closing__button");

//   $navButton.classList.remove("hidden");

//   const openNavigation = () => {
//     $navButton.setAttribute("aria-expanded", "true");

//     $navList.classList.add("abc");
//   };

//   const closeNavigation = () => {
//     $navButton.setAttribute("aria-expanded", "false");

//     $navList.classList.remove("abc");
//   };

//   const toggleNavigation = () => {
//     const open = $navButton.getAttribute("aria-expanded");
//     open === "false" ? openNavigation() : closeNavigation();
//   };

//   closing__button.addEventListener("click", () => {
//     $navList.classList.remove("abc");
//   });

//   const handleBlur = () => {

//     closeNavigation();

//   };

//   $navButton.addEventListener("click", toggleNavigation);

//   listItems[listItems.length - 1].addEventListener("blur", handleBlur);

//   window.addEventListener("keyup", (e) => {
//     if (e.key === "Escape") {
//       $navButton.focus();
//       closeNavigation();
//     }
//   });
// };

// Moved functions outside init

const openNavigation = ($navButton, $navList) => {
  $navButton.setAttribute("aria-expanded", "true");
  $navList.classList.add("abc");
};

const closeNavigation = ($navButton, $navList) => {
  $navButton.setAttribute("aria-expanded", "false");
  $navList.classList.remove("abc");
};

const toggleNavigation = ($navButton, $navList) => {
  const open = $navButton.getAttribute("aria-expanded");
  open === "false"
    ? openNavigation($navButton, $navList)
    : closeNavigation($navButton, $navList);
};

const navigation = () => {
  const $nav = document.querySelector(".nav");
  const $navButton = document.querySelector(".nav__button");
  const $navList = document.querySelector(".nav__list");
  const listItems = $navList.querySelectorAll("li a");
  const closing__button = document.querySelector(".closing__button");

  $navButton.classList.remove("hidden");

  $navButton.addEventListener("click", () =>
    toggleNavigation($navButton, $navList)
  );

  closing__button.addEventListener("click", () =>
    closeNavigation($navButton, $navList)
  );

  listItems[listItems.length - 1].addEventListener("blur", () =>
    closeNavigation($navButton, $navList)
  );

  window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      $navButton.focus();
      closeNavigation($navButton, $navList);
    }
  });
};

const init = () => {
  navigation();
  setupAnimations();
  setupPanelPinning();
  tryAgainButton();
  addDragListeners();
};

init();
