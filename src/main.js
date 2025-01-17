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
    // end: "+=80%",
    scrub: true,
    // markers: true,
    // pin: true,
    // pinSpacing: false,
  },
});

const book_handing = gsap.timeline({
  scrollTrigger: {
    trigger: ".card_two",
    start: "top 1%",
    // end: "+=80%",
    scrub: true,
    // pin: true,
    // markers: true,
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

gsap.utils.toArray(".panel").forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    start: "top top",
    // end: "bottom+=100%",
    end: "bottom+=100%",
    // end: "+=100%",
    pin: true,
    // pinSpacing: false,
    pinSpacing: i === gsap.utils.toArray(".panel").length - 1 ? true : false,
    // markers: true,
  });
});

const draggable = document.querySelectorAll(".draggable");

const stamp = document.querySelector(".stamp");
let normal_paper = document.querySelector(".normal_paper");
const paper = document.querySelector(".normal_paper");
let printed_paper_section = document.querySelector(".printed_paper_section");
let resetButton = document.querySelector(".reset-button");

stamp.addEventListener("touchmove", (e) => {
  e.preventDefault();
  stamp.style.position = "absolute";
  stamp.style.left = "4.5rem";
  stamp.style.top = "2rem";
});

stamp.addEventListener("touchend", () => {
  animateStampOnPaper();
});

function animateStampOnPaper() {
  stamp.style.animation = "moveUpDown 2s ease-in-out";

  setTimeout(() => {
    stamp.style.display = "none";
    normal_paper.src = "./src/assets/printed_paper.png";
    normal_paper.style.transform = "scale(1.2)";
    printed_paper_section.style.paddingBottom = "2rem";
    normal_paper.style.paddingTop = "1.5rem";
    resetButton.style.display = "block";
  }, 1500);
}

resetButton.addEventListener("click", () => {
  stamp.style.display = "block";
  stamp.style.position = "";
  stamp.style.left = "";
  stamp.style.top = "";
  stamp.style.animation = "";
  resetButton.style.display = "none";

  normal_paper.src = "./assets/normal_paper.png";
  normal_paper.style.transform = "";
  printed_paper_section.style.paddingBottom = "";
  normal_paper.style.paddingTop = "";
});

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

// const pathLength = document.querySelector("#path").getTotalLength();

// let path = document.querySelector("#path");
// gsap.set(path, { strokeDasharray: pathLength });

// gsap.fromTo(
//   path,
//   {
//     strokeDashoffset: 0,
//   },
//   {
//     strokeDashoffset: pathLength,
//     scrollTrigger: {
//       trigger: ".timeline__svg-container",
//       start: "top top",
//       end: "bottom bottom",
//       markers: true,
//     },
//   }
// );

// const path = document.querySelector("#path");
// const pathLength = path.getTotalLength();

// gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

// gsap.to(path, {
//   strokeDashoffset: 0,
//   scrollTrigger: {
//     trigger: ".timeline",
//     start: "top top",
//     // end: "bottom bottom",
//     scrub: true,
//     markers: true,
//     pin: true,
//   },
//   ease: "none",
//   duration: 10,
// });

// gsap.to(".open_book", {
//   scrollTrigger: {
//     trigger: ".timeline",
//     start: "top top",
//     end: `+=${pathLength}px`,
//     // end: '+=300vh'
//     // pin: "#path",
//     // pin: true,
//     scrub: true,
//     markers: true,
//   },
//   // duration: 10,
//   ease: "none",
//   motionPath: {
//     path: "#path",
//     align: "#path",
//     alignOrigin: [0.5, 0],
//   },
// });

// const timelineItems = document.querySelectorAll(".timeline__item");

// timelineItems.forEach((item) => {
//   const text = item.querySelector(".timeline__content");
//   const image = item.querySelector(".timeline__media");
//   const dataElement = item.querySelector(".data");

//   if (dataElement) {
//     gsap.fromTo(
//       dataElement,
//       { textContent: 0 },
//       {
//         textContent: 25000,
//         duration: 4,
//         ease: "power1.inOut",
//         snap: { textContent: 1 },
//         scrollTrigger: {
//           trigger: item,
//           start: "top 80%",
//           end: "bottom 60%",
//           toggleActions: "play none play restart",
//           // scrub: true,
//           // markers: true,
//         },
//         onUpdate: function () {
//           dataElement.textContent = Math.floor(
//             dataElement.textContent
//           ).toLocaleString();
//         },
//       }
//     );
//   }

//   // Standard animation for text
//   gsap.fromTo(
//     text,
//     {
//       opacity: 0,
//       y: "2rem",
//     },
//     {
//       scrollTrigger: {
//         trigger: item,
//         start: "top 80%",
//         end: "bottom 60%",
//         // markers: true,
//         scrub: true,
//       },
//       opacity: 1,
//       y: "0",
//       duration: 1,
//     }
//   );

//   // Standard animation for images
//   gsap.fromTo(
//     image,
//     {
//       opacity: 0,
//       y: "2.5rem",
//     },
//     {
//       scrollTrigger: {
//         trigger: item,
//         start: "top 80%",
//         end: "bottom 60%",
//         // markers: true,
//         scrub: true,
//       },
//       opacity: 1,
//       y: "0",
//       duration: 1,
//       delay: 0.5, // Adjust delay as needed
//     }
//   );
// });

const path = document.querySelector("#path");
const pathLength = path.getTotalLength();

gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

// Animate the path stroke with scrolling
gsap.to(path, {
  strokeDashoffset: 0,
  scrollTrigger: {
    trigger: ".timeline",
    start: "top top",
    end: `+=${pathLength}px`, // Match the timeline height
    scrub: true,
    markers: false, // Turn markers off for cleaner visuals
  },
  ease: "none",
});

// Animate the book along the path
gsap.to(".open_book", {
  scrollTrigger: {
    trigger: ".timeline",
    start: "top top",
    end: `+=${pathLength}px`,
    scrub: true,
    markers: false,
  },
  ease: "none",
  motionPath: {
    path: "#path",
    align: "#path",
    alignOrigin: [0.5, 0],
  },
});

// Animate each timeline__item
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
