/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/color/:hexColor/:size", function (request, reply) {
  
  const hexColor = request.params.hexColor;
  const size = parseInt(request.params.size ?? 32, 10);

    // Extract the RGB and alpha components from the hex color
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);
    const alpha = hexColor.slice(6, 8);
    const a = alpha !== '' ? parseInt(alpha, 16) / 255 : 1; // Convert alpha to 0-1 range
    console.log({hexColor, r, g, b, a});

    // Create an SVG response
    const svg = `<svg stroke="black" stroke-width="2" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
                    <rect width="100%" height="100%" fill="rgba(${r},${g},${b},${a})" />
                 </svg>`;

    // Set the Content-Type header to indicate SVG
    reply.header('Content-Type', 'image/svg+xml');
    reply.send(svg);
  
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
