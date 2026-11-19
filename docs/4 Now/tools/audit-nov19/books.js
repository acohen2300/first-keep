// Read-only book checks. node books.js <v100 dir>
const fs=require('fs'),path=require('path');const dir=process.argv[2];
const BOOKS={};global.BOOK=(n,e)=>{BOOKS[n]=e};
for(const f of fs.readdirSync(path.join(dir,'books'))) eval(fs.readFileSync(path.join(dir,'books',f),'utf8'));
const codeFiles=['index.html','menu.js','econ.js','combat.js','ai.js','sound.js','sw.js'];
const SRC=Object.fromEntries(codeFiles.map(f=>[f,fs.readFileSync(path.join(dir,f),'utf8')]));
const ALL=Object.values(SRC).join('\n');
const booksText=Object.fromEntries(fs.readdirSync(path.join(dir,'books')).map(f=>[f.replace('.js',''),fs.readFileSync(path.join(dir,'books',f),'utf8')]));
const out=[];const say=(...a)=>out.push(a.join(' '));
// 0 sizes
say('BOOKS:',Object.entries(BOOKS).map(([n,b])=>n+' '+Object.keys(b).length).join(', '));
// 1 two homes
const seen={};for(const [n,b] of Object.entries(BOOKS))for(const c of Object.keys(b)){(seen[c]=seen[c]||[]).push(n);}
const two=Object.entries(seen).filter(([,v])=>v.length>1);say('1 codes with two homes:',two.length,two.slice(0,8).map(([c,v])=>c+':'+v.join('+')).join(' '));
// 2 comments E-codes
const ecode=[...ALL.matchAll(/\bE\d+\b/g)].map(m=>m[0]);const eset=new Set(ecode);
const EB=Object.keys(BOOKS.comments);
say('2 comment codes: in book',EB.length,'| cited in code',eset.size,'| in code but not in book',[...eset].filter(c=>!BOOKS.comments[c]).join(',')||'none','| in book, cited nowhere in code',EB.filter(c=>!eset.has(c)).length,EB.filter(c=>!eset.has(c)).slice(0,25).join(','));
const dupE=Object.entries(ecode.reduce((o,c)=>(o[c]=(o[c]||0)+1,o),{})).filter(([,n])=>n>1).length;say('  comment codes cited on more than one line:',dupE);
const lens=EB.map(c=>(BOOKS.comments[c].text||'').length);say('  whys over 320 chars:',lens.filter(n=>n>320).length,'| longest',Math.max(...lens));
// 3 citations
const NB=Object.keys(BOOKS.citations);const cited=new Set();
for(const [n,b] of Object.entries(BOOKS)) if(n!=='citations') for(const e of Object.values(b)) for(const c of (e.cite||[])) cited.add(c);
const inText=new Set([...Object.values(booksText).join('\n').matchAll(/\bN\d+\b/g)].map(m=>m[0]));
say('3 citations: in book',NB.length,'| cited by a book entry (cite field)',cited.size,'| cited but missing from the book',[...cited].filter(c=>!BOOKS.citations[c]).join(',')||'none','| never cited by any cite field',NB.filter(c=>!cited.has(c)).length);
const noCite=[];for(const [n,b] of Object.entries(BOOKS)) if(!['citations','comments'].includes(n)){const k=Object.entries(b).filter(([,e])=>!(e.cite&&e.cite.length)).length;noCite.push(n+' '+k+'/'+Object.keys(b).length);}
say('  entries with no citation, by book:',noCite.join(', '));
const opened=NB.filter(c=>BOOKS.citations[c].opened===true).length;say('  citations marked opened:',opened,'of',NB.length);
// 4 unused top-level keys per keyed book
const used=(k)=>new RegExp('[.\\[\'"]'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b').test(ALL);
for(const n of ['measure','words','screen','sprites','sound','colours','angles','mass','ground','sides']){const b=BOOKS[n];const tops={};for(const [c,e] of Object.entries(b)){const k=e.key.split('.')[0];(tops[k]=tops[k]||[]).push(c);}
 const dead=Object.keys(tops).filter(k=>!used(k)&&!tops[k].some(c=>new RegExp('\\b'+c+'\\b').test(ALL+Object.values(booksText).filter((_,i)=>Object.keys(booksText)[i]!==n).join('\n'))));
 say('4 '+n+': top keys',Object.keys(tops).length,'| never read in code (suspected dead)',dead.length,dead.slice(0,30).join(', '));}
// 4b second-level keys of measure never read (by name anywhere)
{const b=BOOKS.measure;let n=0,dead=[];for(const [c,e] of Object.entries(b)){ if(e.value&&typeof e.value==='object'&&!Array.isArray(e.value)){for(const k of Object.keys(e.value)){n++; if(!/^[A-Z]+\d+$/.test(k)&&!new RegExp('[.\\[\'"]'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b').test(ALL)) dead.push(e.key+'.'+k);}}}
 say('4b measure second-level keys:',n,'| name never appears in code (suspected unused numbers)',dead.length,dead.slice(0,40).join(', '));}
// 5 doubles
const leaves=(v,p,acc)=>{if(typeof v==='string'){acc.push([p,v]);}else if(v&&typeof v==='object')for(const [k,x] of Object.entries(v))leaves(x,p+'.'+k,acc);return acc;};
{const L=[];for(const e of Object.values(BOOKS.words))leaves(e.value,e.key,L);const by={};for(const [p,s] of L)if(s.length>=14)(by[s]=by[s]||[]).push(p);const d=Object.entries(by).filter(([,v])=>v.length>1);
 say('5 words: strings',L.length,'| the same sentence (14+ letters) stored twice or more:',d.length);for(const [s,v] of d.slice(0,12))say('   "'+s.slice(0,60)+'" ×'+v.length+': '+v.slice(0,3).join(' | '));}
{const L=[];for(const e of Object.values(BOOKS.colours))leaves(e.value,e.key,L);const by={};for(const [p,s] of L)if(/^#[0-9a-f]{6}$/i.test(s))(by[s.toLowerCase()]=by[s.toLowerCase()]||[]).push(p);const d=Object.entries(by).filter(([,v])=>v.length>1);
 say('5 colours: hex values',L.filter(([,s])=>/^#/.test(s)).length,'| distinct',Object.keys(by).length,'| the same colour stored under 2+ names:',d.length,d.slice(0,10).map(([s,v])=>s+'×'+v.length).join(' '));}
{const L=[];for(const e of Object.values(BOOKS.sprites))leaves(e.value,e.key,L);const hex=L.filter(([,s])=>/^#[0-9a-f]{3,8}$/i.test(s));say('5 sprites book holds colours of its own:',hex.length,'(',new Set(hex.map(([,s])=>s)).size,'distinct )');}
// 6 typed in code
const art=SRC['index.html'];say('6 colours typed in code (not in a book): index.html',(art.match(/'#[0-9a-fA-F]{3,8}'/g)||[]).length,'| others',codeFiles.filter(f=>f!=='index.html').map(f=>f+' '+(SRC[f].match(/'#[0-9a-fA-F]{3,8}'/g)||[]).length).join(', '));
// 7 stray numbers typed in code, outside the art (rough count: decimals and integers >= 2 not part of an identifier or book code)
const strip=(s)=>s.replace(/\/\/.*$/gm,'').replace(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g,"''");
const nums=(s)=>(strip(s).match(/(?<![\w.$#])(?:\d+\.\d+|[2-9]|\d{2,})(?![\w.]*['"])\b/g)||[]);
const lines=art.split('\n');const reg=(a,b)=>lines.slice(a-1,b).join('\n');
say('7 numbers typed in code (rough): index.html 1-499',nums(reg(1,499)).length,'| 500-1038 art',nums(reg(500,1038)).length,'| 1039-1822',nums(reg(1039,1822)).length,'|',['menu.js','econ.js','combat.js','ai.js'].map(f=>f+' '+nums(SRC[f]).length+' ['+[...new Set(nums(SRC[f]))].slice(0,12).join(' ')+']').join(' | '));
// 8 job/kind/class names asked in code
const names=(re)=>codeFiles.map(f=>f+' '+(SRC[f].match(re)||[]).length).join(', ');
say("8 asks by name: .job === '…'",names(/\.job [!=]== '\w+'/g),"| .then === '…'",names(/\.then [!=]== '\w+'/g),"| .kind === '…'",names(/\.kind [!=]== '\w+'/g),"| class === '…'",names(/class [!=]== '\w+'/g));
console.log(out.join('\n'));
