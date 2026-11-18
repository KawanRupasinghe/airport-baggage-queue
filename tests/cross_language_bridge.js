const fs=require('node:fs'), vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'../docs');
const ctx={module:{exports:{}}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'observed_durations.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'script.js'),'utf8'),ctx);
const input=JSON.parse(fs.readFileSync(0,'utf8'));
const output=input.map(x=>{
  const s=ctx.module.exports.initialize({arrivals:x.arrivals,services:x.services},x.servers);
  ctx.module.exports.advance(s,1000000);
  const v=ctx.module.exports.stats(s);
  return {mean_wait:v.meanWait,mean_queue_length:v.meanQueue,utilisation:v.util,arrivals:v.arrived,completed:v.completed,waits:s.waits};
});
process.stdout.write(JSON.stringify(output));
