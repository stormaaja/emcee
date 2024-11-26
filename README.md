# emCee

**! This repository is archived and development is discontinued !**

emCee on C/JS/Java-tyyppinen kieli. Tässä repositoriossa on kielen tulkki.

## Ryhmä

Matti Ahinko

## Teknologiat

- [Node](https://nodejs.org/en/)
- [Jison](http://zaa.ch/jison/)
- [Jest](https://jestjs.io)

## Vaatimukset

Sovellus on testattu ja kehitetty Node 11.2.0 versiolla.

Muiden versioiden toimivuudesta ei ole takuuta.

## Kääntäminen

Kääntäjä (tai tässä tapauksessa tulkki) on kehitetty JavaScriptillä eikä sitä
tässä tapauksessa tarvitse erikseen kääntää.

## Riippuvuuksien asentaminen

Ennen tulkin käyttöä tulee asentaa projektin riippuvuudet komennolla

    npm install

## Käyttö

Tulkkia käytetään `--eval`-vivulla. Esimerkiksi examples-kansiossa olevan
lähdekooditiedoston suoritus:

    node src/emcee.js examples/eval_advanced.emc --eval

Ilman `--eval`-vipua lähdekoodi parsitaan ja luetaan syntaksipuuksi.

Jos `main`-funktiolle on määritelty argumentit (string array), niin nämä arvot
luetaan myös. Kaikki komentorivin paremetrit, jotka eivät ole `--`-vipuja tai
tiedostonnimiä (*.emc) tulkitaan parametreiksi funktiolle. Tätä voi testata
`examples/eval_params.emc`-lähdekoodilla.

## Testit

Kääntäjän kehitystä varten on luotu useita erilaisia testejä. Nämä voit ajaa
komennolla

    npm test

## Esimerkkilähdekoodit

Esimerkkilähdekoodit voit suorittaa yhdellä kertaa komennolla

    npm run compile examples


## Lintterit

Lintterin (ES5) voit suorittaa komennolla

    npm run lint

## Lisenssi

MIT License

Copyright (c) 2018-2019 Matti Ahinko
