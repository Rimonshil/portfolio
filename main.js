/* ============================================================
   RIMON SHIL — PORTFOLIO  |  main.js
============================================================ */

// ============================================================
// 1. PARTICLE NETWORK
// ============================================================
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  const N = 65, DIST = 130, SPD = 0.28, COL = '88,166,255';
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  const mkP = () => ({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*SPD, vy:(Math.random()-.5)*SPD, r:Math.random()*1.4+0.4 });
  window.addEventListener('resize', resize);
  resize();
  pts = Array.from({length:N}, mkP);
  (function draw() {
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if (d<DIST) { ctx.strokeStyle=`rgba(${COL},${(1-d/DIST)*0.15})`; ctx.lineWidth=0.6; ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
    }
    pts.forEach(p => {
      ctx.fillStyle=`rgba(${COL},0.4)`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
    });
    requestAnimationFrame(draw);
  })();
})();


// ============================================================
// 2. TYPED HERO TEXT
// ============================================================
(function () {
  const phrases = ['DevOps Engineer III','AWS & Kubernetes Expert','CI/CD Architect','DevSecOps Practitioner','Infrastructure Automator','SRE & Cloud Builder'];
  const el = document.getElementById('typed-text');
  let pi=0,ci=0,del=false;
  function tick() {
    const cur=phrases[pi];
    el.textContent = del ? cur.substring(0,ci-1) : cur.substring(0,ci+1);
    if(del)ci--;else ci++;
    let w = del?48:88;
    if(!del&&ci===cur.length){w=2200;del=true;}
    else if(del&&ci===0){del=false;pi=(pi+1)%phrases.length;w=450;}
    setTimeout(tick,w);
  }
  tick();
})();


// ============================================================
// 3. ANIMATED HERO TERMINAL  (real DevOps commands)
// ============================================================
(function () {
  const c = document.getElementById('terminal-lines');
  if (!c) return;
  const script = [
    {t:'cmd', s:'kubectl get nodes -o wide'},
    {t:'out', s:'NAME             STATUS   ROLES    AGE   VERSION   INTERNAL-IP'},
    {t:'out', s:'eks-prod-node-1  Ready    <none>   2y    v1.29.0   10.0.1.4'},
    {t:'out', s:'eks-prod-node-2  Ready    <none>   2y    v1.29.0   10.0.1.5'},
    {t:'ok',  s:'✓ 2/2 nodes Ready'},
    {t:'p', ms:600},
    {t:'cmd', s:'trivy image myapp:v2.4.1 --severity CRITICAL,HIGH --quiet'},
    {t:'out', s:'2024-08-30T11:04:01Z INFO  Scanning...'},
    {t:'out', s:'myapp:v2.4.1 (debian 12.4)'},
    {t:'ok',  s:'Total: 0 (CRITICAL: 0, HIGH: 0)'},
    {t:'ok',  s:'✓ Security gate passed'},
    {t:'p', ms:700},
    {t:'cmd', s:'terraform plan -var-file=prod.tfvars'},
    {t:'out', s:'Refreshing state... aws_eks_cluster.main: Refreshing'},
    {t:'out', s:'Plan: 2 to add, 1 to change, 0 to destroy.'},
    {t:'ok',  s:'✓ Plan complete. Applying...'},
    {t:'p', ms:600},
    {t:'cmd', s:'kubectl rollout status deploy/api -n production'},
    {t:'out', s:'Waiting for deployment "api" rollout to finish...'},
    {t:'out', s:'3/3 updated replicas are available.'},
    {t:'ok',  s:'deployment "api" successfully rolled out'},
    {t:'p', ms:500},
    {t:'cmd', s:'curl -sf https://api.prod.example.com/health | jq .'},
    {t:'out', s:'{'},
    {t:'out', s:'  "status": "healthy",'},
    {t:'out', s:'  "uptime": "99.94%",'},
    {t:'out', s:'  "version": "v2.4.1"'},
    {t:'out', s:'}'},
  ];
  let idx=0;
  function addLine(type,text) {
    const p=document.createElement('p'); p.className='tl';
    if(type==='cmd') {
      const pr=document.createElement('span'); pr.className='tl-prompt'; pr.textContent='$';
      const cm=document.createElement('span'); cm.className='tl-cmd';
      p.appendChild(pr); p.appendChild(cm); c.appendChild(p); c.scrollTop=c.scrollHeight;
      let ci2=0;
      return new Promise(res=>{ const iv=setInterval(()=>{ cm.textContent+=text[ci2++]; if(ci2>=text.length){clearInterval(iv);setTimeout(res,100);} },28); });
    } else {
      const sp=document.createElement('span');
      sp.className=type==='ok'?'tl-ok':type==='warn'?'tl-warn':type==='err'?'tl-err':'tl-out';
      sp.textContent=text; p.appendChild(sp); c.appendChild(p); c.scrollTop=c.scrollHeight;
      return Promise.resolve();
    }
  }
  async function run() {
    c.innerHTML=''; idx=0;
    while(idx<script.length) {
      const s=script[idx++];
      if(s.t==='p'){await new Promise(r=>setTimeout(r,s.ms));}
      else{await addLine(s.t,s.s); await new Promise(r=>setTimeout(r,s.t==='cmd'?160:70));}
    }
    await new Promise(r=>setTimeout(r,3500));
    run();
  }
  run();
})();


// ============================================================
// 4. SPARKLINE CANVAS (hero right panel)
// ============================================================
(function () {
  const canvas = document.getElementById('sparkline-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const POINTS = 50;
  const series = {
    cpu: Array.from({length:POINTS}, ()=>Math.random()*40+30),
    mem: Array.from({length:POINTS}, ()=>Math.random()*30+45),
    rps: Array.from({length:POINTS}, ()=>Math.random()*60+20),
  };
  const colors = { cpu:'#58a6ff', mem:'#3fb950', rps:'#d2a8ff' };

  function draw() {
    const W = canvas.offsetWidth || 400;
    canvas.width  = W;
    canvas.height = 52;
    const H = canvas.height;
    ctx.clearRect(0,0,W,H);

    Object.entries(series).forEach(([key, data]) => {
      const max = Math.max(...data), min = Math.min(...data), range = max-min||1;
      ctx.beginPath();
      ctx.strokeStyle = colors[key];
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.8;
      data.forEach((v,i) => {
        const x = (i/(POINTS-1))*W;
        const y = H - ((v-min)/range)*(H-8) - 4;
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      });
      ctx.stroke();

      // fill
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = colors[key];
      ctx.globalAlpha = 0.06;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  draw();
  setInterval(() => {
    Object.keys(series).forEach(k => {
      const arr = series[k];
      arr.push(arr[arr.length-1] + (Math.random()-0.48)*4);
      if (arr[arr.length-1] < 5)  arr[arr.length-1] = 5;
      if (arr[arr.length-1] > 95) arr[arr.length-1] = 95;
      arr.shift();
    });
    draw();
  }, 800);

  window.addEventListener('resize', draw);
})();


// ============================================================
// 5. CI/CD PIPELINE
// ============================================================
(function () {
  const stages = [
    {id:0, dur:1100, logs:[{c:'info',t:'[checkout] Cloning release/v2.4.1 @ sha:a3f9c1d'},{c:'ok',t:'[checkout] ✓ 0.8s'}]},
    {id:1, dur:2000, logs:[{c:'info',t:'[build] docker build -t myapp:v2.4.1 .'},{c:'out',t:'[build] Step 8/12: RUN npm ci --production'},{c:'ok',t:'[build] ✓ Image built in 17.2s'}]},
    {id:2, dur:1700, logs:[{c:'info',t:'[trivy] Scanning myapp:v2.4.1 for CRITICAL,HIGH...'},{c:'out',t:'[trivy] 0 vulnerabilities found'},{c:'ok',t:'[trivy] ✓ Security gate passed'}]},
    {id:3, dur:1300, logs:[{c:'info',t:'[push] Pushing to 123456.dkr.ecr.ap-southeast-1.amazonaws.com'},{c:'ok',t:'[push] ✓ myapp:v2.4.1 pushed successfully'}]},
    {id:4, dur:1900, logs:[{c:'info',t:'[deploy] kubectl set image deploy/api api=myapp:v2.4.1 -n production'},{c:'out',t:'[deploy] Waiting for rollout...'},{c:'ok',t:'[deploy] ✓ 3/3 pods running — zero downtime'}]},
    {id:5, dur:900,  logs:[{c:'info',t:'[health] GET https://api.prod.example.com/health'},{c:'ok',t:'[health] ✓ 200 OK — status: healthy'},{c:'ok',t:'🎉 Pipeline succeeded in 64s'}]},
  ];
  const logEl = document.getElementById('pipeline-log');
  const btn   = document.getElementById('pipeline-restart');

  function stageEl(i) { return document.querySelector(`.pipeline-stage[data-stage="${i}"]`); }
  function timeEl(i)  { return document.getElementById('st-'+i); }
  function arrowEl(i) { return document.querySelectorAll('.pipe-arrow')[i]; }

  function reset() {
    logEl.innerHTML = '<span class="log-placeholder">Initiating pipeline…</span>';
    for (let i=0;i<stages.length;i++) {
      const se=stageEl(i); se.classList.remove('running','done','waiting'); se.classList.add('waiting');
      timeEl(i).textContent='–';
      const a=arrowEl(i); if(a) a.classList.remove('active');
    }
  }

  function log(c,t) {
    const ph=logEl.querySelector('.log-placeholder'); if(ph)ph.remove();
    const s=document.createElement('span'); s.className='log-'+c; s.textContent=t+'\n';
    logEl.appendChild(s); logEl.scrollTop=logEl.scrollHeight;
  }

  async function run() {
    reset(); btn.disabled=true;
    await new Promise(r=>setTimeout(r,350));
    for (let i=0;i<stages.length;i++) {
      const se=stageEl(i), ar=arrowEl(i);
      se.classList.remove('waiting'); se.classList.add('running');
      if(ar) ar.classList.add('active');
      stages[i].logs.forEach(l=>log(l.c,l.t));
      await new Promise(r=>setTimeout(r,stages[i].dur));
      se.classList.remove('running'); se.classList.add('done');
      if(ar) ar.classList.remove('active');
      timeEl(i).textContent=(stages[i].dur/1000).toFixed(1)+'s';
      await new Promise(r=>setTimeout(r,180));
    }
    btn.disabled=false;
  }

  btn.addEventListener('click', run);
  let ran=false;
  new IntersectionObserver(e=>{if(e[0].isIntersecting&&!ran){ran=true;setTimeout(run,400);}},{threshold:0.3})
    .observe(document.getElementById('pipeline'));
})();


// ============================================================
// 6. GRAFANA CANVAS (multi-line chart)
// ============================================================
(function () {
  const canvas = document.getElementById('grafana-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const N = 60;
  const series = {
    cpu:  Array.from({length:N}, (_,i)=>45+Math.sin(i/8)*15+Math.random()*5),
    mem:  Array.from({length:N}, (_,i)=>60+Math.cos(i/10)*12+Math.random()*4),
    rps:  Array.from({length:N}, (_,i)=>280+Math.sin(i/5)*40+Math.random()*20),
  };
  const cfg = {
    cpu:  {color:'#58a6ff', label:'CPU %',   scale:[0,100]},
    mem:  {color:'#3fb950', label:'Mem %',   scale:[0,100]},
    rps:  {color:'#d2a8ff', label:'Req/s',   scale:[200,400]},
  };

  function draw() {
    const W = canvas.offsetWidth||1000;
    canvas.width=W; canvas.height=120;
    const H=canvas.height;
    ctx.clearRect(0,0,W,H);

    // grid lines
    ctx.strokeStyle='rgba(48,54,61,0.8)'; ctx.lineWidth=1;
    for(let y=0;y<=4;y++){const yp=H/4*y; ctx.beginPath(); ctx.moveTo(0,yp); ctx.lineTo(W,yp); ctx.stroke();}

    Object.entries(series).forEach(([key,data])=>{
      const {color,scale}=cfg[key];
      const [mn,mx]=scale; const range=mx-mn;
      ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=1.8; ctx.globalAlpha=0.9;
      data.forEach((v,i)=>{
        const x=(i/(N-1))*W;
        const y=H-((Math.min(Math.max(v,mn),mx)-mn)/range)*(H-6)-3;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      });
      ctx.stroke();
      // area fill
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
      ctx.fillStyle=color; ctx.globalAlpha=0.05; ctx.fill();
      ctx.globalAlpha=1;
    });
  }

  draw();
  const tileIds = {cpu:'tile-cpu', mem:'tile-mem', rps:'tile-rps', lat:'tile-lat', err:'tile-err'};

  setInterval(()=>{
    Object.entries(series).forEach(([k,arr])=>{
      let last=arr[arr.length-1];
      last += (Math.random()-0.48)*4;
      const {scale}=cfg[k];
      last=Math.min(Math.max(last, scale[0]+2), scale[1]-2);
      arr.push(last); arr.shift();
    });
    draw();

    // update stat tiles
    const cpuVal=(series.cpu[series.cpu.length-1]).toFixed(1);
    const memVal=(series.mem[series.mem.length-1]).toFixed(0);
    const rpsVal=Math.round(series.rps[series.rps.length-1]);
    const cpuEl=document.getElementById('tile-cpu'); if(cpuEl)cpuEl.textContent=cpuVal+'%';
    const memEl=document.getElementById('tile-mem'); if(memEl)memEl.textContent=memVal+'%';
    const rpsEl=document.getElementById('tile-rps'); if(rpsEl)rpsEl.textContent=rpsVal;
  }, 1000);

  window.addEventListener('resize', draw);

  // live clock
  setInterval(()=>{
    const t=document.getElementById('gf-time');
    if(t) t.textContent=new Date().toTimeString().slice(0,8);
  }, 1000);
})();


// ============================================================
// 7. K8s RESOURCE BAR ANIMATION
// ============================================================
(function () {
  const fills = document.querySelectorAll('.res-fill');
  // Animate bars on load
  setTimeout(() => {
    fills.forEach(f => {
      const target = f.style.width;
      f.style.width = '0%';
      setTimeout(() => { f.style.width = target; }, 100);
    });
  }, 800);

  // Subtle live fluctuation
  setInterval(() => {
    fills.forEach(f => {
      const cur = parseFloat(f.style.width);
      const next = Math.min(95, Math.max(5, cur + (Math.random()-0.48)*2));
      f.style.width = next.toFixed(0) + '%';
      const valEl = f.closest('.res-row')?.querySelector('.res-val');
      if (valEl) valEl.textContent = next.toFixed(0) + '%';
    });
  }, 3000);
})();


// ============================================================
// 8. HERO PIPELINE COUNTER  (little live number)
// ============================================================
(function () {
  const el = document.getElementById('pipeline-counter');
  if (!el) return;
  setInterval(() => {
    el.textContent = (Math.random() > 0.3) ? Math.floor(Math.random()*3+2) : el.textContent;
  }, 4000);
})();


// ============================================================
// 9. NAVBAR
// ============================================================
(function () {
  const nav = document.getElementById('navbar');
  const hbg = document.getElementById('hamburger');
  const lnk = document.querySelector('.nav-links');
  window.addEventListener('scroll', ()=>nav.classList.toggle('scrolled', window.scrollY>40));
  hbg.addEventListener('click', ()=>lnk.classList.toggle('open'));
  lnk.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>lnk.classList.remove('open')));
  const obs = new IntersectionObserver(e=>{
    e.forEach(en=>{
      if(en.isIntersecting) lnk.querySelectorAll('a').forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+en.target.id));
    });
  },{rootMargin:'-40% 0px -55% 0px'});
  document.querySelectorAll('section[id]').forEach(s=>obs.observe(s));
})();


// ============================================================
// 10. SCROLL REVEAL
// ============================================================
(function () {
  const obs = new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*70); obs.unobserve(e.target);}
    });
  },{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
})();


// ============================================================
// 11. COUNTER ANIMATION
// ============================================================
(function () {
  const obs = new IntersectionObserver(e=>{
    e.forEach(en=>{
      if(!en.isIntersecting) return;
      const el=en.target, target=parseInt(el.dataset.target,10);
      if(isNaN(target))return;
      let cur=0; const steps=1400/16;
      const iv=setInterval(()=>{ cur+=target/steps; el.textContent=Math.min(Math.floor(cur),target); if(cur>=target)clearInterval(iv); },16);
      obs.unobserve(el);
    });
  },{threshold:0.5});
  document.querySelectorAll('.stat-number[data-target]').forEach(el=>obs.observe(el));
})();


// ============================================================
// 12. STAGGER REVEAL (stats)
// ============================================================
(function () {
  const obs = new IntersectionObserver(e=>{
    e.forEach(en=>{
      if(en.isIntersecting){
        en.target.parentElement.querySelectorAll('.reveal-stagger').forEach((s,i)=>setTimeout(()=>s.classList.add('visible'),i*130));
        obs.unobserve(en.target);
      }
    });
  },{threshold:0.2});
  document.querySelectorAll('.reveal-stagger').forEach(el=>obs.observe(el));
})();


// ============================================================
// 13. PROJECT CARD CURSOR GLOW
// ============================================================
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',(e.clientX-r.left)+'px');
    card.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
});


// ============================================================
// 14. FOOTER YEAR
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();
