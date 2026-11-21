/* Presentation-only enhancement for the existing simulator.
   Does NOT modify arrivals, service durations, queue logic or statistics.
   Reads already-rendered DOM values to display status, timeline and queue history. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const qHistory = [{t:0, q:0}];
  let lastT = 0;
  let mode = 'ready';
  let ref = false;
  const gauge = $('timelineProgress');
  const fill = $('progressFill');
  const cursor = $('queueCursor');
  const area = $('queueArea');
  const line = $('queuePolyline');

  function readTime() {
    const m = /^\s*(\d+):(\d+)\s*$/.exec($('clock').textContent);
    return m ? Number(m[1]) + Number(m[2])/60 : 0;
  }
  function queueCount() {
    return Number.parseInt($('queueCount').textContent,10) || 0;
  }
  function updateStationSummary() {
    const n = Number.parseInt($('servers').value,10) || 2;
    const effective = ref ? 1 : n;
    $('stationCount').textContent = `${effective} ${effective===1?'station':'stations'}`;
  }
  function initialStations() {
    const wrapper=$('stations');
    wrapper.replaceChildren();
    const number=Math.max(1,Math.min(12,Number.parseInt($('servers').value,10)||2));
    for (let i=1;i<=number;i++) {
      const card=document.createElement('div');card.className='station';
      const label=document.createElement('small');label.textContent=`Station ${i}`;
      const val=document.createElement('strong');val.textContent='Available';
      card.append(label,val);wrapper.append(card);
    }
    ref=false;updateStationSummary();
  }
  function setMode(next) {
    mode=next;
    const badge=$('runState');
    badge.className='run-badge'+(['running','paused','finished'].includes(next)?' '+next:'');
    $('runStateText').textContent=({ready:'Ready to simulate',running:'Simulation running',paused:'Simulation paused',finished:'Run complete'})[next]||'Ready to simulate';
  }
  function drawQueueLine() {
    const values=qHistory;
    const limit=ref?6:60;
    const peak=Math.max(5,...values.map(x=>x.q));
    $('chartMax').textContent=peak;
    $('chartMid').textContent=Math.round(peak/2);
    const toPoint=p=>[Math.max(0,Math.min(640,(p.t/limit)*640)),104-(p.q/peak)*94];
    // Use observed samples only; no interpolation beyond the current simulation time.
    const pts=values.map(toPoint);
    if(pts.length<2)pts.push(pts[0]);
    const str=pts.map(([x,y])=>`${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
    line.setAttribute('points',str);
    const last=pts[pts.length-1];
    cursor.setAttribute('cx',String(last[0]));cursor.setAttribute('cy',String(last[1]));
    area.setAttribute('d','M0 104 '+pts.map(([x,y])=>`L${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')+' L'+last[0].toFixed(2)+' 104 Z');
  }
  function resetVisual() {
    lastT=0;qHistory.length=0;qHistory.push({t:0,q:0});
    ref=false;setMode('ready');initialStations();drawQueueLine();
  }
  function sampleDOM() {
    const t=readTime();const q=queueCount();
    const limit=ref?6:60;
    const progress=Math.max(0,Math.min(100,(t/limit)*100));
    fill.style.width=`${progress.toFixed(1)}%`;
    $('timePercent').textContent=`${Math.round(progress)}%`;
    gauge.setAttribute('aria-valuenow',String(Math.round(progress)));
    if(t<lastT-.01) {qHistory.length=0;qHistory.push({t:0,q:0});}
    if(t>lastT+1/120){qHistory.push({t,q});lastT=t;}
    if(qHistory.length>320)qHistory.splice(1,qHistory.length-320);
    drawQueueLine();
    if(mode==='running' && $('pause').disabled && t>0 && Number($('arrived').textContent)>0) setMode('finished');
    updateStationSummary();
  }
  function start(reference) {
    // Original script.js action fires first; this listener changes presentation only.
    window.setTimeout(()=>{
      if(!$('error').hidden) return;
      ref=reference;lastT=0;qHistory.length=0;qHistory.push({t:0,q:0});
      setMode('running');sampleDOM();
    },0);
  }
  $('start').addEventListener('click',()=>start(false));
  $('reference').addEventListener('click',()=>start(true));
  $('pause').addEventListener('click',()=>{
    window.setTimeout(()=>{
      if($('error').hidden) setMode($('pause').textContent.trim()==='Resume'?'paused':'running');
    },0);
  });
  $('reset').addEventListener('click',()=>{
    resetVisual();fill.style.width='0%';$('timePercent').textContent='0%';gauge.setAttribute('aria-valuenow','0');
  });
  $('servers').addEventListener('input',()=>{if(mode==='ready')initialStations();});
  resetVisual();
  window.setInterval(sampleDOM,240);
})();
