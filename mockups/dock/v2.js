const tg = ctl.querySelector('.tg:not(.grp)'); tg.querySelectorAll('button').forEach((x) => x.classList.remove('on')); if (window.__jobs) tg.querySelector('button').classList.add('on');
const old = path.innerHTML; path.innerHTML = ''; path.append(tg);
path.insertAdjacentHTML('beforeend', '<span style="color:var(--rw);opacity:.75;white-space:nowrap;text-shadow:0 0 4px rgba(0,0,0,.8)">← choose a task</span><button class="mp" style="margin-left:auto">Go</button><button class="mp">Cancel</button>');
ctl.innerHTML = '<div style="display:flex;gap:6px;align-items:center;width:100%;white-space:nowrap">' + old + '<button class="mp">Delete</button><button class="dot" style="font-size:18px">✕</button></div>';
const sk = ctl.querySelector('[data-v^="exitU"]'); if (sk) sk.remove(); const rd = ctl.querySelector('.mrd'); if (rd) { rd.style.flex = '1'; rd.style.minWidth = '0'; rd.style.overflow = 'hidden'; }
if (window.__jobs) { const t = document.createElement('div'); t.innerHTML = window.__jt; document.querySelector('#base .mt').replaceWith(t.querySelector('.mt')); } else document.querySelector('#base .mt').style.visibility = 'hidden';
