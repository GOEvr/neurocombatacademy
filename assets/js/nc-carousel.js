/* NeuroCombat Academy — carrossel automático, sem dependências externas. */
(function(){
 'use strict';
 document.querySelectorAll('[data-nc-carousel]').forEach(function(carousel){
  const viewport=carousel.querySelector('[data-nc-viewport]');
  const track=carousel.querySelector('[data-nc-track]');
  const slides=Array.from(carousel.querySelectorAll('.nc-slide'));
  const prev=carousel.querySelector('[data-nc-prev]');
  const next=carousel.querySelector('[data-nc-next]');
  const dots=carousel.querySelector('[data-nc-dots]');
  const status=carousel.querySelector('[data-nc-status]');
  if(!viewport||!track||!slides.length||!prev||!next||!dots)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const intervalMs=5000;
  let page=0,pages=1,timer=null,scrollFrame=null,resumeTimer=null;
  let pointerStartX=null;
  function visible(){const n=parseInt(getComputedStyle(carousel).getPropertyValue('--nc-visible'),10);return Number.isFinite(n)&&n>0?n:1}
  function pageCount(){return Math.max(1,Math.ceil(slides.length/visible()))}
  function maxScroll(){return Math.max(0,viewport.scrollWidth-viewport.clientWidth)}
  function pageLeft(p){const i=Math.min(p*visible(),slides.length-1);return Math.max(0,Math.min(slides[i].offsetLeft-track.offsetLeft,maxScroll()))}
  function currentPage(){if(maxScroll()<=1)return 0;let best=0,dist=Infinity;for(let i=0;i<pages;i++){const d=Math.abs(pageLeft(i)-viewport.scrollLeft);if(d<dist){dist=d;best=i}}return best}
  function drawDots(){dots.replaceChildren();for(let i=0;i<pages;i++){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Mostrar grupo '+(i+1)+' de '+pages);b.addEventListener('click',function(){go(i,true)});dots.appendChild(b)}}
  function update(){page=currentPage();prev.disabled=page===0;next.disabled=page>=pages-1;Array.from(dots.children).forEach((d,i)=>{if(i===page)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});if(status)status.textContent=pages>1?'Grupo '+(page+1)+' de '+pages+' · '+slides.length+' cursos em desenvolvimento':slides.length+' cursos em desenvolvimento'}
  function go(p,interacted){page=Math.max(0,Math.min(p,pages-1));viewport.scrollTo({left:pageLeft(page),behavior:reduced.matches?'auto':'smooth'});update();if(interacted)restart()}
  function stop(){if(timer!==null){window.clearInterval(timer);timer=null}}
  function start(){stop();if(reduced.matches||pages<2||document.hidden||carousel.matches(':hover')||carousel.contains(document.activeElement))return;timer=window.setInterval(function(){go((currentPage()+1)%pages,false)},intervalMs)}
  function restart(){stop();if(resumeTimer!==null)window.clearTimeout(resumeTimer);resumeTimer=window.setTimeout(start,intervalMs)}
  function refresh(){const old=page;pages=pageCount();page=Math.min(old,pages-1);drawDots();go(page,false);start()}
  prev.addEventListener('click',function(){go(currentPage()-1,true)});next.addEventListener('click',function(){go(currentPage()+1,true)});
  viewport.addEventListener('scroll',function(){if(scrollFrame!==null)cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(function(){update();scrollFrame=null})},{passive:true});
  viewport.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(currentPage()+1,true)}else if(e.key==='ArrowLeft'){e.preventDefault();go(currentPage()-1,true)}});
  carousel.addEventListener('mouseenter',stop);carousel.addEventListener('mouseleave',start);
  carousel.addEventListener('focusin',stop);carousel.addEventListener('focusout',function(e){if(!carousel.contains(e.relatedTarget))start()});
  carousel.addEventListener('pointerdown',function(e){pointerStartX=e.clientX;stop()},{passive:true});
  carousel.addEventListener('pointerup',function(e){if(pointerStartX!==null&&Math.abs(e.clientX-pointerStartX)>35){go(currentPage(),true)}pointerStartX=null;restart()},{passive:true});
  carousel.addEventListener('pointercancel',function(){pointerStartX=null;restart()},{passive:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start()});
  if(reduced.addEventListener)reduced.addEventListener('change',start);else if(reduced.addListener)reduced.addListener(start);
  if('ResizeObserver' in window){const ro=new ResizeObserver(refresh);ro.observe(viewport);ro.observe(carousel)}else window.addEventListener('resize',refresh,{passive:true});
  refresh();
 });
})();
