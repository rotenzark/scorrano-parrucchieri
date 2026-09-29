/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'scorrano-parrucchieri',
    /* niente WhatsApp: il fisso (Google, Instagram, l'insegna) e Treatwell per prenotare online */
    whatsapp: {
      number: '',
      message: '',
      ids: [],
    },
    /* Google = Treatwell (29/9/2026): martedì–venerdì 9–19, sabato 8:30–18:30, domenica e lunedì chiuso */
    hours: {
      0: [],
      1: [],
      2: [['09:00', '19:00']],
      3: [['09:00', '19:00']],
      4: [['09:00', '19:00']],
      5: [['09:00', '19:00']],
      6: [['08:30', '18:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Scorrano Parrucchieri: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.salone": "The salon",
      "n.lavori": "The work",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.prenota": "Book on Treatwell",
      "t.prenotabreve": "Book",
      "t.indicazioni": "Directions",
      "h.sopra": "Hairdressers for women and men · Via Binda 33 · since 1995",
      "h.titolo": "The <em>third</em> generation.",
      "h.testo": "Umberto learnt the trade from a hairdresser mother, Elisabetta Lentini; today the son, Luigi, works in the salon too. The salon has been at Via Binda 33 since 1995: cuts, colour and blow-dries, for women and men.",
      "h.google": "97 reviews on Google",
      "h.treatwell": "on Treatwell, 194 reviews",
      "t.invito": "Pull the ribbon to undo the braid, or tap a name.",
      "t.rifai": "Braid it again",
      "t.didascalia": "Three strands, three generations: each runs through the whole braid.",
      "t.titolo": "A three-strand braid: green, white and red",
      "t.desc": "In a black oval mirror, three strands come out of a clip and are braided in nine crossings, down to the ribbon: green is Elisabetta Lentini, white is Umberto, red is Luigi.",
      "t.lista": "The three strands of the braid",
      "t.ta": "Umberto’s mother, a hairdresser: where the trade began",
      "t.tb": "the salon at Via Binda 33, open since 1995",
      "t.tc": "the son: the third generation",
      "s.etichetta": "The salon",
      "s.titolo": "The Italian style, on Via Binda",
      "a.salone": "The empty salon: white walls, two black backwash units under the sign LO STILE ITALIANO in the colours of the Italian flag, chairs in front of the black oval mirrors, a red band along the wall.",
      "c.salone": "The salon at Via Binda 33, from their Treatwell page.",
      "s.t1": "White, with black oval mirrors and green and red bands along the walls. “Lo stile italiano” (the Italian style) is written above the backwash units and on the sign outside, under the name Scorrano.",
      "s.t2": "On Treatwell you book with Umberto or with Deborah; and today Luigi, the son, works in the salon too.",
      "s.chi": "on Google",
      "s.1": "Cut and blow-dry",
      "s.1t": "For women and men; a blow-dry on its own too.",
      "s.2": "Colour",
      "s.2t": "Colour, also ammonia-free; shatush and highlights.",
      "s.3": "Treatments",
      "s.3t": "Keratin smoothing, perms and hair treatments.",
      "s.4": "Men",
      "s.4t": "Cuts and beards.",
      "l.etichetta": "The work",
      "l.titolo": "Seen from behind",
      "l.sotto": "The photos are theirs: they post them on their Google listing, finished or halfway, and always from behind.",
      "a.biondo": "Long, layered blonde hair seen from behind, in the chair.",
      "c.biondo": "Blonde, layered",
      "a.ricci": "Dark curls, seen from behind.",
      "c.ricci": "Curls",
      "a.colpi": "Brown hair with highlights processing on the strands, seen from behind.",
      "c.colpi": "Highlights, processing",
      "a.stagnole": "Colour processing, with the strands wrapped in foils, seen from behind.",
      "c.stagnole": "Colour, in foils",
      "a.bordeaux": "Long, straight burgundy hair, seen from behind in front of the mirror.",
      "c.bordeaux": "Burgundy, long",
      "a.caschetto": "A wavy blonde bob, seen from behind, and the salon with its red niches.",
      "c.caschetto": "Blonde bob",
      "d.etichetta": "Reviews",
      "d.titolo": "Professionalism and kindness",
      "d.google": "on Google, 97 reviews",
      "d.treatwell": "on Treatwell, 194 reviews",
      "d.a1": "Google, a year ago",
      "d.a2": "Google, 2 years ago",
      "d.a3": "Google, 3 years ago",
      "d.a4": "Google, 4 years ago",
      "d.a6": "Google, 6 years ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […]. The line about the salon comes from another review.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Tuesday to Saturday",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.nota": "Open all day, lunchtime included.",
      "o.mappa": "Map: Scorrano Parrucchieri, Via Ambrogio Binda 33, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Ambrogio Binda 33, 20143 Milan",
      "o.bus": "By bus",
      "o.busv": "Piazza Miani and Via Watt, about 350 metres away",
      "o.metro": "By metro",
      "o.metrov": "M2 Romolo, about a kilometre away",
      "o.tel": "Phone",
      "q.etichetta": "Questions",
      "q.titolo": "Before you book",
      "q.1": "How do I book?",
      "q.1r": "By phone on +39 02 4547 7151, as they say on Instagram, or online on Treatwell.",
      "q.2": "Are you open on Mondays?",
      "q.2r": "No. The salon is open Tuesday to Friday from 9 am to 7 pm and on Saturday from 8:30 am to 6:30 pm; closed on Mondays and Sundays.",
      "q.3": "Do you also cut men’s hair?",
      "q.3r": "Yes: it is a salon for women and men, beards included.",
      "q.4": "Do you do keratin smoothing?",
      "q.4r": "Yes, along with perms and other hair treatments. To find out how long it takes, ask the salon.",
      "q.5": "How do I get there?",
      "q.5r": "Via Ambrogio Binda 33. Buses stop in Piazza Miani and Via Watt, about 350 metres away; M2 Romolo is about a kilometre away.",
      "f.orario": "Tuesday–Friday 9 am–7 pm · Saturday 8:30 am–6:30 pm · closed Monday and Sunday",
      "f.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are theirs, from their Google listing and their Treatwell page; hours and reviews from Google and Treatwell, the story from their own description on Google (September 2026). We drew the braid ourselves, in the colours of their sign.",
      "f.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ SCORRANO PARRUCCHIERI — «Alla terza generazione.» ══════════
     La pagina ha la loro insegna: «Scorrano» in corsivo bordeaux, la fascia tricolore «LO STILE ITALIANO», il bianco del salone.
     la FIRMA — la treccia a tre capi, in uno specchio ovale nero come quelli del salone: tre capi (verde, bianco, rosso: la «S» della
     loro insegna) escono dal fermaglio e si intrecciano in nove passaggi fino al nastro; ogni capo è una generazione (la madre di
     Umberto, Elisabetta Lentini; Umberto; il figlio Luigi). TUTTO dipende da un numero, P in [0, 9]: i passaggi fatti (anche a metà).
     L'intro va da P = 0 (i capi sciolti, il nastro in alto: l'attesa) a P = 9 (la treccia fatta: l'HTML, lo stato finale), un passaggio
     alla volta, poi il nastro si stringe. Il nastro si tira col mouse o col dito (in su si scioglie, in giù si rifà), ed è uno slider da
     tastiera; lasciato, si ferma sul passaggio più vicino. I nomi della legenda (comandi aggiunti dal JS) accendono il loro capo per tutta
     la treccia. «Rifai la treccia» scioglie e rifà. Senza JS: lo stato finale, invito e bottone nascosti col loro posto. Reduced-motion:
     lo stato finale subito, il nastro e i tasti senza animazione. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la
     larghezza; un gesto durante l'animazione la ferma dov'è (#244). I dati e le funzioni condivise vengono da _scp_firma.mjs. */
  var DATI = {"g":{"cx":140,"y0":118,"h":42,"n":9,"w":30,"t":18,"punta":600,"nastro":28,"largo":280},"colori":{"A":{"fill":"#0E8C45","bordo":"#06522A","riga":"#0A6B35"},"B":{"fill":"#F4F1EA","bordo":"#A89F90","riga":"#CFC7B8"},"C":{"fill":"#D02A38","bordo":"#86131E","riga":"#A81F2B"}},"lobi":[{"k":0,"capo":"A","lato":-1,"origine":[110,111.7]},{"k":1,"capo":"C","lato":1,"origine":[170,153.7]},{"k":2,"capo":"B","lato":-1,"origine":[110,195.7]},{"k":3,"capo":"A","lato":1,"origine":[170,237.7]},{"k":4,"capo":"C","lato":-1,"origine":[110,279.7]},{"k":5,"capo":"B","lato":1,"origine":[170,321.7]},{"k":6,"capo":"A","lato":-1,"origine":[110,363.7]},{"k":7,"capo":"C","lato":1,"origine":[170,405.7]},{"k":8,"capo":"B","lato":-1,"origine":[110,447.7]}],"capi":[{"c":"A","nome":"Elisabetta Lentini","k":"t.ta"},{"c":"B","nome":"Umberto","k":"t.tb"},{"c":"C","nome":"Luigi","k":"t.tc"}],"tempi":{"inizio":300,"passo":340,"crescita":0.76,"fiocco":240,"molla":260,"tasto":220,"sciogli":70,"fine":3600},"yNastro":524};
  function ordineCapi(n) {
    var o = ['A', 'B', 'C'];
    for (var k = 1; k <= n; k++) { var s; if (k % 2) { s = o[0]; o[0] = o[1]; o[1] = s; } else { s = o[2]; o[2] = o[1]; o[1] = s; } }
    return o;
  }
  function puntaD(i, P, G) {
    var p = Math.max(0, Math.min(G.n, P)), k = Math.min(1, p);
    var gap = 30 - 6 * k, xs = G.cx + (i - 1) * gap, ys = G.y0 + p * G.h + 34 * k;
    var xe = G.cx + (i - 1) * 38, ye = G.punta, L = ye - ys;
    var r = function (v) { return Math.round(v * 10) / 10; };
    return 'M' + r(xs) + ' ' + r(ys) + ' C' + r(xs) + ' ' + r(ys + L * 0.45) + ' ' + r(xe) + ' ' + r(ye - L * 0.35) + ' ' + r(xe) + ' ' + r(ye);
  }
  var prendi = function (id) { return document.getElementById(id); };
  var figuraT = prendi('treccia'), svgT = prendi('trecciaSvg'), nastro = prendi('trecciaNastro');
  var rifaiB = prendi('trecciaRifai'), leggiT = prendi('trecciaLeggi');
  var GT = DATI.g, TT = DATI.tempi, N = GT.n, CX = GT.cx;
  var LOBI = [].slice.call(document.querySelectorAll('#trecciaSvg .lobo'));
  var PUNTE = [].slice.call(document.querySelectorAll('#trecciaPunte [data-punta]'));
  var VOCI = [].slice.call(document.querySelectorAll('#trecciaCapi .capo-voce'));
  var faseT = 'fatta', modoT = '', rafT = 0, guardiaT = 0, larghezzaAvvioT = 0, corseT = 0, presaT = null, pianoT = null;
  var PT = N, evidenzaT = null;
  var finaleT = { P: N }, destinazioneT = finaleT;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    passo: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    fuori: function (u) { return 1 - Math.pow(1 - u, 3); },
    lineare: function (u) { return u; }
  };
  var PAROLE = {
    it: { passi: function (n) { return n + (n === 1 ? ' passaggio' : ' passaggi') + ' su ' + N; }, nastro: 'Il nastro: tiratelo in su per sciogliere la treccia, in giù per rifarla' },
    en: { passi: function (n) { return n + ' of ' + N + (n === 1 ? ' crossing' : ' crossings'); }, nastro: 'The ribbon: pull it up to undo the braid, down to redo it' }
  };
  function linguaT() { return (root.getAttribute('lang') || 'it').slice(0, 2) === 'en' ? 'en' : 'it'; }
  function annuncia(t) { if (leggiT) leggiT.textContent = t || ''; }
  /* il disegno di P: i rombi (quelli fatti pieni, quello in corso che cresce dal suo inizio), i capi sciolti sotto l'ultimo passaggio
     nell'ordine giusto, il nastro alla fine della parte fatta; a P = 9 nessun attributo in più (= l'HTML) */
  function disegna(p, fiocco) {
    PT = p;
    DATI.lobi.forEach(function (l, k) {
      var el = LOBI[k], g = c01((p - k) / TT.crescita);
      if (g >= 1) { el.removeAttribute('opacity'); el.removeAttribute('transform'); return; }
      var sc = 0.7 + 0.3 * g, o = l.origine;
      el.setAttribute('opacity', String(r3(g)));
      el.setAttribute('transform', 'translate(' + o[0] + ' ' + o[1] + ') scale(' + r3(sc) + ') translate(' + (-o[0]) + ' ' + (-o[1]) + ')');
    });
    var ord = ordineCapi(Math.ceil(p - 1e-9));
    PUNTE.forEach(function (gEl, i) {
      var c = ord[i], d = puntaD(i, p, GT), ps = gEl.querySelectorAll('path'), col = DATI.colori[c];
      if (gEl.getAttribute('class') !== 'capo capo--' + c) gEl.setAttribute('class', 'capo capo--' + c);
      ps[0].setAttribute('d', d); ps[0].setAttribute('stroke', col.bordo);
      ps[1].setAttribute('d', d); ps[1].setAttribute('stroke', col.fill);
      ps[2].setAttribute('d', d); ps[2].setAttribute('stroke', col.riga);
    });
    var dy = (p - N) * GT.h, yN = DATI.yNastro;
    if (fiocco && fiocco !== 1) nastro.setAttribute('transform', 'translate(0 ' + r3(dy) + ') translate(' + CX + ' ' + yN + ') scale(' + r3(fiocco) + ') translate(' + (-CX) + ' ' + (-yN) + ')');
    else if (Math.abs(dy) < 1e-9) nastro.removeAttribute('transform');
    else nastro.setAttribute('transform', 'translate(0 ' + r3(dy) + ')');
    if (nastro.getAttribute('role') === 'slider') {
      var n = Math.round(p);
      nastro.setAttribute('aria-valuenow', String(n));
      nastro.setAttribute('aria-valuetext', PAROLE[linguaT()].passi(n));
    }
  }
  /* un piano: tratti {da, a, pDa, pA, curva}, e alla fine il fiocco (il nastro che si stringe) se richiesto */
  function fotogrammaPiano(t) {
    var P = pianoT.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    if (t < cur.a) {
      if (cur.curva === 'fiocco') { disegna(cur.pA, 1 + 0.14 * Math.sin(Math.PI * c01((t - cur.da) / (cur.a - cur.da)))); return; }
      disegna(cur.pDa + (cur.pA - cur.pDa) * CURVE[cur.curva](c01((t - cur.da) / (cur.a - cur.da))));
      return;
    }
    disegna(cur.pA);
  }
  function pianoIntreccia(inizio, da) {
    var P = [], t = inizio;
    for (var k = Math.floor(da + 1e-9); k < N; k++) {
      var p0 = Math.max(k, da);
      P.push({ da: t, a: t + TT.passo * (k + 1 - p0), pDa: p0, pA: k + 1, curva: 'passo' });
      t += TT.passo * (k + 1 - p0);
    }
    P.push({ da: t, a: t + TT.fiocco, pDa: N, pA: N, curva: 'fiocco' });
    return { piano: P, fine: t + TT.fiocco };
  }
  function sorvegliaT() { clearTimeout(guardiaT); guardiaT = setTimeout(chiudiT, 1500); }
  function chiudiT() {
    cancelAnimationFrame(rafT); rafT = 0;
    clearTimeout(guardiaT);
    disegna((destinazioneT || finaleT).P);
    if (figuraT) figuraT.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseT = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): la treccia si ferma dov'è (#244); dall'attesa la posa è P = 0, già a schermo */
  function fermaT() {
    cancelAnimationFrame(rafT); rafT = 0;
    clearTimeout(guardiaT);
    if (root.classList.contains('firma-attesa')) { disegna(0); root.classList.remove('firma-attesa'); }
    else disegna(PT);
    if (figuraT) figuraT.setAttribute('data-firma', 'fatta');
    faseT = 'fatta';
  }
  function avviaT(modo, piano) {
    cancelAnimationFrame(rafT); rafT = 0;
    modoT = modo; pianoT = piano;
    root.classList.remove('firma-attesa');
    faseT = 'corre'; if (figuraT) figuraT.setAttribute('data-firma', 'corre');
    larghezzaAvvioT = window.innerWidth;
    var t0 = null, corsa = ++corseT;
    function fotogramma(ts) {
      rafT = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseT !== 'corre' || corsa !== corseT) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaPiano(t);
      if (t >= pianoT.fine) { chiudiT(); return; }
      sorvegliaT();
      rafT = requestAnimationFrame(fotogramma);
    }
    sorvegliaT();
    rafT = requestAnimationFrame(fotogramma);
  }
  function avviaIntro() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: P = 0 */
    disegna(0);
    destinazioneT = finaleT;
    avviaT('intro', pianoIntreccia(TT.inizio, 0));
  }
  /* andare a un numero di passaggi (tasti, nastro lasciato): un tratto breve, o subito in reduced-motion */
  function vai(p, durata, modo) {
    destinazioneT = { P: p };
    if (reducedMotion || Math.abs(p - PT) < 1e-9) { chiudiT(); return; }
    avviaT(modo || 'vai', { piano: [{ da: 0, a: durata, pDa: PT, pA: p, curva: 'fuori' }], fine: durata });
  }
  function rifai() {
    if (presaT) return;
    if (faseT === 'corre' || root.classList.contains('firma-attesa')) fermaT();
    destinazioneT = finaleT;
    if (reducedMotion) { chiudiT(); return; }
    /* prima si scioglie (un passaggio ogni «sciogli» ms), poi si rifà come nell'intro */
    var sciogli = PT * TT.sciogli, pr = pianoIntreccia(sciogli + 120, 0);
    pr.piano.unshift({ da: 0, a: sciogli, pDa: PT, pA: 0, curva: 'lineare' });
    avviaT('rifai', pr);
  }
  /* il nastro col puntatore: la y nel disegno, con lo scarto della presa */
  function ySvg(e) {
    var m = svgT.getScreenCTM();
    if (!m) return null;
    var q = svgT.createSVGPoint(); q.x = e.clientX; q.y = e.clientY;
    return q.matrixTransform(m.inverse()).y;
  }
  var yNastroDi = function (p) { return GT.y0 + p * GT.h + GT.nastro; };
  function prendiNastro(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (presaT) return;
    var y = ySvg(e);
    if (y === null) return;
    if (faseT === 'corre' || root.classList.contains('firma-attesa')) fermaT();
    e.preventDefault();
    presaT = { id: e.pointerId, scarto: y - yNastroDi(PT) };
    try { nastro.setPointerCapture(e.pointerId); } catch (err) {}
    nastro.classList.add('preso');
  }
  function tiraNastro(e) {
    if (!presaT || e.pointerId !== presaT.id) return;
    e.preventDefault();
    var y = ySvg(e);
    if (y === null) return;
    var p = Math.max(0, Math.min(N, (y - presaT.scarto - GT.y0 - GT.nastro) / GT.h));
    disegna(p);
  }
  function lasciaNastro(e) {
    if (!presaT || (e && e.pointerId !== presaT.id)) return;
    presaT = null;
    nastro.classList.remove('preso');
    var n = Math.round(PT);
    annuncia(PAROLE[linguaT()].passi(n));
    vai(n, TT.molla, 'molla');
  }
  function tasto(e) {
    var n = Math.round(PT), m = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') m = n + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') m = n - 1;
    else if (e.key === 'PageDown') m = n + 3;
    else if (e.key === 'PageUp') m = n - 3;
    else if (e.key === 'Home') m = 0;
    else if (e.key === 'End') m = N;
    if (m === null) return;
    e.preventDefault();
    if (presaT) return;
    if (faseT === 'corre' || root.classList.contains('firma-attesa')) fermaT();
    m = Math.max(0, Math.min(N, m));
    vai(m, TT.tasto, 'tasto');
  }
  /* un nome della legenda: il suo capo si accende per tutta la treccia (di nuovo, si spegne) */
  function evidenzia(c) {
    evidenzaT = evidenzaT === c ? null : c;
    if (evidenzaT) svgT.setAttribute('data-evidenza', evidenzaT); else svgT.removeAttribute('data-evidenza');
    VOCI.forEach(function (li) {
      var b = li.querySelector('.capo-voce__corpo');
      if (b) b.setAttribute('aria-pressed', li.getAttribute('data-capo') === evidenzaT ? 'true' : 'false');
    });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche accanto alla settimana */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la treccia è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaT() { var r = svgT.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraT && svgT && nastro && rifaiB && LOBI.length === N && PUNTE.length === 3 && VOCI.length === 3) {
    try { clearTimeout(window.__attesaTreccia); } catch (e) {}
    window.__treccia = {
      stato: function () {
        return { fase: faseT, modo: modoT, corse: corseT, P: PT, evidenza: evidenzaT, presa: !!presaT };
      },
      tempi: TT,
    };
    /* il nastro diventa uno slider (senza JS è un disegno) */
    nastro.setAttribute('role', 'slider');
    nastro.setAttribute('tabindex', '0');
    nastro.setAttribute('aria-valuemin', '0');
    nastro.setAttribute('aria-valuemax', String(N));
    nastro.setAttribute('aria-orientation', 'vertical');
    nastro.setAttribute('aria-label', PAROLE[linguaT()].nastro);
    nastro.setAttribute('aria-valuenow', String(N));
    nastro.setAttribute('aria-valuetext', PAROLE[linguaT()].passi(N));
    /* la legenda: da lista a comandi, senza cambiare di un pixel l'impaginazione */
    VOCI.forEach(function (li) {
      var b = li.querySelector('.capo-voce__corpo'), c = li.getAttribute('data-capo');
      if (!b) return;
      b.setAttribute('role', 'button');
      b.setAttribute('tabindex', '0');
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { evidenzia(c); });
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); evidenzia(c); } });
    });
    /* il cambio di lingua rinomina il nastro (il plumbing traduce solo ciò che ha data-i18n) */
    [].slice.call(document.querySelectorAll('[data-lang]')).forEach(function (b) {
      b.addEventListener('click', function () {
        nastro.setAttribute('aria-label', PAROLE[linguaT()].nastro);
        nastro.setAttribute('aria-valuetext', PAROLE[linguaT()].passi(Math.round(PT)));
      });
    });
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaT();
    /* perché la firma è partita o no (lo legge il check) */
    window.__treccia.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgT.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFare || ancora) chiudiT();
    else if (inVista) avviaIntro();
    else if ('IntersectionObserver' in window) {
      /* la treccia sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora i capi restano sciolti */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioT = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioT.disconnect();
        if (faseT === 'fatta' && root.classList.contains('firma-attesa')) avviaIntro();
      }, { threshold: soglie });
      ioT.observe(svgT);
      window.__treccia.avvio.aspetta = true;
    } else chiudiT();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseT !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioT) <= 1) return;
      chiudiT();
    });
    rifaiB.addEventListener('click', rifai);
    /* Chrome non guarda il touch-action degli elementi interni di un SVG: senza questo il dito sul nastro farebbe scorrere la pagina
       (#242, svg-dito-check). Solo sul nastro: dal resto della treccia la pagina scorre. */
    nastro.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });
    nastro.addEventListener('pointerdown', prendiNastro);
    nastro.addEventListener('pointermove', tiraNastro);
    nastro.addEventListener('pointerup', lasciaNastro);
    nastro.addEventListener('pointercancel', lasciaNastro);
    nastro.addEventListener('keydown', tasto);
  }
})();
