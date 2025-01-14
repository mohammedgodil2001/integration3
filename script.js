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



window.requestAnimationFrame(draw);
