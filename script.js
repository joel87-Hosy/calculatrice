const ecran = document.querySelector("#ecran");
const boutons = document.querySelectorAll(".bouton");
const boutonClear = document.querySelector(".supp");

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
    // Si un résultat vient d'être affiché, le retour arrière efface tout
    if (resultatAffiche) {
        effacer();
        return;
    }

    // On retire le tout dernier caractère de la chaîne
    calcul = calcul.slice(0, -1);

    // On met à jour l'écran (si calcul est vide, afficher "0")
    afficher(calcul);
}

function effacer() {
    calcul = "";
    resultatAffiche = false;
    afficher("0");
}

boutons.forEach((bouton) => {
    bouton.addEventListener("click", () => {
        const valeur = bouton.textContent.trim();

        if (valeur === "=") {
            calculer();
        } else if (valeur === "⌫") {
            retourArriere();    
        } else {
            ajouterValeur(valeur);
        }
    });
});

boutonClear.addEventListener("click", effacer);
