// On recupère les onglets ouverts dans le navigateur
chrome.tabs.query(
  {
    currentWindow: true,
    active: true,
  },
  (tabs) => {
    // Ajoute un évènement au bouton de sauvegarde
    document.getElementById("save-button").addEventListener("click", () => {
      // On recupère l'URL de l'onglet actif
      let url = tabs[0].url;

      // On recupère les liens sauvegardés dans le stockage local
      chrome.storage.local.get({ links: [] }, (data) => {
        // On ajoute le nouveau lien à la liste des liens sauvegardés
        data.links.push(url);

        // Stocke la nouvelle liste des liens dans le stockage local
        chrome.storage.local.set(
          {
            links: data.links,
          },
          () => {
            // On met à jour l'interface utilisateur avec la nouvelle liste de liens
            updateLinks(data.links);
          }
        );
      });
    });
  }
);

// On met à jour l'interface utilisateur avec la liste des liens sauvegardés
const updateLinks = (links) => {
  let linksList = document.getElementById("links-list");
  linksList.innerHTML = "";

  for (const link of links) {
    let linkItem = document.createElement("li");
    let navItem = document.createElement("a");
    navItem.href = link;
    let linkText = document.createTextNode(link);
    // linkItem.appendChild(linkText);
    navItem.appendChild(linkText);
    linkItem.appendChild(navItem);
    linksList.appendChild(linkItem);

    // Ecouteur d'évènement pour ouvrir un lien dans un nouveau onglet
    navItem.addEventListener("click", (event) => {
      event.preventDefault();
      chrome.tabs.create({ url: link });
    });

    // Ecouteur d'évènement pour previsualiser un lien au survol
    // navItem.addEventListener("mouseover", () => {
    //   chrome.tabs.captureVisibleTab((screenshotUrl) => {
    //     const previewImage = document.createElement("img");
    //     previewImage.src = screenshotUrl;
    //     linksList.appendChild(previewImage);
    //   });
    // });

    
  }
};

// ON recupère tout les liens stockés dans notre navigateur chrome
initLinks();

// Ecouteur d'évènement pour effacer tout les liens stockés
document.getElementById("clear").addEventListener("click", clearLinksStorage());

// Fonction pour vider tout les liens stockés dans le stockage de chrome
function clearLinksStorage() {
    return () => {
        chrome.storage.local.clear();
        initLinks();
    };
}

// Fonction pour initialiser la liste des liens
function initLinks() {
  chrome.storage.local.get({ links: [] }, (data) => {
    // On ajoute le nouveau lien à la liste des liens sauvegardés
    updateLinks(data.links);
  });
}
