'use strict';
const text = {
  market:['逛集市','逛集市','Market'],stories:['校园分享','校園分享','Campus stories'],signup:['注册体验','註冊體驗','Try registration'],
  hero:['好物，就在你身边','好物，就在你身邊','Good finds, close by'],sub:['逛逛校园里在卖的好物，看看同校的人在分享什么。','逛逛校園裡在賣的好物，看看同校的人在分享甚麼。','Browse campus listings and see what people are sharing.'],
  list:['校园集市','校園集市','Campus market'],placeholder:['搜商品、类别或交收地点','搜尋商品、類別或交收地點','Search listings, categories or pickup places'],
  results:['件商品','件商品','listings'],all:['全部','全部','All'],living:['生活好物','生活好物','Everyday finds'],research:['科研设备','科研設備','Research equipment'],services:['校园服务','校園服務','Campus services'],other:['其他发布','其他發佈','Other listings'],
  digital:['数码电子','數碼電子','Electronics'],dorm:['宿舍生活','宿舍生活','Dorm essentials'],books:['书籍文具','書籍文具','Books and stationery'],
  footer:['香港校园交易与互助社区 · 商品信息以原发布为准','香港校園交易與互助社區 · 商品資料以原發佈為準','Hong Kong campus marketplace · Confirm availability with the original seller.'],
  sponsored:['推广','推廣','Ad'],offer:['AI 调用套餐和 API Key 优惠','AI 調用套餐及 API Key 優惠','Discounted AI plans and API keys'],plans:['查看套餐','查看套餐','View plans'],
  noResult:['没有匹配的商品，试试其他关键词或分区。','沒有符合的商品，試試其他關鍵字或分區。','No matches. Try another search or section.'],reset:['清除筛选','清除篩選','Clear filters'],
  loading:['正在加载商品…','正在載入商品…','Loading listings…'],failure:['商品暂时未能加载，请刷新后再试。','商品暫時未能載入，請重新整理再試。','Listings could not load. Refresh to try again.'],
  noPhoto:['暂无图片','暫無圖片','No photo'],noPrice:['请咨询价格','請查詢價格','Price on request'],polyu:['香港理工大学','香港理工大學','Hong Kong Polytechnic University'],
  details:['商品详情','商品詳情','Listing details'],close:['关闭','關閉','Close'],original:['前往原集市','前往原集市','Visit the original market'],variants:['可选规格','可選規格','Options'],
  publicPreview:['公开浏览页 · 库存与交收安排请在原集市确认。','公開瀏覽頁 · 庫存及交收安排請在原集市確認。','Public listing preview. Confirm stock and pickup at the original market.']
};
const $=id=>document.getElementById(id);
const lang=$('lang'), query=$('query'), filters=$('filters'), grid=$('grid'), dialog=$('detail');
let items=[], section='all', activeItem=null, state='loading';
const tr=key=>text[key]?.[lang.selectedIndex] || key;
function node(tag,cls,content){
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(content!=null)n.textContent=content;
  return n;
}
function safePhoto(path) {
  if(typeof path!=='string'||!path||/^[/\\]|^\w+:|\.\./.test(path)) return '';
  return new URL(path,location.href).origin===location.origin?path:'';
}
function school(item){return item.school==='polyu'||item.school==='香港理工大学'?tr('polyu'):(item.school||'');}
function group(item){return ['living','research','services'].includes(item.section)?item.section:'other';}
function price(item,p=item.price){
  if(p==null||String(p).trim()===''||!Number.isFinite(Number(p)))return tr('noPrice');
  const c=item.currency || item.priceCurrency || '';
  const unit={HKD:'HK$',CNY:'RMB ¥',RMB:'RMB ¥'}[c] || (c?c+' ':'');
  return unit+Number(p).toLocaleString('en-HK',{maximumFractionDigits:2});
}
function usableCondition(value){return value && !['未知','待补充','待卖家补充','unknown','未说明'].includes(value)?value:'';}
function searchKey(value){return String(value??'').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,' ').trim();}
function card(item){
  const button=node('button','card');button.type='button';
  const photo=node('div','photo',tr('noPhoto'));
  const path=(item.images||[]).map(safePhoto).find(Boolean);
  if(path){
    const img=node('img');img.alt='';img.loading='lazy';img.decoding='async';
    img.addEventListener('error',()=>photo.textContent=tr('noPhoto'),{once:true});
    img.src=path;photo.replaceChildren(img);
  }
  const info=node('div','info');
  info.append(node('strong','name',item.title),node('span','price',price(item)),node('span','meta',[school(item),tr(group(item))].filter(Boolean).join(' · ')));
  button.append(photo,info);button.addEventListener('click',()=>{activeItem=item;renderDetail();dialog.showModal();});
  return button;
}
function renderFilters(){
  const keys=['all',...['living','research','services','other'].filter(s=>items.some(it=>group(it)===s))];
  filters.replaceChildren(...keys.map(key=>{const b=node('button','',tr(key));b.type='button';b.setAttribute('aria-pressed',String(section===key));b.onclick=()=>{section=key;renderFilters();renderList();};return b;}));
}
function matched(item,word){
  const parts=[item.title,item.description,school(item),item.location,item.condition,item.categoryLabel,item.category,...(text[item.category]||[]),...(text[group(item)]||[])];
  return searchKey(parts.join(' ')).includes(word);
}
function renderList(){
  const word=searchKey(query.value);
  const list=items.filter(it=>(section==='all'||group(it)===section)&&(!word||matched(it,word)));
  grid.replaceChildren(...list.map(card));
  $('count').textContent=state==='ready'?list.length+' '+tr('results'):'';
  $('empty').hidden=state==='ready'&&list.length>0;
  $('empty').textContent=tr(state==='ready'?'noResult':state);
  $('reset').hidden=state!=='ready'||list.length>0||(!word&&section==='all');
}
function renderDetail(){
  const item=activeItem;if(!item)return;
  const content=$('body');content.replaceChildren();
  const title=node('h2','',item.title);title.id='detail-title';content.append(title,node('strong','price',price(item)));
  const gallery=node('div','gallery');
  for(const path of (item.images||[]).map(safePhoto).filter(Boolean)){const img=node('img');img.alt=item.title;img.loading='lazy';img.src=path;gallery.append(img);}
  for(const raw of item.videos||[]){const src=typeof raw==='string'?raw:raw.url;
    let path=safePhoto(src);
    if(!path){try{const u=new URL(src);if(u.origin==='https://polyumart.com'&&u.pathname.startsWith('/uploads/'))path=u.href;}catch{}}
    if(path){const vid=node('video');vid.controls=true;vid.preload='none';vid.src=path;gallery.append(vid);}}
  if(gallery.childElementCount) content.append(gallery);
  content.append(node('p','meta',[school(item),item.location,item.categoryLabel||tr(item.category||group(item)),usableCondition(item.condition)].filter(Boolean).join(' · ')));
  if(item.description)content.append(node('p','desc',item.description));
  if(item.variants?.length){
    const ul=node('ul');for(const variant of item.variants){const label=typeof variant==='string'?variant:variant.label;if(label)ul.append(node('li','',[label,variant.price!=null?price(item,variant.price):''].filter(Boolean).join(' · ')));}
    if(ul.childElementCount)content.append(node('strong','',tr('variants')),ul);
  }
  content.append(node('p','meta',tr('publicPreview')));
  try{
    const href=new URL(item.originalUrl||item.sourceUrl);
    if(href.origin==='https://polyumart.com'){const a=node('a','source',tr('original')+' ↗');a.href=href.href;a.target='_blank';a.rel='noopener noreferrer';content.append(a);}
  }catch{}
}
function changeLanguage(){
  document.documentElement.lang=['zh-Hans','zh-Hant','en'][lang.selectedIndex];
  document.querySelectorAll('[data-t]').forEach(n=>n.textContent=tr(n.dataset.t));
  query.placeholder=tr('placeholder');query.setAttribute('aria-label',tr('placeholder'));
  $('close').setAttribute('aria-label',tr('close'));filters.setAttribute('aria-label',tr('list'));
  renderFilters();renderList();renderDetail();
}
query.addEventListener('input',renderList);
lang.addEventListener('change',changeLanguage);
$('close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>{activeItem=null;});
$('reset').onclick=()=>{query.value='';section='all';renderFilters();renderList();query.focus();};
changeLanguage();
fetch('public-listings.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(payload=>{
  const list=Array.isArray(payload)?payload:payload.listings;
  if(!Array.isArray(list))throw Error();
  items=list;state='ready';renderFilters();renderList();
}).catch(()=>{state='failure';renderList();});
