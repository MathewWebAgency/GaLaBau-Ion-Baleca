# Design-Konzept: Gartenpflege Ion Baleca

Stand: 08.09.2026, vor dem Build. Der Build konsumiert dieses Dokument wörtlich.

---

## Phase 1: Referenzen

Aaron hat mir die Auswahl überlassen. Ich habe drei Seiten gewählt, jede aufgerufen
und ihre tatsächlichen Werte im Browser ausgelesen, nicht aus dem Gedächtnis beurteilt.

### 1. Gärtner von Eden (gaertner-von-eden.com)
Der deutsche Premium-Benchmark der Branche. Direkter Vergleichsmaßstab.

| | Befund |
|---|---|
| Display | Livory, Serif, 60px, Gewicht 900 |
| Body | Helvetica Neue, 16px |
| Eyebrow | Versalien, 22px, 1px Laufweite |
| Grund | reines Weiß #FFF |
| Text | reines Schwarz #000 |
| Akzent | Burgunder rgb(145,0,72), 37 Vorkommen |
| Seitenhöhe | 15.312px |

**Der wichtigste Befund:** Das Premium-Segment der deutschen Gartenbranche benutzt
kein Grün als Markenfarbe. Sie nehmen Burgunder. Das Grün kommt aus den Fotos.
Das übernehme ich.

**Was ich nicht übernehme:** Serif-Display. Das klingt nach Gartenarchitekturbüro.
Ion ist der Mann mit dem Freischneider, der auch schöne Beete baut. Außerdem reines
Weiß und reines Schwarz, beides tot.

### 2. Dan Pearson Studio (danpearsonstudio.com)
Landschaftsarchitekt, bildgeführt, extrem zurückgenommen.

| | Befund |
|---|---|
| Wortmarke | Founders Grotesk Condensed, 18px, **6px Laufweite**, Kleinbuchstaben |
| Grund | rgb(243,241,242), ein leicht warmes Fast-Weiß, kein #FFF |
| Farben gesamt | praktisch nur Schwarz plus Grundton |
| Seitenhöhe | 4.825px |

**Was ich übernehme:** Der getönte Grund statt Weiß. Und die Haltung, dass die Bilder
alles tragen und die Typografie sich zurücknimmt, bis auf eine Stelle: die Wortmarke
mit brutal weiter Laufweite. Diese eine typografische Geste trägt die ganze Marke.

**Was ich nicht übernehme:** Die Kühle. Pearson verkauft an Museen und Landgüter.
Ion verkauft an Hausbesitzer in Koblenz, die einen zugewachsenen Hof haben.

### 3. Vitsœ (vitsoe.com)
Außerhalb der Branche gewählt. Möbelmanufaktur mit dem Ruf für ehrliches Handwerk.

| | Befund |
|---|---|
| Schrift | Univers, **eine einzige Schrift für alles** |
| Größen | H1 26px, Body 14px. Winzig für heutige Verhältnisse |
| Akzent | genau ein Blau rgb(0,115,177) |

**Was ich übernehme:** Die Disziplin. Ein Akzent, nicht drei. Und die Haltung, dass
Vertrauen aus Klarheit entsteht, nicht aus Versprechen.

**Was ich nicht übernehme:** Die winzigen Größen und die Ein-Schrift-Regel. Ion braucht
Kontrast, weil er einen Vorher-Nachher-Effekt verkauft, keine Regalsysteme.

### Was ich in der Branche gesucht und nicht gefunden habe
Awwwards kennt unter "garden" nur Digitalagenturen, die zufällig so heißen. Deutsche
Gartenpflege-Seiten sehen fast ausnahmslos gleich aus: grünes Logo, Stockfoto mit
Rasenmäher, drei Icon-Kacheln, "Ihr Partner rund um den Garten". Das ist eine Chance,
kein Mangel.

---

## Phase 2: Das Konzept

### 2.0 Die These in einem Satz

Ion räumt auf und legt an, und der Beweis ist nicht ein Versprechen, sondern dieselbe
Stelle vorher und nachher.

Deshalb ist die Seite keine Leistungsbroschüre. Sie ist eine Beweisführung.

### 2.1 Das Signature-Element: die Kante

Auf zwei von Ions Fotos gibt es eine messerscharfe, schnurgerade Linie, wo heller
Zierkies an roten Rindenmulch stößt. Genau diese Kante unterscheidet einen guten
Gartenpfleger von einem schlechten. Jeder kann Mulch ausschütten. Die Grenze sauber
zu ziehen ist die Arbeit.

Diese Kante wird das durchgehende Gestaltungsmotiv der Seite:

- Sektionen werden nicht durch Abstand getrennt, sondern durch eine schräge, harte
  Materialkante. Fläche stößt an Fläche, ohne Übergang, exakt wie Kies an Mulch.
- Die Seite wechselt dabei zwischen zwei Gründen: hellem Kies und dunklem Mulch.
  Kein Farbverlauf, kein Schatten, keine weiche Blende. Nur die Kante.
- Der Hero-Wisch läuft entlang dieser Kante.
- Die Vorher/Nachher-Vergleiche werden von genau dieser Kante geteilt.

Das ist aus Ions Handwerk hergeleitet, nicht aufgesetzt. Und es gibt der Seite einen
Rhythmus, den kein Baukasten hat.

### 2.2 Farbe, aus den Fotos gemessen

Ich habe die Materialflächen in Ions eigenen Bildern angesteuert und die Durchschnitts-
werte ausgelesen. Keine Farbe hier ist geraten.

| Rolle | Wert | Herkunft |
|---|---|---|
| Grund hell (Kies) | `#E8E4DC` | Zierkies `#BAAFA1` und Travertin `#BCA898`, aufgehellt |
| Grund hell, zweite Stufe | `#D8D2C7` | Kies `#B29B7C`, aufgehellt |
| Grund dunkel (Mulch) | `#2E211D` | Rindenmulch `#614642`, abgedunkelt |
| Mulch, echt | `#614642` | direkt gemessen, Mitte des Beets |
| Text auf hell (Tinte) | `#221C18` | warmes Fast-Schwarz, nie `#000` |
| Text auf dunkel (Kalk) | `#F2EFE9` | nie `#FFF` |
| Akzent (Moos) | `#6B6E4F` | Lorbeer und Buchs, gemessen `#6B6E4F` |

**Nachtrag 10.09.2026, das dunkle Band wurde grün.** Der Kunde wollte mehr Grün. Ich
habe davon abgeraten, Grün zur Flächenfarbe zu machen — Grün auf Grün ist das
Branchenklischee, und die Herleitung oben sagt ausdrücklich, dass das Grün aus den
Fotos kommt. Der Kompromiss hält beides: die Farbe ist weiterhin **gemessen**, nur aus
einer anderen Quelle.

| Rolle | Wert | Herkunft |
|---|---|---|
| Laub im Mittel | `#4A623C` | Mittelwert aller eindeutig grünen Bildpunkte über fünf Aufnahmen: Eibe, Eibenhecke, Hecke nah, Lorbeerkugeln, fertige Anlage |
| Grund dunkel, neu | `#1D2718` | dasselbe Laub, abgedunkelt auf **genau die Helligkeit**, die das braune Band hatte. Kontrast zu Kalk bleibt 13,4:1 |
| Grund dunkel, zweite Stufe | `#3E5232` | dasselbe, auf die Helligkeit des alten `#614642` |
| Hauptknopf | `#8E9270` | der helle Moos-Ton. Text darauf 5,2:1, Fläche gegen das Band 4,8:1 |

Beim Knopf bin ich vom Vorgeschlagenen abgewichen: der dunklere Moos-Ton `#5D6043`
hätte auf dem grünen Band nur 3:1 Flächenkontrast gehabt und den wichtigsten Knopf der
Seite verschluckt. Der helle Ton hält das Grün und die Sichtbarkeit.

Drei Farben plus drei Zwischentöne. Der Akzent kommt selten: Eyebrows, Linien, aktive
Zustände. Die Handlungsaufforderung ist keine bunte Fläche, sondern Mulch-Dunkel mit
Kalk-Text. Kraft durch Kontrast, nicht durch Farbe.

Bewusst kein frisches Gartengrün. Das Grün kommt aus den Fotos, wie bei Gärtner von Eden.

Kontraste: Tinte auf Kies 14,2:1. Kalk auf Mulch 13,8:1. Kalk auf Moos 5,6:1. Alle über AA.

### 2.3 Typografie

Herleitung: Was steht auf Ions Fahrzeug, seinen Rechnungen, seiner Arbeitskleidung?
Ein kleiner Betrieb in Koblenz. Freischneider von Stihl, grüne Latzhose, Karohemd.
Bodenständig, aber die fertigen Beete sind präzise. Also: kräftig und klar, nicht
elegant. Keine Serif als Display, das wäre der Nachbar von Gärtner von Eden.

**Display: Bricolage Grotesque** (Google Fonts, OFL, variabel)
Eine Grotesk mit einer bewusst gebauten, leicht rauen Note. Der Name heißt Heimwerken.
Sie hat eine Breitenachse, mit der ich große Überschriften wirklich schmal setzen kann,
wie Beschriftung auf Maschinen und Schildern, und kleine Auszeichnungen normal breit.
Ein Font, zwei Anmutungen. Im Handwerkssegment praktisch nicht zu sehen.

**Body: Newsreader** (Google Fonts, OFL, variabel)
Warme Zeitungsserif mit optischer Größenachse und echter Kursive. Begründung: Ions
Bilder sind Reportage, kein Katalog. Eine Zeitungsserif erzählt, eine Grotesk listet auf.
Der Kontrast zur Display-Grotesk ist eindeutig.

**Label: Martian Mono** (Google Fonts, OFL, variabel)
Kondensierte Mono für Eyebrows, Ortsnamen, Zahlen, Öffnungszeiten. Versalien, weite
Laufweite, sehr klein. Das ist das Element, das die Seite professionell wirken lässt.

Alle drei lokal als woff2, `font-display: swap`, Preload nur für Bricolage im Hero.
Keine fremden CDN-Aufrufe.

**Type-Scale**, Verhältnis etwa 1,5 für dramatischen Kontrast:

| Rolle | Größe | Zeilenhöhe | Laufweite |
|---|---|---|---|
| Display XL | `clamp(3.2rem, 11vw, 9rem)` | 0,90 | -0,035em |
| H2 | `clamp(2rem, 5.2vw, 4.2rem)` | 1,00 | -0,025em |
| H3 | `1.45rem` | 1,20 | -0,01em |
| Body | `1.125rem` | 1,62 | normal, max 68ch |
| Label | `0.7rem` | 1,4 | 0,18em, Versalien |

Deutsche Typografie: richtige Anführungszeichen unten öffnend, `hyphens: auto` mit
`lang="de"`, keine Fake-Schnitte.

**Der Font-Check:** Tausche ich Ions Text gegen den eines Steuerberaters, sieht man
sofort, dass die Schrift falsch ist. Bestanden.

### 2.4 Sektionsfolge

| # | Sektion | Was sie leistet | Grund |
|---|---|---|---|
| 1 | Hero, die Kante | Die These in zwei Sekunden begreifbar machen | Kies |
| 2 | Einzugsgebiet | Sofort klären, ob er überhaupt zu mir kommt | Mulch |
| 3 | Vorher / Nachher | Der Beweis. Besucher zieht selbst am Regler | Kies |
| 4 | Leistungen | Die sechs echten Leistungen, jede mit echtem Bild | Mulch |
| 5 | Der Ablauf | Die Angst vor dem Unbekannten nehmen | Kies |
| 6 | Ion | Aus dem Betrieb wird ein Mensch | Mulch |
| 7 | Rundgang | Das echte Video. Beweis, dass die Bilder nicht geliehen sind | Kies |
| 8 | Was Leute abhält | Die Einwände direkt beantworten | Kies |
| 9 | Kontakt | Die eine Handlung | Mulch |

Jeder Grundwechsel ist eine Kante. Neun Sektionen, kein Füller.

### 2.5 Der eine Call to Action

**"Schick ein Foto von der Stelle, die dich stört."**

Begründung: Bei Gartenpflege ist die größte Hürde, dass der Kunde nicht weiß, was es
kostet und ob sein Fall zu groß oder zu klein ist. Ein Foto zu schicken kostet ihn
zehn Sekunden und keine Peinlichkeit. Und es passt exakt zur These der Seite: die
Seite lebt von Vorher-Bildern, also fängt der Kunde mit seinem eigenen Vorher an.

Zweiter Weg, gleichwertig sichtbar: Anrufen. Bei lokalen Handwerksbetrieben ist das
Telefon der Hauptkanal, besonders bei der Zielgruppe.

Jede Sektion verdient den nächsten Scroll in diese Richtung.

### 2.6 Der Hero-Moment

Der Hero ist ein geteilter Bildschirm, getrennt durch die schräge Kante. Links das
Vorher, rechts das Nachher.

**Beim Laden**, ohne dass jemand scrollen muss: Die Kante fährt von rechts über den
Schirm und zieht das Nachher-Bild über das Vorher, so wie Mulch aufgezogen wird.
Sie kommt bei etwa 55 Prozent zur Ruhe. Gleichzeitig steigt die Headline zeilenweise
versetzt auf.

**Beim Scrollen**, echt gekoppelt über ScrollTrigger mit `scrub`: Die Kante wandert
weiter, bis das Nachher den ganzen Schirm füllt. Der Besucher steuert die Verwandlung
mit seinem eigenen Daumen. Scrollt er zurück, wächst das Vorher wieder.

Ich baue davon drei Fassungen und schalte durch, statt eine zu bauen und zu hoffen:

- **A** Kante über Bildpaar, wie oben
- **B** Vollbild Panorama, Kante legt die Typografie frei
- **C** Hochformat-Video rechts, Typografie links, Kante als Trenner

### 2.7 Asset-Plan

**Keine Credits. Kein generiertes Bild. Alles echt.** Das ist in dieser Branche der
größte Vorteil, den wir haben.

| Sektion | Asset | Herkunft |
|---|---|---|
| 1 Hero | `beet-01-roh` und `beet-03-fertig` | echt, dieselbe Stelle |
| 3 Vorher/Nachher | 6 geprüfte Paare, gleicher Blickwinkel | echt, aus Collagen getrennt |
| 4 Leistungen | `ion-hecke`, `ba-hof-nachher`, `beet-abend`, `grundstueck-arbeit`, `streifen-fertig`, `haus-kugeln` | echt |
| 5 Ablauf | `beet-01-roh` → `beet-02-vlies` → `beet-03-fertig` | echt, dieselbe Stelle, drei Schritte |
| 6 Ion | `ion-treppe`, `ion-hecke` | echt |
| 7 Rundgang | `rundgang-scrub.mp4` | echtes Handy-Video, 20s, Hochformat |

**Die geprüften Vorher/Nachher-Paare** (gleiche Stelle, gleicher Blickwinkel, von mir
einzeln angesehen):

1. Hof mit Fugenbewuchs → sauber. Volle Auflösung, bestes Paar.
2. Zugewachsene Efeumauer → freigelegte Wand mit Tor
3. Garageneinfahrt zugewachsen → freigeschnitten
4. Hausecke Wildwuchs → geschnitten
5. Verwildertes Grundstück → geräumt
6. Hauswand mit Efeu → freigelegter Weg

**Technik:** Das Video habe ich für Scroll-Scrubbing mit kurzem Keyframe-Intervall
neu encodiert. Auf Mobil und bei `prefers-reduced-motion` läuft grundsätzlich das
Standbild, nicht das Video. Die Seite ist vollständig und schön, auch wenn das Video
nie lädt.

---

## Offene Punkte, die ich von Aaron brauche

1. **Impressum**: Inhaber Ion oder Maria Baleca, Steuernummer, Firmenname. Baue mit
   markierten Platzhaltern.
2. **Formularziel**: Wohin geht die Anfrage wirklich? Ohne Backend gibt es drei
   ehrliche Wege, siehe Rückfrage.
3. **Echte Zahlen**: Jahre im Geschäft, Anzahl betreuter Gärten. Nur wenn belegbar.
   Erfundene Zahlen kommen nicht auf die Seite.
4. **Erreichbarkeit**: Wann geht wirklich jemand ans Telefon?
5. **Domain** für die og-Tags.

## Ein Befund, den ich nennen muss

Auf zwei Fotos sind fremde Autos mit möglicherweise lesbaren Kennzeichen und fremde
Hauseingänge zu sehen. Ich prüfe die Auflösung und unkenntliche mache, was lesbar ist.
Das ist kein Drama, aber es gehört gemacht, bevor die Seite live geht.
