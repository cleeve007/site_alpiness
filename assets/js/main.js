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

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                toggle.setAttribute("aria-expanded", "false");
                nav.classList.remove("open");
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && nav.classList.contains("open")) {
                toggle.setAttribute("aria-expanded", "false");
                nav.classList.remove("open");
                toggle.focus();
            }
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

function setupActiveNav() {
    const normalizePage = (value) => {
        const path = value.split("#")[0].split("?")[0].replace(/\/+$/, "");
        const page = path.split("/").pop() || "index";
        const cleanPage = page.replace(/\.html$/, "");
        return cleanPage === "randonnes" ? "index" : cleanPage;
    };
    const currentPage = normalizePage(window.location.pathname);
    const parentPages = {
        "formation-orientation": "preparer-un-objectif",
        "preparation-physique-trek": "preparer-un-objectif",
        "observation-marmottes": "decouverte-du-patrimoine",
    };
    const navPage = parentPages[currentPage] || currentPage;
    if (currentPage === "contact") document.body.classList.add("is-contact-page");
    document.querySelectorAll(".nav-list a[href]").forEach((link) => {
        const linkPage = normalizePage(link.getAttribute("href"));
        if (linkPage === navPage) link.setAttribute("aria-current", "page");
    });
}

function setupProposalsModal() {
    const openBtn = document.getElementById("open-proposals");
    const modal = document.getElementById("proposals-modal");
    if (!openBtn || !modal) return;

    const closeBtn = modal.querySelector(".modal-close");
    let lastFocusedElement = null;

    const open = () => {
        lastFocusedElement = document.activeElement;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        openBtn.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
        closeBtn?.focus();
    };

    const close = () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        openBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        lastFocusedElement?.focus();
    };

    openBtn.addEventListener("click", open);

    modal.querySelectorAll("[data-close='1']").forEach((el) => {
        el.addEventListener("click", close);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) close();
    });

    modal.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;
        const focusable = [...modal.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")]
            .filter((element) => !element.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

(async () => {
    await injectPartial("#header-slot", "partials/header.html");
    await injectPartial("#footer-slot", "partials/footer.html");
    setupNav();
    setupActiveNav();
    setupFooterYear();
    setupProposalsModal();
})();
