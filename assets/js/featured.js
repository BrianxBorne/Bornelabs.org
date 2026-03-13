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
    card.className = "card project-card";

    card.innerHTML = `

      <div style="display:flex; align-items:center; justify-content:center; background:white; color:#1f1f1f; padding:6px 10px; border-bottom:1px solid #1f1f1f;font-weight:600; font-size:0.875rem; gap:6px;">
        <img src="assets/media/${wing}.jpg" alt="${wing} logo" style="width:20px; height:20px; object-fit:contain;">
        <span>${wing}</span>
      </div>

       <img class="project-image" src="${imageURL}">

      <div class="card-body">

        <h5 class="fw-semibold mb-2">
          ${logoURL ? `<img class="project-logo me-2" src="${logoURL}">` : ''}
          ${name}
        </h5>

        <p class="mb-2">${description}</p>
      </div>
    `;

    container.appendChild(card);
  }
}

loadFeaturedProjects();
