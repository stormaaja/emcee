# Harjoitustyön tiedot

## Ryhmä
Matti Ahinko
matti.ahinko (ät) gmail.com

## Kieli

Kieli on yksinkertainen C-JavaScript-Java-hybridikieli. Syntaksi on ehkä lähelle
C:tä, mutta mukana on esimerkiksi merkkijonot ja paljon ominaisuuksia puuttuu.

## Kohdekieli

Kohdekieli on joko ES5-JS tai WebAssembly. Tämä tarkentuu myöhemmin.

## Työkalut

Isäntäkielenä on JavaScript (NodeJS, ES5).

Parserigeneraattorina toimii Jison.

[Lista käytetyistä teknologioista](README.md#Technologies) löytyy README:sta.

## Testaus

Kääntäjää testataan läpi sen kehityksen. Aluksi selaajaa varten luodaan kokoelma
ohjelmakoodin pätkiä. Näitä tiedostoja käytään myös muiden vaiheiden
testaamisessa.

Ohjelmakoodin testauksessa käytetään unit.js-kirjastoa. Tämän lisäksi
testauksessa hyödynnetään node-projektin run-skriptejä. Ohjelmaa varten luodaan
skriptejä, jotka kääntävät esimerkkikoodit ja tarkastelevat mahdollisia
kääntäjän palauttamia virheilmoituksia.

## Opintopistemäärätavoite

Kokonaisopintopistemäärätavoite on 5-8, riippuen lopullisen toteutuksen
laajuudesta ja kohdekielen lopullisesta valinnasta.

### Perusominaisuudet

- [X] lukukelpoinen (ei binäärimössöä)
- [X] kommentit
- [X] kokonaislukuaritmetiikka (infix-syntaksilla, ellei erikseen muuta sovita)
- [X] valintojen tekeminen (if tms)
- [X] toisto (silmukat, rekursio tms)
- [X] muuttujat
- [X] jonkinlainen syötteen välitys vähintään ohjelman alussa, esim. muuttujille
   alkuarvot
- [X] jonkinlainen tulostus vähintään ohjelman lopussa, esim. muuttujien
   loppuarvot
Yhteensä 3 op

### Lisäominaisuudet

- [ ] aliohjelmat, joille voi viedä parametreja ja joissa voi käyttää paikallisia
   muuttujia, rekursiolla (1 op)
- [ ] yksiulotteiset taulukot (0,25 op)
- [ ] merkkijonosyöte ja -tulostus (0,5 op)
- [X] staattinen tyypintarkastus, yksinkertaiset tyypit (1 op)

Yhteensä 2,75 op

### Toteutustekniikat

- [ ] Webassembly 2 op

Yhteensä 2 op

# Aikataulusuunnitelma

Toteutus tapahtuu inkrementtipohjaisesti.

Aikataulu on aika joustava ja väljä erinäisistä syistä, jotka on ilmoitettu
erikseen. Aikataulu tarkentuu myös toteutettavien ominaisuuksien vahvistuksen
jälkeen.

## 1. inkrementti

13.11.2018 - 28.11.2018

- Työkalujen valinta
- Parseri
  - Tiedostonlukija
  - Selaaja
  - Jäsentäjä

## 2. inkrementti

29.11.2018 - 31.1.2018

- Syntaktinen analyysi
- Kontekstinen analyysi
- AST
. Tulkki
- Kohdekielen selvitykset
- Yksinkertaiset virheviestit

## 3. inkrementti

31.1.2018 - 15.2.2019

- Koodin generointi
- Yksinkertainen virheidenhallinta

## 4. inkrementti

16.2.2019 - 28.2.2019

- Virheidenhallinta
- Optimoinnit

## 5. inkrementti

1.3.2019 - 12.3.2019

- Kääntäjän viimeistelyt
- Harjoitustyön palautus
