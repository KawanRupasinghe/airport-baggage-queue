const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const docs=path.join(__dirname,'../docs');
const context={module:{exports:{}}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(docs,'observed_durations.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(docs,'script.js'),'utf8'),context);
const {initialize,advance,stats,buildTrace}=context.module.exports;
let s=initialize({arrivals:[0,1,1.5],services:[3,2,1]},1,true);
advance(s,10);
assert.equal(s.completed,3);
assert.ok(Math.abs(stats(s).meanWait-11/6)<1e-12);
assert.ok(Math.abs(stats(s).meanQueue-5.5/6)<1e-12); // queue area 2+3.5 = 5.5; total 6 min
for(const mode of ['empirical','exponential']){
 const a=buildTrace(.9,1,12345,60,mode);
 const b=buildTrace(.9,1,12345,60,mode);
 assert.deepEqual(a,b);
 assert.equal(a.arrivals.length,a.services.length);
 assert.ok(a.services.every(x=>x>0));
 const run=initialize(a,2);advance(run,1e6);
 assert.equal(run.completed,a.arrivals.length);
}
console.log('Browser reference trace and empirical/baseline simulation checks passed.');
