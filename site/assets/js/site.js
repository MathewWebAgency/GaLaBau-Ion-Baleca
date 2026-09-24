/* Gartenprofi Baleca · Ion Baleca
   Bewegung: nur da, wo sie etwas trägt. Alles andere bleibt still. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Formspree. Ohne Kennung schickt das Formular nichts los und sagt das
     dem Besucher ehrlich, statt so zu tun als wäre etwas angekommen.
     ------------------------------------------------------------------ */
  var FORMSPREE_ID = ''; // z.B. 'xayzbwqd' aus formspree.io

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var istRuhig = function () { return reduce.matches; };
  var beiAenderung = function (mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  };
  beiAenderung(reduce, function () {
    if (!reduce.matches) return;
    document.querySelectorAll('.auf').forEach(function (el) { el.classList.add('ist-da'); });
  });
  var hatGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (hatGsap) gsap.registerPlugin(ScrollTrigger);

  /* ================= Kopfleiste erscheint nach dem Hero ================= */
  (function kopfleiste() {
    var kopf = document.getElementById('kopf');
    var hero = document.getElementById('top');
    if (!kopf || !hero) return;
    var io = new IntersectionObserver(function (eintraege) {
      var weg = !eintraege[0].isIntersecting;
      kopf.classList.toggle('ist-da', weg);
      // Solange der Hero nicht sichtbar ist, braucht seine Kante keine eigene Ebene.
      if (weg) hero.classList.remove('bewegt'); else hero.classList.add('bewegt');
    }, { rootMargin: '-88% 0px 0px 0px' });
    io.observe(hero);
  })();

  /* ========================= Auftritte je Sektion ======================== */
  (function auftritte() {
    var kandidaten = document.querySelectorAll('.auf');
    if (!kandidaten.length) return;
    if (istRuhig()) {
      kandidaten.forEach(function (el) { el.classList.add('ist-da'); });
      return;
    }
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        var geschwister = Array.prototype.filter.call(
          e.target.parentElement ? e.target.parentElement.children : [],
          function (k) { return k.classList && k.classList.contains('auf'); }
        );
        var i = geschwister.indexOf(e.target);
        e.target.style.transitionDelay = (i > 0 ? Math.min(i, 5) * 55 : 0) + 'ms';
        e.target.classList.add('ist-da');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    kandidaten.forEach(function (el) { io.observe(el); });
  })();

  /* ============================== Hero ==================================
     Der Garten laeuft von selbst, tonlos, als Schleife. Er laedt bewusst
     spaet: das Standbild traegt den ersten Bildaufbau, und wer Datensparen
     eingeschaltet hat, in einem langsamen Netz haengt oder wenig Bewegung
     moechte, bekommt das Standbild und sonst nichts. */
  (function heroFilm() {
    var QUELLE = 'assets/video/garten-hero.mp4';
    var video = document.getElementById('hero-video');
    var hero = document.getElementById('top');
    if (!video || !hero) return;
    if (istRuhig()) return;

    var netz = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (netz && (netz.saveData || /(^|-)2g$/.test(netz.effectiveType || ''))) return;

    var still = hero.querySelector('.hero__still');
    var laeuft = false;

    // Ein abgelehntes play() darf nicht das Ende sein. Manche Geraete
    // verweigern das selbsttaetige Abspielen, iPhones im Stromsparmodus zum
    // Beispiel. Dann bleibt das Standbild stehen, und beim ersten Antippen
    // oder Scrollen wird es noch einmal versucht. Ohne das saehe ein Teil der
    // Besucher den Garten nie laufen, ohne dass es je auffiele.
    var wartetAufTipp = false;
    var beimNaechstenTipp = function (nochmal) {
      if (wartetAufTipp) return;
      wartetAufTipp = true;
      var los = function () {
        wartetAufTipp = false;
        document.removeEventListener('pointerdown', los);
        document.removeEventListener('touchstart', los);
        window.removeEventListener('scroll', los);
        nochmal();
      };
      document.addEventListener('pointerdown', los, { passive: true });
      document.addEventListener('touchstart', los, { passive: true });
      window.addEventListener('scroll', los, { passive: true });
    };

    var anwerfen = function () {
      if (laeuft) return;
      laeuft = true;
      // Meist hat das kleine Script direkt am Video die Quelle schon gesetzt
      // und das Laden laeuft. Dann nicht noch einmal von vorn anfangen.
      if (!video.getAttribute('src')) {
        video.preload = 'auto';
        video.src = video.canPlayType('video/mp4; codecs="av01.0.08M.08"') === 'probably'
          ? QUELLE.replace('.mp4', '-av1.mp4') : QUELLE;
      }
      // Das Standbild bleibt darunter liegen, es kostet nichts mehr und
      // deckt den Moment ab, in dem die Schleife neu ansetzt.
      if (!video.paused && video.readyState >= 3) video.classList.add('laeuft');
      else video.addEventListener('playing', function () { video.classList.add('laeuft'); }, { once: true });

      var versuch = video.play();
      if (versuch && versuch.catch) {
        versuch.catch(function () {
          video.removeAttribute('src');
          video.load();
          laeuft = false;
          beimNaechstenTipp(anwerfen);
        });
      }
    };

    // Sofort, nicht erst nach dem load-Ereignis: das wartete auf jedes Bild
    // und jede Schrift, und das Video kam auf jedem Geraet spuerbar spaet.
    anwerfen();

    // Ausserhalb des Bildes rechnet niemand gern weiter.
    var imBild = true;
    var io = new IntersectionObserver(function (e) {
      imBild = e[0].isIntersecting;
      if (!laeuft) return;
      if (imBild) video.play().catch(function () {});
      else video.pause();
    }, { threshold: 0.05 });
    io.observe(hero);

    // Der Browser haelt das Video an, sobald der Tab in den Hintergrund
    // geht, und startet es von allein nicht wieder. Der Beobachter oben
    // merkt davon nichts, weil sich am Bildausschnitt nichts aendert: wer
    // zurueckkommt, sieht dann ein Standbild und haelt es fuer kaputt.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      if (!laeuft || !imBild) return;
      if (video.paused) video.play().catch(function () {});
    });
  })();

  /* ========================== Laufband =================================
     Ion faehrt die Region ab, also laeuft die Leiste.

     Vorher lief sie als CSS-Animation und das Scrollen hat die
     animation-duration verkuerzt. Das ist falsch: der Browser rechnet den
     Fortschritt aus verstrichener Zeit geteilt durch Dauer, eine halbierte
     Dauer verdoppelt den Fortschritt also augenblicklich und die Leiste
     springt quer ueber den Bildschirm. Deshalb rechnet die Position jetzt
     selbst, Bild fuer Bild, und die Geschwindigkeit darf sich stetig aendern,
     ohne dass die Position einen Sprung macht. */
  (function laufband() {
    var zug = document.querySelector('.laufband__zug');
    if (!zug || istRuhig()) return;

    var GRUND = 26;          // Bildpunkte je Sekunde in Ruhe
    var MAX   = 3;           // hoechstens dreifaches Tempo beim Scrollen
    var strecke = 0, tempo = 1, ziel = 1, letzteZeit = 0, letzterY = window.scrollY;
    var halbe = 0;

    var messen = function () {
      // Die Ortsliste steht zweimal im Zug. Eine Haelfte ist die Strecke,
      // nach der sich das Bild exakt wiederholt.
      halbe = zug.scrollWidth / 2;
    };
    messen();

    // Anhalten, solange jemand liest oder mit der Tastatur darin steht.
    var pause = false;
    var band = zug.closest('.laufband');
    if (band) {
      ['pointerenter','focusin'].forEach(function (ev) {
        band.addEventListener(ev, function () { pause = true; });
      });
      ['pointerleave','focusout'].forEach(function (ev) {
        band.addEventListener(ev, function () { pause = false; });
      });
    }

    var laeuft = false;
    var schritt = function (jetzt) {
      requestAnimationFrame(schritt);
      if (!letzteZeit || pause) { letzteZeit = jetzt; return; }
      var dt = Math.min(0.05, (jetzt - letzteZeit) / 1000);
      letzteZeit = jetzt;

      tempo += (ziel - tempo) * Math.min(1, dt * 6);
      ziel  += (1 - ziel) * Math.min(1, dt * 2.5);

      strecke += GRUND * tempo * dt;
      if (halbe > 0 && strecke >= halbe) strecke -= halbe;
      zug.style.transform = 'translate3d(' + (-strecke).toFixed(2) + 'px,0,0)';
    };

    var starten = function () {
      if (laeuft) return;
      laeuft = true;
      requestAnimationFrame(schritt);
    };

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      ziel = Math.min(MAX, 1 + Math.abs(y - letzterY) / 90);
      letzterY = y;
    }, { passive: true });

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t); t = setTimeout(messen, 200);
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(messen);
    starten();
  })();

  /* ========================= Fotos anhängen ============================= */
  /* Am Telefon gibt es zwei Wege, und beide sollen sichtbar sein: aufnehmen
     oder aus der Galerie. Beide Felder schreiben in dieselbe Liste, damit das
     Formular am Ende nur ein Feld verschickt. */
  (function fotos() {
    var galerie = document.getElementById('foto');
    var kamera = document.getElementById('foto-kamera');
    var liste = document.getElementById('fotoliste');
    if (!galerie || !liste) return;

    var MAX = 3;
    var kannBuendeln = typeof window.DataTransfer === 'function';

    // Ohne Kamera am Gerät wäre der Knopf eine Sackgasse: er öffnet dann nur
    // denselben Dateidialog. Deshalb erscheint er nur auf Zeigegeräten, die
    // sich wie ein Finger verhalten.
    var knopf = document.getElementById('foto-kamera-knopf');
    if (knopf && kamera && window.matchMedia('(pointer: coarse)').matches) knopf.hidden = false;

    var mb = function (bytes) {
      var m = bytes / (1024 * 1024);
      return (m < 0.1 ? '<0,1' : m.toFixed(1).replace('.', ',')) + ' MB';
    };

    var setze = function (dateien) {
      if (!kannBuendeln) return;
      var dt = new DataTransfer();
      dateien.slice(0, MAX).forEach(function (f) { dt.items.add(f); });
      galerie.files = dt.files;
    };

    var zeichne = function () {
      var dateien = Array.prototype.slice.call(galerie.files);
      liste.textContent = '';
      dateien.forEach(function (datei, i) {
        var li = document.createElement('li');
        var name = document.createElement('span');
        name.className = 'fotoliste__name';
        name.textContent = datei.name;
        var groesse = document.createElement('span');
        groesse.className = 'fotoliste__groesse';
        groesse.textContent = mb(datei.size);
        li.appendChild(name);
        li.appendChild(groesse);
        if (kannBuendeln) {
          var weg = document.createElement('button');
          weg.type = 'button';
          weg.className = 'fotoliste__weg';
          weg.setAttribute('aria-label', datei.name + ' wieder entfernen');
          weg.textContent = '\u00d7';
          weg.addEventListener('click', function () {
            var rest = Array.prototype.slice.call(galerie.files);
            rest.splice(i, 1);
            setze(rest);
            zeichne();
          });
          li.appendChild(weg);
        }
        liste.appendChild(li);
      });
    };

    galerie.addEventListener('change', zeichne);
    if (kamera) {
      kamera.addEventListener('change', function () {
        if (!kamera.files.length) return;
        if (kannBuendeln) {
          setze(Array.prototype.slice.call(galerie.files)
            .concat(Array.prototype.slice.call(kamera.files)));
          kamera.value = '';
        } else {
          // Ohne DataTransfer geht nur eins von beidem. Dann gewinnt die
          // Aufnahme, und das Feld trägt den Namen, damit sie mitgeschickt wird.
          kamera.name = 'foto';
          galerie.removeAttribute('name');
        }
        zeichne();
      });
    }
  })();

  /* ===================== Vorher / Nachher Regler ======================== */
  (function vergleiche() {
    var karten = document.querySelectorAll('[data-ba]');
    karten.forEach(function (figur, index) {
      var buehne = figur.querySelector('.ba__buehne');
      var regler = figur.querySelector('.ba__regler');
      if (!buehne || !regler) return;

      var beruehrt = false;
      var setzen = function (p) { buehne.style.setProperty('--p', p); };
      setzen(regler.value);

      // Zeigerbewegung folgt 1:1, ohne Easing. Direkte Bedienung darf nicht nachlaufen.
      regler.addEventListener('input', function () {
        beruehrt = true;
        setzen(regler.value);
      });
      regler.addEventListener('pointerdown', function () { beruehrt = true; buehne.classList.add('zieht'); });
      ['pointerup','pointercancel','blur'].forEach(function (ev) {
        regler.addEventListener(ev, function () { buehne.classList.remove('zieht'); });
      });

      if (istRuhig() || index !== 0) return;

      // Nur die erste Karte zeigt einmal, dass man ziehen kann.
      // Sechs Karten, die gleichzeitig wackeln, wären Effekt statt Hinweis.
      var io = new IntersectionObserver(function (eintraege) {
        if (!eintraege[0].isIntersecting || beruehrt) return;
        io.disconnect();
        var start = performance.now(), dauer = 900;
        (function schritt(jetzt) {
          if (beruehrt) { setzen(regler.value); return; }
          var t = Math.min((jetzt - start) / dauer, 1);
          // hin und zurueck, weich
          var welle = Math.sin(t * Math.PI);
          var eased = 1 - Math.pow(1 - welle, 2);
          var p = 50 + eased * 13;
          setzen(p);
          regler.value = p;
          if (t < 1) requestAnimationFrame(schritt);
          else { regler.value = 50; setzen(50); }
        })(start);
      }, { threshold: 0.55 });
      io.observe(figur);
    });
  })();

  /* ======================== Linie beim Ablauf =========================== */
  (function linie() {
    var svg = document.querySelector('.linie-svg');
    if (!svg) return;
    var pfad = svg.querySelector('path');
    if (!pfad) return;
    if (istRuhig() || !hatGsap) { pfad.style.strokeDasharray = 'none'; return; }
    pfad.style.strokeDasharray = '1';
    pfad.style.strokeDashoffset = '1';
    ScrollTrigger.create({
      trigger: svg, start: 'top 92%', end: 'top 46%', scrub: 0.5,
      onUpdate: function (s) { pfad.style.strokeDashoffset = String(1 - s.progress); }
    });
  })();

  /* ============================= Einwände =============================== */
  (function aufklapper() {
    document.querySelectorAll('.frage__knopf').forEach(function (knopf) {
      var ziel = document.getElementById(knopf.getAttribute('aria-controls'));
      if (!ziel) return;

      knopf.addEventListener('click', function () {
        var offen = knopf.getAttribute('aria-expanded') === 'true';
        knopf.setAttribute('aria-expanded', String(!offen));

        if (istRuhig()) { ziel.style.height = offen ? '0px' : 'auto'; ziel.style.opacity = offen ? '0' : '1'; return; }

        var jetzt = ziel.getBoundingClientRect().height;
        var voll = ziel.scrollHeight;
        ziel.style.transition = 'none';
        ziel.style.height = jetzt + 'px';
        ziel.style.opacity = offen ? '1' : String(jetzt / (voll || 1));
        ziel.offsetHeight; // Layout erzwingen, damit der Übergang greift
        // Auf und zu beide mit ease-out. Was sich zeigt oder verschwindet,
        // soll schnell anfangen, nicht langsam.
        ziel.style.transition = offen
          ? 'height 190ms var(--ease-out), opacity 130ms var(--ease-out)'
          : 'height 230ms var(--ease-out), opacity 200ms var(--ease-out)';
        ziel.style.height = (offen ? 0 : voll) + 'px';
        ziel.style.opacity = offen ? '0' : '1';

        if (!offen) {
          ziel.addEventListener('transitionend', function nachher(e) {
            if (e.propertyName !== 'height') return;
            ziel.style.height = 'auto';
            ziel.removeEventListener('transitionend', nachher);
          });
        }
      });
    });
  })();

  /* ============================== Filme ================================= */
  /* Zwei Aufnahmen, dieselbe Mechanik: das Standbild trägt den Aufbau, das
     Video wird erst geladen, wenn jemand es sehen will, und pausiert wieder,
     sobald es aus dem Bild scrollt. */
  (function filme() {
    var rahmen = document.querySelectorAll('[data-film]');
    if (!rahmen.length) return;

    Array.prototype.forEach.call(rahmen, function (figur) {
      var video = figur.querySelector('.film__video');
      var standbild = figur.querySelector('.film__still');
      var knopf = figur.querySelector('.videoknopf');
      if (!video || !knopf) return;
      var geladen = false;
      var laden = function () {
        if (geladen) return;
        geladen = true;
        video.preload = 'auto';
        video.src = video.getAttribute('data-quelle');
        video.addEventListener('playing', function () {
          if (standbild) standbild.style.opacity = '0';
        }, { once: true });
      };

      // Der Knopf liegt als Flaeche ueber dem ganzen Video: antippen spielt ab,
      // nochmal antippen haelt an. Waehrend es laeuft, ist das Dreieck weg.
      var setzeKnopf = function (laeuft) {
        knopf.setAttribute('aria-pressed', String(laeuft));
        knopf.setAttribute('aria-label', laeuft ? 'Video anhalten' : 'Video abspielen');
        figur.classList.toggle('laeuft', laeuft);
      };

      knopf.addEventListener('click', function () {
        laden();
        if (video.paused) { video.play().then(function () { setzeKnopf(true); }).catch(function () {}); }
        else { video.pause(); setzeKnopf(false); }
      });
      video.addEventListener('pause', function () { setzeKnopf(false); });
      video.addEventListener('play', function () { setzeKnopf(true); });

      // Aus dem Bild heraus wird angehalten, damit nie zwei gleichzeitig laufen
      // und das Handy nicht umsonst rechnet.
      var io = new IntersectionObserver(function (eintraege) {
        if (!eintraege[0].isIntersecting && !video.paused) video.pause();
      }, { threshold: 0.35 });
      io.observe(figur);

      // Schon laden, wenn das Video noch gut eine Bildschirmhoehe entfernt ist.
      // Beim Antippen ist es dann da, statt erst dann anzufangen.
      var vorab = new IntersectionObserver(function (eintraege) {
        if (!eintraege[0].isIntersecting) return;
        vorab.disconnect();
        var n = navigator.connection;
        if (n && n.saveData) return;
        laden();
      }, { rootMargin: '100% 0px 100% 0px' });
      vorab.observe(figur);

      // Steht der Hero-Film, laedt der Browser dieses Video gleich hinterher,
      // statt zu warten, bis man in die Naehe scrollt. Nur wo es sichtbar ist,
      // auf Desktop und Tablet ist der Abschnitt ausgeblendet.
      window.addEventListener('load', function () {
        window.setTimeout(function () {
          var n = navigator.connection;
          if (n && n.saveData) return;
          if (figur.offsetParent === null) return;
          vorab.disconnect();
          laden();
        }, 1200);
      }, { once: true });
    });
  })();

  /* ============================== Formular ============================== */
  (function formular() {
    var form = document.getElementById('anfrage');
    var meldung = document.getElementById('meldung');
    var knopf = document.getElementById('senden');
    if (!form || !meldung || !knopf) return;

    var zeige = function (txt, fehler) {
      meldung.textContent = txt;
      meldung.classList.toggle('meldung--fehler', !!fehler);
      meldung.hidden = false;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Jedes Feld sagt selbst, was ihm fehlt, statt einer Sammelmeldung oben.
      var felder = form.querySelectorAll('input[required], textarea[required]');
      var erstesFehlende = null;
      felder.forEach(function (feld) {
        var fehlt = !feld.checkValidity();
        var hinweis = document.getElementById(feld.id + '-fehler');
        feld.setAttribute('aria-invalid', String(fehlt));
        if (hinweis) hinweis.hidden = !fehlt;
        if (fehlt && !erstesFehlende) erstesFehlende = feld;
      });
      if (erstesFehlende) {
        erstesFehlende.focus();
        meldung.hidden = true;
        return;
      }

      var dateien = form.querySelector('#foto').files;
      if (dateien.length > 3) { zeige('Bitte höchstens drei Bilder anhängen.', true); return; }
      var summe = 0;
      for (var i = 0; i < dateien.length; i++) summe += dateien[i].size;
      if (summe > 8 * 1024 * 1024) {
        zeige('Die Bilder sind zusammen größer als 8 MB. Bitte weniger oder kleinere Bilder anhängen.', true);
        return;
      }

      if (!FORMSPREE_ID) {
        zeige('Das Formular ist noch nicht scharfgeschaltet. Rufen Sie bitte unter 0157 506 227 18 an oder schreiben Sie an info@gartenpflege-maria-md.de.', true);
        return;
      }

      knopf.disabled = true;
      var vorher = knopf.textContent;
      knopf.textContent = 'Wird geschickt';

      fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('abgelehnt');
        form.reset();
        form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
        form.querySelectorAll('.feld__fehler').forEach(function (p) { p.hidden = true; });
        zeige('Angekommen. Sie hören von Ion, meist noch am selben Tag.', false);
      }).catch(function () {
        zeige('Das hat gerade nicht geklappt. Rufen Sie bitte unter 0157 506 227 18 an, dann geht es sofort.', true);
      }).then(function () {
        knopf.disabled = false;
        knopf.textContent = vorher;
      });
    });
  })();

})();
