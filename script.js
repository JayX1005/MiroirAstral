document.addEventListener("DOMContentLoaded", function () {
    const newsletterContainer = document.getElementById("newsletter-container");
    const navbar = document.getElementById("navbar");

    // Sélectionnez l'élément image du signe
    const signImage = document.getElementById("sign-image");
    // Sélectionnez l'élément <span> pour le titre de la newsletter (modifié de <p> à <span> pour une meilleure sémantique)
    const horoscopeTitleSpan = document.getElementById("horoscope-title");
    // Sélectionnez l'élément pour le spinner de chargement
    const loadingSpinner = document.getElementById("loading-spinner");

    // --- Fonction pour analyser les paramètres d'URL ---
    function getUrlParams() {
        const params = {};
        window.location.search.substring(1).split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });
        return params;
    }

    // Fonction pour obtenir la semaine ISO
    function getWeekNumber(date) {
        const d = new Date(date.getTime());
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        const week1 = new Date(d.getFullYear(), 0, 4);
        return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    // Fonction pour obtenir la saison
    function getSeason(month) { // month est 0-indexed (0=Jan, 11=Dec)
        if (month >= 2 && month <= 4) return "spring";
        if (month >= 5 && month <= 7) return "summer";
        if (month >= 8 && month <= 10) return "autumn";
        return "winter";
    }

    // Fonction principale pour charger la newsletter
    function loadNewsletter(signe, periode) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let filename = "";
        let folder = periode;

        const dateForFilename = new Date();
        let currentYear = dateForFilename.getFullYear();
        let currentMonth = String(dateForFilename.getMonth() + 1).padStart(2, '0');
        let currentDay = String(dateForFilename.getDate()).padStart(2, '0');

        // Mettre à jour l'image du signe
        if (signImage) {
            // Assurez-vous que le chemin 'assets/img/signes/' est correct par rapport à horoscope.html
            signImage.src = `assets/img/signes/${signe}.png`;
            signImage.alt = `Image du signe ${signe.charAt(0).toUpperCase() + signe.slice(1)}`;
        } else {
            console.warn("L'élément 'sign-image' n'a pas été trouvé. L'image du signe ne sera pas mise à jour.");
        }

        // Mettre à jour le titre à l'intérieur de la newsletter-box
        if (horoscopeTitleSpan) {
            let displayedSign = signe.charAt(0).toUpperCase() + signe.slice(1);
            let displayedPeriode = "";


// --- Mise à jour dynamique du <title> et <meta description> ---
const pageTitle = `Horoscope ${displayedPeriode} pour ${displayedSign} - ${new Date().toLocaleDateString('fr-FR')}`;
document.title = pageTitle;

let metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) {
    metaDesc.setAttribute(
        "content",
        `Découvrez l'horoscope ${displayedPeriode} du ${new Date().toLocaleDateString('fr-FR')} pour ${displayedSign} : amour, travail, finances et conseils cosmiques.`
    );
}





            switch (periode) {
                case "daily":
                    displayedPeriode = "du jour";
                    break;
                case "tomorrow":
                    displayedPeriode = "de demain";
                    break;
                case "weekly":
                    displayedPeriode = "de la semaine";
                    break;
                case "monthly":
                    displayedPeriode = "du mois";
                    break;
                case "seasonal":
                    displayedPeriode = "de la saison";
                    break;
                case "yearly":
                    displayedPeriode = "de l'année";
                    break;
                default:
                    displayedPeriode = "";
            }
            horoscopeTitleSpan.textContent = `Horoscope ${displayedPeriode} pour ${displayedSign}`;
        } else {
            console.warn("L'élément 'horoscope-title' n'a pas été trouvé. Le titre ne sera pas mis à jour.");
        }

        // Déterminer le nom de fichier basé sur la période
        switch (periode) {
            case "daily":
                filename = `${currentYear}-${currentMonth}-${currentDay}-${signe}.html`;
                break;
            case "tomorrow":
                dateForFilename.setDate(dateForFilename.getDate() + 1); // Avance d'un jour
                currentMonth = String(dateForFilename.getMonth() + 1).padStart(2, '0');
                currentDay = String(dateForFilename.getDate()).padStart(2, '0');
                filename = `${currentYear}-${currentMonth}-${currentDay}-${signe}.html`;
                folder = "daily"; // Assurez-vous que vos fichiers de demain sont aussi dans le dossier 'daily' si c'est le cas
                break;
            case "weekly":
                const weekNumber = getWeekNumber(today);
                filename = `${yyyy}-W${String(weekNumber).padStart(2, '0')}-${signe}.html`;
                break;
            case "monthly":
                const mmMonthly = String(today.getMonth() + 1).padStart(2, '0');
                filename = `${yyyy}-${mmMonthly}-${signe}.html`;
                break;
            case "seasonal":
                const season = getSeason(today.getMonth());
                filename = `${yyyy}-${season}-${signe}.html`;
                break;
            case "yearly":
                filename = `${yyyy}-${signe}.html`;
                break;
            default:
                newsletterContainer.innerHTML = "<p>Période non valide.</p>";
                console.warn(`Période non gérée: ${periode}`);
                return;
        }

        const path = `newsletters/${folder}/${filename}`;
        console.log(`Tentative de chargement : ${path}`);

        // Afficher le spinner et cacher le contenu précédent
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        if (newsletterContainer) newsletterContainer.style.display = 'none';
        
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Horoscope non trouvé pour ${signe.charAt(0).toUpperCase() + signe.slice(1)} - ${periode}. Vérifiez le nom du fichier et le chemin : ${path}`);
                    } else {
                        throw new Error(`Erreur de chargement : ${response.status} ${response.statusText} pour ${path}`);
                    }
                }
                return response.text();
            })
            .then(html => {
                newsletterContainer.innerHTML = html;
            })
            .catch(error => {
                newsletterContainer.innerHTML = `<p>${error.message}</p><p>Veuillez vérifier vos sélections ou revenir plus tard.</p>`;
                console.error("Erreur lors du chargement de l'horoscope :", error);
            })
            .finally(() => {
                // Toujours cacher le spinner et afficher le conteneur de newsletter, qu'il y ait eu une erreur ou non
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (newsletterContainer) newsletterContainer.style.display = 'block';
            });
    }

    // --- Chargement initial basé sur les paramètres d'URL ou par défaut ---
    const urlParams = getUrlParams();
    const initialSigne = urlParams.signe;
    const initialPeriode = urlParams.periode;

    if (initialSigne && initialPeriode) {
        console.log(`Chargement initial via URL : Signe=${initialSigne}, Période=${initialPeriode}`);
        loadNewsletter(initialSigne, initialPeriode);
    } else {
        // Si aucun paramètre n'est fourni, chargez un horoscope par défaut
        console.log("Aucun paramètre trouvé dans l'URL. Chargement de l'horoscope par défaut (Bélier - jour).");
        loadNewsletter("belier", "daily"); // Exemple par défaut
    }

    // --- Gestion des clics sur la navbar à l'intérieur de horoscope.html ---
    if (navbar) {
        navbar.addEventListener("click", function(event) {
            console.log("Clic sur la navbar (horoscope.html):", event.target);
            const clickedLink = event.target.closest('a[data-periode]');

            if (clickedLink) {
                event.preventDefault();

                const periode = clickedLink.dataset.periode;
                let signe = null;

                let parentLi = clickedLink.closest('li.dropdown');

                if (parentLi) {
                    const signeLink = parentLi.querySelector('a[data-signe]');
                    if (signeLink) {
                        signe = signeLink.dataset.signe;
                    }
                }

                console.log("Signe trouvé (navbar horoscope.html) :", signe);
                console.log("Période trouvée (navbar horoscope.html) :", periode);

                if (signe && periode) {
                    loadNewsletter(signe, periode);
                } else {
                    console.warn("Impossible de déterminer le signe ou la période depuis la navbar interne.");
                    newsletterContainer.innerHTML = "<p>Sélection invalide. Veuillez réessayer.</p>";
                }
            }
        });
    }

    // --- Injection dynamique du JSON-LD pour SEO ---
    (function() {
        const params = new URLSearchParams(window.location.search);
        const signe = params.get("signe") || "belier";
        const periode = params.get("periode") || "daily";

        const periodeLabel = {
            daily: "du jour",
            tomorrow: "de demain",
            weekly: "de la semaine",
            monthly: "du mois",
            seasonal: "de la saison",
            yearly: "de l'année"
        }[periode];

        const title = `Horoscope ${periodeLabel} pour ${signe.charAt(0).toUpperCase() + signe.slice(1)}`;
        const description = `Découvrez votre horoscope ${periodeLabel} complet pour ${signe.charAt(0).toUpperCase() + signe.slice(1)} : amour, travail, finances et énergie astrale.`;

        const jsonLD = {
            "@context": "https://schema.org",
            "@type": "Horoscope",
            "name": title,
            "description": description,
            "datePublished": new Date().toISOString().split("T")[0],
            "sign": signe.charAt(0).toUpperCase() + signe.slice(1),
            "date": new Date().toISOString().split("T")[0],
            "inLanguage": "fr",
            "publisher": {
                "@type": "Organization",
                "name": "Miroir Astral",
                "url": "https://www.miroirastral.com",
                "logo": "https://www.miroirastral.com/assets/img/logo/L7.png"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://www.miroirastral.com/horoscope.html?signe=${signe}&periode=${periode}`
            }
        };

        const scriptTag = document.createElement("script");
        scriptTag.type = "application/ld+json";
        scriptTag.text = JSON.stringify(jsonLD);
        document.head.appendChild(scriptTag);
    })();

});