// Provenance: AI-generated prototype. Synthetic data only; student review pending.
'use strict';
const $=id=>document.getElementById(id);
let state=null, timer=null;
function seeded(seed){let x=seed>>>0;return ()=>{x=(1664525*x+1013904223)>>>0;return (x+.5)/4294967296;};}
function expSample(mean,uniform){return -mean*Math.log(uniform());}
function buildTrace(rate,mean,seed=20261118,horizon=60){const uniform=seeded(seed);const a=[],s=[];let t=0;while(true){t+=expSample(1/rate,uniform);if(t>horizon)break;a.push(t);s.push(expSample(mean,uniform));}return{arrivals:a,services:s};}
function validate(){const rate=Number($('arrival').value),mean=Number($('service').value),servers=Number($('servers').value);if(!Number.isFinite(rate)||rate<=0||rate>10||!Number.isFinite(mean)||mean<=0||mean>10||!Number.isInteger(servers)||servers<1||servers>12)throw Error('Use arrival rate 0.05–10, mean service time 0.05–10 and 1–12 whole stations.');return{rate,mean,servers};}
function initialize(trace,c,reference=false){const {arrivals,services}=trace;if(arrivals.length!==services.length||services.some(s=>s<=0)||arrivals.some((a,i)=>i>0&&a<arrivals[i-1]))throw Error('Invalid event trace');return{arrivals,services,c,reference,t:0,next:0,completed:0,queue:[],busy:Array(c).fill(null),waits:[],queueArea:0,busyArea:0,finished:arrivals.length===0};}
function nextEvent(s){let t=s.next<s.arrivals.length?s.arrivals[s.next]:Infinity;for(const item of s.busy)if(item&&item.end<t)t=item.end;return t;}
function event(s){const t=nextEvent(s);if(!Number.isFinite(t)){s.finished=true;return;}s.queueArea+=s.queue.length*(t-s.t);s.busyArea+=s.busy.filter(Boolean).length*(t-s.t);s.t=t;
// Process all departures first, then all simultaneous arrivals.
for(let j=0;j<s.c;j++){const b=s.busy[j];if(b&&Math.abs(b.end-t)<1e-10){s.busy[j]=null;s.completed++;}}
while(s.next<s.arrivals.length&&Math.abs(s.arrivals[s.next]-t)<1e-10){s.queue.push(s.next);s.next++;}
for(let j=0;j<s.c&&s.queue.length;j++){if(s.busy[j]===null){const person=s.queue.shift();s.waits[person]=t-s.arrivals[person];s.busy[j]={person,end:t+s.services[person]};}}
if(s.completed===s.arrivals.length)s.finished=true;
}
function advance(s,until){let guard=0;while(!s.finished&&nextEvent(s)<=until){event(s);if(++guard>100000)throw Error('Event guard exceeded');}if(!s.finished){s.queueArea+=s.queue.length*(until-s.t);s.busyArea+=s.busy.filter(Boolean).length*(until-s.t);s.t=until;}}
function stats(s){const started=s.waits.filter(v=>v!==undefined);return{arrived:s.next,completed:s.completed,waiting:s.queue.length,meanWait:started.length?started.reduce((a,b)=>a+b,0)/started.length:0,meanQueue:s.t>0?s.queueArea/s.t:0,util:s.t>0?s.busyArea/(s.c*s.t):0};}
function formatTime(t){const sec=Math.floor(t*60);return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');}
function render(){if(!state)return;const s=state,m=stats(s);$('clock').textContent=formatTime(s.t);$('queueCount').textContent=m.waiting+' waiting';$('arrived').textContent=m.arrived;$('completed').textContent=m.completed;$('meanWait').textContent=m.arrived?m.meanWait.toFixed(3)+' min':'—';$('meanQueue').textContent=s.t?m.meanQueue.toFixed(3):'—';$('util').textContent=s.t?(m.util*100).toFixed(1)+'%':'—';$('progress').textContent=s.reference?'Deterministic 3-person verification trace':s.finished?'Arrivals finished; queue cleared':'Arrivals over 60 simulated minutes';$('mode').textContent=s.reference?'Reference verification trace':'Synthetic simulation';
const q=$('waiting');q.replaceChildren();if(!s.queue.length){const x=document.createElement('span');x.className='muted';x.textContent='No passengers waiting';q.append(x);}else{for(let i=0;i<Math.min(24,s.queue.length);i++){const x=document.createElement('span');x.className='person';x.textContent='•';x.setAttribute('aria-label','Waiting passenger');q.append(x);}if(s.queue.length>24){const x=document.createElement('span');x.textContent='+'+(s.queue.length-24);q.append(x);}}
const stations=$('stations');stations.replaceChildren();s.busy.forEach((b,j)=>{const x=document.createElement('div');x.className='station'+(b?' busy':'');const l=document.createElement('small');l.textContent='Station '+(j+1);const val=document.createElement('strong');val.textContent=b?'Inspecting #'+(b.person+1):'Available';x.append(l,val);stations.append(x);});}
function stop(){if(timer!==null){clearInterval(timer);timer=null;}$('pause').disabled=true;}
function begin(reference=false){stop();$('pause').textContent='Pause';$('error').hidden=true;try{const {rate,mean,servers}=validate();const trace=reference?{arrivals:[0,1,1.5],services:[3,2,1]}:buildTrace(rate,mean);state=initialize(trace,reference?1:servers,reference);render();$('pause').disabled=false;timer=setInterval(()=>{try{if(!state||state.finished){stop();return;}const speed=Number($('speed').value);advance(state,state.t+speed*0.08);render();if(state.finished)stop();}catch(e){stop();showError(e.message);}},80);}catch(e){showError(e.message);}}
function showError(message){$('error').hidden=false;$('error').textContent=message;}
if(typeof document!=='undefined') {
$('start').addEventListener('click',()=>begin(false));$('reference').addEventListener('click',()=>begin(true));$('pause').addEventListener('click',()=>{if(timer!==null){stop();$('pause').textContent='Resume';$('pause').disabled=false;}else if(state&&!state.finished){$('pause').textContent='Pause';$('pause').disabled=false;timer=setInterval(()=>{if(!state.finished){advance(state,state.t+Number($('speed').value)*0.08);render();}if(state.finished)stop();},80);}});
$('reset').addEventListener('click',()=>{stop();state=null;$('pause').textContent='Pause';$('clock').textContent='00:00';$('queueCount').textContent='0 waiting';$('waiting').textContent='Press Start to simulate passenger arrivals';$('stations').replaceChildren();for(const id of ['arrived','completed'])$(id).textContent='0';for(const id of ['meanWait','meanQueue','util'])$(id).textContent='—';$('mode').textContent='Synthetic simulation';$('progress').textContent='0 of 60 simulated minutes';$('error').hidden=true;});
$('speed').addEventListener('input',()=>$('speedValue').textContent=$('speed').value+'×');
}
// Exposed only for deterministic cross-language tests; does not fetch or transmit data.
if(typeof module!=='undefined'&&module.exports)module.exports={buildTrace,initialize,event,advance,stats};
