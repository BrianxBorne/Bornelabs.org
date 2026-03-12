const dbURL = "https://bms-database-d8fba-default-rtdb.firebaseio.com";

async function loadFeaturedProjects() {
  const container = document.getElementById("featured-projects");
  if (!container) return;

  container.innerHTML = "";

  const featuredRes = await fetch(`${dbURL}/system/featured_projects.json`);
  const featured = await featuredRes.json();
  if (!featured) return;

  const keys = Object.keys(featured);
  if (keys.length === 0) return;

  for (const key of keys) {
    const projectRes = await fetch(`${dbURL}/BMS/PROJECTS/${key}.json`);
    const project = await projectRes.json();
    if (!project) continue;

    const imageURL = project.image.replace(/^"+|"+$/g, '');
    const logoURL = project.logo ? project.logo.replace(/^"+|"+$/g, '') : '';
    const name = project.name.replace(/^"+|"+$/g, '');
    const description = project.description.replace(/^"+|"+$/g, '');
    const wing = project.wing ? project.wing.replace(/^"+|"+$/g, '') : '';

    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <img class="project-image" src="${imageURL}">
      <div class="project-info">
        <h2>
          ${logoURL ? `<img class="project-logo" src="${logoURL}">` : ''}
          ${name}
        </h2>
        <p>${description}</p>
        <small>${wing}</small>
      </div>
    `;

    container.appendChild(card);

    getDarkestColor(logoURL).then(color => {
      card.style.background = color;
      const rgb = color.match(/\d+/g);
      const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
      card.querySelector(".project-info").style.color = brightness > 186 ? "black" : "white";
    });
  }
}

function getDarkestColor(logoUrl) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src =logoUrl;

    img.onload = function() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = 40;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      let darkestColor = null;
      let minBrightness = 255; 

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

        if (brightness < minBrightness) {
          minBrightness = brightness;
          darkestColor = `rgb(${r},${g},${b})`;
        }
      }

      resolve(darkestColor || "black");
    };

    img.onerror = function() {
      resolve("black");
    };
  });
}

loadFeaturedProjects();