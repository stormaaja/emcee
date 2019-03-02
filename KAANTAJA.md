Kääntäjä, tai tässä tapauksessa tulkki, koostuu kolmesta osasta: Parseri, AST
ja kääntäjä.

Selaaja-parseri, joka on toteutettu Jisonilla. Parseri koostuu `src/parser.js`
ja `src/emcee.jison` -tiedostoista. Ensimmäinen näistä luo parseri-objektin ja
suorittaa parsinnan. Jälkimmäinen on Jison-lähdekoodi, jossa määritellään
generoitava parseri. Lähdekoodissa on osittain Bison-syntaksia ja osittain
JavaScriptiä. Jälkimmäisen avulla voidaan generoida syntaksipuu.

Syntaksipuu (AST) löytyy `src/ast.js`-tiedostosta. Tiedosto sisältää noodien
generointifunktion, joka luo noodi-objektin parserin antamien tietojen
perusteella. Tiedoston sisältämät nodet osaavat tehdä tyyppitarkistuksen
(typeCheck-metodi) ja suorituksen (eval-metodi) itselleen sekä lapsinodeilleen.

Kääntäjän osuus on sijoitettu `src/compiler.js`-tiedostoon. Se kokoaa eri
vaiheet yhdeksi ja palauttaa lopputuloksena muun muassa syntaksipuun.

Kokonaisuuden orkestrointi tapahtuu `src/parser.js`-tiedostossa. Se kutsuu
kääntäjää ja esimerkiksi suorittaa tarvittaessa lähdekoodin (eval, tulkki).
Tiedostossa on toteutettu myös virheiden tulostus.
