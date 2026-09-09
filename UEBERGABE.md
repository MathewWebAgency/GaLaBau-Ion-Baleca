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

## 4. Nach dem Livegang

- [ ] Google Search Console einrichten, Eigentum bestätigen, Sitemap einreichen
- [ ] Bing Webmaster Tools einrichten
- [ ] Google Unternehmensprofil pflegen. **Wichtig:** Name, Adresse und Telefonnummer
      müssen dort zeichengenau so stehen wie im Impressum. Abweichungen kosten
      Sichtbarkeit in der lokalen Suche
- [ ] PageSpeed Insights gegen die echte Domain laufen lassen. Die lokalen Messwerte
      schwankten zu stark, um sie als belastbar zu verkaufen, siehe Abschnitt 6

## 5. Was gemessen wurde

Alle Werte aus tatsächlichen Läufen, nicht geschätzt.

| Prüfung | Ergebnis |
|---|---|
| Lighthouse Accessibility | **100** (5 von 5 Läufen) |
| Lighthouse SEO | **100** (5 von 5 Läufen) |
| Lighthouse Best Practices | **100** (5 von 5 Läufen) |
| Layoutverschiebung CLS | **0** (jeder Lauf) |
| Blockierzeit TBT | 0 bis 20 ms |
| Ladegewicht Handy | 933 KB, davon 588 KB Bilder |
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

## 6. Ein offener Punkt, ehrlich benannt

Der **Lighthouse-Performance-Wert schwankte zwischen 80 und 94** bei identischem Code.
Der Unterschied lag allein im First Contentful Paint, der zwischen 0,9 und 2,4 Sekunden
sprang, während der CPU-Index stabil blieb und der Netzwerkverlauf identisch war. Die
Ursache liegt in der lokalen Messumgebung, nicht in der Seite.

Der belastbare Wert kommt von PageSpeed Insights gegen die Live-Domain. Bis dahin gilt
er als ungeprüft.

## 7. Bildrechte

Sämtliche Fotos und das Video stammen aus Ions eigenen Einsätzen. Kein Bildagenturmaterial,
nichts künstlich erzeugt. Das steht so auch im Impressum.

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
    fonts/               Bricolage, Newsreader, Martian Mono als woff2,
                         auf den deutschen Zeichensatz reduziert, 200 KB gesamt
    img/                 57 WebP-Dateien in vier Größen
    video/               Rundgang, 20 Sekunden
    icon/                Favicons
KONZEPT.md               Referenzanalyse, Palette, Schriftwahl, Begründungen
UEBERGABE.md             Diese Datei
.claude/                 Werkzeuge: lokaler Server, Screenshot- und Prüfskripte
```

**Lokal ansehen:**
```
node .claude/serve.mjs
```
Dann http://localhost:4321 aufrufen. Der Server liefert `site/` als Wurzelverzeichnis
aus, genau wie später der echte Server.
