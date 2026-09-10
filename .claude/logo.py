#!/usr/bin/env python3
"""Die Marke aus der Vorlagenaufnahme nachzeichnen.

Die Vorlage ist eine Aufnahme des Zeichens auf weissem Grund. Daraus werden
zwei Masken gebaut, das ganze Zeichen und nur das Blattwerk, beide von potrace
in Kurven uebersetzt. Ergebnis sind Vektordateien: bei jeder Groesse scharf,
in zwei Farbfassungen, und ein echtes SVG-Favicon.

  assets/img/marke-hell.svg     fuer die dunklen Baender
  assets/img/marke-dunkel.svg   fuer Kies und Weiss
  assets/img/favicon.svg        Marke auf Kies, quadratisch
  assets/icon/icon-*.png        Startbildschirm, aus derselben Zeichnung

Warum zwei Dateien statt einer umfaerbbaren: eine ueber <img> geladene SVG
nimmt keine CSS-Variablen der Seite an, und die Marke dreissigmal in das HTML
einzubetten waere teurer als zwei Dateien, die der Browser einmal holt.

Voraussetzung: potrace (brew install potrace) und Pillow.
Aufruf: python3 .claude/logo.py
"""
import os
import re
import subprocess
import tempfile
from PIL import Image, ImageFilter

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUELLE = os.path.join(WURZEL, "_raw/neu/neu-06.jpg")
IMG = os.path.join(WURZEL, "site/assets/img")
# Fassungen, die die Seite selbst nicht braucht, aber der Kunde: Briefbogen,
# Rechnung, Fahrzeugbeschriftung.
MARKE = os.path.join(WURZEL, "_marke")
ICON = os.path.join(WURZEL, "site/assets/icon")

RAHMEN = 10        # dunkle Kante der Aufnahme, gehoert nicht zum Motiv
BLATT_AB = 80      # ab diesem hellsten Kanal gilt ein Punkt als Blattwerk
GENAU = 0.25       # Rasterfeinheit der Kurvenpunkte, siehe nachzeichnen()

KIES = "#DCDED6"
KALK = "#F2EFE9"
MOOS_HELL = "#8E9270"
B_DUNKEL = "#233024"
MOOS_TEXT = "#5D6043"


def masken():
    """Zwei Schwarzweissmasken: das ganze Zeichen und nur das Blattwerk."""
    roh = Image.open(QUELLE).convert("RGB")
    roh = roh.crop((RAHMEN, RAHMEN, roh.width - RAHMEN, roh.height - RAHMEN))
    w, h = roh.size
    px = roh.load()
    weich = roh.filter(ImageFilter.GaussianBlur(radius=6)).load()

    voll = Image.new("L", (w, h), 255)
    blatt = Image.new("L", (w, h), 255)
    pv, pb = voll.load(), blatt.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            mn, mx = min(r, g, b), max(r, g, b)
            if mx - mn < 14 and mn > 150:
                continue                      # Schlagschatten der Aufnahme
            if mn >= 193:
                continue                      # Papier
            pv[x, y] = 0
            wr, wg, wb = weich[x, y]
            if max(wr, wg, wb) >= BLATT_AB:
                pb[x, y] = 0

    bb = voll.point(lambda v: 255 if v == 0 else 0).getbbox()
    p = round(max(bb[2] - bb[0], bb[3] - bb[1]) * 0.02)
    kasten = (max(0, bb[0] - p), max(0, bb[1] - p),
              min(w, bb[2] + p), min(h, bb[3] + p))

    fertig = {}
    # Vordergrund ist schwarz. MinFilter weitet ihn, MaxFilter zieht ihn zurueck.
    # Erst weiten, dann zurueckziehen schliesst Loecher, ohne die Form zu aendern.
    for name, im, schliessen, rad in (("voll", voll, 5, 2.0), ("blatt", blatt, 9, 3.0)):
        k = im.crop(kasten).resize(((kasten[2] - kasten[0]) * 2,
                                    (kasten[3] - kasten[1]) * 2), Image.LANCZOS)
        k = k.filter(ImageFilter.MinFilter(schliessen)).filter(ImageFilter.MaxFilter(schliessen))
        k = k.filter(ImageFilter.GaussianBlur(radius=rad))
        fertig[name] = k.point(lambda v: 0 if v < 128 else 255).convert("1")
    return fertig


def nachzeichnen(maske, tmp, name):
    pbm = os.path.join(tmp, name + ".pbm")
    svg = os.path.join(tmp, name + ".svg")
    maske.save(pbm)
    subprocess.run(["potrace", "-s", "-t", "40", "-a", "1.3", "-O", "0.7",
                    "-o", svg, pbm], check=True)
    s = open(svg).read()
    tr = re.search(r"translate\(([\d.-]+),([\d.-]+)\) scale\(([\d.-]+),([\d.-]+)\)", s).groups()
    d = re.search(r'<path d="(.*?)"', s, re.S).group(1)
    # potrace rechnet in Zehntelpunkten. Ein Viertel davon reicht fuer jede
    # Groesse, in der die Marke je erscheint, und spart ein Drittel der Datei.
    # Der Massstab in der Gruppe faengt die Umrechnung wieder auf.
    d = re.sub(r"-?\d+(?:\.\d+)?", lambda m: "%d" % round(float(m.group(0)) * GENAU), d)
    gr = (float(re.search(r'width="([\d.]+)pt"', s).group(1)),
          float(re.search(r'height="([\d.]+)pt"', s).group(1)))
    tr = tuple(map(float, tr))
    tr = (tr[0], tr[1], tr[2] / GENAU, tr[3] / GENAU)
    return d, tr, gr


def schreibe_svg(pfad, viewbox, transform, pfade, rahmen=None):
    tx, ty, sx, sy = transform
    teile = []
    if rahmen:
        teile.append('<rect width="100%%" height="100%%" fill="%s"/>' % rahmen)
    teile.append('<g transform="translate(%.0f,%.0f) scale(%g,%g)">' % (tx, ty, sx, sy))
    for d, farbe in pfade:
        teile.append('<path fill="%s" d="%s"/>' % (farbe, d))
    teile.append("</g>")
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" role="img" '
           'aria-label="Gartenpflege Maria MD">%s</svg>\n' % (viewbox, "".join(teile)))
    open(pfad, "w").write(svg)
    return len(svg)


def main():
    m = masken()
    with tempfile.TemporaryDirectory() as tmp:
        d_voll, tr, gr = nachzeichnen(m["voll"], tmp, "voll")
        d_blatt, tr2, _ = nachzeichnen(m["blatt"], tmp, "blatt")
    assert tr == tr2, "beide Masken muessen dieselbe Grundflaeche haben"
    vb = "0 0 %.0f %.0f" % gr

    os.makedirs(MARKE, exist_ok=True)
    for ordner, datei, b, blatt in (
            (IMG, "marke-hell.svg", KALK, MOOS_HELL),
            (MARKE, "marke-hell.svg", KALK, MOOS_HELL),
            (MARKE, "marke-dunkel.svg", B_DUNKEL, MOOS_TEXT)):
        n = schreibe_svg(os.path.join(ordner, datei), vb, tr,
                         [(d_voll, b), (d_blatt, blatt)])
        print("  %-28s %6d Bytes" % (os.path.relpath(os.path.join(ordner, datei), WURZEL), n))

    # Favicon: quadratisch, Marke mittig auf Kies.
    rand = gr[1] * 0.13
    seite = gr[1] + 2 * rand
    versatz = (seite - gr[0]) / 2
    tx, ty, sx, sy = tr
    n = schreibe_svg(os.path.join(IMG, "favicon.svg"),
                     "0 0 %.0f %.0f" % (seite, seite),
                     (tx + versatz, ty + rand, sx, sy),
                     [(d_voll, B_DUNKEL), (d_blatt, MOOS_TEXT)], rahmen=KIES)
    print("  %-20s %6d Bytes" % ("favicon.svg", n))

    # Rasterfassungen fuer den Startbildschirm, aus derselben Maske.
    voll = m["voll"]
    marke = Image.new("RGBA", voll.size, (0, 0, 0, 0))
    zb = marke.load()
    pv, pb = voll.convert("L").load(), m["blatt"].convert("L").load()
    du = tuple(int(B_DUNKEL[i:i + 2], 16) for i in (1, 3, 5))
    mo = tuple(int(MOOS_TEXT[i:i + 2], 16) for i in (1, 3, 5))
    ki = tuple(int(KIES[i:i + 2], 16) for i in (1, 3, 5))
    for y in range(voll.height):
        for x in range(voll.width):
            if pv[x, y] == 0:
                zb[x, y] = (*(mo if pb[x, y] == 0 else du), 255)
    for px_ in (32, 180, 192, 512):
        r = round(px_ * 0.13)
        innen = px_ - 2 * r
        s = min(innen / marke.width, innen / marke.height)
        k = marke.resize((max(1, round(marke.width * s)), max(1, round(marke.height * s))),
                         Image.LANCZOS)
        icon = Image.new("RGBA", (px_, px_), (*ki, 255))
        icon.alpha_composite(k, ((px_ - k.width) // 2, (px_ - k.height) // 2))
        pfad = os.path.join(ICON, "icon-%d.png" % px_)
        icon.convert("RGB").save(pfad, "PNG", optimize=True)
        print("  %-20s %6d Bytes" % ("icon-%d.png" % px_, os.path.getsize(pfad)))


if __name__ == "__main__":
    main()
