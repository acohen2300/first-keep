// prints book values by dotted key: node book.js <v100 dir> measure breakAt nerve ...
const fs=require('fs'),path=require('path');const dir=process.argv[2],name=process.argv[3];
const BOOKS={};global.BOOK=(n,e)=>{BOOKS[n]=e};
eval(fs.readFileSync(path.join(dir,'books',name+'.js'),'utf8'));
const o={};for(const [c,e] of Object.entries(BOOKS[name])){const p=e.key.split('.');let t=o;for(let i=0;i<p.length-1;i++)t=t[p[i]]=t[p[i]]||{};t[p[p.length-1]]={v:e.value,code:c,cite:e.cite};}
for(const k of process.argv.slice(4)){let t=o;for(const p of k.split('.'))t=t&&t[p];const s=JSON.stringify(t);console.log(k,'=',s&&s.length>700?s.slice(0,700)+'…':s);}
