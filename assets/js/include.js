(function () {
'use strict';

const content = document.getElementById('content');

async function loadPage(page) {

    if (!content) return;

    const file = `Pages/${page.toLowerCase()}.html`;

    try {

        const res = await fetch(`${file}?v=${Date.now()}`, { cache: "no-store" });

        if (!res.ok) throw new Error(res.status);

        content.innerHTML = await res.text();

        if (typeof loadFeaturedProjects === "function") loadFeaturedProjects();

    } catch (err) {

        content.innerHTML =
        `<div class="p-3 text-danger">Could not load "${file}"</div>`;

        console.error(err);
    }
}

function router() {
    loadPage(location.hash.replace("#","") || "Home");
}

function initNavigation() {

    document.addEventListener("click", e => {

        const link = e.target.closest("[data-page]");
        if (!link) return;

        e.preventDefault();

        const page = link.dataset.page;

        location.hash = page;

        document.querySelectorAll("[data-page]")
            .forEach(el => el.classList.remove("active"));

        link.classList.add("active");

        const menu = document.getElementById("mobileMenu");

        if (menu?.classList.contains("show")) {
            bootstrap.Collapse.getInstance(menu)?.hide();
        }

    });

}

document.addEventListener("DOMContentLoaded", () => {

    initNavigation();
    router();

    window.addEventListener("hashchange", router);

});

})();