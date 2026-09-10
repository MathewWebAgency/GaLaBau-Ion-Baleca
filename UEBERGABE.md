# Übergabe: Gartenpflege Maria MD, Ion Baleca

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
| `index.html`, Abschnitt „Wer kommt" | Wann geht wirklich jemand ans Telefon |
| `index.html`, Abschnitt „Wer kommt" | Seit wann gibt es den Betrieb, nur wenn belegbar |

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
stammen vom Stand vor dem Bildtausch am 09.09.2026.** Struktur, Alternativtexte und
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
| `site/assets/img/marke-hell.svg` | Kopfleiste, Hero, Fuß, 404 — die dunklen Bänder |
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

Drei der Vergleiche — Garage, Hausecke, Grundstück — stammen aus **Bildschirmfotos von
Collagen**, die der Kunde geschickt hat. Die Collagen sind 900 × 1600 Bildpunkte groß,
jede Kachel darin also nur rund **450 Bildpunkte breit**. Für die Fläche, auf der sie
stehen, ist das zu wenig.

Diese sechs Kacheln sind deshalb mit **Topaz Image Upscale** vervierfacht worden
(über KIE, Modell `topaz/image-upscale`, Faktor 4). Die Originale liegen unter
`_work/up/`, die Aufträge dazu in `.claude/bilder.py`. Das Motiv bleibt unverändert,
es kommt nichts hinzu, was nicht fotografiert wurde — aber Kanten und Blattstrukturen
werden von Software ergänzt, nicht von der Kamera.

**Deshalb steht das jetzt auch so im Impressum**, unter „Bildnachweis". Der Satz „kein
Bild wurde künstlich erzeugt" wäre sonst nicht mehr richtig gewesen.

**Besser wäre trotzdem: die Originalfotos aus Ions Telefon**, einzeln, nicht als
Collage. Dann laufen sie durch dieselbe Verarbeitung wie alles andere, brauchen kein
Hochrechnen, und der Hinweis im Impressum kann wieder raus.

### Die Schriften

Zwei Familien, beide lokal, keine Verbindung zu Google:

| | |
|---|---|
| **Archivo** | Überschriften, Auszeichnungen, Knöpfe, alle Zahlen |
| **Newsreader** | Fließtext |

Vorher lief die Seite mit Bricolage Grotesque, Newsreader und **Martian Mono**.

Wichtiger als der Schriftwechsel war aber ein zweiter Schritt: **das Etikettenmuster
ist abgeschafft.** Über jedem Abschnitt stand ein kleines gesperrtes Versalien-Kürzel
(VORHER UND NACHHER, WAS ION MACHT, RUNDGANG), dasselbe unter jedem Bild
(MAUER, HAUSECKE), in jeder Formularbeschriftung und auf jedem Knopf. Das ist der
Standardgriff maschinell gebauter Layouts, unabhängig davon, in welcher Schrift er
gesetzt ist.

Jetzt gilt: **keine Versalien mehr auf der ganzen Seite.** Die Abschnittsetiketten sind
ersatzlos weg, die Überschrift trägt allein; an ihrer Stelle steht ein kurzer
Moos-Strich darüber. Bildunterschriften laufen als Satz („**Mauer** — Efeu abgenommen,
Wand wieder sichtbar"). Knöpfe heißen „Foto schicken" statt „FOTO SCHICKEN".
Formularbeschriftungen und Fußzeilen-Überschriften ebenso. Gegliedert wird über
Linien, Ziffern und Abstände.

Archivo hat eine Breitenachse von 62 bis 125 Prozent. Die alten `font-stretch`-Werte
im CSS waren auf Bricolages engeren Bereich gerechnet und hätten Archivo unnötig
zusammengeschnürt; sie sind entfernt. Wer die Überschriften später schmaler haben
will, kann die Achse gezielt wieder ansprechen.

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
genau 1238 Bildpunkte braucht — vorher sprang die Auswahl von 1200 auf 1600.

Ergebnis: **4,4 MB statt 6,2 MB** bei gleicher Darstellungsschärfe.

### Die Seite spricht in der Ich-Form

Der Text ist aus Ions Sicht geschrieben: „Ich komme vorbei, sage Ihnen was es kostet,
und mache es." Umgestellt wurden **nur die Stellen, an denen er vorher in der dritten
Person genannt war** — elf an der Zahl. Alles andere bleibt sachlich beschreibend.

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

### Die Kante im Hero

Die Bildbahn wächst beim Scrollen von 38 auf 94 Prozent Breite. Das ist so gewollt.

Ein Nebeneffekt davon war ein Fehler: weil die Bahn breiter wird, rechnet der
Bildausschnitt neu, und was oben im Bild steht, wandert aus dem Rahmen. Oben steht der
Mann auf der Leiter — also genau die Figur, wegen der man hinsieht. Deshalb wandert der
Bildpunkt jetzt gegenläufig mit, von 34 auf 2 Prozent (`--oy` in `site.js`). Er bleibt
dadurch im Bild, solange der Hero auf dem Schirm ist.

**Ganz lösen lässt sich das nicht:** die Bewegung hängt am Scrollen, und wer scrollt,
schiebt den Hero nach oben aus dem Bild. Wer die Bewegung wirklich vollständig sehen
will, braucht die angeheftete Fassung — die ist unter `site/_muster/hero.html` als
Variante B durchschaltbar, zusammen mit drei weiteren Hero-Aufbauten.

### Musterseiten

Unter `site/_muster/` liegen Vergleichsseiten, mit denen Entscheidungen getroffen
wurden: `schriften.html` stellt vier Schriftrichtungen nebeneinander, `marke.html`
zeigt die Marke auf hellem und dunklem Grund. Der Ordner steht in `.gitignore` und
**gehört nicht auf den Server**. Vor dem Livegang löschen.

### Wer auf welchem Bild zu sehen ist

Auf den neuen Aufnahmen sind zwei unterschiedlich gekleidete Personen zu erkennen: auf
den Leiterbildern grüne Latzhose und orangefarbener Helm, an der Straßenhecke schwarze
Kappe und Sonnenbrille. In den Alternativtexten steht überall Ion Baleca. **Wenn das
nicht stimmt, bitte sagen**, dann werden die betroffenen Texte geändert. Ein falscher
Name im Alternativtext ist eine Aussage über eine echte Person.

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
    fonts/               Archivo und Newsreader als woff2, auf den deutschen
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
