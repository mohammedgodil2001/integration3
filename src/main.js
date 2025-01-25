import "./css/reset.css";
import "./css/style.css";

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Body = Matter.Body,
  Svg = Matter.Svg,
  Vector = Matter.Vector,
  Vertices = Matter.Vertices,
  Bodies = Matter.Bodies;

var engine = Engine.create(),
  world = engine.world;

engine.gravity.y = 1;

var render = Render.create({
  // element: document.body,
  engine: engine,
  options: {
    background: "none",
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    showVelocity: true,
    showAngleIndicator: true,
  },
});

Render.run(render);

var runner = Runner.create();
Runner.run(runner, engine);

// Dynamic boundaries
Composite.add(world, [
  Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight,
    window.innerWidth,
    10,
    {
      isStatic: true,
      render: {
        visible: false, // Makes the boundary invisible
      },
    }
  ),
  Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, {
    isStatic: true,
    render: {
      visible: false, // Makes the boundary invisible
    },
  }),
  Bodies.rectangle(
    window.innerWidth,
    window.innerHeight / 2,
    10,
    window.innerHeight,
    {
      isStatic: true,
      render: {
        visible: false, // Makes the boundary invisible
      },
    }
  ),
  Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, {
    isStatic: true,
    render: {
      visible: false, // Makes the boundary invisible
    },
  }),
]);

const paths = document.querySelectorAll(".matter-path"); // Select all paths with the class "matter-path"

const matterSVGMapping = [];

paths.forEach((path, index) => {
  const svg = path.parentNode;
  // Convert each SVG path to vertices
  let vertices = Svg.pathToVertices(path);

  // Dynamically calculate scaleFactor using viewBox
  const viewBox = path.ownerSVGElement.getAttribute("viewBox").split(" ");
  const viewBoxWidth = parseFloat(viewBox[2]);
  const viewBoxHeight = parseFloat(viewBox[3]);

  // Fit the SVG to 20% of the canvas width
  const desiredWidth = window.innerWidth * 0.26;
  const scaleFactor = desiredWidth / viewBoxWidth;

  // Scale vertices
  vertices = Vertices.scale(vertices, scaleFactor, scaleFactor);

  // Create a Matter.js body from the vertices
  const svgBody = Bodies.fromVertices(
    window.innerWidth / 2 + index * 100, // Center horizontally with spacing for each body
    window.innerHeight / 2, // Center vertically
    // 50,
    [vertices],
    {
      render: {
        visible: false,
        fillStyle: "#4B4239",
        strokeStyle: "#4B4239",
      },
    }
  );

  matterSVGMapping.push({
    svg: svg,
    body: svgBody,
    scaleFactor,
  });

  // Add the body to the world
  Composite.add(world, svgBody);
});

let isDragging = false;
let activeBody = null;
let offset = { x: 0, y: 0 };

// Add event listeners to each SVG
matterSVGMapping.forEach((mapping) => {
  const { svg, body } = mapping;

  svg.addEventListener("mousedown", (event) => {
    isDragging = true;
    activeBody = body;
    offset.x = event.clientX - body.position.x;
    offset.y = event.clientY - body.position.y;
  });

  svg.addEventListener("mousemove", (event) => {
    if (isDragging && activeBody) {
      // Set the position of the Matter.js body
      Body.setPosition(activeBody, {
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
      });
    }
  });

  svg.addEventListener("mouseup", () => {
    isDragging = false;
    activeBody = null;
  });

  // For touch devices
  svg.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      isDragging = true;
      activeBody = body;
      offset.x = touch.clientX - body.position.x;
      offset.y = touch.clientY - body.position.y;
    },
    { passive: false }
  );

  svg.addEventListener(
    "touchmove",
    (event) => {
      if (isDragging && activeBody) {
        const touch = event.touches[0];
        Body.setPosition(activeBody, {
          x: touch.clientX - offset.x,
          y: touch.clientY - offset.y,
        });
      }
    },
    { passive: false }
  );

  svg.addEventListener(
    "touchend",
    () => {
      isDragging = false;
      activeBody = null;
    },
    { passive: false }
  );
});

const draw = () => {
  matterSVGMapping.forEach((o) => {
    // console.log(o);

    const { svg, body, scaleFactor } = o;
    // console.log(body);
    const degrees = (body.angle * 180) / Math.PI;
    svg.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${degrees}deg) scale(${scaleFactor})`;
    // svg.style.transform = ``;
  });

  window.requestAnimationFrame(draw);
};

draw();

// function resizeSVGsForMobile() {
//   // Select all SVGs with the .matter-path class
//   const paths = document.querySelectorAll(".matter-path");

//   // Check if the screen width is mobile size
//   if (window.innerWidth < 768) {
//     paths.forEach((path) => {
//       const svg = path.parentNode; // Get the SVG element
//       const viewBox = svg.getAttribute("viewBox").split(" ");
//       const viewBoxWidth = parseFloat(viewBox[2]);

//       // If viewBoxWidth is invalid, skip this SVG
//       if (!viewBoxWidth) {
//         console.warn("Invalid viewBox or missing viewBox on SVG:", svg);
//         return;
//       }

//       // Scale the SVG to fit 80% of the mobile screen width
//       const desiredWidth = window.innerWidth * 0.8; // 80% of screen width
//       const scaleFactor = desiredWidth / viewBoxWidth;

//       // Apply the scale to the SVG
//       svg.style.transform = `scale(${scaleFactor})`;
//       svg.style.transformOrigin = "center center"; // Scale from the center
//     });
//   } else {
//     // Reset SVG scale for desktop
//     paths.forEach((path) => {
//       const svg = path.parentNode;
//       svg.style.transform = ""; // Clear any applied transform
//     });
//   }
// }

// // Call resize function on page load
// resizeSVGsForMobile();

// // Adjust scaling on window resize
// window.addEventListener("resize", resizeSVGsForMobile);

// window.requestAnimationFrame(draw);

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

gsap.to(".spark__figure", {
  x: "-81vw",
  scrollTrigger: {
    trigger: ".spark",
    start: "top 40%",
    scrub: true,
    //markers: true,
  },
});

const book_handing = gsap.timeline({
  scrollTrigger: {
    trigger: ".card_two",
    start: "top 1%",
    end: "+=20%",
    scrub: true,
    // pin: true,
    //markers: true,
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

// let hand_giving_receiving = gsap.matchMedia();

// hand_giving_receiving.add("(min-width: 45rem)", () => {
//   console.log("yey");
//   book_handing.kill();
//   const book_handing_tablet = gsap.timeline({
//     scrollTrigger: {
//       trigger: ".card_two",
//       start: "top 1%",
//       // end: "+=50%",
//       scrub: true,
//       markers: true,
//       // pin: true,
//       // pinSpacing: false,
//     },
//   });

//   book_handing_tablet.to(".hand_giving", {
//     x: "19.5rem",
//     ease: "power2.out",
//     duration: 1,
//   });

//   book_handing_tablet.to(".book_inHand", {
//     opacity: 1,
//     ease: "power2.out",
//     duration: 1,
//   });

//   book_handing_tablet.to(".hand_receiving", {
//     x: "-18rem",
//     ease: "power2.out",
//     duration: 1,
//   });

//   book_handing_tablet.to(".book_inHand", {
//     y: "6rem",
//     ease: "power2.out",
//     duration: 1,
//   });

//   gsap.to(".spark__figure", {
//     x: "-100vw",
//     scrollTrigger: {
//       trigger: ".spark",
//       start: "top 40%",
//       // end: "+=80%",
//       scrub: true,
//       // markers: true,
//       // pin: true,
//       // pinSpacing: false,
//     },
//   });
// });

// gsap.utils.toArray(".panel").forEach((panel, i) => {
//   ScrollTrigger.create({
//     trigger: panel,
//     start: "top top",
//     end: "+=70%",
//     pin: true,
//     markers: true,
//     pinSpacing: false,
//   });
// });

// gsap.utils.toArray(".panel").forEach((panel, i) => {
//   ScrollTrigger.create({
//     trigger: panel,
//     start: "top top",
//     end: "+=70%",
//     pin: true,
//     markers: true,
//     pinSpacing: false,
//   });
// });

const panel1 = document.querySelector(".panel1");
ScrollTrigger.create({
  trigger: panel1,
  start: "top top",
  // end: "+=70%",
  pin: true,
  markers: true,
  pinSpacing: false,
});

const panel2 = document.querySelector(".panel2");
ScrollTrigger.create({
  trigger: panel2,
  start: "top top",
  end: "+=100%",
  // pin: true,
  markers: {
    startColor: "purple",
    endColor: "purple",
  },
  // pinSpacing: true,
});

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

if (eight_one.matches) {
  gsap.to(".horizontal-scroll__image--plantin", {
    x: "14rem",
    scrollTrigger: {
      trigger: ".horizontal-scroll__content",
      start: "top top",
      toggleActions: "play none reverse restart",
      // scrub: true,
      // markers: true,
    },
  });
}

stamp.addEventListener("touchmove", (e) => {
  e.preventDefault();
  stamp.style.position = "absolute";
  // stamp.style.left = "4.5rem";
  // stamp.style.top = "2rem";

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

function animateStampOnPaper() {
  stamp.style.animation = "moveUpDown 2s ease-in-out";

  setTimeout(() => {
    stamp.style.display = "none";
    // normal_paper.src = "/printed_paper.png";
    normal_paper.src = normal_paper.getAttribute("data-printed-src");
    normal_paper.style.transform = "scale(1.2)";
    printed_paper_section.style.paddingBottom = "2rem";
    normal_paper.style.paddingTop = "1.5rem";
    resetButton.style.display = "block";
  }, 1500);
}

let Dragging = false;

resetButton.addEventListener("click", () => {
  stamp.style.display = "block";
  stamp.style.position = "";
  stamp.style.left = "";
  stamp.style.top = "";
  stamp.style.animation = "";
  resetButton.style.display = "none";

  // normal_paper.src = "/normal_paper.png";
  normal_paper.src = normal_paper.getAttribute("data-normal-src");
  normal_paper.style.transform = "";
  printed_paper_section.style.paddingBottom = "";
  normal_paper.style.paddingTop = "";
  Dragging = false;
  document.querySelector(".hand_pointing").style.display = "block";
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

function handleMouseMove(e) {
  stamp.style.position = "absolute";
  stamp.style.left = "0";
  stamp.style.top = "3rem";
}

const dragArea = document.querySelector(".drag-area");
const dropZones = document.querySelectorAll(".drop-zone");

// Prevent default behavior on touchmove
const draggables = document.querySelectorAll(".draggable");

draggables.forEach((draggable) => {
  draggable.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Prevents scrolling or other default actions
  });
});

// Initialize Dragula
const drake = dragula([dragArea, ...dropZones], {
  revertOnSpill: true, // Revert if dropped outside any container
});

// Handle drop event
drake.on("drop", (el, target, source, sibling) => {
  // If dropped outside a drop zone, do nothing
  if (!target || !target.classList.contains("drop-zone")) {
    return;
  }

  // Get the match values
  const matchValue = target.dataset.match;
  const draggedMatchValue = el.dataset.match;

  // Check if the match is correct
  if (matchValue === draggedMatchValue) {
    el.classList.add("matched_item");
    target.appendChild(el); // Place the element in the drop zone
    target.classList.add("correct");
    setTimeout(() => target.classList.remove("correct"), 1000);
  } else {
    // Revert the element to its original container
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

// gsap.to(".open_book", {
//   scrollTrigger: {
//     trigger: ".timeline",
//     start: "top top",
//     scrub: true,
//     markers: false,
//     pin: ".open_book",
//   },
// });

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

  // Animate text
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

  // Animate image
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

      // Animate text
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

// $(".flipbook").turn();

// $(document).ready(function () {
//   $(".flipbook").turn({
//     width: 800,
//     height: 1200,
//     autoCenter: true,
//   });
// });

// const arialingDiv = document.querySelector(".arialing");
// const garamondDiv = document.querySelector(".garamond");
// let feedback_for_font = document.querySelector(".feedback_for_font");

// if (arialingDiv) {
//   arialingDiv.addEventListener("click", () => {
//     feedback_for_font.textContent =
//       "You chose Arial! 67% of users prefer this modern typeface for its clean look.";
//   });
// }

// if (garamondDiv) {
//   garamondDiv.addEventListener("click", () => {
//     feedback_for_font.textContent =
//       "You chose Garamond! 33% of users also prefer this elegant typeface for its timeless design.";
//   });
// }

// const pageFlip = new St.PageFlip(document.getElementById("example"), {
//   width: 400,
//   height: 600,
//   autoSize: true,
// });

// pageFlip.loadFromHTML(document.querySelectorAll(".page"));

// gsap.to(".section-plantin__image--two", {
//   // y: "20rem",
//   top: "20rem",
//   rotate: -157,
//   scrollTrigger: {
//     trigger: ".section-plantin",
//     start: "top top",
//     end: "bottom top",
//     markers: true,
//     // scrub: true,
//     toggleActions: "play none play play",
//   },
// });

gsap.set(".section-plantin__image--two", {
  rotate: -211, // Matches CSS
});

gsap.to(".section-plantin__image--two", {
  top: "20rem",
  rotate: -157, // Target rotation
  scrollTrigger: {
    trigger: ".section-plantin",
    start: "top top",
    end: "bottom top",
    // markers: true,
    // scrub: true, // Sync animation with scroll
    toggleActions: "play none reverse restart",
  },
});

gsap.fromTo(
  ".section-book__image--hand-one",
  { x: "-10vw" }, // Start off-screen to the left
  {
    x: "2rem",
    // duration: 1,
    scrollTrigger: {
      trigger: ".section-book",
      start: "top top",
      end: "+=1000",
      toggleActions: "play none reverse restart",
      // end: "top 50%",
      scrub: true,
      // pin: true,
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
      // end: "top 50%",
      scrub: true,
      // pin: true,
    },
  }
);

gsap.to(".horizontal-scroll__image--moretus", {
  x: "0rem",
  scrollTrigger: {
    trigger: ".horizontal-scroll__content",
    start: "top top",
    toggleActions: "play none reverse restart",
    // scrub: true,
    // markers: true,
  },
});

gsap.to(".museum-visit__image-file", {
  x: "0",
  scrollTrigger: {
    trigger: ".museum-visit",
    start: "top top",
    toggleActions: "play none reverse restart",
    // scrub: true,
    // markers: true,
  },
});

// let flipbook1 = document.querySelector("#flipbook1");
// let options1 = {
//   width: 400,
//   height: 400,
//   size: "stretch",
//   startPage: 0,
//   showCover: true,
//   useMouseEvents: true,
//   maxShadowOpacity: 0.5,
//   flippingTime: 1000,
// };
// const pageFlip1 = new St.PageFlip(flipbook1, options1);

// let pages = document.querySelectorAll(".page");
// pageFlip1.loadFromHTML(pages);

const arialingDiv = document.querySelector(".arialing");
const garamondDiv = document.querySelector(".garamond");
let feedback_for_font = document.querySelector(".feedback_for_font");

if (arialingDiv) {
}
arialingDiv.addEventListener("click", (event) => {
  arialingDiv.classList.add("arial_div_click_color");
  garamondDiv.classList.remove("arial_div_click_color");
  event.stopPropagation(); // Prevent page flip
  feedback_for_font.textContent =
    "You chose Arial! 67% of users prefer this modern typeface for its clean look.";
});

if (garamondDiv) {
  garamondDiv.addEventListener("click", (event) => {
    arialingDiv.classList.remove("arial_div_click_color");
    garamondDiv.classList.add("arial_div_click_color");
    event.stopPropagation(); // Prevent page flip
    feedback_for_font.textContent =
      "You chose Garamond! 33% of users also prefer this elegant typeface for its timeless design.";
  });
}

// flipbook1.addEventListener("click", (event) => {
//   if (pageFlip1.getCurrentPageIndex() === 0) {
//     pageFlip1.flipNext();
//   }
// });

const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");

prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

let currentLocation = 1;
let numOfPapers = 2;
let maxLocation = numOfPapers;

function openBook() {
  book.style.transformOrigin = "center"; // Ensure scaling happens from the center
  book.style.transform = "translateX(50%) scale(1.2)"; // Combine both transforms
}

function closeBook() {
  book.style.transform = "translateX(50%)";
  book.style.transition = "transform 0.5s ease";
}

function goNextPage() {
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
}

function goPrevPage() {
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
}

const init = () => {
  const $nav = document.querySelector(".nav");
  const $navButton = document.querySelector(".nav__button");
  const $navList = document.querySelector(".nav__list");
  const $iconLink = document.querySelector("#iconlink");
  const listItems = $navList.querySelectorAll("li a");
  const closing__button = document.querySelector(".closing__button");

  $navButton.classList.remove("hidden");
  // $navList.classList.add("hidden");

  const openNavigation = () => {
    $navButton.setAttribute("aria-expanded", "true");
    // $iconLink.setAttribute("xlink:href", "#close");
    $navList.classList.add("abc");
  };

  const closeNavigation = () => {
    $navButton.setAttribute("aria-expanded", "false");
    // $iconLink.setAttribute("xlink:href", "#navicon");
    $navList.classList.remove("abc");
  };

  const toggleNavigation = () => {
    const open = $navButton.getAttribute("aria-expanded");
    open === "false" ? openNavigation() : closeNavigation();
  };

  closing__button.addEventListener("click", () => {
    $navList.classList.remove("abc");
  });

  const handleBlur = () => {
    //if (!event.relatedTarget || !$navList.contains(event.relatedTarget)) {
    closeNavigation();
    //}
  };

  $navButton.addEventListener("click", toggleNavigation);

  // add event to the last item in the nav list to trigger the disclosure to close if the user tabs out of the disclosure
  listItems[listItems.length - 1].addEventListener("blur", handleBlur);

  // Close the disclosure if a user presses the escape key
  window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      $navButton.focus();
      closeNavigation();
    }
  });
};

init();
