/* Navigation follows the active XML sitemap, including original nesting and order. */
(() => {
  'use strict';
  const data=window.BizlinkCatalog?.navigation;if(!data)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=s=>String(s).replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/[\u064b-\u065f]/g,'').toLowerCase();
  let installed=false,searching=false,opened=new Set();const storeKey='bizlink.public-demo.navigation.v1';
  try{const saved=JSON.parse(localStorage.getItem(storeKey)||'[]');if(Array.isArray(saved))opened=new Set(saved.filter(v=>typeof v==='string'));}catch(_){}
  function save(){try{localStorage.setItem(storeKey,JSON.stringify([...opened]));}catch(_){}}
  function branch(node){const icon=node.icon?`<i class="${esc(node.icon)}" aria-hidden="true"></i>`:'';const label=`${icon}<span>${esc(node.title)}</span>`;
    if(!node.children.length)return `<li data-menu-node="${node.id}">${node.href?`<a class="nav-link" href="${esc(node.href)}" data-menu-leaf="${node.id}">${label}</a>`:`<button class="menu-inactive" disabled title="هذا العنصر غير مربوط بشاشة في المشروع">${label}</button>`}</li>`;
    const expanded=opened.has(node.id);
    return `<li data-menu-node="${node.id}" class="menu-branch"><div class="menu-group-row">${node.href?`<a class="nav-link" href="${esc(node.href)}">${label}</a><button class="menu-toggle-only" data-menu-toggle="${node.id}" aria-label="توسيع ${esc(node.title)}" aria-controls="children-${node.id}" aria-expanded="${expanded}"><i class="fa fa-angle-down" aria-hidden="true"></i></button>`:`<button class="menu-group" data-menu-toggle="${node.id}" aria-controls="children-${node.id}" aria-expanded="${expanded}">${label}<i class="fa fa-angle-down menu-chevron" aria-hidden="true"></i></button>`}</div><ul id="children-${node.id}" ${expanded?'':'hidden'}>${node.children.map(branch).join('')}</ul></li>`;
  }
  function setOpen(id,value){const button=document.querySelector(`[data-menu-toggle="${id}"]`),children=document.getElementById('children-'+id);if(!button||!children)return;button.setAttribute('aria-expanded',String(value));children.hidden=!value;}
  function sync(hash=location.hash){if(!installed)return;const path=hash.split('?')[0]||'#dashboard';document.querySelectorAll('#navigation a,#all-screens-link').forEach(a=>{const active=a.getAttribute('href')===path;a.classList.toggle('active',active);if(active){a.setAttribute('aria-current','page');let ul=a.closest('ul');while(ul&&ul.id.startsWith('children-')){const id=ul.id.slice(9);opened.add(id);setOpen(id,true);ul=ul.parentElement.parentElement.closest('ul');}}else a.removeAttribute('aria-current');});save();}
  function filter(value){const q=norm(value).trim();searching=!!q;
    function visit(node){const item=document.querySelector(`[data-menu-node="${node.id}"]`);const own=norm(node.title).includes(q);let childMatch=false;for(const child of node.children)childMatch=visit(child)||childMatch;const visible=!q||own||childMatch;item.hidden=!visible;if(q&&own)for(const child of item.querySelectorAll('[data-menu-node]'))child.hidden=false;if(node.children.length)setOpen(node.id,q?visible:opened.has(node.id));return visible;}
    const found=data.tree.map(visit).some(Boolean);document.getElementById('menu-empty').hidden=found;
  }
  function init(){if(installed)return;installed=true;const nav=document.getElementById('navigation');nav.innerHTML=`<label class="menu-search"><i class="fa fa-search" aria-hidden="true"></i><input type="search" id="menu-search" placeholder="ابحث في القائمة…" aria-label="بحث في القائمة"></label><p id="menu-empty" class="page-description" hidden>لا توجد صفحات مطابقة.</p><ul class="project-menu">${data.tree.map(branch).join('')}</ul>`;
    const footer=document.querySelector('.sidebar-foot'),reset=document.getElementById('reset-demo'),catalogLink=document.createElement('a');catalogLink.id='all-screens-link';catalogLink.className='menu-catalog-link';catalogLink.href='#catalog';catalogLink.innerHTML='<i class="fa fa-th-large" aria-hidden="true"></i> دليل كل الشاشات';footer.replaceChildren(catalogLink,...(reset?[reset]:[]));
    nav.addEventListener('click',event=>{if(event.target.closest('a[data-menu-leaf]'))window.dispatchEvent(new CustomEvent('bizlink:navigate'));const button=event.target.closest('[data-menu-toggle]');if(!button)return;const id=button.dataset.menuToggle,next=button.getAttribute('aria-expanded')!=='true';setOpen(id,next);if(!searching){if(next)opened.add(id);else opened.delete(id);save();}});
    document.getElementById('menu-search').addEventListener('input',e=>filter(e.target.value));
    nav.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key)||e.target.tagName==='INPUT')return;const items=[...nav.querySelectorAll('a,button')].filter(el=>!el.disabled&&!el.closest('[hidden]'));const index=items.indexOf(document.activeElement);if(index<0)return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowDown'?1:items.length-1))%items.length;items[next]?.focus();});
    window.addEventListener('hashchange',()=>{if(searching){document.getElementById('menu-search').value='';filter('');}sync();});sync();
  }
  function trail(hash=location.hash){const target=hash.split('?')[0];function find(nodes,parents){for(const node of nodes){const chain=parents.concat(node);if(node.href===target)return chain;const match=find(node.children,chain);if(match)return match;}return null;}return find(data.tree,[])||[];}
  window.BizlinkNavigation={init,sync,trail};
})();
