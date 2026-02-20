async function injectPartial(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;

    // Évite les injections multiples
    if (el.dataset.loaded === "1") return;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    el.innerHTML = await res.text();
    el.dataset.loaded = "1";
}

function setupNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");
    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!isOpen));
            nav.classList.toggle("open", !isOpen);
        });
    }

    document.querySelectorAll(".submenu-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
            const isOpen = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", String(!isOpen));
            btn.parentElement.classList.toggle("submenu-open", !isOpen);
        });
    });
}

function setupFooterYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
}

(async () => {
    await injectPartial("#header-slot", "partials/header.html");
    await injectPartial("#footer-slot", "partials/footer.html");
    setupNav();
    setupFooterYear();
})();
