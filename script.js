const ecran = document.querySelector("#ecran");
const boutons = document.querySelectorAll(".bouton");

let calcul = "";
let resultatAffiche = false;

function afficher(valeur) {
    ecran.textContent = valeur || "0";
}

function estOperateur(valeur) {
    return ["+", "-", "*", "/"].includes(valeur);
}

function ajouterValeur(valeur) {
    const dernierCaractere = calcul.slice(-1);

    if (resultatAffiche && !estOperateur(valeur)) {
        calcul = "";
    }

    resultatAffiche = false;

    if (valeur === ".") {
        const nombreActuel = calcul.split(/[+\-*/]/).pop();
        if (nombreActuel.includes(".")) {
            return;
        }
    }

    if (estOperateur(valeur)) {
        if (calcul === "" && valeur !== "-") {
            return;
        }

        if (estOperateur(dernierCaractere)) {
            calcul = calcul.slice(0, -1);
        }
    }

    calcul += valeur;
    afficher(calcul);
}

function calculer() {
    if (calcul === "" || estOperateur(calcul.slice(-1))) {
        return;
    }

    try {
        const resultat = Function(`"use strict"; return (${calcul})`)();

        if (!Number.isFinite(resultat)) {
            afficher("Erreur");
            calcul = "";
            return;
        }

        calcul = String(Number(resultat.toFixed(10)));
        afficher(calcul);
        resultatAffiche = true;
    } catch (error) {
        afficher("Erreur");
        calcul = "";
    }
}

function retourArriere() {
    if (resultatAffiche) {
        effacer();
        return;
    }

    calcul = calcul.slice(0, -1);
    afficher(calcul);
}

function effacer() {
    calcul = "";
    resultatAffiche = false;
    afficher("0");
}

function gererAction(valeur) {
    if (valeur === "=") {
        calculer();
    } else if (valeur === "DEL") {
        retourArriere();
    } else if (valeur === "AC") {
        effacer();
    } else {
        ajouterValeur(valeur);
    }
}

boutons.forEach((bouton) => {
    bouton.addEventListener("click", () => {
        gererAction(bouton.dataset.value);
    });
});

document.addEventListener("keydown", (event) => {
    const touche = event.key;

    if (/^[0-9.]$/.test(touche) || estOperateur(touche)) {
        gererAction(touche);
        return;
    }

    if (touche === "Enter" || touche === "=") {
        event.preventDefault();
        gererAction("=");
    } else if (touche === "Backspace") {
        gererAction("DEL");
    } else if (touche === "Escape") {
        gererAction("AC");
    }
});
