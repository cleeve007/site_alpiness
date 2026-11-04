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

    const submenuButtons = [...document.querySelectorAll(".submenu-toggle")];
    const closeSubmenu = (btn, restoreFocus = false) => {
        btn.setAttribute("aria-expanded", "false");
        btn.parentElement.classList.remove("submenu-open");
        if (restoreFocus) btn.focus();
    };

    submenuButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const isOpen = btn.getAttribute("aria-expanded") === "true";
            submenuButtons.filter((other) => other !== btn).forEach((other) => closeSubmenu(other));
            btn.setAttribute("aria-expanded", String(!isOpen));
            btn.parentElement.classList.toggle("submenu-open", !isOpen);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        const openButton = submenuButtons.find((btn) => btn.getAttribute("aria-expanded") === "true");
        if (openButton) closeSubmenu(openButton, true);
    });

    document.addEventListener("click", (event) => {
        submenuButtons.forEach((btn) => {
            if (btn.getAttribute("aria-expanded") === "true" && !btn.parentElement.contains(event.target)) closeSubmenu(btn);
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
        return cleanPage === "randonnes" || cleanPage === "randonnees" ? "index" : cleanPage;
    };
    const currentPage = normalizePage(window.location.pathname);
    const parentPages = {
        "trek-baronnies-2027": "treks",
        "baronnies-2027": "treks",
        "reservation-baronnies-19-23-mai-2027": "treks",
        "reservation-baronnies-26-30-mai-2027": "treks",
        "formation-orientation": "preparer-un-objectif",
        "preparation-physique-trek": "preparer-un-objectif",
        "observation-marmottes": "decouverte-du-patrimoine",
    };
    const navPage = window.location.pathname.startsWith("/treks/") ? "treks" : (parentPages[currentPage] || currentPage);
    if (currentPage === "contact") document.body.classList.add("is-contact-page");
    document.querySelectorAll(".nav-list a[href]").forEach((link) => {
        const href = link.getAttribute("href");
        if (href.includes("#")) return;
        const linkPage = normalizePage(href);
        if (linkPage === navPage) link.setAttribute("aria-current", "page");
    });
}

function setupTrekFilters() {
    const form = document.querySelector("#trek-filter-form");
    if (!form) return;

    const cards = [...document.querySelectorAll("[data-trek-card]")];
    const groups = [...document.querySelectorAll("[data-trek-group]")];
    const summary = document.querySelector("#trek-filter-summary");
    const empty = document.querySelector("#trek-filter-empty");

    const applyFilters = () => {
        const values = Object.fromEntries(new FormData(form).entries());
        let visibleCount = 0;

        cards.forEach((card) => {
            const matches = ["level", "duration", "season", "status"].every((key) => !values[key] || card.dataset[key] === values[key]);
            card.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        groups.forEach((group) => {
            const groupCards = [...group.querySelectorAll("[data-trek-card]")];
            if (groupCards.length) {
                group.hidden = !groupCards.some((card) => !card.hidden);
                return;
            }
            const otherFiltersActive = values.level || values.duration || values.season;
            group.hidden = Boolean(otherFiltersActive) || Boolean(values.status && values.status !== group.dataset.trekGroup);
        });

        if (summary) summary.textContent = `${visibleCount} trek${visibleCount > 1 ? "s" : ""} affiché${visibleCount > 1 ? "s" : ""}`;
        if (empty) empty.hidden = visibleCount > 0 || groups.some((group) => !group.hidden && !group.querySelector("[data-trek-card]"));
    };

    form.addEventListener("change", applyFilters);
    form.addEventListener("reset", () => window.setTimeout(applyFilters, 0));
    applyFilters();
}

(async () => {
    await injectPartial("#header-slot", "/partials/header.html");
    await injectPartial("#footer-slot", "/partials/footer.html");
    setupNav();
    setupActiveNav();
    setupFooterYear();
    setupTrekFilters();
})();
