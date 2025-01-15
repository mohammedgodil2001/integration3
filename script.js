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
  element: document.body,
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
  svg.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    isDragging = true;
    activeBody = body;
    offset.x = touch.clientX - body.position.x;
    offset.y = touch.clientY - body.position.y;
  });

  svg.addEventListener("touchmove", (event) => {
    if (isDragging && activeBody) {
      const touch = event.touches[0];
      Body.setPosition(activeBody, {
        x: touch.clientX - offset.x,
        y: touch.clientY - offset.y,
      });
    }
  });

  svg.addEventListener("touchend", () => {
    isDragging = false;
    activeBody = null;
  });
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
    normal_paper.src = "./assets/printed_paper.png";
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
