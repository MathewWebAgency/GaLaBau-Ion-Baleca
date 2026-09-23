# Übergabe: Gartenprofi Baleca, Ion Baleca

> Nach außen heißt der Betrieb seit dieser Fassung **Gartenprofi Baleca**.
> Rechtlich bleibt es **Gartenpflege Maria MD**; dieser Name steht im Impressum,
> in der Datenschutzerklärung und in `legalName` der Strukturdaten. Die Zeile
> dazu in der Fußzeile ist auf Wunsch des Kunden entfallen. Die Domain bleibt
> unverändert.

Stand 09.09.2026. Die Seite ist fertig gebaut und geprüft. Was hier steht, muss vor
dem Livegang passieren.

---

## 1. Was du noch brauchst

Alle diese Stellen sind auf der Seite **rot umrandet markiert** und lassen sich nicht
übersehen. Sie müssen ausgefüllt oder entfernt werden, bevor die Seite online geht.

| Wo | Was fehlt |
|---|---|
| `impressum.html` | Wer führt den Betrieb rechtlich? Die alte Seite sagt vorne Ion Baleca, im Impressum Maria Baleca |
| `impressum.html` | Umsatzsteuer-ID nach § 27a UStG, oder der Kleinunternehmer-Hinweis nach § 19 UStG |
| `impressum.html` | Verantwortlich für den Inhalt, Name und Anschrift |
| `datenschutz.html` | Name der verantwortlichen Person |
| `datenschutz.html` | Hosting-Anbieter mit Anschrift und tatsächliche Speicherdauer der Logfiles |
| `datenschutz.html` | Formspree-Hinweis, erledigt sich mit Abschnitt 2 |

**Die Startseite ist vollständig**, dort steht seit dem 23.09.2026 kein
Platzhalter mehr. Offen sind nur noch die sechs Stellen in Impressum und
Datenschutz.

Erfundene Zahlen kommen nicht auf die Seite. Lieber die Zeile streichen als raten.

## 2. Formular scharfschalten

Das Formular ist fertig gebaut, aber noch nicht verbunden. Solange die Kennung fehlt,
verschickt es nichts und weist die Besucher ehrlich auf Telefon und E-Mail hin.

1. Kostenloses Konto auf [formspree.io](https://formspree.io) anlegen.
2. Neues Formular erstellen, Empfängeradresse `info@gartenpflege-maria-md.de` eintragen.
3. Die Kennung aus der Formular-URL kopieren (der Teil hinter `/f/`).
4. In `assets/js/site.js`, Zeile 10, eintragen:
   ```js
   var FORMSPREE_ID = 'deineKennung';
   ```
5. Im Formspree-Konto den Auftragsverarbeitungsvertrag nach Art. 28 DSGVO abschließen.
   Ohne den ist die Nutzung datenschutzrechtlich nicht sauber, und die
   Datenschutzerklärung behauptet, dass es ihn gibt.
6. Selbst testen: Formular mit Foto abschicken und prüfen, ob es im Postfach ankommt.

## 3. Domain und Deploy

**Wenn die Domain `gartenpflege-maria-md.de` bleibt**, ist alles schon richtig
eingetragen. Wenn nicht, in diesen Dateien anpassen:

- `index.html`: `<link rel="canonical">`, `og:url`, `og:image` und die drei JSON-LD-Blöcke
- `robots.txt`: die Sitemap-Adresse
- `sitemap.xml`: die `<loc>`-Adresse

Danach hochladen. **Der Inhalt von `site/` kommt in das Wurzelverzeichnis der Domain**,
nicht der Ordner selbst. Also `index.html` liegt direkt unter `/`, nicht unter `/site/`.
Das ist wichtig, weil die 404-Seite mit wurzelabsoluten Pfaden arbeitet.

Nach dem Hochladen prüfen:

- [ ] `https://deine-domain.de/` lädt und sieht aus wie lokal
- [ ] `http://` leitet auf `https://` um
- [ ] `www.` leitet auf die Variante ohne `www` um
- [ ] Eine erfundene Adresse zeigt die eigene 404-Seite, nicht die von Hostinger
- [ ] `robots.txt` und `sitemap.xml` sind abrufbar
- [ ] Die Sicherheits-Kopfzeilen kommen an (mit den Entwicklerwerkzeugen prüfen)
- [ ] HSTS erst einschalten, wenn HTTPS nachweislich überall läuft. Die Zeile steht
      auskommentiert in `.htaccess`

### Wenn der Server 403 Forbidden zeigt

Ein 403 heißt: Der Server hat die Anfrage verstanden und verweigert sie. Warum, sagt er
nicht. Diese Punkte in dieser Reihenfolge prüfen, die ersten beiden decken fast alle
Fälle ab.

1. **Dateirechte.** Verzeichnisse brauchen 755, Dateien 644. Aus iCloud heraus stehen
   sie auf 700 und 600. Damit kommt der Webserver nicht an die Dateien und antwortet
   mit 403. Vor jedem Upload einmal laufen lassen:
   ```bash
   find site -type d -exec chmod 755 {} +
   find site -type f -exec chmod 644 {} +
   ```
   Ein FTP-Programm überträgt diese Rechte mit. Ist schon hochgeladen, im Dateimanager
   von hPanel nachziehen.

2. **Falscher Ordner.** Landet der Ordner `site` selbst in `public_html`, liegt unter
   `/` keine `index.html`. `Options -Indexes` verbietet dann das Auflisten, und daraus
   wird ein 403 statt einer Seite. Es muss der **Inhalt** von `site/` direkt in
   `public_html` liegen, also `public_html/index.html`.

3. **Reste der alten WordPress-Installation.** Unter `gartenpflege-maria-md.de` läuft
   derzeit noch WordPress (geprüft am 09.09.2026: HTTP 200, LiteSpeed, Hostinger). Vor
   dem Hochladen `public_html` leeren, sonst stehen sich zwei `.htaccess`-Dateien und
   die alte `index.php` im Weg. Vorher eine Sicherung ziehen.

4. **Schalter in hPanel.** Passwortschutz für Verzeichnisse, Wartungsmodus, eine
   „Coming soon“-Seite oder ein Sicherheits-Plugin aus der WordPress-Zeit liefern
   ebenfalls 403. In hPanel unter Sicherheit und unter Website nachsehen.

5. **Die `.htaccess` selbst.** Zum Ausschließen kurz umbenennen, etwa in
   `htaccess.aus`, und neu laden. Kommt die Seite dann, liegt es an einer Zeile darin,
   am ehesten an `Options -Indexes`, falls der Hoster `Options` nicht erlaubt.


## 4. Nach dem Livegang

- [ ] Google Search Console einrichten, Eigentum bestätigen, Sitemap einreichen
- [ ] Bing Webmaster Tools einrichten
- [ ] Google Unternehmensprofil pflegen. **Wichtig:** Name, Adresse und Telefonnummer
      müssen dort zeichengenau so stehen wie im Impressum. Abweichungen kosten
      Sichtbarkeit in der lokalen Suche
- [ ] PageSpeed Insights gegen die echte Domain laufen lassen. Die lokalen Messwerte
      schwankten zu stark, um sie als belastbar zu verkaufen, siehe Abschnitt 6

## 5. Was gemessen wurde

Alle Werte aus tatsächlichen Läufen, nicht geschätzt. **Die Lighthouse-Werte
stammen vom Stand vor dem Bildtausch am 09.09.2026 und sind seit dem Farb-, Schrift-
und Bildumbau vom 16.09.2026 erst recht überholt.** Struktur, Alternativtexte und
Kontraste haben sich nicht geändert, die Bilddateien schon. Vor dem Livegang gehören
sie einmal neu gemessen, siehe Abschnitt 4.

| Prüfung | Ergebnis |
|---|---|
| Lighthouse Accessibility | **100** (5 von 5 Läufen) |
| Lighthouse SEO | **100** (5 von 5 Läufen) |
| Lighthouse Best Practices | **100** (5 von 5 Läufen) |
| Layoutverschiebung CLS | **0** (jeder Lauf) |
| Blockierzeit TBT | 0 bis 20 ms |
| Ladegewicht Handy, ganze Seite durchgescrollt | 3,9 MB (Retina, ohne Serverkomprimierung) |
| Ladegewicht Rechner 1440px, ganze Seite | 4,4 MB (Retina, mit Hero-Video-Verzicht bei 2G) |
| `impeccable detect` | 0 Treffer auf allen 4 Seiten |
| Bilder ohne Alternativtext | 0 von 24 |
| Kontrastfehler | 0 auf allen 4 Seiten |
| Klickflächen unter 44 px | 0 (Fließtextlinks ausgenommen, WCAG 2.5.8) |
| Überschriften-Ebenensprünge | 0 |
| Interne Links geprüft | 74, kein Fehler |
| Bildlaufrate beim Hero-Scrollen | 60/s stabil, auch bei 6-fach gedrosselter CPU |

**Rückfallebenen selbst getestet:**
Ohne JavaScript vollständig lesbar und bedienbar. Bei reduzierter Bewegung ohne jede
Animation. Das Video lädt erst, wenn man es erreicht, beim Seitenstart gar nicht.

## 5b. Gelb und Dunkelgrün

Der Kunde mag Gelb zusammen mit einem dunklen Grün. Beides steht auf seinem
Firmenwagen, also ist nichts ausgesucht, sondern **aus der Fahrzeugbeschriftung
gemessen**.

| Rolle | Wert | Kontrast |
|---|---|---|
| Dunkelgrün, trägt die ganze Seite | `#0C2E1F` | |
| Helle Fläche, kühles Grüngrau | `#E9EBE4` | |
| Schrift hell | `#F4F6F1` | 13,1:1 auf Dunkelgrün |
| Schrift hell, leise | `#B6BEB2` | 7,4:1 auf Dunkelgrün |
| Schrift dunkel | `#141A13` | 15,1:1 auf Hell |
| Schrift dunkel, leise | `#4B5249` | 7,3:1 auf Hell |
| Gelb, einziger Akzent | `#F2B623` | 8,3:1 auf Dunkelgrün |

**Warum der cremefarbene Grund raus musste.** Die Fassung davor lief auf `#F1ECDE`.
Der Prüfer `npx impeccable detect` meldet dazu wörtlich: *"A warm cream or beige page
background has become the default tasteful AI surface, reached for by reflex."* Genau
das war passiert. Der neue helle Ton ist grünstichig statt gelbstichig und kommt aus
dem Licht auf Ions Heckenfotos.

**Die Regel, die eingehalten werden muss:** Gelb auf Hell ergibt nur 1,55:1. Es darf
dort als Fläche stehen, mit dunkelgrüner Schrift darauf, aber niemals als Schriftfarbe.

Von vier Akzentfarben ist eine übrig. Die Emotion kommt aus den Fotos, nicht aus der
Palette. Das ist die zweite Sache, die aus beiden Referenzen übernommen ist.

## 5a. Bilder und Marke

### Wie Bilder gebaut werden

Alle Bilder entstehen in einem Durchgang aus der Originaldatei, mit
`python3 .claude/bilder.py`. Die Aufträge stehen als Tabelle im Kopf der Datei:
Quelle, Zielname, Ausschnitt, Seitenverhältnis, Bildpunkt der stehen bleibt. Ein Aufruf
baut alles neu, `python3 .claude/bilder.py hero` nur die Aufträge mit „hero“ im Namen.

Zwei Regeln stecken darin, und beide sind der Grund, warum die erste Fassung matschig
aussah: **nie über die Originalgröße hinaus vergrößern**, und **nie ein zweites Mal
über eine schon verkleinerte Zwischendatei gehen**. Das Zuschneiden passiert jetzt
beim Bauen, nicht erst im Browser, dadurch enthält jede Datei genau die Bildpunkte,
die auch gezeigt werden.

### Die Marke

`python3 .claude/logo.py` zeichnet die Marke aus `_raw/neu/neu-06.jpg` nach. Aus der
Aufnahme werden zwei Masken gebaut, das ganze Zeichen und nur das Blattwerk, und
potrace übersetzt beide in Kurven. Daraus entstehen:

| Datei | wofür |
|---|---|
| `site/assets/img/marke-hell.svg` | Kopfleiste, Hero, Fuß, 404, also die dunklen Bänder |
| `site/assets/img/favicon.svg` | Browser-Reiter, Marke auf Kies |
| `site/assets/icon/icon-*.png` | Startbildschirm auf dem Telefon |
| `_marke/marke-hell.svg`, `_marke/marke-dunkel.svg` | für Ion: Briefbogen, Rechnung, Fahrzeug |

Als Vektor ist die Marke bei jeder Größe scharf und braucht kein Kies-Feld mehr unter
sich, das vorher auf dem braunen Band als Kachel zu sehen war. Der Ordner `_marke`
gehört nicht auf den Server, sondern zum Kunden.

Wenn Ion irgendwann eine echte Vektordatei seines Logos hat, etwa vom Grafiker, sollte
die hier eingesetzt werden. Diese Fassung ist eine Nachzeichnung von einer Aufnahme,
gut genug für jede Bildschirmgröße, aber kein Ersatz für das Original.

### Sechs Kacheln sind hochgerechnet

Drei der Vergleiche, Garage, Hausecke und Grundstück, stammen aus **Bildschirmfotos von
Collagen**, die der Kunde geschickt hat. Die Collagen sind 900 × 1600 Bildpunkte groß,
jede Kachel darin also nur rund **450 Bildpunkte breit**. Für die Fläche, auf der sie
stehen, ist das zu wenig.

Diese sechs Kacheln sind deshalb mit **Topaz Image Upscale** vervierfacht worden
(über KIE, Modell `topaz/image-upscale`, Faktor 4). Die Originale liegen unter
`_work/up/`, die Aufträge dazu in `.claude/bilder.py`. Das Motiv bleibt unverändert,
es kommt nichts hinzu, was nicht fotografiert wurde, aber Kanten und Blattstrukturen
werden von Software ergänzt, nicht von der Kamera.

**Deshalb steht das jetzt auch so im Impressum**, unter „Bildnachweis". Der Satz „kein
Bild wurde künstlich erzeugt" wäre sonst nicht mehr richtig gewesen.

**Besser wäre trotzdem: die Originalfotos aus Ions Telefon**, einzeln, nicht als
Collage. Dann laufen sie durch dieselbe Verarbeitung wie alles andere, brauchen kein
Hochrechnen, und der Hinweis im Impressum kann wieder raus.

### Die Schriften

Ein Trio, alle lokal, keine Verbindung zu Google:

| Rolle | Schrift | Größe |
|---|---|---|
| Display | **Cabinet Grotesk** (Fontshare, ITF Free) | 27 KB |
| Fließtext | **Switzer** (Fontshare, ITF Free) | 27 KB |
| Auszeichnungen und Zahlen | **Martian Mono** (Google, OFL) | 20 KB |

Zusammen 74 KB, als variable Schnitte auf den deutschen Zeichenvorrat beschnitten.
Vorher waren es 138 KB in drei Serifen.

**Warum Playfair Display raus ist.** Die Schrift steht auf der Sperrliste des
Agentur-Skills, und der Skill hat recht: Playfair ist die Serife, die in fast jeder
maschinell gebauten Seite landet. Dasselbe galt für Archivo eine Runde davor. Der
Kunde hat beim Anblick der Seite sofort "billig und nach KI" gesagt, ohne den Grund
benennen zu können. Der Grund war die Schrift und die Fläche darunter.

Cabinet Grotesk ist keine neutrale Grotesk. Sie hat ein schmales, leicht nach innen
gezogenes "a", eine eigenwillige "g"-Schlinge und trägt bei 120px ohne zu zerfallen.
Genau das braucht der Größensprung unten.

**Der Größensprung ist das eigentliche Werkzeug.** Aus den beiden Referenzen des
Kunden (superpower.com, numa.uprock.pro) kommt vor allem eines: Überschrift sehr groß,
Text klein, nichts dazwischen. Beide Seiten setzen H1 zwischen 56 und 75px bei einer
Zeilenhöhe unter 1,0 und negativer Laufweite, und den Fließtext bei 15 bis 16px.

| | vorher | jetzt |
|---|---|---|
| H1 | 3,0 bis 7,4rem, Zeilenhöhe 0,95 | 2,55 bis 7,6rem, Zeilenhöhe 0,94, Laufweite -0,035em |
| H2 | 2,0 bis 4,0rem | 2,4 bis 5,1rem, Laufweite -0,034em |
| Fließtext | 1,125rem | 1rem |

**Keine Versalien, weiterhin.** Die Auszeichnungen laufen in der Mono, nicht in
gesperrten Großbuchstaben. Das Etikettenmuster bleibt abgeschafft.

### Foto anhängen

Das Formularfeld bietet zwei sichtbare Wege: **Foto aufnehmen** öffnet direkt die
Kamera (`capture="environment"`), **Aus der Galerie** die Bildauswahl. Der Kamera-Knopf
erscheint nur auf Geräten mit grobem Zeiger, weil er am Rechner nur denselben
Dateidialog öffnen würde. Ausgewählte Bilder stehen als Liste darunter, mit Größe und
einem Kreuz zum Entfernen; beide Wege schreiben über `DataTransfer` in dasselbe Feld,
die Grenze von drei Bildern und 8 MB gilt zusammengezählt. Ohne JavaScript bleibt das
Galeriefeld bedienbar und wird normal mitgeschickt.

### Bewegtbild im Hero

Hinter dem Hero läuft Ions eigene Aufnahme, tonlos, als zehn Sekunden lange Schleife
(`assets/video/rundgang-hero.mp4`, 720 × 1280, 1,06 MB). Sie ist mit ffmpeg aus den
ersten elf Sekunden von `rundgang.mp4` geschnitten; die letzte Sekunde blendet über die
erste, damit der Übergang beim Neustart nicht springt.

**Sie lädt bewusst spät und nur dort, wo sie etwas bringt.** Übersprungen wird sie:

- unter 861 Pixeln Breite, wo die Bildbahn nur ein schmales Band ist
- bei eingeschaltetem Datensparen oder einer als 2G gemeldeten Verbindung
- wenn im Betriebssystem weniger Bewegung eingestellt ist

Bis dahin und in all diesen Fällen trägt das Standbild. Das Video legt sich erst
darüber, wenn die Seite fertig geladen ist, und blendet über 1,4 Sekunden ein. Verlässt
der Hero das Bild, hält es an.

**Was ich nicht prüfen konnte:** ob die Schleife sauber läuft. Das Vorschaufenster hält
Videos an („paused to save power") und erfasst Video-Ebenen nicht in seinen Aufnahmen.
Geprüft sind die Datei (10 s, 720 × 1280, vollständig ladbar), die Auslieferung und die
Einblendlogik. **Bitte einmal in einem echten Browser ansehen.**

Der Rundgang-Abschnitt bleibt unverändert und zeigt weiterhin die vollen zwanzig
Sekunden zum Anklicken. Oben der Anreißer, unten das ganze Stück.

### Der Entwicklungsserver konnte keine Bereichsanfragen

`.claude/serve.mjs` meldete `Accept-Ranges: bytes`, beantwortete einen `Range`-Wunsch
aber mit der ganzen Datei, ohne Längenangabe und in Stücken. Damit bleibt jede
Videowiedergabe im Browser hängen. Der Server beantwortet jetzt Bereichsanfragen mit
`206` und `Content-Range`, liefert `Content-Length`, streamt statt zu puffern und
verweigert Pfade außerhalb von `site/`. Das betraf nur die lokale Vorschau, nicht den
echten Server.

### Bildgrößen: die sizes-Angaben waren zu großzügig

Nach dem Hochrechnen der Kacheln wog die Seite 6,2 MB. Ursache waren die
`sizes`-Angaben im HTML: dort stand für die Vorher-Nachher-Kacheln `50vw`, tatsächlich
ist eine Kachel bei 1119 Pixeln Fensterbreite **325 Pixel** breit, also 29vw. Der
Browser holte deshalb überall die größte Fassung.

Alle Angaben sind jetzt an der gerenderten Breite gemessen statt geschätzt, und die
Kacheln sind auf 1000 Pixel gedeckelt. Beim Hero-Bild kam eine Zwischenstufe bei 1280
dazu, weil die Bildbahn gemessen 43vw breit ist und auf einem 1440er Retina-Schirm
genau 1238 Bildpunkte braucht. Vorher sprang die Auswahl von 1200 auf 1600.

Ergebnis: **4,4 MB statt 6,2 MB** bei gleicher Darstellungsschärfe.

### Die Seite spricht in der Ich-Form

Der Text ist aus Ions Sicht geschrieben: „Ich komme vorbei, sage Ihnen was es kostet,
und mache es." Umgestellt wurden **nur die Stellen, an denen er vorher in der dritten
Person genannt war**, elf an der Zahl. Alles andere bleibt sachlich beschreibend.

Das ist Absicht: Auf der ganzen Seite stehen neun „ich" und fünf „mein", und der Name
fällt genau einmal, dort wo er hingehört („Mein Name ist Ion Baleca"). Häufte man das
Ich weiter, kippte der Ton ins Selbstverliebte. Wer weiterschreibt, sollte diese
Zurückhaltung halten: **die Handlung gehört Ion, der Nutzen gehört dem Leser.**

Bewusst **nicht** umgestellt, weil es dort keine Erzählung ist, sondern eine Angabe:

- **Alternativtexte der Bilder.** Sie beschreiben für Menschen, die das Bild nicht
  sehen, was darauf zu sehen ist. „Ion Baleca auf der Travertintreppe" ist dort richtig,
  „ich auf der Treppe" wäre unverständlich.
- **Titel, Beschreibung und Vorschautexte im Kopf der Datei.** Die stehen in
  Suchergebnissen und in Nachrichten-Vorschauen, wo der Name mehr hilft als ein „ich"
  ohne Kontext.
- **Impressum, Datenschutz und die maschinenlesbaren Daten.** Rechtstexte und
  strukturierte Daten sind Angaben über den Betrieb, keine Ansprache.

### Der Hero: der Schnitt

Zwei Aufnahmen aus Ions Telefon zeigen **dieselbe Thujahecke vom selben Bordstein**,
einmal ausgewachsen und einmal geschnitten. Dieselbe Laterne, dasselbe Pflaster,
dasselbe Haus im Hintergrund.

Daraus ist der Hero gebaut: unten liegt die wilde Aufnahme, darüber die geschnittene,
freigelegt von einer waagerechten gelben Klinge, die beim Scrollen nach unten fährt.
Wer scrollt, schneidet die Hecke.

Damit die Naht nicht springt, sind beide Ausschnitte in `.claude/bilder.py` so gesetzt,
dass die **Kante Pflaster/Hecke in beiden Bildern auf 60 Prozent der Bildhöhe liegt**.
Wer die Ausschnitte ändert, muss diese Regel mitrechnen, sonst versetzt sich das
Pflaster beim Wischen.

Zwei Werte steuern alles:

| Wert | Ort | Bedeutung |
|---|---|---|
| `--schnitt` | CSS-Variable auf `.hero` | 0 bis 100, wie weit der Schnitt durch ist |
| `RUHE = 40` | `site.js`, `heroSchnitt()` | wo der Schnitt nach dem Auftritt steht |

`RUHE` steht bewusst auf 40 und nicht tiefer: **oberhalb von rund 30 Prozent ist in
beiden Aufnahmen nur Himmel.** Ein Auftritt, der bei 18 stehen bleibt, zeigt gar
nichts, weil sich zwei Himmel nicht unterscheiden.

Der Schnitt ist nach zwei Dritteln der Hero-Höhe durch, damit die letzte Strecke
nicht als tote Bewegung weiterläuft.

Bei `prefers-reduced-motion` steht der Schnitt einfach schon bei 46 und bewegt sich
nicht. Das ist kein kaputter Zustand, sondern ein ruhiges Bild.

Die frühere schräge Materialkante zwischen allen Bändern ist **ersatzlos raus**. Sie
war auf jeder Sektion und hat dadurch nirgends mehr etwas bedeutet. Die einzige Kante
auf der Seite ist jetzt die Schnittkante, und die steht für den Heckenschnitt selbst.

### Das Laufband

Das Einzugsgebiet läuft als Band durch den unteren Hero-Rand, von allein, und wird
beim Scrollen kurz schneller (`--tempo`, gesetzt in `laufband()`).

`impeccable detect` meldet das als Anti-Pattern: *"Continuously auto-scrolling content
demands attention it has not earned."* **Der Befund bleibt bewusst offen.** Begründung:
der Kunde hat die bewegte Leiste ausdrücklich verlangt, der Inhalt sind zehn Ortsnamen
ohne Lesezwang, und dieselben Orte stehen unbewegt im Fußbereich und in den Fragen.
Der lesbare Kern des Einwands ist trotzdem behoben: **das Band hält bei Hover und bei
Tastaturfokus an**, und bei `prefers-reduced-motion` läuft es gar nicht, sondern wird
seitlich scrollbar.

### Musterseiten

Unter `site/_muster/` liegen Vergleichsseiten, mit denen Entscheidungen getroffen
wurden: `schriften.html` stellt vier Schriftrichtungen nebeneinander, `marke.html`
zeigt die Marke auf hellem und dunklem Grund. Der Ordner steht in `.gitignore` und
**gehört nicht auf den Server**. Vor dem Livegang löschen.

### Wer auf welchem Bild zu sehen ist

Das ist inzwischen geklärt, und es war ein echter Fehler in der vorigen Fassung: der
Mann mit dem orangefarbenen Helm auf der Leiter, der bis dahin das Hero-Bild war,
**ist nicht Ion**. Das Bild ist raus.

Ion ist der Mann im karierten Hemd mit grüner Latzhose, schwarzer Kappe und Brille.
Er ist auf dem Porträt im Abschnitt „Wer kommt" und im Video zu sehen, dieselbe
Person, deshalb ist das gesichert. Alle Alternativtexte, die ihn namentlich nennen,
beziehen sich nur noch auf diese beiden Stellen.

Zwei Aufnahmen zeigen weiterhin Personen, ohne jemanden zu benennen: im
Formschnitt-Vergleich hockt jemand im Hintergrund am Strauch, und im Video steht am
unteren Bildrand kurz ein zweiter Mann. Da steht kein Name, also auch keine falsche
Aussage.

### Neue Bilder in dieser Fassung

| Stelle | vorher | jetzt | Quelle |
|---|---|---|---|
| Hero | Leiter an der Eibe (falsche Person) | Weg an der Eibenhecke im Gegenlicht | `_raw/neu2/n2-10.jpg` |
| Vergleich 1 | Hofeinfahrt (markiert) | Hausgarten geräumt, Gewächshaus raus | `n2-07` / `n2-12` |
| Leistung 2 | Hecke an der Straße mit Person | Thujahecke am Straßenrand | `n2-13` |
| Leistung 3 | Beet im Abendlicht | Beet an der berankten Mauer | `n2-05` |
| Video | Rundgang durch einen Garten, 20 s | Ion sägt einen Stumpf ab, 11 s | Handyaufnahme |

Der Rundgang durch den fertigen Garten ist damit nicht verloren: er läuft weiterhin
als stille Bewegung hinter dem Hero (`assets/video/rundgang-hero.mp4`). Die lange
Fassung liegt unter `_work/video/rundgang-garten.mp4`, falls sie wieder gebraucht wird.

Der erste Vergleich ist damit eine echte, unbearbeitete Aufnahme aus Ions Telefon.
An den sechs hochgerechneten Kacheln weiter hinten (Garage, Hausecke, Grundstück)
ändert das nichts; der Hinweis im Impressum bleibt.

## 5d. Umbau vom 18.09.2026, zweite Runde

### Der Hero ist jetzt der Garten selbst

Statt der Heckenschnitt-Animation laeuft oben die Handyaufnahme des fertigen
Gartens, tonlos, als Schleife. Die Ueberschrift sagt nur "Schau dir das an.
Reden koennen wir danach." Alles Erklaerende steht darunter.

**Das Format der Aufnahme bestimmt die Flaeche, nicht umgekehrt.** Die Datei
ist 720 mal 1280 gross, also neun zu sechzehn, so wie sie aus dem Telefon
kommt. Genau in diesem Verhaeltnis steht sie auch auf der Seite. Die zweite
Spalte des Heros ist `auto` breit, der Film bekommt
`height:calc(100svh - var(--leiste))` und `aspect-ratio:9/16`, und die Breite
faellt daraus ab. Auf 1440 mal 900 sind das 481 mal 855 Bildpunkte: vom oberen
Rand bis an die Laufleiste, rechts bis an die Kante, und kein einziger
abgeschnittener Bildpunkt. Hochgerechnet wird nichts.

Deshalb hat die Laufleiste jetzt eine feste Hoehe. Sie steht als `--leiste`
oben im Hero-Block und nicht erst unten bei `.laufband`, weil der Film mit ihr
rechnet. Frueher wuchs die Leiste aus ihrer Innenpolsterung, dann haette der
Film nicht exakt darueber enden koennen.

**Eine Ausnahme:** auf einem hohen, schmalen Fenster (Seitenverhaeltnis unter
1,28) wuerde der Film der Ueberschrift den Platz nehmen. Dort bestimmt die
Breite das Mass (`width:min(42vw,30rem)`), der Film steht mittig und reicht
nicht mehr ganz von oben nach unten. Beschnitten wird auch dort nichts.

Die Datei laeuft 14 Sekunden, 24 Bilder je Sekunde, crf 26 mit leichtem
`hqdn3d` davor, 3,4 MB. Gebaut aus `_work/video/rundgang-garten.mp4`,
Abschnitt 3 bis 18 Sekunden:

```
ffmpeg -ss 3 -t 15 -i _work/video/rundgang-garten.mp4 -filter_complex \
 "[0:v]split=2[main][tail];\
  [main]trim=0:14,setpts=PTS-STARTPTS[m];\
  [tail]trim=14:15,setpts=PTS-STARTPTS,format=yuva420p,fade=t=out:st=0:d=1:alpha=1[t];\
  [m][t]overlay=shortest=0,hqdn3d=2:1.5:4:4,format=yuv420p[v]" \
 -map "[v]" -an -c:v libx264 -preset veryslow -crf 26 -pix_fmt yuv420p \
 -g 48 -movflags +faststart site/assets/video/garten-hero.mp4
```

Die letzte Sekunde liegt ueberblendet auf der ersten, deshalb zeigen erstes
und letztes Bild denselben Ausschnitt und die Schleife springt nicht.
Nachgemessen: mittlere Abweichung zwischen Anfangs- und Schlussbild 16 von
255, gegenueber 58 zwischen Anfang und Sekunde zwei.

Das Standbild `garten-standbild.webp` ist exakt das erste Videobild
(`ffmpeg -i garten-hero.mp4 -frames:v 1 _review/garten_0.jpg`), sonst springt
es in dem Moment, in dem das Video uebernimmt.

Das Video laedt erst nach dem Seitenaufbau und gar nicht, wenn Datensparen an
ist, das Netz 2G meldet oder wenig Bewegung gewuenscht ist. Dann steht das
Standbild.

**Vorgeschichte, damit es niemand wieder falsch macht:** die erste Fassung
dieses Heros lag in einer 46-Prozent-Bahn mit `object-fit:cover`. Das hat das
Hochformat links und rechts angeschnitten, und sie war mit crf 28 und 720p auf
12 Sekunden gequetscht, was man gesehen hat. Beides ist der Grund fuer den
Umbau. Wer die Bahn wieder breiter macht, muss das Seitenverhaeltnis
mitziehen, sonst schneidet es erneut.

### Die Schriften, dritter Anlauf

| Rolle | Schrift |
|---|---|
| Display | **Sentient** (Fontshare, ITF Free), 35 KB |
| Fliesstext und Auszeichnungen | **Supreme** (Fontshare, ITF Free), 21 KB |

Cabinet Grotesk und Martian Mono sind raus. Sie waren technisch sauber, aber
kuehl, und der Kunde hat genau das beanstandet. Eine Mono als Auszeichnung ist
der kuehlste Ton, den eine Seite haben kann.

Fraunces stand kurz an dieser Stelle und ist wieder raus: `impeccable detect`
fuehrt sie zusammen mit Inter, Roboto und Space Grotesk als ueberstrapaziert.
Sentient ist warm, offen und kontrastarm, und sie ist selten.

Zusammen 56 KB, vorher 74, davor 138.

### Alles auf Du

Der ganze Seitentext spricht den Leser jetzt mit Du an. Das ist keine
Wortersetzung gewesen, sondern eine Neufassung: aus "Sie muessen nichts
stapeln" wird "Du musst nichts stapeln", aber aus "Es muss Ihnen nichts
unangenehm sein" wird "Dir muss nichts unangenehm sein, ich habe das alles
schon gesehen".

### Gestrichen

| Was | Warum |
|---|---|
| Vergleich Formschnitt und Mauer | vier statt sechs Kacheln, der Kunde fand es zu viel |
| Bildband mit der Fichte | zeigt einen Mitarbeiter in Warnkleidung, nicht Ion |
| Die kleine Zeile ueber der Ueberschrift | las sich wie ein Etikett |
| Die Fliesstexte in den Leistungskarten | Ueberschrift und Stichworte tragen allein |
| Das zweite Video an derselben Stelle | der fertige Garten ist jetzt der Hero |

### Das Laufband lief falsch

Die Leiste raste beim Scrollen quer ueber den Bildschirm. Ursache war eine
CSS-Animation, deren `animation-duration` das Scrollen verkuerzt hat. Der
Browser rechnet den Fortschritt aus verstrichener Zeit geteilt durch Dauer,
eine halbierte Dauer verdoppelt den Fortschritt also augenblicklich.

Die Position rechnet jetzt `laufband()` in `site.js` selbst, Bild fuer Bild.
Gemessen: 26 Bildpunkte je Sekunde in Ruhe, groesster Sprung bei hartem
Scrollen 3,5 Bildpunkte statt vorher der halben Bildschirmbreite.

**Wer das anfasst, darf `animation-duration` nicht wieder als Tempo benutzen.**

### Das Bild bei "Rasen und Boden", drei Anlaeufe

Es zeigt dieselbe Anlage wie der erste Vorher-Nachher-Vergleich, nur ein paar
Wochen spaeter, mit den Bahnen vom Maeher.

| Quelle | Groesse | Warum verworfen |
|---|---|---|
| `_raw/neu4/n4-06.jpg` | | war ein Versehen des Kunden, falsches Motiv |
| `_raw/neu5/n5-01.jpg` | 959 x 996 | die orangefarbene Plane lag im Bild |
| `_raw/neu6/n6-01.webp` | 1233 x 1275 | **im Einsatz**, Plane weggeschnitten, groesser |

Ausschnitt `box=(0.0, 0.26, 0.70, 1.0)` mit `fokus=(0.5, 0.40)`. Die Box laesst
das rote Geraetehaus rechts weg, der Fokus haelt oben noch einen Streifen
Haus und Beet im Bild, sonst ist die Kachel nur nacktes Gras. Ergebnis
863 mal 690, drei Fassungen (863, 800, 480).


## 5e. Umbau vom 19.09.2026, dritte Runde

### Der Hero: Film hinter allem

Der Garten liegt jetzt vollflaechig hinter Satz und Knoepfen. Drei Ebenen:
`.hero__film` ganz hinten, `.hero__schleier` darueber, `.hero__inhalt` vorn.

**Zwei Fassungen derselben Aufnahme**, weil ein Hochformat an einem breiten
Schirm zwangslaeufig entweder beschnitten oder hochgerechnet wird:

| Datei | Groesse | Wofuer | Warum |
|---|---|---|---|
| `garten-hero.mp4` | 720 x 1280, 3,4 MB | bis 860 Bildpunkte | Der Telefonschirm ist selbst hochkant. Aus 720 x 1280 wird auf einem 375er Geraet 456 x 812, es fehlen 81 Bildpunkte in der Breite, und verkleinert wird dabei auch. Also scharf. |
| `garten-hero-quer.mp4` | 1600 x 1066, 3,9 MB | ab 861 Bildpunkten | Schon beim Rendern auf den sichtbaren Streifen zugeschnitten und mit Lanczos und `unsharp` vergroessert, statt den Browser bilinear hochrechnen zu lassen. |

Welche geladen wird, entscheidet `heroFilm()` in `site.js` ueber dieselbe
Grenze von 861 Bildpunkten wie CSS und Standbild. Die Standbilder laufen
parallel dazu ueber `<picture>` und zwei `<link rel=preload media=...>`.

Die Entscheidung faellt einmal beim Laden und wird danach nicht revidiert.
Wer ein Fenster von schmal auf breit zieht, behaelt also das Hochformat.
Das ist Absicht: die zweite Datei nachzuladen kostet mehr, als die etwas
weichere Darstellung wert ist, und auf einem echten Geraet aendert sich die
Breite so gut wie nie.

Die Querfassung entsteht so:

```
ffmpeg -ss 3 -t 15 -i _work/video/rundgang-garten.mp4 -filter_complex \
 "[0:v]split=2[main][tail];\
  [main]trim=0:14,setpts=PTS-STARTPTS[m];\
  [tail]trim=14:15,setpts=PTS-STARTPTS,format=yuva420p,fade=t=out:st=0:d=1:alpha=1[t];\
  [m][t]overlay=shortest=0,hqdn3d=2:1.5:4:4,\
  crop=720:480:0:265,scale=w=1600:h=1066:flags=lanczos,\
  unsharp=5:5:0.55:5:5:0.0,format=yuv420p[v]" \
 -map "[v]" -an -c:v libx264 -preset veryslow -crf 28 -pix_fmt yuv420p \
 -g 48 -movflags +faststart site/assets/video/garten-hero-quer.mp4
```

`crop=720:480:0:265` ist der Streifen, der spaeter zu sehen ist. Er wurde
gewaehlt, indem vier Zeitpunkte bei vier Hoehen nebeneinandergelegt wurden:
weiter unten sieht man fast nur Pflaster, weiter oben faellt die Mauer raus.

**Warum 1600 und nicht 1280:** bei crf 28 kostet 1600 dasselbe wie 1280 bei
crf 26, naemlich rund 3,9 MB, deckt aber einen 1920er Schirm mit Faktor 1,2
statt 1,5 ab und wird auf 1440 sogar verkleinert, also scharf. Nachgesehen
wurde das an 1:1-Ausschnitten, nicht nach Gefuehl.

### Der Schleier, nachgerechnet statt geschaetzt

Der Verlauf ueber dem Film muss zwei Dinge zugleich: die Schrift tragen und
den Garten zeigen. Beide Fassungen sind deshalb an acht Bildern der Schleife
durchgerechnet worden, Bildpunkt fuer Bildpunkt unter den echten
Textkaesten aus dem DOM. Schlechtester Punkt:

| | Ueberschrift | Zeile darunter | Namenszug |
|---|---|---|---|
| Schirm | 4,4 : 1 | 12,8 : 1 | 13,2 : 1 |
| Telefon | 4,1 : 1 | 11,1 : 1 | 6,7 : 1 |

Fuer eine Ueberschrift dieser Groesse verlangt WCAG AA 3 : 1, fuer die
kleinen Zeilen 4,5 : 1. Beides ist mit Abstand erfuellt.

Am Schirm faellt der Schleier ab 54 Prozent Breite schnell ab, rechts bleibt
das Bild fast unberuehrt. Am Telefon liegt der dunkle Teil unten, oben bleibt
der Garten offen, und der Satz sitzt am Fuss wie in einer App.

**Wer daran dreht, muss nachmessen.** Eine haltbare Zahl bekommt man nicht
aus einem Bildschirmfoto: die Schleife laeuft durch helles Pflaster, Himmel
und dunkles Laub, und der schlechteste Moment entscheidet.

### Texte: raus aus der Ich-Perspektive

Der Kunde will nicht moeglichst schnell moeglichst viel verdienen, sondern
zufriedene Leute. Der alte Text erzaehlte dauernd, was Ion alles macht.
Sechzehn Mal "ich" auf der Startseite, jetzt vier, und die vier sind ein
Handwerksdetail, ein Versprechen und zwei Formularhinweise.

| Vorher | Jetzt |
|---|---|
| Schau dir das an. Reden koennen wir danach. | Schau mal, so schoen kann dein Garten aussehen. |
| Derselbe Garten, ein paar Tage spaeter. | Derselbe Ort, ein paar Stunden oder Tage spaeter. |
| Was ich jede Woche mache. | Was in deinem Garten so anfaellt. |
| Bei dir stehe ich selbst im Garten. | Wer bei dir im Garten steht. |
| Ich gehe selbst ans Telefon | Keine Frage ist zu klein, wirklich keine. |
| Du hoerst von mir | Du hoerst zurueck |
| Wir machen einen Termin | Ihr macht einen Termin |

Alle sechs Antworten im Fragenteil sind neu geschrieben, waermer und ohne
Eigenlob, und die Kopien im JSON-LD sind mitgezogen. Der Absatz ueber dem
Saegevideo ist ersatzlos raus.

### Das Bild von Ion, zweite Quelle

Am Telefon wurde es beim Heranziehen weich. Der Kunde hat dieselbe Aufnahme
noch einmal geschickt, `_raw/neu6/n6-02.webp`, 1086 x 1448 statt 1170 x 1330.

**Der Gewinn liegt nicht in der Dateigroesse, sondern im Ausschnitt.** Beide
Quellen haben rund 1,57 Millionen Bildpunkte, und nach Kantenstreuung ist die
alte sogar leicht im Vorteil. Ion steht in der neuen aber deutlich groesser im
Bild: sein Kopf misst darin etwa 130 statt 90 Bildpunkte, also rund das
Anderthalbfache an echter Zeichnung auf der Person. Genau darum ging es.

Der 4:5-Beschnitt greift jetzt oben und unten statt seitlich, weil die neue
Quelle hochkanter ist. `fokus=(0.5, 0.62)`, sonst bleibt zu viel Himmel stehen
und die Stufen fallen unten raus. Ergebnis 1086 x 1358.

**Damit ist das Ende der Fahnenstange erreicht.** Auf einem Telefon mit
dreifacher Pixeldichte deckt die Datei 1015 gebrauchte Bildpunkte mit 1086
ab, also sieben Prozent Reserve. Wer weiter hineinzieht, sieht es wieder
weicher werden, und dagegen hilft nur eine groessere Originaldatei.

### Nachtraege aus derselben Runde

Die kleine Zeile unter der Ueberschrift im Hero ist wieder raus, samt CSS und
Auftritt. Der Hero traegt jetzt nur noch Marke, Satz und zwei Knoepfe.

Die zweite Sektion hiess "Derselbe Garten, ein paar Tage spaeter". Unter den
vier Vergleichen ist aber eine Garage und ein Grundstueck, und nicht alles
dauert Tage. Jetzt "Derselbe Ort, ein paar Stunden oder Tage spaeter".

`og:title`, `og:description` und die Seitenbeschreibung siezten noch aus der
ersten Fassung. Auch die sind auf Du umgestellt.

**Ein abgelehntes `play()` ist nicht mehr das Ende.** Vorher nahm `heroFilm()`
in dem Fall die Quelle wieder weg und versuchte es nie erneut, das Standbild
blieb also fuer immer stehen. Das faellt niemandem auf, weil die Seite
trotzdem richtig aussieht, betrifft aber echte Geraete: ein iPhone im
Stromsparmodus verweigert selbsttaetiges Abspielen. Jetzt wird beim ersten
Antippen oder Scrollen noch einmal angesetzt.

### Die Handy-Fassung

Sie ist jetzt gleichwertig gebaut, nicht nur nicht kaputt.

- Der Film liegt vollflaechig dahinter, unbeschnitten bis auf 81 Bildpunkte
  Breite, und wird verkleinert statt vergroessert.
- Satz und Knoepfe sitzen am Fuss. Die zwei Knoepfe stehen untereinander ueber
  die volle Breite. Nebeneinander passten 165 Bildpunkte nicht und die
  Telefonnummer brach mitten im Vorwahlblock um.
- Geprueft auf 360 x 740, 375 x 812 und 430 x 932: der ganze Hero passt auf
  jedem davon in einen Bildschirm, ohne Scrollen.
- Die Stichworte in den Leistungskarten waren 12,6 Bildpunkte gross, jetzt
  13,8. Der Knopf in der Kopfleiste war 12,5, jetzt 13,8.
- Kein waagerechter Ueberlauf, kein kaputtes Bild, keine Tippflaeche unter
  40 Bildpunkten ausser den Verweisen mitten im Fliesstext.

### Zwei Abstandsfehler, die auf jedem Geraet falsch waren

`.sektion-kopf h2` hat keinen Abstand nach unten, und darauf folgt direkt
Fliesstext. Ueberschrift und erster Absatz klebten also aneinander, im
Personen- und im Videoabschnitt. Jetzt `margin-top:clamp(1.1rem,2.4vw,1.5rem)`
auf `h2+p`.

Untereinander gestapelt lag der gelbe Strich ueber "Wer bei dir im Garten
steht" 26 Bildpunkte unter dem Foto und gehoerte optisch noch zum Bild. Jetzt
42 Bildpunkte zum Strich und 32 weiter zur Ueberschrift.

### Flacher Schirm

Auf 1440 x 700 war der Hero 46 Bildpunkte zu hoch und die Knoepfe rutschten
unter die Laufleiste. Unter 780 Bildpunkten Hoehe faellt die Ueberschrift
deshalb auf `clamp(2.2rem,5.4vw,4.6rem)` und die Polsterung wird knapper.

## 5f. Umbau vom 19.09.2026, vierte Runde

### Der Hero am Rechner: Buehne und Wand

Die Querfassung des Videos ist geloescht. Sie war ein auf 1600 hochgerechneter
Ausschnitt von 720 mal 480, und genau das hat man gesehen.

Jetzt laeuft auch am Rechner das Hochformat, und zwar hoechstens in seiner
echten Groesse. Zwei Ebenen:

| Ebene | Was | Groesse auf 1440 x 900 |
|---|---|---|
| `.hero__buehne` | die scharfe Aufnahme, neun zu sechzehn, rechts bis an die Kante | 481 x 855, also **verkleinert** um Faktor 1,5 |
| `.hero__wand` | dieselbe Aufnahme als **Bild**, Unschaerfe in der Datei gebacken | 360 x 640, 2,1 KB, gedehnt auf den ganzen Schirm |

Die Wand macht den Garten flaechig praesent, ohne dass irgendwo hochgerechnet
wird: was unscharf ist, bleibt beim Dehnen unscharf.

**Warum die Wand ein Bild ist und kein Video.** Die erste Fassung war ein
zweites `<video>` mit `filter:blur(11px)`, sogar mit dem ueblichen Trick, den
Weichzeichner auf einer viertel so grossen Flaeche rechnen zu lassen und
danach zu skalieren. Gemessen ueber zwei Sekunden: **60 Bilder je Sekunde
ohne die Wand, 30 mit.** Halbe Bildrate fuer einen Hintergrund, den niemand
scharf sieht. Mit dem vorgerenderten Bild sind es wieder 60.

**Wer das anfasst:** kein `filter` auf eine vollflaechige, laufende Ebene
legen. Die Datei entsteht so:

```
ffmpeg -ss 6 -i site/assets/video/garten-hero.mp4 -frames:v 1 wandquelle.png
# dann in Python: auf 360x640, GaussianBlur(14), Farbe 0.85, Helligkeit 0.62
```

Der Kontrast ist damit exakt nachrechenbar, weil die Wand ein festes Bild
ist: **5,7 zu 1 unter der Ueberschrift, 13,7 zu 1 am Namenszug.** Die
Helligkeit 0,62 ist nicht Geschmack, sondern das Ergebnis dieser Rechnung:
bei 0,85 waeren es nur 3,5 zu 1.

### Zwei Fehler, die es auf jedem Geraet gab

**Das Bild von Ion hatte nie ein Seitenverhaeltnis.** `.person__bild img`
setzte `aspect-ratio:4/5`, aber kein `height:auto`. Ohne diese Angabe zaehlt
das `height`-Attribut aus dem HTML als Vorgabe des Browsers, die Box hat dann
eine feste Hoehe, und `aspect-ratio` wird stillschweigend ignoriert. Das Bild
lief ueber seine ganze natuerliche Hoehe und wurde stattdessen seitlich
beschnitten. Die Verschiebung auf `34% 76%` war nur der Verband darauf und
ist mit der Ursache weggefallen.

**Der Fokusrahmen war auf allen dunklen Flaechen unsichtbar.**
`:focus-visible` zeichnete `var(--mulch)` auf `var(--mulch)`, gemessen
1,1 zu 1. Gelb galt nur innerhalb von `.band--dunkel`, nicht in Kopfleiste,
Hero, Laufleiste und Fuss. Jetzt gilt es dort auch, gemessen 9,9 zu 1.

### Am Telefon

- Das Bild von Ion steht quadratisch statt vier zu fuenf. Ueber die volle
  Breite blieb sonst oben zu viel Himmel und unten zu viel Treppe stehen.
  Ion liegt in der Datei zwischen 19 und 82 Prozent der Hoehe, deshalb
  `object-position:50% 52%`.
- Das Zeichen oben links ist von 34 auf 46 Bildpunkte gewachsen, in der
  Kopfleiste von 30 auf 38.

### Texte

| Vorher | Jetzt |
|---|---|
| Ohne Ton, und du kannst jederzeit anhalten. | raus |
| Ein Handyfoto genuegt. Aufraeumen musst du vorher nichts. | raus |
| ... woran sich der Preis bemisst und was du dir sparen kannst. | ... und woran sich der Preis bemisst. |
| Ihr macht einen Termin | Wir machen einen Termin |
| Wenn es fuer dich passt, wird ein Tag gesucht, der dir passt. | Wenn alles fuer dich passt, suchen wir nach einem geeigneten Termin. |
| ... ist es ein Tag. Dir muss nichts unangenehm sein, so etwas ist hier wirklich nichts Besonderes. | ... ist es ein oder wenige Tage. Dir muss nichts unangenehm sein. |

### Messwerte nach dieser Runde

| | Wert |
|---|---|
| Bildrate im Hero | 60 je Sekunde |
| Kontrastverstoesse ausserhalb des Heros | 0, auf beiden Groessen geprueft |
| Waagerechter Ueberlauf | 0 bei 360, 375, 430, 900, 1100, 1440 |
| Kaputte Bilder | 0 von 23 |
| Tote Verweise | 0 von 98, ueber alle vier Seiten |
| Tippflaechen unter 40 Bildpunkten | keine ausser Verweisen im Fliesstext |
| `impeccable detect` | ohne Befund auf allen sechs Dateien |
| Gewicht Video | 5,0 MB gesamt, davon 3,4 MB Hero |

## 5g. Umbau vom 22.09.2026, fuenfte Runde

### Ions Vorstellung

Der Abschnitt "Wer bei dir im Garten steht" hat einen vom Kunden
geschriebenen Text bekommen. Die Begruessung steht als eigene Zeile darueber,
in der Display-Schrift und eine Stufe groesser (`.fliess--auftakt`): sie ist
die Anrede, nicht der erste Absatz.

Drei Aenderungen am gelieferten Wortlaut, alle bewusst:

| Original | Auf der Seite | Warum |
|---|---|---|
| Ion, Gedankenstrich, freut mich | Ion. Freut mich, dich kennenzulernen. | Hausregel: kein Gedankenstrich im Seitentext |
| hängt, Gedankenstrich, auch wenn | hängt, auch wenn | dasselbe |
| merke ich mir, Gedankenstrich, und | merke ich mir, und | dasselbe |
| [X Jahren] | roter Platzhalter | so wie jede andere offene Angabe auf der Seite |

**Die Angabe "Im Geschaeft seit" ist aus der Faktenliste geflogen.** Sie hat
dieselbe Tatsache abgefragt wie der neue Platzhalter im Fliesstext, es waeren
zwei rote Kaesten fuer eine Zahl gewesen. Offene Punkte auf der Startseite
damit von drei auf zwei.

**Platzhalter im Fliesstext brauchen eine eigene Fassung.** `.platzhalter` ist
fuer ganze Bloecke gebaut, mit 1rem Innenabstand und 1,2rem Aussenabstand.
Mitten in einem Absatz war der Kasten 36 Bildpunkte hoch in einer 27er Zeile
und hat den Absatz aufgerissen. Dafuer gibt es jetzt `.platzhalter--zeile`.

### Der Fuss

Vorher liefen dort fuenf Schriftgroessen nebeneinander: 12,8 fuer die
Spaltentitel, 13,4 fuer die Nummer, 13,8 im Rechtshinweis, 14,4 unten und
18 fuer die Verweise. Die Verweise waren damit das Lauteste im ganzen Fuss und
der Firmenname mit 12,8 das Leiseste, weil er dieselbe Klasse trug wie die
Spaltentitel.

Jetzt vier Stufen mit klarer Rangfolge:

| Stufe | Wofuer |
|---|---|
| 17,3 / 700, Display | der Firmenname |
| 15,2 / 400 | Verweise und Anschrift |
| 13,8 / 400 | Rechtshinweis und Zeile ganz unten |
| 12,5 / 600, gesperrt | die drei Spaltentitel |

Der Firmenname ist kein `h2` mehr, sondern ein Absatz: er benennt keinen
Abschnitt. Die drei echten Spaltentitel bleiben `h2`. `.zahl` bringt eine
eigene Groesse mit, damit die Nummer in die Kopfleiste passt, im Fuss wird
sie deshalb auf `inherit` zurueckgesetzt.

Unter 640 Bildpunkten stehen Marke und Kontakt ueber die volle Breite und die
beiden kurzen Listen nebeneinander. In einer halben Spalte bricht die
Mailadresse mitten im Wort um. Der Fuss ist damit 799 statt 940 Bildpunkte
hoch, ohne dass eine Tippflaeche kleiner wird.

### Abstand zwischen Titel und Video

`.sektion-kopf` setzt `margin-bottom:0`, damit Ueberschrift und Fliesstext
zusammenstehen. Im Abschnitt "Arbeitstag" folgt aber direkt das Video, und die
Unterlaenge vom g in "Arbeitstag" verschwand dahinter. `.rundgang__text` hat
jetzt einen eigenen Abstand, gemessen 45 Bildpunkte.

### Was der Durchgang mit den Skills gefunden hat

Nach Emil Kowalskis Checkliste geprueft. Sauber waren: keine
`transition:all`, kein `ease-in`, eigene Kurven statt der schwachen
CSS-Vorgaben, `scale(.98)` auf Knoepfen, kein Auftritt aus `scale(0)`, und
das Akkordeon macht schon alles richtig (Ausklappen 230ms, Einklappen 190ms,
beides `ease-out`, aus der aktuellen Hoehe heraus also unterbrechbar).

Gefunden und behoben:

| Befund | Vorher | Jetzt |
|---|---|---|
| Hover auf Formularfeldern ohne Zeigerabfrage | Rand blieb am Telefon nach dem Tippen haengen | in `(hover:hover) and (pointer:fine)` |
| Bildzoom beim Ueberfahren | 450ms | 300ms |
| Auftritt beim Scrollen | 620ms fuer 18 Bildpunkte | 460ms |
| Die zwei Fotoknoepfe im Formular | keine Druckrueckmeldung | `scale(.98)` mit 140ms |

### Messwerte nach dieser Runde

| | Wert |
|---|---|
| `impeccable detect` | ohne Befund auf allen sechs Dateien |
| Kontrastverstoesse ausserhalb des Heros | 0, Startseite auf beiden Groessen |
| Waagerechter Ueberlauf | 0 auf allen vier Seiten, 375 und 1440 |
| Kaputte Bilder | 0 von 23 |
| Verwaiste Bild- und Videodateien | keine |
| Gedankenstriche | 0 in allen Dateien |
| Tippflaechen unter 40 Bildpunkten | keine ausser den verborgenen Dateifeldern |
| Schriftgroessen im Fuss | 4 statt 5 |

## 5h. Umbau vom 23.09.2026, sechste Runde

### Fachwissen in den drei Schritten

Schritt 02 sagte vorher nur, das Vlies "spart dir jedes Wochenende". Jetzt
steht dort, wie es wirkt: an den Stoessen zehn Zentimeter ueberlappend, mit
Erdnaegeln festgesteckt, Regen und Luft kommen durch, Licht nicht, deshalb
keimt darunter nichts, und Mulch und Kies mischen sich nicht mit der Erde.
Der Kunde hatte Notizen zum Vlies angekuendigt, die kamen aber nicht mit.
Der Text stuetzt sich auf gaengiges Fachwissen und sollte von Ion einmal
gegengelesen werden.

Schritt 03 erklaert jetzt, warum Rindenmulch und Kies nebeneinander liegen:
Mulch dort, wo Pflanzen Feuchtigkeit brauchen, weil er sie haelt und beim
Verrotten duengt, Kies dort, wo Wasser ablaufen soll, weil er es sofort
durchlaesst und dauerhaft haelt. Die Angaben stammen vom Kunden.

### Knoepfe

Die Seite ist sonst durchweg eckig. Die Knoepfe sind jetzt die einzige runde
Form darauf und werden deshalb sofort gefunden. Im Hero traegt jeder Knopf
einen Kreis mit Zeichen:

| Knopf | Aufbau |
|---|---|
| Foto schicken | gelbe Pille, rechts ein dunkelgruener Kreis mit Pfeil, der beim Ueberfahren drei Bildpunkte nach rechts rutscht |
| Anrufen | dunkle, halb durchsichtige Pille, links ein gelber Kreis mit Hoerer, daneben "Ion Baleca" und darunter klein die Nummer |

Der Anrufknopf hat bewusst kein `backdrop-filter`: er liegt ueber dem
laufenden Video, und ein Weichzeichner dort rechnet jedes Bild neu. Die
Nummer bleibt sichtbar, der Knopf liest sich jetzt aber als Person statt
als Ziffernfolge. Beide Knoepfe sind 55 Bildpunkte hoch.

Alle anderen `.btn` sind ebenfalls rund, ebenso "Abspielen" und das
Hoerer-Symbol in der Kopfleiste am Telefon.

### Leistungen am Telefon

Vorher stand jede Leistung als volle Karte untereinander, 2735 Bildpunkte.
Der eigentliche Fehler: zwischen zwei Karten lagen 18 Bildpunkte, innerhalb
einer Karte zwischen Bild und Titel 17. Das Auge konnte nicht zuordnen,
welche Stichworte zu welchem Bild gehoeren.

Unter 700 Bildpunkten ist jede Leistung jetzt eine Zeile: Bild quadratisch
links, Titel und Stichworte rechts senkrecht mittig, feine Linien
dazwischen. 1295 Bildpunkte, jede Zeile 166 hoch.

Zwei Stolperstellen dabei, damit sie niemand wieder einbaut:
- Die Seite trennt ueberall automatisch. In der schmalen Spalte kam dabei
  "Rueckschnit-t" heraus. Die Stichworte haben deshalb `hyphens:none` und
  `white-space:nowrap`.
- Im Markup steht zwischen den `<li>` kein Leerraum. Als Inline-Elemente
  gibt es dann keine einzige Stelle zum Umbrechen, die Zeile lief rechts
  aus dem Bild. Deshalb `display:flex;flex-wrap:wrap` auf der Liste.

### Saegevideo nur am Telefon

`@media (min-width:768px){ #rundgang{display:none} }`. Standbild und Video
werden dort gar nicht erst geladen. Die Fragen folgen am Schirm dann direkt
auf den dunklen Ion-Abschnitt; `band--knapp` war fuer hell auf hell gedacht,
deshalb bekommt `#rundgang + .band--knapp` dort den vollen Abstand zurueck.
Der Videoabschnitt selbst hatte `band--knapp` auch am Telefon zu Unrecht,
er folgt immer auf Dunkel.

### Ueberschrift im Hero am Rechner

Ab 861 Bildpunkten eine Stufe kleiner als die allgemeine h1:
`clamp(2.6rem,6vw,5.6rem)`, auf 1440 also 86 statt 104 Bildpunkte. Die
Schrift endet damit bei 647 statt 763, gut 300 Bildpunkte vor der Bahn mit
dem Film. Der gemessene Kontrast wird dadurch nur besser, weil die Schrift
weiter vom hellen Teil des Bildes wegrueckt. Die Regel steht vor der fuer
flache Schirme, dort gilt weiter die noch kleinere Groesse.

### Weggefallen

| Was | Warum |
|---|---|
| Faktenliste unter Ion (Einzugsgebiet, Am Telefon) | vom Kunden gestrichen, das Einzugsgebiet steht ohnehin im Laufband |
| Platzhalter Jahre | fuenf Jahre, vom Kunden genannt |
| Rechtshinweis "firmiert als Gartenpflege Maria MD" im Fuss | vom Kunden gestrichen, steht weiter im Impressum |
| leeres `<div class="strich">` | hatte weder CSS noch JS |
| CSS fuer `.fakten`, `.platzhalter--zeile`, `.fuss__recht` | kein Element mehr dazu |

Die Startseite hat damit **keinen einzigen offenen Platzhalter mehr**. Offen
sind nur noch je drei in Impressum und Datenschutz.

### Fuss

Rechts unten steht jetzt neben dem Copyright "Realisiert von Mathew WebAgency"
mit Verweis auf `https://mathew-webagency.de/`, die Canonical der eigenen
Agenturseite. Ohne `nofollow`, es ist die eigene Seite.

Drei Kleinigkeiten dabei: auf mittleren Breiten rutschte die Zeile unter den
Bildhinweis und stand dann links (jetzt `margin-left:auto`), die Mailadresse
brach mitten in der Domain (jetzt `nowrap`, die fr-Spalte waechst mit), und
am Telefon hing "Realisiert von" allein am Zeilenende (jetzt zusammengehalten,
der Punkt dazwischen faellt dort weg). Der Verweis ist 44 Bildpunkte hoch.

## 5c. Was die beiden Pflicht-Reviews ergeben haben

Am 18.09.2026 sind zwei voneinander getrennte Prüfer über die Seite gelaufen, ein
Designreview und ein Messlauf. Sie haben sich gegenseitig nicht gesehen.

**Design Health Score: 22 von 32 anwendbaren Punkten.** Heuristik 7 und 10 sind bei
einer Landingpage nicht anwendbar.

### Behoben

| Befund | Was es war |
|---|---|
| Überschriftenspalten 207px breit | `max-width:20ch` stand am Container und wurde damit in Switzer gemessen statt in der Überschrift. Auf jedem Desktop standen die Überschriften als Buchstabentreppe in einer schmalen Säule neben 1100px leerer Fläche. Der schwerste Fehler der Fassung. |
| Vier Farbfamilien statt einer | Braunschwarz, Creme und ein drittes Grün aus der verworfenen Vorfassung standen neben den Tokens. Jetzt alles auf `--mulch`, `--tinte`, `--kalk`, plus ein einziges Warnrot als `--warn`. |
| Gelbe Vorzeile im Hero auf 2,45:1 | Gelb auf Himmel ist nicht lesbar. Die Zeile läuft jetzt in Kalk, das Gelb bleibt im Strich davor. |
| Fragen ohne JavaScript unerreichbar | Alle sechs Antworten hingen auf `height:0`. Jetzt stehen sie offen und werden erst vom Skript zugeklappt. |
| Vier Klickflächen unter 44px | Logo im Kopf, Navigation, Telefonzeile, Fußlinks. |
| Scrollfalle auf den Vergleichskacheln | Der unsichtbare Regler bedeckt die ganze Kachel und schluckte auch senkrechte Wischer. `touch-action:pan-y` gibt das Scrollen zurück. |
| Telefonnummer verschwand am Handy | Unter 640px steht jetzt ein Hörer-Knopf im Kopf. |
| Porträt zu 60 Prozent Gewitterwolke | `object-position` auf 34%/76% gesetzt, Ion sitzt jetzt im Bild. |
| Widersprüchliche Angaben | Alt-Text sagte Gartenhaus, Bildunterschrift Gewächshaus. FAQ-Markup wich vom sichtbaren Text ab, das beanstandet Google. |
| Toter Code | `.leistung p` war gestylt, seit die Leistungstexte raus sind. |

### Messwerte nach den Korrekturen

| Prüfung | Ergebnis |
|---|---|
| Horizontales Überlaufen bei 320, 375, 768, 1440, 1920px | 0 |
| Bilder ohne Alternativtext | 0 von 30 |
| Konsolenfehler | 0 |
| Fehlgeschlagene Netzwerkanfragen | 0 von 98 |
| Klickflächen unter 44px | 0 |
| Überschriften-Ebenensprünge | 0 |
| Ladegewicht erste Ansicht, 1440px | 0,64 MB |
| Ladegewicht ganze Seite durchgescrollt | 4,27 MB |
| `impeccable detect` auf allen vier Seiten | nur das Laufband, bewusst offen |

### Bewusst offen gelassen

**Das Laufband.** Siehe Abschnitt "Das Laufband". Der Kunde hat es verlangt, der
lesbare Kern des Einwands ist behoben.

**Ohne JavaScript bleiben die Videos stumm.** Zwei `video`-Elemente ohne `source`,
die Quelle steht in `data-quelle`. Das ist Absicht: sonst lädt jedes Handy zwei
Videodateien, die niemand angefordert hat. Text, Bilder, Formular, Telefon, Mail und
alle Fragen funktionieren ohne Skript.

### Nicht abgearbeitet, weil es Entscheidungen des Kunden sind

1. **Kein WhatsApp-Weg**, obwohl der Hauptknopf "Foto schicken" heißt. Ein
   Hausbesitzer über 45 schickt ein Gartenfoto per WhatsApp, nicht über einen
   Dateidialog. Das ist die billigste Verbesserung, die diese Seite noch haben kann.
2. **Keine Preisspanne, keine Anfahrtspauschale.** Dass die Einschätzung nichts
   kostet, steht nur in einer zugeklappten Frage.
3. **Keine einzige Kundenstimme, keine Bewertung, keine Jahreszahl.** Die drei
   Stellen, an denen so etwas stünde, sind rote Platzhalter.
4. **Kein Hinweis auf § 35a EStG** und auf eine ordentliche Rechnung. Für
   Eigenheimbesitzer ein häufiges Entscheidungskriterium und zugleich das Signal
   "ich arbeite angemeldet".
5. **Das Animations-Review** (`/review-animations`) ist nicht gelaufen. Der Skill ist
   für den ausdrücklichen Aufruf durch den Nutzer reserviert und lässt sich nicht
   automatisch starten.

## 6. Ein offener Punkt, ehrlich benannt

Der **Lighthouse-Performance-Wert schwankte zwischen 80 und 94** bei identischem Code.
Der Unterschied lag allein im First Contentful Paint, der zwischen 0,9 und 2,4 Sekunden
sprang, während der CPU-Index stabil blieb und der Netzwerkverlauf identisch war. Die
Ursache liegt in der lokalen Messumgebung, nicht in der Seite.

Der belastbare Wert kommt von PageSpeed Insights gegen die Live-Domain. Bis dahin gilt
er als ungeprüft.

## 7. Bildrechte

Sämtliche Fotos und das Video stammen aus Ions eigenen Einsätzen, kein
Bildagenturmaterial. Sechs Kacheln der Vorher-Nachher-Vergleiche wurden hochgerechnet,
siehe Abschnitt 5a. Genau in dieser Form steht es auch im Impressum.

Auf zwei Fotos sind fremde Autos am Ende einer Hofeinfahrt zu sehen. Ich habe die
Kennzeichen in der Originaldatei bei doppelter Vergrößerung geprüft: unleserlich. Auf
der Seite werden sie mit wenigen Pixeln dargestellt. Kein Handlungsbedarf.

Was du trotzdem klären solltest: ob Ion für die abgebildeten Grundstücke das
Einverständnis der Eigentümer hat. Rechtlich ist das bei Aufnahmen vom Grundstück selbst
in der Regel nötig.

## 8. Später ändern

Sag mir in normalen Worten, was anders soll, und ich ändere es und schiebe es live.
Die Tür bleibt offen.

---

## Projektaufbau

```
site/                    Das, was auf den Server kommt
  index.html             Die Seite
  impressum.html
  datenschutz.html
  404.html
  robots.txt  sitemap.xml  .htaccess  site.webmanifest
  assets/
    css/site.css         Ein Stylesheet, keine Abhängigkeiten
    js/site.js           Eigener Code, dazu GSAP und ScrollTrigger lokal
    fonts/               Playfair, Cinzel und Newsreader als woff2, auf den deutschen
                         Zeichensatz reduziert, 164 KB gesamt
    img/                 58 WebP-Dateien in bis zu vier Größen, dazu die Marke
    video/               Rundgang, 20 Sekunden
    icon/                Favicons
KONZEPT.md               Referenzanalyse, Palette, Schriftwahl, Begründungen
UEBERGABE.md             Diese Datei
.claude/                 Werkzeuge
  bilder.py              baut alle Bilder aus den Originalen
  logo.py                stellt die Marke frei und baut die Icons
  serve.mjs              lokaler Server
  shot.mjs  probe.mjs    Screenshot- und Prüfskripte, brauchen Google Chrome
```

**Lokal ansehen:**
```
node .claude/serve.mjs
```
Dann http://localhost:4321 aufrufen. Der Server liefert `site/` als Wurzelverzeichnis
aus, genau wie später der echte Server.
