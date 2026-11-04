(() => {
    const buttons = Array.from(document.querySelectorAll(".chalet-gallery-button"));
    const dialog = document.querySelector("#chalet-lightbox");

    if (!buttons.length || !dialog) return;

    const lightboxImage = dialog.querySelector("figure img");
    const description = dialog.querySelector(".chalet-lightbox-description");
    const counter = dialog.querySelector(".chalet-lightbox-counter");
    const closeButton = dialog.querySelector(".chalet-lightbox-close");
    const previousButton = dialog.querySelector(".chalet-lightbox-prev");
    const nextButton = dialog.querySelector(".chalet-lightbox-next");
    const photos = buttons.map((button) => {
        const image = button.querySelector("img");
        return { src: image.currentSrc || image.src, alt: image.alt };
    });
    let currentIndex = 0;

    const showPhoto = (index) => {
        currentIndex = (index + photos.length) % photos.length;
        const photo = photos[currentIndex];
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;
        description.textContent = photo.alt;
        counter.textContent = `${currentIndex + 1} / ${photos.length}`;
    };

    const openLightbox = (index) => {
        showPhoto(index);
        dialog.showModal();
        document.body.classList.add("has-open-lightbox");
    };

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => openLightbox(index));
    });

    previousButton.addEventListener("click", () => showPhoto(currentIndex - 1));
    nextButton.addEventListener("click", () => showPhoto(currentIndex + 1));
    closeButton.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
        if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
    });

    dialog.addEventListener("close", () => {
        document.body.classList.remove("has-open-lightbox");
    });
})();
