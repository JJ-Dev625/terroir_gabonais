let countProduits = 1; // Un produit est déjà présent dans le tableau HTML

// GESTION NAVIGUABLE DES ONGLETS DE LA SIDEBAR GAUCHE
function ouvrirOnglet(evenement, idOngletCible) {
  // 1. Masquer tous les panneaux de contenu
  const contenus = document.getElementsByClassName("tab-content");
  for (let i = 0; i < contenus.length; i++) {
    contenus[i].classList.remove("active");
  }

  // 2. Enlever l'état actif (sélectionné) de tous les boutons de la sidebar
  const boutonsSidebar = document.querySelectorAll(".sidebar-menu .tab-btn");
  boutonsSidebar.forEach((btn) => btn.classList.remove("active"));

  // 3. Afficher le panneau de contenu cible
  document.getElementById(idOngletCible).classList.add("active");

  // 4. Mettre en surbrillance le bouton sur lequel on a cliqué
  evenement.currentTarget.classList.add("active");
}

// COMPORTEMENTS ENVERS LE FORMULAIRE ET LE STOCK (INTERACTION DYNAMIQUE)
document.addEventListener("DOMContentLoaded", function () {
  const formulaire = document.getElementById("add-product-form");

  if (formulaire) {
    formulaire.addEventListener("submit", function (e) {
      e.preventDefault();

      // Gestion des identifiants et incrémentation
      countProduits++;
      const idUnique = "row-" + countProduits;

      // Récupération des informations saisies par le distributeur
      const nom = document.getElementById("p-nom").value;
      const prix = document.getElementById("p-prix").value;
      const stock = document.getElementById("p-stock").value;
      const loc = document.getElementById("p-loc").value;

      const tbody = document.getElementById("supplier-stock-list");
      const nouvelleLigne = document.createElement("tr");
      nouvelleLigne.id = idUnique;

      // Structure HTML de la nouvelle ligne (avec labels responsives)
      nouvelleLigne.innerHTML = `
                <td data-label="Nom du produit"><b>${nom}</b></td>
                <td data-label="Tarification & Quantité">${parseInt(prix).toLocaleString()} FCFA (${stock} pièces dispo)</td>
                <td data-label="Provenance / Cueillette">${loc}</td>
                <td data-label="Filière"><span class="status-badge status-local">Filière Gabonaise</span></td>
                <td data-label="Action">
                    <button class="btn-delete" data-id="${idUnique}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;

      // Injection en tête de liste
      tbody.insertBefore(nouvelleLigne, tbody.firstChild);

      // Rafraîchissement du compteur numérique global
      document.getElementById("products-count").innerText = countProduits;

      alert(`Félicitations ! Le produit "${nom}" a bien été mis en ligne.`);
      formulaire.reset();

      // Retour de focus fluide vers le premier onglet (Stock & Suivi)
      const premierBouton = document.querySelector(".sidebar-menu .tab-btn");
      if (premierBouton) premierBouton.click();
    });
  }

  // RETRAIT D'UN PRODUIT (DÉLÉGATION DE CLIC ÉCOLOGIQUE SUR LE BODY)
  document.body.addEventListener("click", function (e) {
    const btnDelete = e.target.closest(".btn-delete");
    if (btnDelete) {
      const idLigne = btnDelete.getAttribute("data-id");
      if (
        confirm("Voulez-vous retirer cette ressource forestière du catalogue ?")
      ) {
        const ligneAEnlever = document.getElementById(idLigne);
        if (ligneAEnlever) {
          ligneAEnlever.remove();
          countProduits--;
          document.getElementById("products-count").innerText = countProduits;
        }
      }
    }
  });
});
