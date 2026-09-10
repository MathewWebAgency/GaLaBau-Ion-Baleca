# Gartenpflege Maria MD · Ion Baleca

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

- Zwei Schriften, lokal als woff2, auf den deutschen Zeichensatz reduziert, 164 KB
  gesamt: **Archivo** für Überschriften, Auszeichnungen und Zahlen, **Newsreader**
  für den Fließtext. Keine Verbindung zu Google Fonts.
- GSAP mit ScrollTrigger, lokal eingebunden.
- Keine Cookies, keine Reichweitenmessung, keine externen Einbindungen.
- Alle Bilder in vier Größen als WebP, gebaut mit `python3 .claude/bilder.py`.
  Ein Durchgang vom Original bis zur fertigen Datei, ohne Zwischenschritt und ohne
  Vergrößerung. Die Marke kommt aus `python3 .claude/logo.py`.
- Ohne JavaScript vollständig lesbar und bedienbar.
