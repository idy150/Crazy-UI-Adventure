// New game logic: Jerry chases cheese, Tom chases Jerry.
document.addEventListener('DOMContentLoaded', () => {
  const jerry = document.getElementById('jerry');
  const tom = document.getElementById('tom');
  const boom = document.getElementById('boom');
  const timerEl = document.getElementById('timer');
  const scoreEl = document.getElementById('score');
  const playArea = document.getElementById('play-area') || document.body;
  const splash = document.getElementById('splash');
  const splashTitle = document.getElementById('splash-title');
  const splashSub = document.getElementById('splash-sub');
  const countdownEl = document.getElementById('countdown');
  const REQUIRED_MS = (splash && splash.dataset && parseInt(splash.dataset.duration, 10) > 0) ? parseInt(splash.dataset.duration, 10) * 1000 : 15000;
  const bgAudio = document.getElementById('bg-audio');
  const audioBtn = document.getElementById('audio-btn');

  if (!jerry || !tom || !boom) { console.warn('game.js: éléments manquants'); return; }

  let tomX = 100, tomY = 100;
  let jerryX = window.innerWidth / 2, jerryY = window.innerHeight / 2;
  let time = 0, score = 0;
  let running = false;
  let gameStarted = false;
  let chaseStartTime = 0;

  // Timer
  setInterval(() => { if (!running) return; time++; if (timerEl) timerEl.textContent = '⏱ Temps : ' + time + 's'; }, 1000);

  // Countdown updater (updates HUD with time remaining until Jerry-click is valid)
  function updateCountdown() {
    if (!countdownEl) return;
    if (!gameStarted) { countdownEl.textContent = '⏳ Prêt : -'; return; }
    const elapsed = Date.now() - chaseStartTime;
    const remaining = Math.max(0, REQUIRED_MS - elapsed);
    const secs = Math.ceil(remaining / 1000);
    if (remaining <= 0) {
      countdownEl.textContent = '✅ Vous pouvez cliquer Jerry';
    } else {
      countdownEl.textContent = '⏳ Prêt : ' + secs + 's';
    }
  }
  setInterval(updateCountdown, 200);

  // Spawn cheese
  function spawnCheese() {
    const cheese = document.createElement('div');
    cheese.className = 'cheese';
    const areaRect = playArea.getBoundingClientRect();
    const x = areaRect.left + 40 + Math.random() * (Math.max(0, areaRect.width - 80));
    const y = areaRect.top + 80 + Math.random() * (Math.max(0, areaRect.height - 160));
    cheese.style.position = 'absolute'; cheese.style.left = x + 'px'; cheese.style.top = y + 'px';
    cheese.style.width = '28px'; cheese.style.height = '28px'; cheese.style.fontSize = '20px';
    cheese.textContent = '🧀'; cheese.style.transform = 'translate(-50%,-50%)'; cheese.style.pointerEvents = 'none';
    playArea.appendChild(cheese);
    setTimeout(() => { if (cheese.parentNode) cheese.parentNode.removeChild(cheese); }, 12000);
  }
  for (let i = 0; i < 3; i++) spawnCheese(); setInterval(spawnCheese, 6000);

  // helper: nearest cheese
  function getNearestCheese() {
    const cheeses = Array.from(document.querySelectorAll('.cheese'));
    if (!cheeses.length) return null;  
    let best = null, bestD = Infinity; 
    cheeses.forEach(c => { const cx = parseFloat(c.style.left), cy = parseFloat(c.style.top); if (Number.isNaN(cx) || Number.isNaN(cy)) return; const d = Math.hypot(cx - jerryX, cy - jerryY); if (d < bestD) { bestD = d; best = { el: c, x: cx, y: cy }; } });
    return best;
  }

  // wandering
  let wanderTarget = { x: jerryX, y: jerryY };
  function pickWander() { const a = playArea.getBoundingClientRect(); wanderTarget.x = a.left + 40 + Math.random() * Math.max(0, a.width - 80); wanderTarget.y = a.top + 80 + Math.random() * Math.max(0, a.height - 160); }
  setInterval(pickWander, 4000);

  // audio helpers
  async function tryPlayAudio() {
    if (!bgAudio) return false;
    try {
      bgAudio.loop = true;
      await bgAudio.play();
      return true;
    } catch (e) {
      try {
        bgAudio.muted = true;
        bgAudio.loop = true;
        await bgAudio.play();
        setTimeout(() => { try { bgAudio.muted = false; } catch (_) { } }, 600);
        return true;
      } catch (_) {
        return false;
      }
    }
  }

  // intro: disperse title then start chase
  function disperseText(el, cb) {
    if (!el) { cb && cb(); return; }
    const text = el.textContent || '';
    el.textContent = '';
    const chars = [];
    for (const ch of text) { const s = document.createElement('span'); s.className = 'char'; s.textContent = ch; el.appendChild(s); chars.push(s); }
    // Wait longer before dispersing so users can read the title
    setTimeout(() => { chars.forEach(s => { const rx = (Math.random() - 0.5) * 600; const ry = (Math.random() - 0.5) * 400; const rot = (Math.random() - 0.5) * 60; s.style.transform = `translate(${rx}px,${ry}px) rotate(${rot}deg)`; s.style.opacity = '0'; }); setTimeout(() => cb && cb(), 900); }, 1800);
  }

  // start game
  async function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    running = true;
    chaseStartTime = Date.now();
    const audioOk = await tryPlayAudio();
    if (!audioOk && audioBtn) {
      audioBtn.style.display = 'block';
      audioBtn.addEventListener('click', async function onAudio() { try { await bgAudio.play(); } catch (e) { } audioBtn.style.display = 'none'; audioBtn.removeEventListener('click', onAudio); });
    }
    requestAnimationFrame(loop);
  }

  // core loop
  function loop() {
    if (!running) return;
    const nearest = getNearestCheese();
    let tx = wanderTarget.x, ty = wanderTarget.y;
    if (nearest) { tx = nearest.x; ty = nearest.y; }
    jerryX += (tx - jerryX) * 0.06; jerryY += (ty - jerryY) * 0.06;
    const dx = jerryX - tomX, dy = jerryY - tomY;
    tomX += dx * 0.02; tomY += dy * 0.02;
    jerry.style.left = jerryX + 'px'; jerry.style.top = jerryY + 'px';
    tom.style.left = tomX + 'px'; tom.style.top = tomY + 'px';
    const elapsed = Date.now() - chaseStartTime;
    const dist = Math.hypot(jerryX - tomX, jerryY - tomY);
    // Tom can only catch Jerry after the required time
    if (dist < 60 && elapsed >= REQUIRED_MS) {
      running = false;
      boom.style.left = ((jerryX + tomX) / 2) + 'px';
      boom.style.top = ((jerryY + tomY) / 2) + 'px';
      boom.style.transform = 'translate(-50%,-50%) scale(1.2)';
      boom.style.opacity = '1';
      setTimeout(() => { boom.style.transform = 'translate(-50%,-50%) scale(0)'; boom.style.opacity = '0'; }, 400);
      // DO NOT show the start button here — it must be shown only after a valid user click on Jerry.
    }
    const cheeses = document.querySelectorAll('.cheese');
    cheeses.forEach(c => {
      const cx = parseFloat(c.style.left), cy = parseFloat(c.style.top);
      if (Number.isNaN(cx) || Number.isNaN(cy)) return;
      if (Math.hypot(cx - jerryX, cy - jerryY) < 30) {
        score++;
        if (scoreEl) scoreEl.textContent = '🧀 Fromages : ' + score;
        if (c.parentNode) c.parentNode.removeChild(c);
        const burst = document.createElement('div'); burst.textContent = '✨'; burst.style.position = 'absolute'; burst.style.left = cx + 'px'; burst.style.top = cy + 'px'; burst.style.transform = 'translate(-50%,-50%)'; burst.style.pointerEvents = 'none'; playArea.appendChild(burst);
        setTimeout(() => { if (burst.parentNode) burst.parentNode.removeChild(burst); }, 700);
        pickWander();
      }
    });
    requestAnimationFrame(loop);
  }

  function showStartButton() {
    if (document.getElementById('start-btn-float')) return;
    const b = document.createElement('button');
    b.id = 'start-btn-float';
    b.className = 'btn enabled';
    b.textContent = 'Commencer';
    b.style.position = 'fixed';
    b.style.right = '18px';
    b.style.bottom = '18px';
    b.style.zIndex = '100';
    b.addEventListener('click', () => {
      try { if (bgAudio && !bgAudio.paused) { bgAudio.pause(); bgAudio.currentTime = 0; } } catch (e) { }
      window.location.href = 'form.html';
    });
    // prepare animated appearance
    b.classList.add('start-float');
    document.body.appendChild(b);
    // trigger entrance animation on next frame
    requestAnimationFrame(()=> b.classList.add('visible'));
  }

  // clicking jerry: if clicked after required duration, stop and show start
  if (jerry) {
    jerry.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!gameStarted) return;
      const elapsed = Date.now() - chaseStartTime;
      if (elapsed >= REQUIRED_MS) {
        running = false;
        showStartButton();
        try { await bgAudio.play(); } catch (_) { }
      } else {
        jerry.animate([
          { transform: 'translate(-50%,-50%) rotate(0deg)' },
          { transform: 'translate(-50%,-48%) rotate(-6deg)' },
          { transform: 'translate(-50%,-50%) rotate(0deg)' }
        ], { duration: 350, iterations: 1 });
      }
    });
  }

  // start intro: show splash and wait for the user to click the "Jouer" button
  disperseText(splashTitle, () => {
    if (splashSub) splashSub.classList.remove('hidden');
    const splashBtn = document.getElementById('splash-start');
    if (splashBtn) {
      splashBtn.style.display = 'inline-block';
      splashBtn.addEventListener('click', async () => {
        // try to play audio as this is a user gesture
        try { await tryPlayAudio(); } catch (_) { }
        // fade out splash, then start game
        if (splash) {
          splash.style.transition = 'opacity 0.4s ease';
          splash.style.opacity = '0';
          setTimeout(() => { if (splash && splash.parentNode) splash.parentNode.removeChild(splash); }, 450);
        }
        startGame();
      }, { once: true });
    } else {
      // fallback: auto-start after a short delay
      setTimeout(() => { if (splash) splash.style.opacity = '0'; startGame(); }, 1200);
    }
  });

});


   