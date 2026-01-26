async function injectPartial(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    const res = await fetch(url);
    el.innerHTML = await res.text();
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
    await injectPartial("#header-slot", "/partials/header.html");
    await injectPartial("#footer-slot", "/partials/footer.html");
    setupNav();
    setupFooterYear();
})();
