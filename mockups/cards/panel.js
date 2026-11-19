// The card's mold (Drafts 7 and 8, Albert Nov 19), drawn from a spec. Used by mock.py on a plain page (strips) and over the real game (full screens).
window.fkPanel = (sp, taps) => {
  const css = `
  .fk{position:relative;width:390px;height:150px;font-family:'Barlow Semi Condensed',sans-serif;color:#efe6d2;background:linear-gradient(#3a2c20,#241a12 30%);border-top:1px solid #5a4632;box-sizing:border-box;overflow:hidden}
  .fk.fix{position:fixed;left:0;bottom:0;z-index:99999}
  .fk .r1{position:absolute;left:3px;right:3px;top:6px;height:44px;display:flex;align-items:center;gap:8px}
  .fk .hm,.fk .w{width:38px;height:38px;border-radius:50%;border:1.5px solid #8a7660;background:#2b2018;display:grid;place-items:center;flex:none}
  .fk .w{color:#e8604c;font-size:18px;font-weight:700}.fk .w.won{background:#e8604c;color:#fff;border-color:#e8604c}
  .fk .way{font-size:16px;font-weight:600;white-space:nowrap}.fk .way i{color:#8a7660;font-style:normal;padding:0 4px}.fk .way b{color:#e6b947;font-weight:600}
  .fk .tt{margin-left:auto;border:1.5px solid #e6b947;border-radius:6px;color:#e6b947;font-size:18px;font-weight:600;padding:2px 8px;white-space:nowrap}
  .fk .r2{position:absolute;left:3px;right:3px;top:54px;height:44px;display:flex;align-items:stretch;white-space:nowrap}
  .fk .s{flex:none;min-width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;box-sizing:border-box;position:relative;padding:0 3px}
  .fk .s.nt{min-width:0}.fk .s small{font-weight:400;color:#c9b99a;margin-left:3px;font-size:12px}
  .fk.taps .s:not(.nt){outline:1px dashed #ffffff66;outline-offset:-1px}
  .fk .fg{border:1.5px solid #5fd08a;border-radius:7px;padding:2px 5px;box-shadow:0 0 6px #5fd08a88}.fk .bl{border-color:#4aa3ff;box-shadow:0 0 6px #4aa3ff88}.fk .rd{border-color:#e8604c;box-shadow:0 0 6px #e8604c88}
  .fk .fp::before{content:'';position:absolute;left:0;top:15px;bottom:15px;border-left:1px solid #8a7660}
  .fk .dm{color:#e8604c}.fk .ex span,.fk .fpm span{border:1.5px solid #e8604c;border-radius:7px;padding:2px 6px}.fk .fpm span{border-color:#efe6d2;padding:2px 9px}.fk .fsp{flex:1;min-width:0}
  .fk .r3{position:absolute;left:5px;top:101px;display:flex;gap:3px}
  .fk .tile{width:61px;height:44px;border:1.5px solid #efe6d2;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:13px;line-height:1.1;box-sizing:border-box;white-space:nowrap;overflow:hidden}
  .fk .tile small{color:#5fd08a;font-size:11px}.fk .tile.ton{border-color:#5fd08a;box-shadow:0 0 6px #5fd08a88}.fk .tile.tgr{border-color:#5fd08a}
  .fk .tile.twar{color:#e8604c;font-style:italic;font-weight:600;text-transform:uppercase;font-size:11px;white-space:normal;text-align:center}.fk .tile.twar svg{width:14px;height:14px;stroke:#e8604c;fill:none;stroke-width:1.6}
  .fk .info{position:absolute;left:8px;top:54px;height:44px;display:flex;align-items:center;font-size:13px;color:#c9b99a}`;
  const s = (t, c = '') => `<div class="s ${c}">${t}</div>`, r2 = [];
  if (sp.crumb) { r2.push(s(`<span class="fg">${sp.crumb}</span>`), sp.pages && sp.pages.length ? s('›', 'nt') : ''); }
  (sp.pages || []).forEach((p, i) => r2.push(s(p === sp.page ? `<span class="fg ${p === 'Learn' ? 'bl' : ''}">${p}</span>` : p, i && p !== sp.page && sp.pages[i - 1] !== sp.page ? 'fp' : '')));
  (sp.pick || []).forEach(([n, c], i) => r2.push(s(i === (sp.picked || 0) ? `<span class="fg ${sp.war ? 'rd' : ''}">${n}<small>${c ?? ''}</small></span>` : `${n}<small>${c ?? ''}</small>`, i && i !== (sp.picked || 0) && i - 1 !== (sp.picked || 0) ? 'fp' : '')));
  r2.push('<div class="fsp"></div>'); if (sp.pm) r2.push(s('<span>−</span>', 'fpm'), s('<span>+</span>', 'fpm'));
  for (const a of sp.acts || []) r2.push(s(a === 'Exit' ? '<span>Exit</span>' : a, a === 'Exit' ? 'ex fp' : a === 'Demolish' ? 'dm fp' : 'fp'));
  const tile = (t) => t.war ? `<div class="tile twar ${t.c || ''}">${t.i ? `<svg viewBox="0 0 24 24">${t.i}</svg>` : ''}${t.n}</div>` : `<div class="tile ${t.c || ''}">${t.n}${t.s ? `<small>${t.s}</small>` : ''}</div>`;
  const d = document.createElement('div'); d.className = 'fk' + (taps ? ' taps' : '') + (sp.fix ? ' fix' : '');
  d.innerHTML = `<style>${css}</style><div class="r1"><div class="hm"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#efe6d2" stroke-width="1.6"><path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/></svg></div><div class="way">Home<i>|</i>${sp.way === 'Jobs' ? '<b>Jobs</b>' : 'Jobs'}<i>|</i>${sp.way === 'Build' ? '<b>Build</b>' : 'Build'}</div><div class="tt">${sp.title}</div><div class="w ${sp.war ? 'won' : ''}">W</div></div>
    <div class="r2">${r2.join('')}</div><div class="r3">${(sp.tiles || []).map(tile).join('')}</div>`;
  document.body.append(d);
  for (const t of d.querySelectorAll('.tile')) { const sm = t.querySelector('small'); let f = 11; while (sm && t.scrollWidth > t.clientWidth && f > 8) sm.style.fontSize = --f + 'px'; f = 13; while (t.scrollWidth > t.clientWidth && f > 9) t.style.fontSize = --f + 'px'; }
  const row = d.querySelector('.r2'); return { over: Math.max(0, Math.round(row.scrollWidth - row.clientWidth)), title: Math.round(d.querySelector('.r1').scrollWidth - d.querySelector('.r1').clientWidth) };
};
