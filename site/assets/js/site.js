/* Gartenpflege Maria MD · Ion Baleca
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

  /* ============================== Hero ================================== */
  (function heroKante() {
    var hero = document.getElementById('top');
    if (!hero) return;
    var keil = hero.querySelector('.hero__keil');
    var setzen = function (v) { hero.style.setProperty('--w', v.toFixed(4)); };

    // Auf schmalen Geräten liegt die Kante waagerecht. Sie darf nie in den Text
    // laufen, deshalb wird sie am tatsächlichen Inhalt gemessen statt geraten.
    var ruheWert = function () {
      if (window.matchMedia('(min-width: 861px)').matches) return 0.62;
      var cta = hero.querySelector('.hero__cta');
      if (!cta) return 0.7;
      var unten = cta.getBoundingClientRect().bottom - hero.getBoundingClientRect().top;
      // Die Kante fällt nach links um 7vh ab, dieser Betrag muss oben drauf.
      var schraege = window.innerHeight * 0.07;
      return Math.max(0.5, Math.min(0.84, (unten + schraege + 26) / hero.offsetHeight));
    };
    var ruhe = ruheWert();
    setzen(ruhe);

    if (istRuhig() || !hatGsap) return;

    // Die Einblendung läuft in CSS und braucht kein JavaScript. Das Scrollen
    // übernimmt erst, wenn sie fertig ist oder der Besucher vorher scrollt.
    var uebernommen = false;
    var uebernehmen = function () {
      if (uebernommen) return;
      uebernommen = true;
      hero.classList.add('uebernommen', 'bewegt');
    };
    if (keil) keil.addEventListener('animationend', uebernehmen, { once: true });
    setTimeout(uebernehmen, 1600);

    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6,
      onUpdate: function (s) {
        if (s.progress > 0.002) uebernehmen();
        if (!uebernommen) return;
        setzen(ruhe - s.progress * (ruhe - 0.06));
      }
    });

    var timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        ruhe = ruheWert();
        if (window.scrollY < 4) setzen(ruhe);
        ScrollTrigger.refresh();
      }, 180);
    });
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

  /* ============================= Rundgang =============================== */
  (function rundgang() {
    var video = document.getElementById('rundgang-video');
    var standbild = document.getElementById('rundgang-standbild');
    var knopf = document.getElementById('videoknopf');
    var text = document.getElementById('videoknopf-text');
    if (!video || !knopf || !text) return;

    var geladen = false;
    var laden = function () {
      if (geladen) return;
      geladen = true;
      video.src = 'assets/video/rundgang.mp4';
      video.addEventListener('playing', function () {
        if (standbild) standbild.style.opacity = '0';
      }, { once: true });
    };

    var setzeKnopf = function (laeuft) {
      text.textContent = laeuft ? 'Anhalten' : 'Abspielen';
      knopf.setAttribute('aria-pressed', String(laeuft));
    };

    knopf.addEventListener('click', function () {
      laden();
      if (video.paused) { video.play().then(function(){ setzeKnopf(true); }).catch(function(){}); }
      else { video.pause(); setzeKnopf(false); }
    });
    video.addEventListener('pause', function () { setzeKnopf(false); });
    video.addEventListener('play', function () { setzeKnopf(true); });

    // Von selbst anlaufen, sobald man da ist. Nur auf Geräten, wo das nicht stört.
    if (istRuhig()) return;
    var io = new IntersectionObserver(function (eintraege) {
      if (!eintraege[0].isIntersecting) { if (!video.paused) video.pause(); return; }
      if (navigator.connection && navigator.connection.saveData) return;
      laden();
      video.play().then(function(){ setzeKnopf(true); }).catch(function () { /* Autoplay abgelehnt, Knopf bleibt */ });
    }, { threshold: 0.5 });
    io.observe(video.parentElement);
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
