(() => {
    const form = document.querySelector("#baronnies-reservation-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const questions = String(data.get("questions") || "").trim() || "Aucune question pour le moment.";
        const subject = "Inscription - Trek des Baronnies - 19 au 23 mai 2027";
        const body = [
            "Bonjour,",
            "",
            "Je suis intéressé par le trek des Baronnies du 19 au 23 mai 2027.",
            "",
            `Nom : ${String(data.get("lastName") || "").trim()}`,
            `Prénom : ${String(data.get("firstName") || "").trim()}`,
            `Téléphone : ${String(data.get("phone") || "").trim()}`,
            "",
            "Questions :",
            questions,
            "",
            "Cordialement,",
        ].join("\n");

        window.location.href = `mailto:alpinessenoisans@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
})();
