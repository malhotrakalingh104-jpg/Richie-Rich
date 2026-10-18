/**
 * Generates Richie-Diamond-Vault-OFFLINE.html
 * 100% self-contained single HTML file:
 * - HTML + CSS + JavaScript + inline SVG/emojis
 * - Zero external URLs, zero internet required, zero login needed
 * - Under 100KB (tiny, instant WhatsApp attachment)
 * - Contains both:
 *     1) Candy-Crush style Diamond Swipe Match (with touch swipe & haptic vibration)
 *     2) 6-Level Mansion Vault Catcher (cart driving arcade)
 * - Web Audio API synthesized sounds (coins, gems, combo fanfares)
 */

export function generateSingleFileOfflineGame(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#F59E0B">
  <title>Richie's Diamond Vault - Kids Gem Adventure (Offline)</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      background: #1E1B4B;
      color: #1E293B;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow-x: hidden;
      padding: 0;
    }
    #app-frame {
      width: 100%;
      max-width: 480px;
      height: 100vh;
      max-height: 900px;
      display: flex;
      flex-direction: column;
      background: #FFFDF5;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    }
    /* Top Header */
    #top-header {
      background: #FFFFFF;
      border-bottom: 3px solid #F59E0B;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      z-index: 30;
    }
    .brand-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-avatar {
      width: 36px;
      height: 36px;
      background: #FEF3C7;
      border: 2px solid #F59E0B;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .brand-name {
      font-weight: 900;
      font-size: 15px;
      color: #78350F;
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 10px;
      font-weight: 700;
      color: #B45309;
    }
    .hud-diamond {
      background: #FEF3C7;
      border: 2px solid #F59E0B;
      border-radius: 16px;
      padding: 4px 10px;
      font-weight: 900;
      font-size: 13px;
      color: #78350F;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .btn-sound {
      background: #FEF3C7;
      border: 2px solid #F59E0B;
      border-radius: 12px;
      padding: 4px 8px;
      font-size: 14px;
      cursor: pointer;
    }
    /* Tab Switcher */
    #tabs {
      display: flex;
      background: #FEF3C7;
      border-bottom: 2px solid #FDE68A;
      flex-shrink: 0;
    }
    .tab-btn {
      flex: 1;
      padding: 9px 4px;
      text-align: center;
      font-size: 12px;
      font-weight: 900;
      color: #92400E;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: #FFFFFF;
      color: #78350F;
      border-bottom: 3px solid #F59E0B;
      box-shadow: 0 -2px 6px rgba(0,0,0,0.04);
    }
    /* Main Content Area */
    #tab-content {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #FFFBEB;
    }
    .game-view {
      position: absolute;
      inset: 0;
      display: none;
      flex-direction: column;
    }
    .game-view.active {
      display: flex;
    }

    /* --- SWIPE MATCH 3 GAME STYLES --- */
    #swipe-hud {
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FFFFFF;
      border-bottom: 2px solid #FDE68A;
      font-weight: 800;
      font-size: 13px;
      color: #78350F;
    }
    .match-pill {
      background: #FFFBEB;
      border: 2px solid #F59E0B;
      border-radius: 14px;
      padding: 4px 10px;
    }
    #board-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      touch-action: none;
    }
    #board {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(6, 1fr);
      gap: 6px;
      width: 100%;
      max-width: 380px;
      aspect-ratio: 1;
      background: #FFFFFF;
      border: 4px solid #F59E0B;
      border-radius: 20px;
      padding: 8px;
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25);
    }
    .gem-cell {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: #FFFDF0;
      border: 2px solid #FEF3C7;
      cursor: pointer;
      transition: transform 0.12s ease-out, background-color 0.12s;
    }
    .gem-cell.selected {
      background: #FEF3C7;
      border-color: #F59E0B;
      transform: scale(1.08);
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.8);
      z-index: 5;
    }
    .gem-cell:active {
      transform: scale(0.94);
    }
    .gem-svg {
      width: 80%;
      height: 80%;
      pointer-events: none;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15));
    }

    /* --- 6 LEVELS CATCHER STYLES --- */
    #catcher-hud {
      padding: 8px 12px;
      background: #FFFFFF;
      border-bottom: 2px solid #FDE68A;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 800;
      font-size: 12px;
      color: #78350F;
    }
    #canvas-wrap {
      flex: 1;
      position: relative;
      background: linear-gradient(180deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%);
      overflow: hidden;
    }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
    }
    #catcher-controls {
      background: #FFFFFF;
      border-top: 3px solid #FCD34D;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .c-btn {
      width: 80px;
      height: 48px;
      background: #F59E0B;
      border: 3px solid #D97706;
      border-radius: 14px;
      color: #451A03;
      font-size: 24px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 3px 0 #B45309;
    }
    .c-btn:active {
      transform: translateY(2px);
      box-shadow: 0 1px 0 #B45309;
    }

    /* Overlays / Popups */
    .overlay-card {
      position: absolute;
      inset: 16px;
      background: #FFFFFF;
      border: 4px solid #F59E0B;
      border-radius: 24px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-shadow: 0 16px 40px rgba(0,0,0,0.3);
      z-index: 40;
    }
    .btn-big {
      background: #10B981;
      color: white;
      font-size: 18px;
      font-weight: 900;
      padding: 12px 28px;
      border-radius: 18px;
      border: 3px solid #059669;
      cursor: pointer;
      box-shadow: 0 5px 0 #047857;
      margin-top: 14px;
    }
    .btn-big:active {
      transform: translateY(3px);
      box-shadow: 0 2px 0 #047857;
    }
    .btn-gold {
      background: #F59E0B;
      color: #451A03;
      border-color: #D97706;
      box-shadow: 0 5px 0 #B45309;
    }

    /* AdMob Placeholder (Bottom Banner) */
    #admob-slot {
      background: #1E293B;
      border-top: 2px solid #F59E0B;
      color: #FDE047;
      padding: 4px 10px;
      font-size: 10px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .ad-tag {
      background: #F59E0B;
      color: #451A03;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 900;
    }

    /* Floating tip */
    .offline-badge {
      background: #DCFCE7;
      border: 2px solid #86EFAC;
      border-radius: 12px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 800;
      color: #166534;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  </style>
</head>
<body>

  <div id="app-frame">
    <!-- Top Header -->
    <header id="top-header">
      <div class="brand-title">
        <div class="brand-avatar">💎</div>
        <div>
          <div class="brand-name">Richie's Diamond Vault</div>
          <div class="brand-sub">KIDS GEM ADVENTURE</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div class="hud-diamond">
          <span>💎</span>
          <span id="global-diamonds">250</span>
        </div>
        <button class="btn-sound" id="btn-sound-toggle" onclick="toggleSound()" title="Sound On/Off">🔊</button>
      </div>
    </header>

    <!-- Tab Bar -->
    <nav id="tabs">
      <button class="tab-btn active" id="tab-btn-swipe" onclick="switchTab('swipe')">
        <span>🍬</span>
        <span>Candy Swipe Match</span>
      </button>
      <button class="tab-btn" id="tab-btn-catcher" onclick="switchTab('catcher')">
        <span>🏎️</span>
        <span>6 Levels Vault</span>
      </button>
    </nav>

    <!-- Content Area -->
    <div id="tab-content">
      <!-- GAME 1: CANDY SWIPE MATCH -->
      <section class="game-view active" id="view-swipe">
        <div id="swipe-hud">
          <div class="match-pill">🎯 Score: <span id="swipe-score">0</span> / <span id="swipe-target">1200</span></div>
          <div class="match-pill">⚡ Moves: <span id="swipe-moves">25</span></div>
          <button onclick="resetSwipeBoard()" style="background:#F59E0B;border:2px solid #D97706;border-radius:10px;padding:3px 8px;font-weight:800;font-size:11px;color:#451A03;cursor:pointer;">🔄 Shuffle</button>
        </div>

        <div style="padding: 6px 14px; text-align: center; font-size: 11px; font-weight: 700; color: #92400E;">
          👉 Swipe or tap two adjacent gems to match 3 in a row!
        </div>

        <div id="board-container">
          <div id="board"></div>
        </div>

        <!-- Swipe Win / Complete Overlay -->
        <div class="overlay-card" id="swipe-overlay" style="display: none;">
          <div style="font-size: 50px; margin-bottom: 6px;">🏆💎</div>
          <h2 style="color: #78350F; font-size: 22px; font-weight: 900; margin-bottom: 6px;" id="swipe-overlay-title">Awesome Match!</h2>
          <p style="color: #92400E; font-size: 13px; font-weight: 700; line-height: 1.4;" id="swipe-overlay-desc">You cracked Richie's Diamond Rush and earned +100 Diamonds!</p>
          <button class="btn-big" onclick="nextSwipeLevel()">PLAY NEXT ROUND ➔</button>
        </div>
      </section>

      <!-- GAME 2: 6 LEVELS VAULT CATCHER -->
      <section class="game-view" id="view-catcher">
        <div id="catcher-hud">
          <div class="match-pill" id="hud-level-title">🏰 1. Bedroom Safe</div>
          <div class="match-pill">💎 <span id="catcher-score">0</span> / <span id="catcher-target">12</span></div>
          <div class="match-pill" id="catcher-lives">❤️❤️❤️</div>
        </div>

        <div id="canvas-wrap">
          <canvas id="gameCanvas"></canvas>

          <!-- Catcher Start Overlay -->
          <div class="overlay-card" id="catcher-start-card">
            <div style="font-size: 52px; margin-bottom: 8px;">🏎️💎</div>
            <h2 style="color: #78350F; font-size: 22px; font-weight: 900; margin-bottom: 6px;">Richie's Diamond Run</h2>
            <p style="color: #92400E; font-size: 13px; font-weight: 700; line-height: 1.4; margin-bottom: 10px;">
              Drive Richie's cart to catch sparkling gems across 6 mansion rooms! Watch out for mud obstacles!
            </p>
            <button class="btn-big" onclick="startCatcherGame()">START LEVEL 1 ➔</button>
          </div>

          <!-- Catcher Level Win Overlay -->
          <div class="overlay-card" id="catcher-win-card" style="display: none;">
            <div style="font-size: 52px; margin-bottom: 8px;">🎉✨</div>
            <h2 style="color: #78350F; font-size: 22px; font-weight: 900; margin-bottom: 6px;" id="catcher-win-title">Vault Cleaned!</h2>
            <p style="color: #92400E; font-size: 13px; font-weight: 700; line-height: 1.4;" id="catcher-win-desc">All diamonds collected in this room!</p>
            <button class="btn-big" id="btn-next-room" onclick="nextCatcherRoom()">NEXT LEVEL ➔</button>
          </div>

          <!-- Catcher Game Over Overlay -->
          <div class="overlay-card" id="catcher-lose-card" style="display: none;">
            <div style="font-size: 52px; margin-bottom: 8px;">💫😅</div>
            <h2 style="color: #78350F; font-size: 22px; font-weight: 900; margin-bottom: 6px;">Try Again!</h2>
            <p style="color: #92400E; font-size: 13px; font-weight: 700; line-height: 1.4;">Richie's cart hit too much mud. Tap to retry!</p>
            <button class="btn-big btn-gold" onclick="retryCatcherRoom()">RETRY LEVEL ↺</button>
          </div>
        </div>

        <div id="catcher-controls">
          <div class="c-btn" id="ctrl-left">◀</div>
          <div style="font-size: 11px; font-weight: 800; color: #78350F; text-align: center;">
            DRAG CART OR TAP BUTTONS
          </div>
          <div class="c-btn" id="ctrl-right">▶</div>
        </div>
      </section>
    </div>

    <!-- AdMob Placeholder (Offline Safe) -->
    <div id="admob-slot">
      <div style="display: flex; align-items: center; gap: 6px;">
        <span class="ad-tag">Ad</span>
        <span>AdMob (320x50) Ready Unit</span>
      </div>
      <div class="offline-badge">⚡ 100% Offline</div>
    </div>
  </div>

  <script>
    // --- SYNTHESIZED WEB AUDIO (ZERO EXTERNAL SOUND FILES) ---
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let soundEnabled = true;

    function initAudio() {
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function toggleSound() {
      soundEnabled = !soundEnabled;
      document.getElementById('btn-sound-toggle').innerText = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) playTone(880, 'sine', 0.1);
    }

    function playTone(freq, type, duration) {
      if (!soundEnabled) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch(e) {}
    }

    function soundGem() {
      playTone(1200, 'sine', 0.08);
      setTimeout(() => playTone(1800, 'sine', 0.1), 35);
    }
    function soundCombo() {
      [659, 830, 987, 1318].forEach((f, i) => setTimeout(() => playTone(f, 'triangle', 0.18), i * 60));
    }
    function soundWin() {
      [523, 659, 783, 1046, 1318].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.25), i * 90));
    }
    function soundHit() {
      playTone(160, 'sawtooth', 0.2);
    }

    function triggerVibrate(pattern) {
      if (navigator.vibrate) {
        try { navigator.vibrate(pattern || 40); } catch(e) {}
      }
    }

    // --- GLOBAL DIAMOND COUNTER ---
    let globalDiamonds = 250;
    function addDiamonds(amount) {
      globalDiamonds += amount;
      document.getElementById('global-diamonds').innerText = globalDiamonds;
    }

    // --- TAB SWITCHER ---
    function switchTab(tab) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.game-view').forEach(v => v.classList.remove('active'));

      if (tab === 'swipe') {
        document.getElementById('tab-btn-swipe').classList.add('active');
        document.getElementById('view-swipe').classList.add('active');
      } else {
        document.getElementById('tab-btn-catcher').classList.add('active');
        document.getElementById('view-catcher').classList.add('active');
        resizeCanvas();
      }
      initAudio();
    }

    // --- GEM SVG DEFINITIONS ---
    const GEM_TYPES = ['diamond', 'ruby', 'emerald', 'topaz', 'amethyst'];
    function getGemSvg(type) {
      switch(type) {
        case 'diamond':
          return \`<svg viewBox="0 0 100 100" class="gem-svg">
            <polygon points="50,5 92,35 78,92 22,92 8,35" fill="#E0F2FE" stroke="#0284C7" stroke-width="4"/>
            <polygon points="50,5 92,35 68,35 50,5" fill="#BAE6FD"/>
            <polygon points="50,5 8,35 32,35 50,5" fill="#BAE6FD"/>
            <polygon points="32,35 68,35 50,92" fill="#FFFFFF"/>
            <polygon points="8,35 32,35 22,92" fill="#7DD3FC"/>
            <polygon points="92,35 68,35 78,92" fill="#7DD3FC"/>
            <circle cx="50" cy="35" r="4" fill="#FFFFFF"/>
          </svg>\`;
        case 'ruby':
          return \`<svg viewBox="0 0 100 100" class="gem-svg">
            <polygon points="50,6 94,36 78,94 22,94 6,36" fill="#FEE2E2" stroke="#DC2626" stroke-width="4"/>
            <polygon points="50,6 94,36 68,36 50,6" fill="#FCA5A5"/>
            <polygon points="50,6 6,36 32,36 50,6" fill="#FCA5A5"/>
            <polygon points="32,36 68,36 50,94" fill="#EF4444"/>
            <polygon points="6,36 32,36 22,94" fill="#B91C1C"/>
            <polygon points="94,36 68,36 78,94" fill="#B91C1C"/>
          </svg>\`;
        case 'emerald':
          return \`<svg viewBox="0 0 100 100" class="gem-svg">
            <polygon points="26,8 74,8 94,28 94,72 74,92 26,92 6,72 6,28" fill="#D1FAE5" stroke="#059669" stroke-width="4"/>
            <polygon points="26,8 74,8 64,24 36,24" fill="#6EE7B7"/>
            <polygon points="36,24 64,24 64,76 36,76" fill="#10B981"/>
            <polygon points="6,28 36,24 36,76 6,72" fill="#047857"/>
            <polygon points="94,28 64,24 64,76 94,72" fill="#047857"/>
          </svg>\`;
        case 'topaz':
          return \`<svg viewBox="0 0 100 100" class="gem-svg">
            <polygon points="50,6 94,50 50,94 6,50" fill="#FEF3C7" stroke="#D97706" stroke-width="4"/>
            <polygon points="50,6 74,50 50,78 26,50" fill="#FBBF24"/>
            <polygon points="50,6 26,50 6,50" fill="#F59E0B"/>
            <polygon points="50,6 74,50 94,50" fill="#FDE68A"/>
            <polygon points="50,78 50,94 6,50 26,50" fill="#B45309"/>
            <polygon points="50,78 50,94 94,50 74,50" fill="#B45309"/>
          </svg>\`;
        case 'amethyst':
          return \`<svg viewBox="0 0 100 100" class="gem-svg">
            <circle cx="50" cy="50" r="44" fill="#EDE9FE" stroke="#7C3AED" stroke-width="4"/>
            <polygon points="50,14 82,34 82,66 50,86 18,66 18,34" fill="#A78BFA"/>
            <polygon points="50,22 72,50 50,78 28,50" fill="#8B5CF6"/>
            <polygon points="50,30 62,50 50,70 38,50" fill="#FFFFFF"/>
          </svg>\`;
        default:
          return '💎';
      }
    }

    // --- GAME 1: CANDY SWIPE MATCH ENGINE ---
    const BOARD_SIZE = 6;
    let board = [];
    let swipeScore = 0;
    let swipeTarget = 1200;
    let swipeMoves = 25;
    let selectedCell = null;
    let pointerStart = null;

    function initSwipeBoard() {
      board = [];
      let hasMatches = true;
      while (hasMatches) {
        board = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
          const row = [];
          for (let c = 0; c < BOARD_SIZE; c++) {
            row.push(GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)]);
          }
          board.push(row);
        }
        hasMatches = findMatches().length > 0;
      }
      renderBoard();
    }

    function renderBoard() {
      const boardEl = document.getElementById('board');
      boardEl.innerHTML = '';
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const cell = document.createElement('div');
          cell.className = 'gem-cell';
          if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
            cell.classList.add('selected');
          }
          cell.dataset.r = r;
          cell.dataset.c = c;
          cell.innerHTML = getGemSvg(board[r][c]);

          // Touch and pointer listeners for swipe gestures
          cell.addEventListener('pointerdown', (e) => onCellPointerDown(r, c, e));
          boardEl.appendChild(cell);
        }
      }
    }

    function onCellPointerDown(r, c, e) {
      initAudio();
      pointerStart = { r, c, x: e.clientX, y: e.clientY };

      const onPointerMove = (moveEvent) => {
        if (!pointerStart) return;
        const dx = moveEvent.clientX - pointerStart.x;
        const dy = moveEvent.clientY - pointerStart.y;
        const threshold = 28;

        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);

          let targetR = pointerStart.r;
          let targetC = pointerStart.c;

          if (Math.abs(dx) > Math.abs(dy)) {
            targetC += dx > 0 ? 1 : -1;
          } else {
            targetR += dy > 0 ? 1 : -1;
          }

          if (targetR >= 0 && targetR < BOARD_SIZE && targetC >= 0 && targetC < BOARD_SIZE) {
            trySwap(pointerStart.r, pointerStart.c, targetR, targetC);
          }
          pointerStart = null;
          selectedCell = null;
        }
      };

      const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        if (pointerStart) {
          // It was a tap
          handleCellTap(r, c);
        }
        pointerStart = null;
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    function handleCellTap(r, c) {
      if (!selectedCell) {
        selectedCell = { r, c };
        soundGem();
        renderBoard();
      } else {
        const isNeighbor = Math.abs(selectedCell.r - r) + Math.abs(selectedCell.c - c) === 1;
        if (isNeighbor) {
          trySwap(selectedCell.r, selectedCell.c, r, c);
          selectedCell = null;
        } else {
          selectedCell = { r, c };
          soundGem();
          renderBoard();
        }
      }
    }

    function trySwap(r1, c1, r2, c2) {
      // Swap gems
      const temp = board[r1][c1];
      board[r1][c1] = board[r2][c2];
      board[r2][c2] = temp;

      const matches = findMatches();
      if (matches.length > 0) {
        // Valid move!
        swipeMoves = Math.max(0, swipeMoves - 1);
        document.getElementById('swipe-moves').innerText = swipeMoves;
        triggerVibrate([40, 30, 40]);
        resolveMatches(matches);
      } else {
        // Invalid - swap back
        soundHit();
        const revert = board[r1][c1];
        board[r1][c1] = board[r2][c2];
        board[r2][c2] = revert;
        renderBoard();
      }
    }

    function findMatches() {
      const matchSet = new Set();
      // Horizontal
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE - 2; c++) {
          const t = board[r][c];
          if (t && t === board[r][c + 1] && t === board[r][c + 2]) {
            matchSet.add(\`\${r},\${c}\`);
            matchSet.add(\`\${r},\${c + 1}\`);
            matchSet.add(\`\${r},\${c + 2}\`);
          }
        }
      }
      // Vertical
      for (let c = 0; c < BOARD_SIZE; c++) {
        for (let r = 0; r < BOARD_SIZE - 2; r++) {
          const t = board[r][c];
          if (t && t === board[r + 1][c] && t === board[r + 2][c]) {
            matchSet.add(\`\${r},\${c}\`);
            matchSet.add(\`\${r + 1},\${c}\`);
            matchSet.add(\`\${r + 2},\${c}\`);
          }
        }
      }
      return Array.from(matchSet).map(s => {
        const [r, c] = s.split(',').map(Number);
        return { r, c };
      });
    }

    function resolveMatches(matches) {
      const pts = matches.length * 40;
      swipeScore += pts;
      addDiamonds(Math.floor(matches.length / 2));
      document.getElementById('swipe-score').innerText = swipeScore;

      if (matches.length >= 4) {
        soundCombo();
      } else {
        soundGem();
      }

      // Clear matched gems
      matches.forEach(m => {
        board[m.r][m.c] = null;
      });

      // Drop down
      for (let c = 0; c < BOARD_SIZE; c++) {
        let emptyRow = BOARD_SIZE - 1;
        for (let r = BOARD_SIZE - 1; r >= 0; r--) {
          if (board[r][c] !== null) {
            if (emptyRow !== r) {
              board[emptyRow][c] = board[r][c];
              board[r][c] = null;
            }
            emptyRow--;
          }
        }
        // Fill top with new gems
        for (let r = emptyRow; r >= 0; r--) {
          board[r][c] = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
        }
      }

      renderBoard();

      // Check cascade
      setTimeout(() => {
        const cascade = findMatches();
        if (cascade.length > 0) {
          resolveMatches(cascade);
        } else {
          checkSwipeRoundEnd();
        }
      }, 200);
    }

    function checkSwipeRoundEnd() {
      if (swipeScore >= swipeTarget) {
        soundWin();
        triggerVibrate([80, 50, 80, 50, 150]);
        document.getElementById('swipe-overlay-title').innerText = '🎉 Target Reached!';
        document.getElementById('swipe-overlay-desc').innerText = \`Awesome! You scored \${swipeScore} points and won +150 bonus diamonds!\`;
        addDiamonds(150);
        document.getElementById('swipe-overlay').style.display = 'flex';
      } else if (swipeMoves <= 0) {
        soundHit();
        document.getElementById('swipe-overlay-title').innerText = 'Out of Moves!';
        document.getElementById('swipe-overlay-desc').innerText = \`Good try! You scored \${swipeScore} points! Tap below to play again!\`;
        document.getElementById('swipe-overlay').style.display = 'flex';
      }
    }

    function nextSwipeLevel() {
      document.getElementById('swipe-overlay').style.display = 'none';
      swipeScore = 0;
      swipeTarget += 500;
      swipeMoves = 25;
      document.getElementById('swipe-score').innerText = '0';
      document.getElementById('swipe-target').innerText = swipeTarget;
      document.getElementById('swipe-moves').innerText = '25';
      initSwipeBoard();
    }

    function resetSwipeBoard() {
      soundGem();
      initSwipeBoard();
    }

    // --- GAME 2: 6 LEVELS VAULT CATCHER ENGINE ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let cWidth = 0, cHeight = 0;

    const CATCHER_ROOMS = [
      { name: "1. Bedroom Safe", target: 12, speed: 2.2, spawnFreq: 65, bg1: "#FEF3C7", bg2: "#FDE68A" },
      { name: "2. Mansion Play Palace", target: 16, speed: 2.8, spawnFreq: 55, bg1: "#FDE68A", bg2: "#FCD34D" },
      { name: "3. Golden Grand Staircase", target: 20, speed: 3.3, spawnFreq: 48, bg1: "#FCD34D", bg2: "#FBBF24" },
      { name: "4. Secret Laser Vault", target: 24, speed: 3.8, spawnFreq: 42, bg1: "#FBBF24", bg2: "#F59E0B" },
      { name: "5. Diamond Cavern", target: 28, speed: 4.4, spawnFreq: 36, bg1: "#F59E0B", bg2: "#D97706" },
      { name: "6. Master Treasury", target: 35, speed: 5.0, spawnFreq: 32, bg1: "#D97706", bg2: "#B45309" }
    ];

    let currentRoom = 0;
    let catcherScore = 0;
    let catcherLives = 3;
    let catcherItems = [];
    let cartX = 180;
    let isCatcherRunning = false;
    let catcherFrameId = null;
    let tickCount = 0;

    function resizeCanvas() {
      cWidth = canvas.parentElement.clientWidth;
      cHeight = canvas.parentElement.clientHeight;
      canvas.width = cWidth;
      canvas.height = cHeight;
      if (cartX === 180 && cWidth > 0) cartX = cWidth / 2;
    }
    window.addEventListener('resize', resizeCanvas);

    function startCatcherGame() {
      initAudio();
      document.getElementById('catcher-start-card').style.display = 'none';
      document.getElementById('catcher-win-card').style.display = 'none';
      document.getElementById('catcher-lose-card').style.display = 'none';
      resizeCanvas();
      currentRoom = 0;
      loadCatcherRoom(0);
    }

    function loadCatcherRoom(idx) {
      currentRoom = idx;
      catcherScore = 0;
      catcherLives = 3;
      catcherItems = [];
      cartX = cWidth / 2;
      isCatcherRunning = true;
      updateCatcherHud();
      if (!catcherFrameId) catcherLoop();
    }

    function updateCatcherHud() {
      const r = CATCHER_ROOMS[currentRoom];
      document.getElementById('hud-level-title').innerText = '🏰 ' + r.name;
      document.getElementById('catcher-score').innerText = catcherScore;
      document.getElementById('catcher-target').innerText = r.target;
      document.getElementById('catcher-lives').innerText = '❤️'.repeat(catcherLives);
    }

    // Touch & Button controls for Cart
    let isCartDragging = false;
    canvas.addEventListener('pointerdown', (e) => {
      isCartDragging = true;
      updateCartFromPointer(e);
    });
    window.addEventListener('pointermove', (e) => {
      if (isCartDragging) updateCartFromPointer(e);
    });
    window.addEventListener('pointerup', () => { isCartDragging = false; });

    function updateCartFromPointer(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      cartX = Math.max(45, Math.min(cWidth - 45, x));
    }

    document.getElementById('ctrl-left').addEventListener('pointerdown', () => {
      cartX = Math.max(45, cartX - 40);
    });
    document.getElementById('ctrl-right').addEventListener('pointerdown', () => {
      cartX = Math.min(cWidth - 45, cartX + 40);
    });

    function spawnCatcherItem() {
      const r = CATCHER_ROOMS[currentRoom];
      const isBad = Math.random() < 0.28;
      catcherItems.push({
        x: 40 + Math.random() * (cWidth - 80),
        y: -30,
        type: isBad ? 'mud' : (Math.random() < 0.2 ? 'star' : 'gem'),
        speed: r.speed + Math.random() * 1.6,
        size: 32,
        rot: Math.random() * Math.PI
      });
    }

    function catcherLoop() {
      if (!isCatcherRunning) return;
      tickCount++;
      const room = CATCHER_ROOMS[currentRoom];

      if (tickCount % room.spawnFreq === 0) {
        spawnCatcherItem();
      }

      // Draw Background
      const grad = ctx.createLinearGradient(0, 0, 0, cHeight);
      grad.addColorStop(0, room.bg1);
      grad.addColorStop(1, room.bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cWidth, cHeight);

      // Floor & Carpet
      ctx.fillStyle = '#78350F';
      ctx.fillRect(0, cHeight - 20, cWidth, 20);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(0, cHeight - 24, cWidth, 4);

      // Draw Richie's Diamond Cart
      const cartY = cHeight - 50;
      const cartW = 80;
      const cartH = 34;

      // Cart body
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.roundRect(cartX - cartW / 2, cartY, cartW, cartH, 10);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#D97706';
      ctx.stroke();

      // Golden Rim
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(cartX - cartW / 2 + 4, cartY + 4, cartW - 8, 4);

      // Cart Emblem / Diamond
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💎', cartX, cartY + 24);

      // Wheels
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(cartX - 25, cartY + cartH + 4, 8, 0, Math.PI * 2);
      ctx.arc(cartX + 25, cartY + cartH + 4, 8, 0, Math.PI * 2);
      ctx.fill();

      // Update & Render Items
      for (let i = catcherItems.length - 1; i >= 0; i--) {
        const item = catcherItems[i];
        item.y += item.speed;

        // Render Item
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let emoji = '💎';
        if (item.type === 'mud') emoji = '💩';
        else if (item.type === 'star') emoji = '⭐';
        ctx.fillText(emoji, item.x, item.y);

        // Check collision with cart
        const hitDistance = Math.hypot(item.x - cartX, item.y - cartY);
        if (hitDistance < 42) {
          catcherItems.splice(i, 1);
          if (item.type === 'mud') {
            soundHit();
            triggerVibrate([80, 50, 80]);
            catcherLives--;
            updateCatcherHud();
            if (catcherLives <= 0) {
              isCatcherRunning = false;
              document.getElementById('catcher-lose-card').style.display = 'flex';
              return;
            }
          } else {
            soundGem();
            triggerVibrate(30);
            catcherScore += (item.type === 'star' ? 3 : 1);
            addDiamonds(item.type === 'star' ? 3 : 1);
            updateCatcherHud();

            if (catcherScore >= room.target) {
              soundWin();
              triggerVibrate([60, 40, 100, 50, 150]);
              isCatcherRunning = false;
              addDiamonds(100);
              const winTitle = currentRoom === 5 ? '🏆 Grand Mansion Champion!' : '🎉 Room Cleaned!';
              const winDesc = currentRoom === 5 ? 'Incredible! You beat all 6 levels of Richie\\'s Diamond Vault!' : \`Awesome! You cleared room \${currentRoom + 1} and won +100 diamonds!\`;
              document.getElementById('catcher-win-title').innerText = winTitle;
              document.getElementById('catcher-win-desc').innerText = winDesc;
              document.getElementById('btn-next-room').innerText = currentRoom === 5 ? 'PLAY AGAIN ↺' : 'NEXT ROOM ➔';
              document.getElementById('catcher-win-card').style.display = 'flex';
              return;
            }
          }
          continue;
        }

        // Out of bounds
        if (item.y > cHeight + 40) {
          catcherItems.splice(i, 1);
        }
      }

      catcherFrameId = requestAnimationFrame(catcherLoop);
    }

    function nextCatcherRoom() {
      document.getElementById('catcher-win-card').style.display = 'none';
      if (currentRoom >= 5) {
        startCatcherGame();
      } else {
        loadCatcherRoom(currentRoom + 1);
      }
    }

    function retryCatcherRoom() {
      document.getElementById('catcher-lose-card').style.display = 'none';
      loadCatcherRoom(currentRoom);
    }

    // --- INITIALIZE ON PAGE LOAD ---
    window.addEventListener('DOMContentLoaded', () => {
      initSwipeBoard();
      resizeCanvas();
    });
  </script>
</body>
</html>`;
}
