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

function setupProposalsModal() {
    const openBtn = document.getElementById("open-proposals");
    const modal = document.getElementById("proposals-modal");
    if (!openBtn || !modal) return;

    const open = () => {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const close = () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    openBtn.addEventListener("click", open);

    modal.querySelectorAll("[data-close='1']").forEach((el) => {
        el.addEventListener("click", close);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
}

(async () => {
    await injectPartial("#header-slot", "partials/header.html");
    await injectPartial("#footer-slot", "partials/footer.html");
    setupNav();
    setupFooterYear();
    setupProposalsModal();
})();
