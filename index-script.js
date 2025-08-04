document.addEventListener('DOMContentLoaded', () => {

    /**
     * ### Logique pour le Menu Principal (les icônes) ###
     *
     * Cette partie gère les clics dans la grille des signes du zodiaque.
     * Elle trouve le filtre actif (jour, semaine...) pour déterminer la période.
     */
    const menuSection = document.querySelector('#menu');
    if (menuSection) {
        menuSection.addEventListener('click', (event) => {
            // Cible le lien <a> qui contient un attribut data-signe
            const link = event.target.closest('a[data-signe]');
            
            // Si on n'a pas cliqué sur un lien de signe, on arrête
            if (!link) {
                return;
            }

            // On empêche la navigation par défaut pour construire notre propre URL
            event.preventDefault();

            // 1. On récupère le signe du lien cliqué
            const signe = link.dataset.signe;

            // 2. On trouve le filtre actif pour déterminer la période
            const activeFilter = document.querySelector('#menu-flters .filter-active');
            let periode = 'daily'; // Période par défaut au cas où

            if (activeFilter) {
                const filterValue = activeFilter.dataset.filter.replace('.filter-', '');
                switch (filterValue) {
                    case 'jour':
                        periode = 'daily';
                        break;
                    case 'demain':
                        periode = 'tomorrow';
                        break;
                    case 'semaine':
                        periode = 'weekly';
                        break;
                    case 'annee':
                        periode = 'yearly';
                        break;
                }
            }

            // 3. On construit l'URL et on redirige
            if (signe && periode) {
                const url = `horoscope.html?signe=${signe}&periode=${periode}`;
                window.location.href = url;
            }
        });
    }

    /**
     * ### Logique pour la Barre de Navigation (le menu déroulant) ###
     *
     * Cette partie gère les clics dans le menu déroulant en haut de la page.
     * Elle trouve le signe en remontant dans la structure du menu.
     */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.addEventListener('click', (event) => {
            // Cible le lien qui contient une période (jour, semaine...)
            const periodLink = event.target.closest('a[data-periode]');
            
            // Si on n'a pas cliqué sur un lien de période, on arrête
            if (!periodLink) {
                return;
            }

            event.preventDefault();

            // 1. On récupère la période du lien cliqué
            const periode = periodLink.dataset.periode;
            let signe = null;

            // 2. On trouve le signe en remontant au parent "dropdown"
            const parentDropdown = periodLink.closest('li.dropdown');
            if (parentDropdown) {
                const signLink = parentDropdown.querySelector('a[data-signe]');
                if (signLink) {
                    signe = signLink.dataset.signe;
                }
            }
            
            // 3. On construit l'URL et on redirige
            if (signe && periode) {
                const url = `horoscope.html?signe=${signe}&periode=${periode}`;
                window.location.href = url;
            }
        });
    }
});