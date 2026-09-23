# Gartenprofi Baleca · Ion Baleca

Die Seite spricht den Leser mit **Du** an.

(rechtlich: Gartenpflege Maria MD, siehe Impressum)

Website für einen Gartenpflegebetrieb im Raum Koblenz. Statisches HTML, CSS und
Vanilla JavaScript, kein Framework, kein Build-Schritt.

**Vor dem Livegang:** [UEBERGABE.md](UEBERGABE.md) durchgehen. Dort stehen die
offenen Daten, das Scharfschalten des Formulars und die Deploy-Checkliste.

**Gestalterische Herleitung:** [KONZEPT.md](KONZEPT.md). Die Farbpalette ist aus den
Fotos des Kunden gemessen, nicht gewählt.

## Lokal ansehen

```bash
node .claude/serve.mjs
```

Dann http://localhost:4321 aufrufen. Der Server liefert `site/` als Wurzelverzeichnis
aus, genau wie später der echte Server.

## Deployen

Der **Inhalt** von `site/` kommt in das Wurzelverzeichnis der Domain, nicht der Ordner
selbst. `index.html` liegt danach direkt unter `/`.

## Technik

- Zwei Schriften, lokal als woff2, auf den deutschen Zeichensatz reduziert, 56 KB
  gesamt: **Sentient** für Überschriften, **Supreme** für Fließtext und
  Auszeichnungen. Keine Verbindung zu Google Fonts.
- Farben aus der Fahrzeugbeschriftung gemessen: Dunkelgrün `#0C2E1F` trägt die
  ganze Seite, Gelb `#F2B623` ist der einzige Akzent, hell ist `#E9EBE4`.
- Der Hero ist eine tonlose Videoschleife aus einem fertigen Garten, die
  vollflächig hinter Satz und Knoepfen läuft. Es gibt zwei Fassungen der
  Datei, hochkant fürs Telefon und quer für den Schirm. Welche geladen
  wird, entscheidet `heroFilm()` in `site.js`. Details in UEBERGABE.md,
  Abschnitt 5e.
- GSAP mit ScrollTrigger, lokal eingebunden.
- Keine Cookies, keine Reichweitenmessung, keine externen Einbindungen.
- Alle Bilder in vier Größen als WebP, gebaut mit `python3 .claude/bilder.py`.
  Ein Durchgang vom Original bis zur fertigen Datei, ohne Zwischenschritt und ohne
  Vergrößerung. Die Marke kommt aus `python3 .claude/logo.py`.
- Ohne JavaScript vollständig lesbar und bedienbar.
