<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Photo Canon">
<title>Assistant Photo Canon</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0e0e0f;
  --bg2: #1a1a1c;
  --bg3: #242426;
  --border: rgba(255,255,255,0.08);
  --border2: rgba(255,255,255,0.15);
  --text: #f0f0f0;
  --muted: #888;
  --accent: #f0a500;
  --accent2: #ff6b35;
  --red: #ff4444;
  --green: #4caf7d;
  --blue: #4a9eff;
  --radius: 14px;
  --radius-sm: 8px;
}
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; overflow: hidden; }

.app { display: flex; flex-direction: column; height: 100vh; height: -webkit-fill-available; }

/* Header */
.header { padding: 52px 20px 16px; background: var(--bg); border-bottom: 1px solid var(--border); flex-shrink: 0; }
.header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.logo { display: flex; align-items: center; gap: 10px; }
.logo-icon { width: 36px; height: 36px; background: var(--accent); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.logo-text { font-size: 17px; font-weight: 600; letter-spacing: -0.3px; }
.logo-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
.key-btn { background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 7px 12px; font-size: 12px; color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif; }
.key-btn.configured { color: var(--green); border-color: rgba(76,175,125,0.3); }

/* Tabs */
.tabs { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab { flex-shrink: 0; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--muted); background: transparent; border: none; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
.tab.active { background: var(--accent); color: #000; font-weight: 600; }

/* Content */
.content { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.page { display: none; padding: 16px 16px 100px; }
.page.active { display: block; }

/* IA Page */
.ia-desc { font-size: 13px; color: var(--muted); margin-bottom: 14px; line-height: 1.5; }
.ia-box { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; margin-bottom: 12px; }
.ia-textarea { width: 100%; background: transparent; border: none; outline: none; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; resize: none; height: 70px; line-height: 1.5; }
.ia-textarea::placeholder { color: var(--muted); }
.ia-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.char-count { font-size: 12px; color: var(--muted); }
.send-btn { background: var(--accent); color: #000; border: none; border-radius: var(--radius-sm); padding: 9px 18px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.2s; }
.send-btn:disabled { opacity: 0.4; }
.send-btn:active { opacity: 0.8; }

.quick-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
.quick-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
.qchip { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 6px 12px; font-size: 13px; color: var(--text); cursor: pointer; transition: all 0.2s; }
.qchip:active { background: var(--bg3); }

.result-wrap { margin-top: 4px; }
.result-situation { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); font-weight: 600; margin-bottom: 12px; }
.result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
.rcard { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; }
.rcard-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px; }
.rcard-val { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.3; }
.result-tip { background: rgba(240,165,0,0.08); border: 1px solid rgba(240,165,0,0.2); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 13px; color: var(--text); line-height: 1.6; }
.result-tip span { color: var(--accent); font-weight: 600; }
.loading-wrap { text-align: center; padding: 2rem; }
.loading-dot { display: inline-block; width: 8px; height: 8px; background: var(--accent); border-radius: 50%; margin: 0 3px; animation: bounce 1s infinite; }
.loading-dot:nth-child(2) { animation-delay: 0.15s; }
.loading-dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
.empty-state { text-align: center; padding: 3rem 1rem; color: var(--muted); font-size: 14px; line-height: 1.7; }
.empty-icon { font-size: 40px; margin-bottom: 12px; }

/* Fiches */
.fiche-tabs { display: flex; gap: 6px; overflow-x: auto; margin-bottom: 16px; scrollbar-width: none; padding-bottom: 4px; }
.fiche-tabs::-webkit-scrollbar { display: none; }
.ftab { flex-shrink: 0; padding: 6px 12px; border: 1px solid var(--border); border-radius: 20px; font-size: 13px; color: var(--muted); cursor: pointer; background: transparent; font-family: 'DM Sans', sans-serif; }
.ftab.active { border-color: var(--accent2); color: var(--accent2); background: rgba(255,107,53,0.1); }
.fiche { display: none; }
.fiche.active { display: block; }
.alert { border-radius: var(--radius-sm); padding: 10px 14px; font-size: 13px; line-height: 1.6; margin-bottom: 12px; }
.alert-warn { background: rgba(255,68,68,0.08); border: 1px solid rgba(255,68,68,0.2); color: #ff8080; }
.alert-info { background: rgba(74,158,255,0.08); border: 1px solid rgba(74,158,255,0.2); color: #7ab8ff; }
.fcard { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 12px; }
.fcard-title { padding: 12px 16px; font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--border); color: var(--text); }
.frow { display: flex; padding: 10px 16px; border-bottom: 1px solid var(--border); gap: 12px; }
.frow:last-child { border-bottom: none; }
.frow:nth-child(odd) { background: rgba(255,255,255,0.02); }
.flabel { font-size: 12px; color: var(--muted); width: 110px; flex-shrink: 0; padding-top: 2px; }
.fval { font-size: 13px; font-weight: 500; color: var(--text); flex: 1; line-height: 1.4; }

/* Objectifs */
.obj-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 14px; }
.obj-header { padding: 14px 16px; border-bottom: 1px solid var(--border); }
.obj-name { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.obj-badge { display: inline-block; background: rgba(240,165,0,0.15); color: var(--accent); font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.compare-table { width: 100%; }
.compare-table tr { border-bottom: 1px solid var(--border); }
.compare-table tr:last-child { border-bottom: none; }
.compare-table td { padding: 10px 16px; font-size: 13px; }
.compare-table td:first-child { color: var(--muted); width: 45%; }
.compare-table td:last-child { font-weight: 500; color: var(--text); }

/* Glossaire */
.g-item { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 8px; overflow: hidden; }
.g-term { padding: 13px 16px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.g-arrow { color: var(--muted); font-size: 18px; font-weight: 300; transition: transform 0.2s; }
.g-arrow.open { transform: rotate(45deg); }
.g-def { display: none; padding: 10px 16px 14px; font-size: 13px; color: var(--muted); line-height: 1.7; border-top: 1px solid var(--border); }
.g-def.open { display: block; }

/* Key modal */
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100; align-items: flex-end; }
.modal-overlay.open { display: flex; }
.modal { background: var(--bg2); border-radius: 20px 20px 0 0; padding: 24px 20px 40px; width: 100%; }
.modal-title { font-size: 17px; font-weight: 600; margin-bottom: 6px; }
.modal-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 16px; }
.modal-input { width: 100%; background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 14px; color: var(--text); font-family: 'DM Mono', monospace; outline: none; margin-bottom: 10px; }
.modal-input:focus { border-color: var(--accent); }
.modal-btns { display: flex; gap: 8px; }
.modal-save { flex: 1; background: var(--accent); color: #000; border: none; border-radius: var(--radius-sm); padding: 13px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.modal-cancel { background: var(--bg3); color: var(--muted); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 13px 16px; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.modal-link { font-size: 12px; color: var(--blue); margin-bottom: 14px; display: block; }

section-title { display: block; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 12px; }
</style>
</head>
<body>

<div class="app">
  <div class="header">
    <div class="header-top">
      <div class="logo">
        <div class="logo-icon">📷</div>
        <div>
          <div class="logo-text">Assistant Photo</div>
          <div class="logo-sub">Canon · Tir sportif & terrain</div>
        </div>
      </div>
      <button class="key-btn" id="keyBtn" onclick="openModal()">⚙ Clé API</button>
    </div>
    <div class="tabs">
      <div class="tab active" onclick="showPage('ia', this)">Assistant IA</div>
      <div class="tab" onclick="showPage('fiches', this)">Fiches</div>
      <div class="tab" onclick="showPage('objectifs', this)">Objectifs</div>
      <div class="tab" onclick="showPage('glossaire', this)">Glossaire</div>
    </div>
  </div>

  <div class="content">

    <!-- IA -->
    <div class="page active" id="page-ia">
      <p class="ia-desc">Décris ta situation photo et obtiens les réglages exacts pour ton Canon.</p>
      <div class="ia-box">
        <textarea class="ia-textarea" id="userInput" placeholder="Ex: portrait d'un travailleur sur balcon contre-jour, douille en vol plein soleil..."></textarea>
        <div class="ia-actions">
          <span class="char-count" id="charCount">0 / 200</span>
          <button class="send-btn" id="sendBtn" onclick="askClaude()">Analyser →</button>
        </div>
      </div>

      <div class="quick-label">Situations rapides</div>
      <div class="quick-wrap">
        <div class="qchip" onclick="setQ('douille en vol plein soleil')">Douille en vol</div>
        <div class="qchip" onclick="setQ('portrait tireur plein soleil')">Portrait soleil</div>
        <div class="qchip" onclick="setQ('portrait tireur stand intérieur sombre')">Portrait intérieur</div>
        <div class="qchip" onclick="setQ('ambiance générale stand de tir plein air')">Ambiance stand</div>
        <div class="qchip" onclick="setQ('détail arme gros plan')">Détail arme</div>
        <div class="qchip" onclick="setQ('paysage urbain soleil en fond compression téléobjectif')">Urbain compression</div>
        <div class="qchip" onclick="setQ('travailleur sur balcon fond intérieur sombre depuis bâtiment en face')">Travailleur balcon</div>
        <div class="qchip" onclick="setQ('cible trouée après les tirs détail')">Cible impacts</div>
      </div>

      <div id="iaOutput">
        <div class="empty-state">
          <div class="empty-icon">🎯</div>
          Décris ta situation<br>pour obtenir tes réglages
        </div>
      </div>
    </div>

    <!-- FICHES -->
    <div class="page" id="page-fiches">
      <div class="fiche-tabs">
        <button class="ftab active" onclick="showFiche('douille', this)">Douille</button>
        <button class="ftab" onclick="showFiche('portrait-soleil', this)">Portrait soleil</button>
        <button class="ftab" onclick="showFiche('portrait-int', this)">Portrait intérieur</button>
        <button class="ftab" onclick="showFiche('ambiance', this)">Ambiance</button>
        <button class="ftab" onclick="showFiche('detail', this)">Détails</button>
        <button class="ftab" onclick="showFiche('urbain', this)">Urbain</button>
        <button class="ftab" onclick="showFiche('balcon', this)">Balcon</button>
      </div>

      <div class="fiche active" id="fiche-douille">
        <div class="alert alert-warn">Situation la plus technique — lis bien avant de shooter !</div>
        <div class="fcard">
          <div class="fcard-title">Douille en vol / flamme au départ</div>
          <div class="frow"><div class="flabel">Mode</div><div class="fval">Priorité vitesse (Tv)</div></div>
          <div class="frow"><div class="flabel">Vitesse</div><div class="fval">1/2000s à 1/4000s</div></div>
          <div class="frow"><div class="flabel">Ouverture</div><div class="fval">La plus grande dispo (f/1.8 – f/2.8)</div></div>
          <div class="frow"><div class="flabel">ISO</div><div class="fval">100–400 (soleil) · 3200–6400 (intérieur)</div></div>
          <div class="frow"><div class="flabel">Autofocus</div><div class="fval">Manuel MF — switch sur l'objectif</div></div>
          <div class="frow"><div class="flabel">MAP sur</div><div class="fval">Fenêtre d'éjection de l'arme</div></div>
          <div class="frow"><div class="flabel">Rafale</div><div class="fval">Oui — vitesse maximale</div></div>
          <div class="frow"><div class="flabel">Cadrage</div><div class="fval">Espace à droite (côté éjection)</div></div>
        </div>
        <div class="alert alert-info">Scotche la bague de MAP après réglage. La douille passe en quelques ms — prends des dizaines de photos.</div>
      </div>

      <div class="fiche" id="fiche-portrait-soleil">
        <div class="alert alert-warn">Attention soleil en fond — risque de sous-exposition du visage !</div>
        <div class="fcard">
          <div class="fcard-title">Portrait tireur — plein soleil</div>
          <div class="frow"><div class="flabel">Mode</div><div class="fval">Priorité ouverture (Av)</div></div>
          <div class="frow"><div class="flabel">Ouverture</div><div class="fval">f/1.8 à f/2.8</div></div>
          <div class="frow"><div class="flabel">ISO</div><div class="fval">100 à 200</div></div>
          <div class="frow"><div class="flabel">Vitesse mini</div><div class="fval">> 1/500s — vérifier dans le viseur</div></div>
          <div class="frow"><div class="flabel">Autofocus</div><div class="fval">One Shot — point unique sur l'oeil</div></div>
          <div class="frow"><div class="flabel">Mesure</div><div class="fval">Spot sur le visage si soleil en fond</div></div>
          <div class="frow"><div class="flabel">Correction expo</div><div class="fval">+1 à +2 stops si visage trop sombre</div></div>
        </div>
        <div class="alert alert-info">Positionne-toi avec le soleil dans le dos ou sur le côté pour éviter les ombres dures.</div>
      </div>

      <div class="fiche" id="fiche-portrait-int">
        <div class="fcard">
          <div class="fcard-title">Portrait tireur — stand intérieur</div>
          <div class="frow"><div class="flabel">Mode</div><div class="fval">Priorité ouverture (Av)</div></div>
          <div class="frow"><div class="flabel">Ouverture</div><div class="fval">f/1.8 à f/2.8</div></div>
          <div class="frow"><div class="flabel">ISO</div><div class="fval">800 à 3200</div></div>
          <div class="frow"><div class="flabel">Vitesse mini</div><div class="fval">> 1/125s — vérifier dans le viseur</div></div>
          <div class="frow"><div class="flabel">Autofocus</div><div class="fval">One Shot — point sur l'oeil</div></div>
          <div class="frow"><div class="flabel">Mesure</div><div class="fval">Évaluative</div></div>
          <div class="frow"><div class="flabel">Style image</div><div class="fval">Portrait</div></div>
        </div>
        <div class="alert alert-info">N'aie pas peur de monter les ISO — un peu de grain vaut mieux qu'une photo floue.</div>
      </div>

      <div class="fiche" id="fiche-ambiance">
        <div class="fcard">
          <div class="fcard-title">Ambiance générale du stand</div>
          <div class="frow"><div class="flabel">Mode</div><div class="fval">Priorité ouverture (Av)</div></div>
          <div class="frow"><div class="flabel">Ouverture</div><div class="fval">f/4 à f/8</div></div>
          <div class="frow"><div class="flabel">ISO</div><div class="fval">100–400 (soleil) · 800–3200 (intérieur)</div></div>
          <div class="frow"><div class="flabel">Vitesse mini</div><div class="fval">> 1/60s</div></div>
          <div class="frow"><div class="flabel">Autofocus</div><div class="fval">One Shot</div></div>
          <div class="frow"><div class="flabel">Objectif</div><div class="fval">18–35mm (grand angle)</div></div>
          <div class="frow"><div class="flabel">Mesure</div><div class="fval">Évaluative</div></div>
        </div>
        <div class="alert alert-info">Vue depuis l'arrière avec les cibles au fond = très beau plan. Cherche un angle original.</div>
      </div>

      <div class="fiche" id="fiche-detail">
        <div class="fcard">
          <div class="fcard-title">Détails — arme, équipement, cible</div>
          <div class="frow"><div class="flabel">Mode</div><div class="fval">Priorité ouverture (Av)</div></div>
          <div class="frow"><div class="flabel">Ouverture</div><div class="fval">f/2.8 à f/5.6</div></div>
          <div class="frow"><div class="flabel">ISO</div><div class="fval">100–1600 selon lumière</div></div>
          <div class="frow"><div class="flabel">Autofocus</div><div class="fval">One Shot — point sur le détail</div></div>
          <div class="frow"><div class="flabel">Objectif</div><div class="fval">70–200mm à distance</div></div>
          <div class="frow"><div class="flabel">Stabilisation</div><div class="fval">IS activée</div></div>
          <div class="frow"><div class="flabel">Cadrage</div><div class="fval">Très serré — remplir le cadre</div></div>
        </div>
        <div class="alert alert-info">Impacts sur la cible, mécanisme de l'arme, mains du tireur — les détails racontent une histoire.</div>
      </div>

      <div class="fiche" id="fiche-urbain">
        <div class="fcard">
          <div class="fcard-title">Paysage urbain — compression téléobjectif</div>
          <div class="frow"><div class="flabel">Mode</div><div class="fval">Priorité ouverture (Av)</div></div>
          <div class="frow"><div class="flabel">Ouverture</div><div class="fval">f/8 à f/11</div></div>
          <div class="frow"><div class="flabel">ISO</div><div class="fval">100</div></div>
          <div class="frow"><div class="flabel">Vitesse mini</div><div class="fval">> 1/500s</div></div>
          <div class="frow"><div class="flabel">Focale</div><div class="fval">135mm à 200mm</div></div>
          <div class="frow"><div class="flabel">Autofocus</div><div class="fval">AI Servo (passants en mouvement)</div></div>
          <div class="frow"><div class="flabel">Stabilisation</div><div class="fval">IS activée — indispensable</div></div>
          <div class="frow"><div class="flabel">Mesure</div><div class="fval">Spot si soleil en fond</div></div>
        </div>
        <div class="alert alert-info">Recule-toi le plus loin possible — c'est le secret de la compression. f/16 pour un starburst sur le soleil.</div>
      </div>

      <div class="fiche" id="fiche-balcon">
        <div class="alert alert-warn">Écart de luminosité important entre l'extérieur et le fond intérieur sombre !</div>
        <div class="fcard">
          <div class="fcard-title">Portrait travailleur — balcon / fond intérieur</div>
          <div class="frow"><div class="flabel">Mode</div><div class="fval">Priorité ouverture (Av)</div></div>
          <div class="frow"><div class="flabel">Ouverture</div><div class="fval">f/2.8 à f/4</div></div>
          <div class="frow"><div class="flabel">ISO</div><div class="fval">200 à 400</div></div>
          <div class="frow"><div class="flabel">Vitesse mini</div><div class="fval">> 1/250s</div></div>
          <div class="frow"><div class="flabel">Autofocus</div><div class="fval">One Shot — point sur le visage</div></div>
          <div class="frow"><div class="flabel">Mesure</div><div class="fval">Spot sur le travailleur</div></div>
          <div class="frow"><div class="flabel">Objectif</div><div class="fval">70–200mm à 85–135mm</div></div>
          <div class="frow"><div class="flabel">Correction expo</div><div class="fval">+1 si visage sombre · -1 si trop clair</div></div>
        </div>
        <div class="alert alert-info">Laisse le fond intérieur sous-exposé volontairement — effet cinématographique très beau !</div>
      </div>
    </div>

    <!-- OBJECTIFS -->
    <div class="page" id="page-objectifs">
      <div class="obj-card">
        <div class="obj-header">
          <div class="obj-name">18–55mm — Objectif kit</div>
          <span class="obj-badge">Grand angle</span>
        </div>
        <table class="compare-table">
          <tr><td>Idéal pour</td><td>Ambiance, plans larges, détails proches</td></tr>
          <tr><td>Focale portrait</td><td>35–55mm (éviter 18mm = distorsion)</td></tr>
          <tr><td>Ouverture max</td><td>f/3.5–f/5.6 (limité en basse lumière)</td></tr>
          <tr><td>Distance mini MAP</td><td>~25cm</td></tr>
          <tr><td>Stabilisation</td><td>Selon modèle — vérifier</td></tr>
        </table>
      </div>

      <div class="obj-card">
        <div class="obj-header">
          <div class="obj-name">70–200mm — Téléobjectif</div>
          <span class="obj-badge" style="background:rgba(255,107,53,0.15);color:var(--accent2);">Zoom puissant</span>
        </div>
        <table class="compare-table">
          <tr><td>Idéal pour</td><td>Portraits, détails à distance, compression</td></tr>
          <tr><td>Portrait flatteur</td><td>85–135mm</td></tr>
          <tr><td>Compression max</td><td>135–200mm</td></tr>
          <tr><td>Stabilisation IS</td><td>Obligatoire au-delà de 100mm</td></tr>
        </table>
      </div>

      <div class="obj-card">
        <div class="obj-header">
          <div class="obj-name">Tableau de choix rapide</div>
        </div>
        <table class="compare-table">
          <tr><td>Douille en vol</td><td>18–55mm (rester proche)</td></tr>
          <tr><td>Portrait visage</td><td>70–200mm à 85–135mm</td></tr>
          <tr><td>Ambiance stand</td><td>18–55mm à 18–35mm</td></tr>
          <tr><td>Détail arme</td><td>70–200mm à distance</td></tr>
          <tr><td>Compression urbaine</td><td>70–200mm à 135–200mm</td></tr>
          <tr><td>Travailleur balcon</td><td>70–200mm à 85–135mm</td></tr>
        </table>
      </div>
    </div>

    <!-- GLOSSAIRE -->
    <div class="page" id="page-glossaire">
      <div id="glossaire-list"></div>
    </div>

  </div>
</div>

<!-- KEY MODAL -->
<div class="modal-overlay" id="modalOverlay" onclick="closeModalOutside(event)">
  <div class="modal">
    <div class="modal-title">Clé API Anthropic</div>
    <div class="modal-desc">Entre ta clé API pour activer l'assistant IA. Elle sera sauvegardée sur ton téléphone uniquement.</div>
    <a class="modal-link" href="https://console.anthropic.com" onclick="openLink(this.href);return false;">→ Obtenir une clé sur console.anthropic.com</a>
    <input class="modal-input" type="password" id="apiKeyInput" placeholder="sk-ant-..." autocomplete="off" spellcheck="false">
    <div class="modal-btns">
      <button class="modal-cancel" onclick="closeModal()">Annuler</button>
      <button class="modal-save" onclick="saveKey()">Enregistrer</button>
    </div>
  </div>
</div>

<script>
const glossaire = [
  ["Ouverture (f/)", "Le diaphragme dans l'objectif. Un chiffre BAS (f/1.8) = grande ouverture = beaucoup de lumière + fond flou. Un chiffre HAUT (f/11) = petite ouverture = moins de lumière + tout net."],
  ["Vitesse d'obturation", "Durée pendant laquelle le capteur est exposé. 1/4000s = très rapide, fige tout. 1/30s = lent, crée du flou de mouvement."],
  ["ISO", "Sensibilité du capteur. ISO 100 = peu sensible, image propre (plein soleil). ISO 6400 = très sensible, image avec grain (obscurité). Monte les ISO quand il manque de lumière."],
  ["Priorité ouverture (Av)", "Tu choisis l'ouverture, l'appareil calcule la vitesse. Idéal pour contrôler la profondeur de champ (fond flou ou net)."],
  ["Priorité vitesse (Tv)", "Tu choisis la vitesse, l'appareil calcule l'ouverture. Idéal pour figer ou flouter le mouvement."],
  ["One Shot", "Mode AF Canon : la mise au point se verrouille sur un sujet immobile. Pour tout ce qui ne bouge pas."],
  ["AI Servo", "Mode AF Canon : la mise au point suit en continu un sujet en mouvement. Pour les sujets qui bougent."],
  ["MAP manuelle (MF)", "Tu règles toi-même la netteté avec la bague sur l'objectif. Indispensable pour la douille en vol."],
  ["Mode mesure", "Façon dont l'appareil analyse la lumière. Évaluative = toute la scène. Spot = un tout petit point précis."],
  ["Rafale", "L'appareil prend plusieurs photos par seconde tant que tu maintiens le déclencheur. Essentiel pour la douille en vol."],
  ["Compression", "Effet optique du téléobjectif qui rapproche visuellement les éléments éloignés. Plus on zoome et recule, plus l'effet est fort."],
  ["Starburst", "Effet d'étoile sur une source lumineuse (soleil). S'obtient en fermant l'ouverture à f/11 ou f/16."],
  ["Stabilisation (IS)", "Système dans l'objectif qui compense les tremblements. À activer surtout au-delà de 100mm."],
  ["Style d'image", "Traitement couleur appliqué au JPEG. Portrait = teintes douces. Standard = polyvalent. Neutre = pour retouche."],
  ["Correction d'exposition", "Bouton +/- qui force l'appareil à exposer plus clair (+) ou plus sombre (-). Utile quand le sujet est mal exposé."],
  ["Profondeur de champ", "Zone de netteté dans la photo. Grande ouverture (f/1.8) = zone nette courte = fond flou. Petite ouverture (f/11) = tout est net."],
];

const gl = document.getElementById('glossaire-list');
glossaire.forEach(([term, def]) => {
  const d = document.createElement('div');
  d.className = 'g-item';
  d.innerHTML = `<div class="g-term" onclick="toggleG(this)">${term}<span class="g-arrow">+</span></div><div class="g-def">${def}</div>`;
  gl.appendChild(d);
});

function toggleG(el) {
  const def = el.nextElementSibling;
  const arrow = el.querySelector('.g-arrow');
  const open = def.classList.toggle('open');
  arrow.textContent = open ? '×' : '+';
  arrow.classList.toggle('open', open);
}

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  el.classList.add('active');
}

function showFiche(id, el) {
  document.querySelectorAll('.fiche').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
  document.getElementById('fiche-' + id).classList.add('active');
  el.classList.add('active');
}

function setQ(text) {
  document.getElementById('userInput').value = text;
  updateCount();
  askClaude();
}

function updateCount() {
  const val = document.getElementById('userInput').value.length;
  document.getElementById('charCount').textContent = val + ' / 200';
}
document.getElementById('userInput').addEventListener('input', updateCount);

// API Key
function getKey() { try { return localStorage.getItem('anthropic_key') || ''; } catch(e) { return ''; } }
function setKey(k) { try { localStorage.setItem('anthropic_key', k); } catch(e) {} }

function updateKeyBtn() {
  const btn = document.getElementById('keyBtn');
  if (getKey()) { btn.textContent = '✓ Clé API'; btn.className = 'key-btn configured'; }
  else { btn.textContent = '⚙ Clé API'; btn.className = 'key-btn'; }
}
updateKeyBtn();

function openModal() {
  document.getElementById('apiKeyInput').value = getKey();
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
function closeModalOutside(e) { if (e.target === document.getElementById('modalOverlay')) closeModal(); }
function saveKey() {
  const k = document.getElementById('apiKeyInput').value.trim();
  setKey(k);
  updateKeyBtn();
  closeModal();
}

async function askClaude() {
  const input = document.getElementById('userInput').value.trim();
  if (!input) return;
  const key = getKey();
  if (!key) {
    document.getElementById('iaOutput').innerHTML = `<div class="alert alert-warn">Configure ta clé API en appuyant sur ⚙ Clé API en haut à droite.</div>`;
    return;
  }
  const btn = document.getElementById('sendBtn');
  btn.disabled = true;
  document.getElementById('iaOutput').innerHTML = `<div class="loading-wrap"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>`;

  const sys = `Tu es un expert photographe conseillant un débutant avec un Canon reflex/hybride avec objectif kit 18-55mm et téléobjectif 70-200mm.
Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, sans backticks.
Format exact:
{"situation":"Titre court max 5 mots","mode":"Mode Canon","vitesse":"valeur","ouverture":"valeur","iso":"valeur","autofocus":"One Shot / AI Servo / Manuel MF + explication courte","objectif":"18-55mm ou 70-200mm + focale","rafale":"Oui vitesse max / Non / Optionnel","conseil":"Conseil pratique max 2 phrases."}
Plein soleil = ISO 100-400. Intérieur sombre = ISO 800-6400. Adapte toujours à la lumière décrite.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true"},
      body: JSON.stringify({model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: [{role: "user", content: input}]})
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.content.map(i => i.text || "").join("");
    const r = JSON.parse(text.replace(/```json|```/g, "").trim());
    document.getElementById('iaOutput').innerHTML = `
      <div class="result-wrap">
        <div class="result-situation">${r.situation}</div>
        <div class="result-grid">
          <div class="rcard"><div class="rcard-label">Mode</div><div class="rcard-val">${r.mode}</div></div>
          <div class="rcard"><div class="rcard-label">Vitesse</div><div class="rcard-val">${r.vitesse}</div></div>
          <div class="rcard"><div class="rcard-label">Ouverture</div><div class="rcard-val">${r.ouverture}</div></div>
          <div class="rcard"><div class="rcard-label">ISO</div><div class="rcard-val">${r.iso}</div></div>
          <div class="rcard"><div class="rcard-label">Autofocus</div><div class="rcard-val">${r.autofocus}</div></div>
          <div class="rcard"><div class="rcard-label">Objectif</div><div class="rcard-val">${r.objectif}</div></div>
          <div class="rcard"><div class="rcard-label">Rafale</div><div class="rcard-val">${r.rafale}</div></div>
        </div>
        <div class="result-tip"><span>Conseil : </span>${r.conseil}</div>
      </div>`;
  } catch(e) {
    document.getElementById('iaOutput').innerHTML = `<div class="alert alert-warn">Erreur : ${e.message || 'Vérifie ta clé API'}</div>`;
  }
  btn.disabled = false;
}
</script>
</body>
</html>
