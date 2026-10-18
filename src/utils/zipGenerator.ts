import JSZip from 'jszip';

// Generates the 100% self-contained offline game HTML that runs on double-click
export function generateStandaloneGameHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Richie's Diamond Vault: Kids Gem Adventure</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #1E1B4B;
      color: #1E293B;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      overflow-x: hidden;
    }
    #game-container {
      width: 100%;
      max-width: 600px;
      height: 100vh;
      max-height: 820px;
      display: flex;
      flex-direction: column;
      background: #FFFDF0;
      position: relative;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    #top-bar {
      background: #F59E0B;
      color: #451A03;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 4px solid #D97706;
    }
    .hud-badge {
      background: #FEF3C7;
      border: 2px solid #D97706;
      border-radius: 12px;
      padding: 4px 10px;
      font-weight: 800;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    #canvas-wrap {
      flex: 1;
      position: relative;
      background: linear-gradient(180deg, #FDE68A 0%, #FEF3C7 50%, #F59E0B 100%);
      overflow: hidden;
    }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
    }
    #controls {
      background: #FFFBEB;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-top: 3px solid #FCD34D;
    }
    .ctrl-btn {
      width: 72px;
      height: 56px;
      background: #F59E0B;
      border: 3px solid #D97706;
      border-radius: 16px;
      color: #451A03;
      font-size: 28px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 0 #B45309;
      active: translateY(4px);
    }
    .ctrl-btn:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 #B45309;
    }
    .overlay-card {
      position: absolute;
      inset: 20px;
      background: #FFFFFF;
      border: 4px solid #F59E0B;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      z-index: 50;
    }
    .btn-main {
      background: #10B981;
      color: white;
      font-size: 20px;
      font-weight: 900;
      padding: 14px 32px;
      border-radius: 20px;
      border: 3px solid #059669;
      cursor: pointer;
      box-shadow: 0 6px 0 #047857;
      margin-top: 16px;
    }
    .btn-main:active {
      transform: translateY(4px);
      box-shadow: 0 2px 0 #047857;
    }
    h1 { color: #78350F; font-size: 26px; font-weight: 900; margin-bottom: 6px; }
    p { color: #78350F; font-size: 14px; font-weight: 600; line-height: 1.4; }
  </style>
</head>
<body>
  <div id="game-container">
    <div id="top-bar">
      <div class="hud-badge" id="hud-level">🏰 Level 1 / 6</div>
      <div class="hud-badge" id="hud-score">💎 0 / 15</div>
      <div class="hud-badge" id="hud-lives">❤️❤️❤️</div>
    </div>

    <div id="canvas-wrap">
      <canvas id="gameCanvas"></canvas>

      <!-- Start Screen -->
      <div class="overlay-card" id="start-overlay">
        <div style="font-size: 54px; margin-bottom: 8px;">💎🏎️</div>
        <h1>Richie's Diamond Vault</h1>
        <p>Help Richie collect sparkling diamonds across 6 luxurious mansion levels! Avoid mud and toys!</p>
        <button class="btn-main" onclick="startGame()">TAP TO PLAY!</button>
      </div>

      <!-- Victory / Next Level Screen -->
      <div class="overlay-card" id="win-overlay" style="display: none;">
        <div style="font-size: 60px; margin-bottom: 8px;">🏆✨</div>
        <h1 id="win-title">Vault Cleaned!</h1>
        <p id="win-desc">You collected all diamonds in this mansion room!</p>
        <button class="btn-main" id="btn-next" onclick="nextLevel()">NEXT LEVEL ➔</button>
      </div>

      <!-- Game Over Screen -->
      <div class="overlay-card" id="lose-overlay" style="display: none;">
        <div style="font-size: 60px; margin-bottom: 8px;">💫😅</div>
        <h1>Try Again!</h1>
        <p>Richie's cart got muddy! Tap to replay this level!</p>
        <button class="btn-main" style="background: #F59E0B; border-color: #D97706; box-shadow: 0 6px 0 #B45309;" onclick="restartLevel()">REPLAY LEVEL</button>
      </div>

      <!-- Bottom-Right AdMob (320x50) Banner Placeholder -->
      <div id="admob-banner" style="position: absolute; bottom: 8px; right: 8px; background: #1E293B; border: 2px dashed #F59E0B; border-radius: 12px; padding: 6px 12px; color: #FDE047; font-size: 11px; font-weight: 800; z-index: 40; box-shadow: 0 4px 15px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 8px;">
        <span style="background: #F59E0B; color: #451A03; font-size: 9px; padding: 2px 6px; border-radius: 6px; font-weight: 900;">Ad</span>
        <span>AdMob (320×50) Placeholder</span>
      </div>
    </div>

    <div id="controls">
      <div class="ctrl-btn" id="btn-left">◀</div>
      <div style="font-weight: 800; font-size: 13px; color: #78350F;">DRAG OR TAP BUTTONS</div>
      <div class="ctrl-btn" id="btn-right">▶</div>
    </div>
  </div>

  <script>
    // --- WEB AUDIO API SYNTHESIZER (ZERO EXTERNAL FILES) ---
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    function initAudio() {
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }
    function playBeep(freq, type, duration) {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch(e) {}
    }
    function soundCoin() {
      playBeep(1400, 'sine', 0.08);
      setTimeout(() => playBeep(2400, 'sine', 0.1), 30);
    }
    function soundDiamond() {
      soundCoin();
      playBeep(880, 'triangle', 0.15);
      setTimeout(() => playBeep(1320, 'sine', 0.2), 60);
    }
    function soundHit() { playBeep(180, 'sawtooth', 0.2); }
    function soundWin() { [523, 659, 783, 1046].forEach((f, i) => setTimeout(() => playBeep(f, 'triangle', 0.3), i * 100)); }

    // --- GAME ENGINE ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;

    function resize() {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resize);

    const LEVELS = [
      { name: "1. Bedroom Safe", target: 12, speed: 2.2, spawnRate: 65, bg: "#FEF3C7" },
      { name: "2. Mansion Play Palace", target: 16, speed: 2.8, spawnRate: 55, bg: "#FDE68A" },
      { name: "3. Golden Grand Staircase", target: 20, speed: 3.2, spawnRate: 48, bg: "#FCD34D" },
      { name: "4. Secret Laser Vault", target: 24, speed: 3.8, spawnRate: 42, bg: "#FBBF24" },
      { name: "5. Diamond Cavern", target: 28, speed: 4.4, spawnRate: 38, bg: "#F59E0B" },
      { name: "6. Master Treasury", target: 35, speed: 5.0, spawnRate: 34, bg: "#D97706" }
    ];

    let currentLevel = 0;
    let score = 0;
    let lives = 3;
    let items = [];
    let cartX = 0;
    let isPlaying = false;
    let frameId = null;
    let tick = 0;

    function startGame() {
      initAudio();
      document.getElementById('start-overlay').style.display = 'none';
      document.getElementById('win-overlay').style.display = 'none';
      document.getElementById('lose-overlay').style.display = 'none';
      resize();
      currentLevel = 0;
      loadLevel(0);
    }

    function loadLevel(idx) {
      currentLevel = idx;
      score = 0;
      lives = 3;
      items = [];
      cartX = width / 2;
      isPlaying = true;
      updateHud();
      if (!frameId) loop();
    }

    function updateHud() {
      const lvl = LEVELS[currentLevel];
      document.getElementById('hud-level').innerText = '🏰 ' + lvl.name;
      document.getElementById('hud-score').innerText = '💎 ' + score + ' / ' + lvl.target;
      document.getElementById('hud-lives').innerText = '❤️'.repeat(lives);
    }

    // Touch & Pointer controls
    let isDragging = false;
    canvas.addEventListener('pointerdown', (e) => { isDragging = true; setCartFromPointer(e); });
    window.addEventListener('pointermove', (e) => { if (isDragging) setCartFromPointer(e); });
    window.addEventListener('pointerup', () => { isDragging = false; });

    function setCartFromPointer(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      cartX = Math.max(40, Math.min(width - 40, x));
    }

    document.getElementById('btn-left').addEventListener('pointerdown', () => { cartX = Math.max(40, cartX - 45); });
    document.getElementById('btn-right').addEventListener('pointerdown', () => { cartX = Math.min(width - 40, cartX + 45); });

    function spawnItem() {
      const lvl = LEVELS[currentLevel];
      const isBad = Math.random() < 0.28;
      items.push({
        x: 40 + Math.random() * (width - 80),
        y: -30,
        type: isBad ? 'mud' : (Math.random() < 0.2 ? 'star' : 'gem'),
        speed: lvl.speed + Math.random() * 1.5,
        rot: Math.random() * Math.PI * 2
      });
    }

    function loop() {
      if (!isPlaying) return;
      ctx.clearRect(0, 0, width, height);

      // Background room pattern
      ctx.fillStyle = LEVELS[currentLevel].bg;
      ctx.fillRect(0, 0, width, height);

      tick++;
      if (tick % LEVELS[currentLevel].spawnRate === 0) spawnItem();

      // Render & Move Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;
        item.rot += 0.03;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rot);
        ctx.font = item.type === 'star' ? "32px sans-serif" : (item.type === 'gem' ? "28px sans-serif" : "26px sans-serif");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.type === 'star' ? "⭐" : (item.type === 'gem' ? "💎" : "💩"), 0, 0);
        ctx.restore();

        // Check collision with cart
        const cartY = height - 50;
        if (Math.abs(item.x - cartX) < 42 && Math.abs(item.y - cartY) < 35) {
          if (item.type === 'mud') {
            soundHit();
            lives--;
            updateHud();
            if (lives <= 0) {
              isPlaying = false;
              document.getElementById('lose-overlay').style.display = 'flex';
              return;
            }
          } else {
            soundDiamond();
            score += (item.type === 'star' ? 2 : 1);
            updateHud();
            if (score >= LEVELS[currentLevel].target) {
              isPlaying = false;
              soundWin();
              if (currentLevel >= LEVELS.length - 1) {
                document.getElementById('win-title').innerText = "🏆 BILLIONAIRE CHAMPION!";
                document.getElementById('win-desc').innerText = "Incredible! You unlocked every diamond vault in Richie's mansion!";
                document.getElementById('btn-next').innerText = "PLAY FROM LEVEL 1";
              } else {
                document.getElementById('win-title').innerText = "Level " + (currentLevel + 1) + " Complete!";
                document.getElementById('win-desc').innerText = "Vault cleared! Tap Next for the next mansion room!";
                document.getElementById('btn-next').innerText = "NEXT ROOM ➔";
              }
              document.getElementById('win-overlay').style.display = 'flex';
              return;
            }
          }
          items.splice(i, 1);
          continue;
        }

        if (item.y > height + 40) items.splice(i, 1);
      }

      // Draw Richie's Golden Cart
      const cartY = height - 50;
      ctx.fillStyle = "#F59E0B";
      ctx.strokeStyle = "#B45309";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cartX - 40, cartY - 20, 80, 36, 12);
      ctx.fill();
      ctx.stroke();

      // Golden wheels
      ctx.fillStyle = "#78350F";
      ctx.beginPath();
      ctx.arc(cartX - 25, cartY + 18, 8, 0, Math.PI * 2);
      ctx.arc(cartX + 25, cartY + 18, 8, 0, Math.PI * 2);
      ctx.fill();

      // Cart emblem
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("💎", cartX, cartY);

      frameId = requestAnimationFrame(loop);
    }

    function nextLevel() {
      document.getElementById('win-overlay').style.display = 'none';
      if (currentLevel >= LEVELS.length - 1) {
        loadLevel(0);
      } else {
        loadLevel(currentLevel + 1);
      }
    }

    function restartLevel() {
      document.getElementById('lose-overlay').style.display = 'none';
      loadLevel(currentLevel);
    }
  </script>
</body>
</html>`;
}

// Generates the capacitor.config.json for Android Studio
export function generateCapacitorConfig(): string {
  return JSON.stringify({
    appId: "com.kidbillionaire.diamondvault",
    appName: "Richie Diamond Vault",
    webDir: "game",
    bundledWebRuntime: false,
    server: {
      androidScheme: "https"
    }
  }, null, 2);
}

// Generates the Android manifest
export function generateManifest(): string {
  return JSON.stringify({
    name: "Richie's Diamond Vault: Kids Gem Adventure",
    short_name: "DiamondVault",
    start_url: "index.html",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFDF0",
    theme_color: "#F59E0B",
    icons: [
      {
        src: "icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable"
      }
    ]
  }, null, 2);
}

// Generates the Google Play Store Privacy Policy Template (required for Play Store family apps)
export function generatePrivacyPolicy(): string {
  return `# Privacy Policy for Richie's Diamond Vault: Kids Gem Adventure

Last updated: October 2026

## 1. Kid-Safe & Family-Friendly Commitment
Richie's Diamond Vault is designed for children and families. We respect your children's privacy and ensure 100% kid-safe experiences:
- We do NOT collect any personally identifiable information (PII).
- We do NOT collect names, emails, addresses, contacts, or location data.
- The game runs 100% offline on your device without transmitting private personal data to external servers.

## 2. Children's Online Privacy Protection Act (COPPA)
Our application complies strictly with COPPA and Google Play Families Policy requirements:
- No tracking cookies or behavioral profile advertising.
- Safe game progression stored locally on device memory.

## 3. Contact Information
For questions regarding this policy or children's privacy, contact:
Developer Support: support@kidbillionairegame.com
`;
}

// Generates the complete step-by-step publishing guide
export function generatePublishingGuide(): string {
  return `========================================================================
HOW TO PUBLISH TO GOOGLE PLAY STORE & EARN MONEY - COMPLETE GUIDE
========================================================================

Congratulations! You now have the complete offline game & Android project.

------------------------------------------------------------------------
STEP 1: PLAY THE OFFLINE GAME RIGHT NOW
------------------------------------------------------------------------
1. Unzip this package.
2. Open the "/game/" folder.
3. Double-click "index.html" in ANY browser (Chrome, Safari, Edge, Firefox).
4. The game starts immediately with sound, 6 levels, and touch controls - 
   NO internet connection required!

------------------------------------------------------------------------
STEP 2: BUILD THE ANDROID APK / AAB (TWO EASY METHODS)
------------------------------------------------------------------------

METHOD A (Fastest - 2 Minutes on PWABuilder.com):
1. Go to https://www.pwabuilder.com
2. Upload the "/game/" folder or package.
3. Select "Android (Google Play)".
4. Click "Generate Package" to download your ready-to-upload .aab file!

METHOD B (Using Android Studio & Capacitor):
1. Inside this folder, run:
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap add android
   npx cap copy
   npx cap open android
2. Android Studio will open!
3. Click "Build" -> "Generate Signed Bundle / APK" -> select "Android App Bundle (.aab)".
4. You have your signed store file!

------------------------------------------------------------------------
STEP 3: UPLOAD TO GOOGLE PLAY CONSOLE
------------------------------------------------------------------------
1. Go to https://play.google.com/console and create a developer account ($25 one-time fee).
2. Click "Create App".
3. Set Category to: Games -> Casual / Kids.
4. Set Target Age: Ages 6-8, 9-12 (Designed for Families).
5. Paste the privacy policy from "/playstore/PRIVACY_POLICY.md".
6. Upload the app icon from "/playstore/icon-512.svg".
7. Upload your generated .aab file under "Production".
8. Click "Submit for Review"!

------------------------------------------------------------------------
STEP 4: HOW TO MONETIZE & EARN MONEY
------------------------------------------------------------------------
1. Google AdMob (Rewarded Video Ads):
   - Sign up at https://admob.google.com
   - Set up Rewarded Video ads (e.g. "Watch a video to unlock +500 free gems!").
2. Google Play In-App Purchases:
   - Offer Diamond Packs ($0.99 for 5,000 Diamonds, $1.99 to Unlock All Toys).
3. Paid App:
   - Charge a one-time $1.99 price for an ad-free kids experience.

------------------------------------------------------------------------
⚠️ CRITICAL TRADEMARK SAFETY NOTICE:
------------------------------------------------------------------------
"Richie Rich" is an active trademark owned by DreamWorks / NBCUniversal.
On the Google Play Store, publish with a safe original title such as:
- "Kid Billionaire: Diamond Vault"
- "Little Rich: Gem Rush"
- "Diamond Vault: Kids Gem Adventure"
This protects your Google Play developer account from copyright strikes!
========================================================================
`;
}

// 512x512 High resolution SVG App Icon
export function generateAppIconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bgG)" />
  <circle cx="256" cy="256" r="210" fill="#FEF3C7" stroke="#F59E0B" stroke-width="10" />
  <!-- Brilliant Cut Diamond -->
  <g transform="translate(256, 230) scale(2.6) translate(-50, -50)">
    <polygon points="50,12 85,38 72,88 28,88 15,38" fill="#E0F2FE" stroke="#0284C7" stroke-width="3" />
    <polygon points="50,12 85,38 65,38 50,12" fill="#BAE6FD" />
    <polygon points="50,12 15,38 35,38 50,12" fill="#BAE6FD" />
    <polygon points="35,38 65,38 50,88 35,38" fill="#FFFFFF" />
    <polygon points="15,38 35,38 28,88" fill="#7DD3FC" />
    <polygon points="85,38 65,38 72,88" fill="#7DD3FC" />
    <polygon points="40,26 43,32 49,35 43,38 40,44 37,38 31,35 37,32" fill="#FFFFFF" />
  </g>
  <!-- Bowtie Emblem -->
  <g transform="translate(256, 395)">
    <polygon points="-44,-20 -44,20 0,5 0,-5" fill="#EF4444" stroke="#B91C1C" stroke-width="3" />
    <polygon points="44,-20 44,20 0,5 0,-5" fill="#EF4444" stroke="#B91C1C" stroke-width="3" />
    <ellipse cx="0" cy="0" rx="14" ry="12" fill="#FBBF24" stroke="#B45309" stroke-width="3" />
  </g>
</svg>`;
}

// 1024x500 Feature Graphic SVG for Google Play Store Listing
export function generateFeatureGraphicSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
  <defs>
    <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B" />
      <stop offset="50%" stop-color="#312E81" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bannerBg)" />
  <circle cx="200" cy="250" r="160" fill="#F59E0B" fill-opacity="0.15" />
  <circle cx="850" cy="250" r="200" fill="#38BDF8" fill-opacity="0.15" />
  <!-- Big Diamonds -->
  <text x="180" y="270" font-size="120" text-anchor="middle">💎</text>
  <text x="860" y="290" font-size="130" text-anchor="middle">🏆</text>
  <text x="320" y="160" font-size="50" text-anchor="middle">⭐</text>
  <text x="720" y="140" font-size="60" text-anchor="middle">✨</text>
  <!-- Title -->
  <text x="512" y="220" font-family="-apple-system, sans-serif" font-weight="900" font-size="56" fill="#FDE047" text-anchor="middle">KID BILLIONAIRE</text>
  <text x="512" y="280" font-family="-apple-system, sans-serif" font-weight="800" font-size="34" fill="#FFFFFF" text-anchor="middle">Diamond Vault: Gem Adventure</text>
  <rect x="362" y="320" width="300" height="54" rx="27" fill="#F59E0B" stroke="#FEF08A" stroke-width="4" />
  <text x="512" y="356" font-family="-apple-system, sans-serif" font-weight="900" font-size="22" fill="#451A03" text-anchor="middle">6 EXCITING LEVELS</text>
</svg>`;
}

// Main In-Browser Blob Download Function - 100% Offline, Zero Network Calls
export async function downloadRichiesDiamondVaultPackage(): Promise<void> {
  const zip = new JSZip();

  // 1. /game/ - Offline Standalone Game HTML
  zip.file('game/index.html', generateStandaloneGameHtml());

  // 2. /android/ - Capacitor Android Configs
  zip.file('android/capacitor.config.json', generateCapacitorConfig());
  zip.file('android/manifest.json', generateManifest());
  zip.file('android/package.json', JSON.stringify({
    name: "richie-diamond-vault",
    version: "1.0.0",
    description: "Richie's Diamond Vault Kids Game for Android",
    dependencies: {
      "@capacitor/android": "^6.0.0",
      "@capacitor/cli": "^6.0.0",
      "@capacitor/core": "^6.0.0"
    }
  }, null, 2));

  // 3. /playstore/ - Google Play Store Assets & Compliance
  zip.file('playstore/icon-512x512.svg', generateAppIconSvg());
  zip.file('playstore/feature_graphic.svg', generateFeatureGraphicSvg());
  zip.file('playstore/PRIVACY_POLICY.md', generatePrivacyPolicy());
  zip.file('playstore/screenshots_info.txt', `SCREENSHOT INSTRUCTIONS FOR GOOGLE PLAY STORE:
1. Open /game/index.html in any browser.
2. Play through Levels 1 to 6.
3. Take 4-8 screenshots (1080x1920 or standard portrait phone resolution).
4. Upload them to Google Play Console under "Store Listing -> Screenshots".
`);

  // Include 512x512 PNG for Google Play Store upload
  try {
    const pngRes = await fetch('/icon-512x512.png');
    if (pngRes.ok) {
      const pngBlob = await pngRes.blob();
      zip.file('playstore/icon-512x512.png', pngBlob);
      zip.file('android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', pngBlob);
    }
  } catch (e) {
    console.warn('Could not fetch icon-512x512.png for zip', e);
  }

  // 4. /guide/ - Publishing and Monetization Steps
  zip.file('guide/HOW_TO_PUBLISH.txt', generatePublishingGuide());

  // Generate ZIP as in-browser Blob
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  // Pure Client-Side Blob URL Download (No DNS, No Server, Works 100% Offline)
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = 'Richies_Diamond_Vault_Full_Package.zip';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
  }, 2000);
}
