// Sécurité rafraîchissement cache local
localStorage.removeItem("stocks_nyoni");

const catalogueInitial = [
  {
    id: 1,
    nom: "Chenilles d'Odika de l'Ivindo",
    type: "chenille",
    origine: "Ogooué-Ivindo",
    prix: "5 000 FCFA",
    stock: 40,
    image: "../images/6.png",
  },
  {
    id: 2,
    nom: "Chenilles de l'Arbre à Pain",
    type: "chenille",
    origine: "Woleu-Ntem",
    prix: "4 500 FCFA",
    stock: 65,
    image: "../images/4.png",
  },
  {
    id: 3,
    nom: "Chenilles Rouges de l'Ogooué",
    type: "chenille",
    origine: "Ogooué-Lolo",
    prix: "6 000 FCFA",
    stock: 22,
    image: "../images/3.png",
  },
  {
    id: 4,
    nom: "Vers à Soie Secs de Palmier",
    type: "ver",
    origine: "Moyen-Ogooué",
    prix: "7 500 FCFA",
    stock: 15,
    image: "../images/2.png",
  },
  {
    id: 5,
    nom: "Vers à Soie Vivants de la Nyanga",
    type: "ver",
    origine: "Nyanga",
    prix: "8 000 FCFA",
    stock: 18,
    image: "../images/2.png",
  },
  {
    id: 6,
    nom: "Miel Pur Sauvage Extrait à Froid",
    type: "miel",
    origine: "Woleu-Ntem",
    prix: "7 000 FCFA",
    stock: 50,
    image: "../images/m.png",
  },
  {
    id: 7,
    nom: "Miel Ambré de Ndendé",
    type: "miel",
    origine: "Ngounié",
    prix: "8 500 FCFA",
    stock: 12,
    image: "../images/1.png",
  },
  {
    id: 8,
    nom: "Miel de Savane Doré",
    type: "miel",
    origine: "Haut-Ogooué",
    prix: "6 500 FCFA",
    stock: 30,
    image: "../images/5.png",
  },
  {
    id: 9,
    nom: "Miel de Moucherons de Kango (Rare)",
    type: "moucheron",
    origine: "Estuaire",
    prix: "12 000 FCFA",
    stock: 8,
    image: "../images/1.png",
  },
  {
    id: 10,
    nom: "Élixir de Moucheron de Mandji",
    type: "moucheron",
    origine: "Ogooué-Maritime",
    prix: "14 000 FCFA",
    stock: 5,
    image: "../images/m.png",
  },
];

const fichesRecettes = [
  {
    id: "r1",
    titre: "Mijoté de Chenilles à l'Odika",
    prix: "1 500 FCFA",
    image: "../images/p3.png",
  },
  {
    id: "r2",
    titre: "Brochettes de Vers de Palmier au Miel",
    prix: "2 000 FCFA",
    image: "../images/p2.png",
  },
];

if (!localStorage.getItem("stocks_nyoni")) {
  localStorage.setItem("stocks_nyoni", JSON.stringify(catalogueInitial));
}

function afficherCatalogue(produits) {
  const grille = document.getElementById("product-grid");
  if (!grille) return;
  grille.innerHTML =
    produits.length === 0 ? "<p>Aucun produit trouvé.</p>" : "";

  produits.forEach((p) => {
    grille.innerHTML += `
            <div class="card">
                <img src="${p.image}" alt="${p.nom}" class="card-img">
                <div class="card-body">
                    <span class="card-tag">📍 ${p.origine}</span>
                    <h3>${p.nom}</h3>
                    <p class="quantity-tag">Stock : <b>${p.stock}</b> dispo(s)</p>
                    <div class="card-footer-flex">
                        <div class="price">${p.prix}</div>
                        <button onclick="ajouterAuPanierDirect(${p.id})" class="btn btn-primary">🛒 Ajouter</button>
                    </div>
                </div>
            </div>
        `;
  });
}

function afficherRecettes() {
  const grilleRecette = document.getElementById("recipe-grid");
  if (!grilleRecette) return;
  grilleRecette.innerHTML = fichesRecettes
    .map(
      (r) => `
        <div class="card">
            <img src="${r.image}" alt="${r.titre}" class="card-img">
            <div class="card-body">
                <span class="card-tag">🍳 GASTRONOMIE</span>
                <h3>${r.titre}</h3>
                <div class="card-footer-flex">
                    <div class="price">${r.prix}</div>
                    <button class="btn btn-secondary" onclick="ajouterRecetteAuPanier('${r.id}', '${r.titre}', '${r.prix}')">Acheter</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function filtrerProduits() {
  const texteSaisi = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filtreType = document.getElementById("filter-select").value;
  const complet = JSON.parse(localStorage.getItem("stocks_nyoni"));

  const resultat = complet.filter((p) => {
    const correspondTexte =
      p.nom.toLowerCase().includes(texteSaisi) ||
      p.origine.toLowerCase().includes(texteSaisi);
    const correspondType = filtreType === "tous" || p.type === filtreType;
    return correspondTexte && correspondType;
  });
  afficherCatalogue(resultat);
}

function ajouterAuPanierDirect(id) {
  const complet = JSON.parse(localStorage.getItem("stocks_nyoni"));
  const produit = complet.find((p) => p.id === id);
  let panier = JSON.parse(localStorage.getItem("panier_nyoni")) || [];

  const itemExistant = panier.find((item) => item.id === id && !item.isRecette);
  if (itemExistant) {
    itemExistant.quantite += 1;
  } else {
    panier.push({
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      quantite: 1,
      isRecette: false,
    });
  }

  localStorage.setItem("panier_nyoni", JSON.stringify(panier));
  mettreAjourBadgePanier();
  alert("Article ajouté au panier !");
}

function ajouterRecetteAuPanier(id, titre, prix) {
  let panier = JSON.parse(localStorage.getItem("panier_nyoni")) || [];
  const itemExistant = panier.find((item) => item.id === id && item.isRecette);

  if (!itemExistant) {
    panier.push({
      id: id,
      nom: titre,
      prix: prix,
      quantite: 1,
      isRecette: true,
    });
    localStorage.setItem("panier_nyoni", JSON.stringify(panier));
    mettreAjourBadgePanier();
    alert("Fiche recette ajoutée !");
  } else {
    alert("Déjà dans le panier.");
  }
}

function mettreAjourBadgePanier() {
  const panier = JSON.parse(localStorage.getItem("panier_nyoni")) || [];
  const total = panier.reduce((acc, item) => acc + item.quantite, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = total;
}

window.onscroll = function () {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

function remonterEnHaut() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("open");
}

window.onload = function () {
  afficherCatalogue(JSON.parse(localStorage.getItem("stocks_nyoni")));
  afficherRecettes();
  mettreAjourBadgePanier();
};
