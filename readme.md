# Simulation

## How to test

Install NodeJS v20 or more.

Install packages
```
npm i
```

Run script
```
npm start
```



Types de défis :
* Boucle : chemin continu entre 3 (triangle), 4(losange) ou 6(hexagone) tuiles.
* Ligne droite : chemin continu en ligne droite entre 3, 4 ou 5 tuiles.
* Même couleur : (série de neurones de même couleurs qui se suivent) 2, 3 ou 4 tuiles d'une couleur au choix ou imposée.
* Connexion : relier deux tuiles d'une couleur au choix ou imposée à une distance de 1 à 5 tuiles d’écart.
* Arc-en-ciel : relier exactement 5 tuiles de 5 couleurs différentes.
* Alternance chromatique : séquence de 3, 4 ou 5 tuiles avec 2 couleurs en alternance.
* Floor is Lava : relier au moins 5, 6, 7 ou 8 tuiles sans toucher une tuile d'une couleur définie.