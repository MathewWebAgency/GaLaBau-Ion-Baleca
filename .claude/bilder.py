#!/usr/bin/env python3
"""Bildaufbereitung für die Website.

Ein Durchgang von der Originaldatei bis zum fertigen WebP. Kein Zwischenschritt
über JPEG, kein zweites Herunterrechnen, keine Vergrößerung über die
Originalgröße hinaus. Genau daran ist die erste Fassung kaputtgegangen.

  python3 .claude/bilder.py            alle Aufträge neu bauen
  python3 .claude/bilder.py hero       nur Aufträge, deren Name "hero" enthält

Voraussetzung: Pillow (python3 -m pip install --user Pillow)
"""
import os
import sys
from PIL import Image, ImageFilter

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIEL = os.path.join(WURZEL, "site", "assets", "img")

# Qualität. Ab 80 ist bei diesem Laubmaterial kein Unterschied mehr zu 90 zu
# sehen, darunter fangen Blattkanten an zu blocken. Höher zu gehen kostet nur
# Ladezeit, weil dichtes Grün ohnehin die teuerste Textur ist, die es gibt.
Q = 80
METHODE = 6          # langsamster, bester Encoder-Durchgang
BREITEN = (480, 800, 1200, 1600)


def zuschnitt(im, box):
    """box = (links, oben, rechts, unten) in Anteilen von 0..1."""
    if not box:
        return im
    l, o, r, u = box
    w, h = im.size
    return im.crop((round(l * w), round(o * h), round(r * w), round(u * h)))


def auf_verhaeltnis(im, ver, fokus=(0.5, 0.5)):
    """Auf ein Seitenverhältnis beschneiden, ohne zu verzerren.

    ver = Breite/Höhe. fokus sagt, welcher Punkt des Bildes stehen bleibt,
    wenn beschnitten werden muss.
    """
    if not ver:
        return im
    w, h = im.size
    if w / h > ver:                       # zu breit, seitlich abschneiden
        nw, nh = round(h * ver), h
    else:                                 # zu hoch, oben/unten abschneiden
        nw, nh = w, round(w / ver)
    fx, fy = fokus
    x = min(max(round(fx * w - nw / 2), 0), w - nw)
    y = min(max(round(fy * h - nh / 2), 0), h - nh)
    return im.crop((x, y, x + nw, y + nh))


def schreibe(im, pfad, q=Q):
    im.save(pfad, "WEBP", quality=q, method=METHODE)
    return os.path.getsize(pfad)


def baue(quelle, name, box=None, ver=None, fokus=(0.5, 0.5), breiten=BREITEN,
         q=Q, alpha=False, deckel=None):
    src = os.path.join(WURZEL, quelle)
    im = Image.open(src)
    im = im.convert("RGBA" if alpha else "RGB")
    im = zuschnitt(im, box)
    im = auf_verhaeltnis(im, ver, fokus)
    # deckel begrenzt die groesste ausgelieferte Fassung. Sinnvoll, wenn die
    # Quelle groesser ist, als die Flaeche auf der Seite je darstellt.
    if deckel and im.width > deckel:
        im = im.resize((deckel, round(im.height * deckel / im.width)), Image.LANCZOS)
    voll_w, voll_h = im.size

    # Größte Fassung: die native Größe, ohne Neuberechnung.
    ausgaben = [(os.path.join(ZIEL, f"{name}.webp"), im, voll_w)]

    for b in breiten:
        if b >= voll_w:
            continue
        h = round(voll_h * b / voll_w)
        klein = im.resize((b, h), Image.LANCZOS)
        # Nach dem Verkleinern minimal nachschärfen. Mehr als das sieht künstlich aus.
        klein = klein.filter(ImageFilter.UnsharpMask(radius=0.6, percent=40, threshold=3))
        ausgaben.append((os.path.join(ZIEL, f"{name}-{b}.webp"), klein, b))

    zeilen = []
    for pfad, bild, b in ausgaben:
        groesse = schreibe(bild, pfad, q)
        zeilen.append(f"    {os.path.basename(pfad):<34} {bild.size[0]}x{bild.size[1]:<6} {groesse/1024:6.0f} KB")
    print(f"  {name}  <- {quelle}  ({voll_w}x{voll_h})")
    print("\n".join(zeilen))
    return voll_w, voll_h


# ---------------------------------------------------------------------------
# Aufträge. Reihenfolge wie auf der Seite.
# box: (links, oben, rechts, unten) als Anteil, vor allem anderen angewendet.
# ver: Zielverhältnis Breite/Höhe. fokus: Bildpunkt, der stehen bleibt.
# ---------------------------------------------------------------------------
AUFTRAEGE = [
    # --- Hero: Ion auf der Leiter über der geschnittenen Eibe.
    #     Die Aufnahme hat 1200 Bildpunkte, die Bildbahn braucht auf einem
    #     grossen Retina-Bildschirm rund 1650. Deshalb liegt hier die
    #     verdoppelte Fassung zugrunde. ---
    # Die Bildbahn ist gemessen 43vw breit. Auf einem 1440er Retina-Schirm sind
    # das 1238 Bildpunkte, deshalb die Zwischenstufe 1280 statt eines Sprungs
    # von 1200 auf 1600.
    dict(quelle="_work/up/up-hero.png", name="hero-hecke", ver=None, deckel=1800,
         breiten=(480, 800, 1280)),
    # Für schmale Geräte ein eigener Ausschnitt: dort ist die Bildbahn ein
    # querliegendes Band, in dem das Hochformat den Mann abschneiden würde.
    dict(quelle="_work/up/up-hero.png", name="hero-hecke-quer", box=(0.19, 0.0, 0.95, 0.40), deckel=1400),

    # --- Vorher / Nachher ---
    dict(quelle="_work/named/ba-hof-vorher.jpg", name="ba-hof-vorher", ver=4 / 5, fokus=(0.5, 0.5)),
    dict(quelle="_work/named/ba-hof-nachher.jpg", name="ba-hof-nachher", ver=4 / 5, fokus=(0.5, 0.5)),
    dict(quelle="_work/named/ba-mauer-vorher.jpg", name="ba-mauer-vorher", ver=4 / 5, fokus=(0.5, 0.5)),
    dict(quelle="_work/named/ba-mauer-nachher.jpg", name="ba-mauer-nachher", ver=4 / 5, fokus=(0.5, 0.5)),
    # Diese sechs kamen als Kacheln aus Bildschirmfotos von Collagen, je rund 450
    # Bildpunkte breit. Sie sind mit Topaz vervierfacht (siehe UEBERGABE, "Bilder
    # und Marke"). Die Originale aus Ions Telefon waeren immer noch besser.
    dict(quelle="_work/up/up-ba-garage-vorher.png", name="ba-garage-vorher", ver=4 / 5, fokus=(0.5, 0.5), deckel=1000),
    dict(quelle="_work/up/up-ba-garage-nachher.png", name="ba-garage-nachher", ver=4 / 5, fokus=(0.5, 0.5), deckel=1000),
    dict(quelle="_work/up/up-ba-ecke-vorher.png", name="ba-ecke-vorher", ver=4 / 5, fokus=(0.5, 0.5), deckel=1000),
    dict(quelle="_work/up/up-ba-ecke-nachher.png", name="ba-ecke-nachher", ver=4 / 5, fokus=(0.5, 0.5), deckel=1000),
    dict(quelle="_work/up/up-ba-grundstueck-vorher.png", name="ba-grundstueck-vorher", ver=4 / 5, fokus=(0.5, 0.5), deckel=1000),
    dict(quelle="_work/up/up-ba-grundstueck-nachher.png", name="ba-grundstueck-nachher", ver=4 / 5, fokus=(0.5, 0.5), deckel=1000),
    # Neu: Formschnitt an der Thuja, während der Arbeit und fertig.
    dict(quelle="_raw/neu/neu-07.jpg", name="ba-formschnitt-vorher", box=(0.0, 0.0, 0.90, 1.0), ver=4 / 5, fokus=(0.5, 0.51)),
    dict(quelle="_raw/neu/neu-08.jpg", name="ba-formschnitt-nachher", box=(0.10, 0.0, 1.0, 1.0), ver=4 / 5, fokus=(0.5, 0.49)),

    # --- Leistungen (5:4 quer) ---
    dict(quelle="_work/named/haus-kugeln.jpg", name="haus-kugeln", ver=5 / 4, fokus=(0.5, 0.5)),
    dict(quelle="_raw/neu/neu-10.jpg", name="hecke-strasse", ver=5 / 4, fokus=(0.5, 0.52)),
    dict(quelle="_work/named/beet-abend.jpg", name="beet-abend", ver=5 / 4, fokus=(0.5, 0.45)),
    dict(quelle="_work/named/grundstueck-arbeit.jpg", name="grundstueck-arbeit", ver=5 / 4, fokus=(0.5, 0.5)),
    dict(quelle="_work/named/streifen-fertig.jpg", name="streifen-fertig", ver=5 / 4, fokus=(0.5, 0.45)),

    # --- Ablauf: drei Schritte (4:3 quer) ---
    dict(quelle="_work/named/beet-01-roh.jpg", name="beet-01-roh", ver=4 / 3, fokus=(0.5, 0.5)),
    dict(quelle="_work/named/beet-02-vlies.jpg", name="beet-02-vlies", ver=4 / 3, fokus=(0.5, 0.5)),
    dict(quelle="_work/named/beet-03-fertig.jpg", name="beet-03-fertig", ver=4 / 3, fokus=(0.5, 0.5)),

    # --- Wer kommt: Ion von vorn, auf der Treppe, zeigt ins fertige Beet.
    #     Der Fokus liegt links, damit ihm der 4:5-Beschnitt nicht die Schulter
    #     abschneidet wie in der ersten Fassung. ---
    dict(quelle="_work/named/ion-treppe.jpg", name="ion-beet", ver=4 / 5, fokus=(0.0, 0.5)),

    # --- Rundgang: Standbild ist das erste Videobild, damit beim Start
    #     nichts springt. Der Rahmen ist 9:16, die Datei auch. ---
    dict(quelle="_review/vf_0.jpg", name="rundgang-standbild", ver=None),

    # Nicht eingebunden, aber vorhanden, falls eine Fläche noch ein Bild
    # braucht: _raw/neu/neu-09.jpg (Schnitt aus der Nähe), neu-11.jpg (Leiter
    # an der grossen Eibe), neu-12.jpg (zweite Aufnahme an der Straße),
    # neu-04.jpg (Heckenreihe vor dem Schnitt) und
    # _work/named/garten-panorama.jpg (fertige Anlage, bisher das Hero-Bild).
]


def main():
    filt = sys.argv[1] if len(sys.argv) > 1 else ""
    os.makedirs(ZIEL, exist_ok=True)
    n = 0
    for a in AUFTRAEGE:
        if filt and filt not in a["name"]:
            continue
        baue(**a)
        n += 1
    print(f"\n{n} Aufträge gebaut nach {ZIEL}")


if __name__ == "__main__":
    main()
