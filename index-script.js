document.addEventListener("DOMContentLoaded", function () {
    // Sélectionnez à la fois le conteneur du menu (pour la section "Menu")
    const menuContainer = document.querySelector("#menu .menu-container > .row.menu-container");
    // ET la barre de navigation (pour l'en-tête)
    const navbar = document.getElementById("navbar");

    // Fonction générique pour gérer le clic et la redirection
    function handleHoroscopeClick(event) {
        // Remonte jusqu'à l'élément <a> le plus proche qui a data-periode
        const clickedLink = event.target.closest('a[data-periode]');

        if (clickedLink) {
            event.preventDefault(); // Empêche la navigation par défaut

            const periode = clickedLink.dataset.periode;
            let signe = null;

            // Pour trouver le signe, nous devons remonter à l'élément parent qui contient data-signe
            // Dans la navbar, c'est le <a> parent direct du <ul>, ou son <li> parent pour la structure
            const parentDropdownLi = clickedLink.closest('li.dropdown'); // Remonte au li.dropdown

            if (parentDropdownLi) {
                // Cherche le <a> qui a l'attribut data-signe à l'intérieur de ce li.dropdown
                const signeLink = parentDropdownLi.querySelector('a[data-signe]');
                if (signeLink) {
                    signe = signeLink.dataset.signe;
                }
            }

            if (signe && periode) {
                const redirectUrl = `horoscope.html?signe=${signe}&periode=${periode}`;
                console.log("Redirection vers :", redirectUrl);
                window.location.href = redirectUrl; // Redirige le navigateur
            } else {
                console.warn("Impossible de déterminer le signe ou la période pour la redirection depuis la navbar ou le menu.");
            }
        }
    }

    // Ajoutez l'écouteur d'événements à la section "Menu" si elle existe
    if (menuContainer) {
        menuContainer.addEventListener("click", handleHoroscopeClick);
    }

    // Ajoutez l'écouteur d'événements à la barre de navigation si elle existe
    if (navbar) {
        navbar.addEventListener("click", handleHoroscopeClick);
    }
});