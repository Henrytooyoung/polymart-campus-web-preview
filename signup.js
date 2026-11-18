'use strict';
const schools = [{"id":"polyu","name":"香港理工大学","domains":["connect.polyu.hk","polyu.edu.hk"]},{"id":"hku","name":"香港大学","domains":["connect.hku.hk","hku.hk"]},{"id":"cuhk","name":"香港中文大学","domains":["link.cuhk.edu.hk","cuhk.edu.hk"]},{"id":"hkust","name":"香港科技大学","domains":["connect.ust.hk","ust.hk"]},{"id":"cityu","name":"香港城市大学","domains":["my.cityu.edu.hk","cityu.edu.hk","staff.cityu.edu.hk","gapps.cityu.edu.hk"]},{"id":"hkbu","name":"香港浸会大学","domains":["life.hkbu.edu.hk","hkbu.edu.hk"]},{"id":"lu","name":"岭南大学","domains":["ln.hk","ln.edu.hk"]},{"id":"eduhk","name":"香港教育大学","domains":["s.eduhk.hk","eduhk.hk"]},{"id":"hkmu","name":"香港都会大学","domains":["live.hkmu.edu.hk","hkmu.edu.hk"]},{"id":"hksyu","name":"香港树仁大学","domains":["hksyu.edu.hk","hksyu.edu"]},{"id":"hsuhk","name":"香港恒生大学","domains":["hsu.edu.hk"]},{"id":"thei","name":"香港高等教育科技学院","domains":["stu.thei.edu.hk","stu.vtc.edu.hk","thei.edu.hk","vtc.edu.hk"]},{"id":"ive","name":"香港专业教育学院","domains":["stu.vtc.edu.hk","vtc.edu.hk"]},{"id":"hkct","name":"港专（HKCT / CTIHE）","domains":["student.hkct.edu.hk","student.ctihe.edu.hk","hkct.edu.hk","ctihe.edu.hk","tutor.hkct.edu.hk","tutor.ctihe.edu.hk"]}];
const labels = {
  back:['← 返回集市','← 返回集市','← Back to market'],
  step:['注册 · 第 1 步，共 2 步','註冊 · 第 1 步，共 2 步','Registration · Step 1 of 2'],
  title:['验证学校邮箱','驗證學校電郵','Verify your school email'],
  intro:['学生和教职工均可使用本人学校邮箱注册。','學生及教職員均可使用本人學校電郵註冊。','Students, faculty and staff can register with their own school email.'],
  notice:['这是公开体验页，请使用示例用户名。这里不会保存邮箱、发送邮件或创建账号。','這是公開體驗頁，請使用範例用戶名稱。此頁不會儲存電郵地址、傳送郵件或建立帳戶。','Public preview. Please use an example username. This page does not store addresses, send email or create accounts.'],
  school:['选择学校','選擇學校','School'],
  user:['邮箱用户名','電郵用戶名稱','Email username'],
  domain:['邮箱后缀','電郵後綴','Email domain'],
  help:['也可以粘贴完整的示例邮箱，自动匹配所选学校的后缀。','也可以貼上完整的範例電郵，系統會配對所選學校的後綴。','You can also paste a full example address to match its domain to the selected school.'],
  sample:['使用示例用户名','使用範例用戶名稱','Use an example username'],
  placeholder:['例如 campus-demo','例如 campus-demo','For example, campus-demo'],
  empty:['请选择学校','請選擇學校','Choose a school'],
  first:['请先选择学校','請先選擇學校','Choose a school first'],
  result:['地址预览','地址預覽','Address preview'],
  incorrect:['请核对完整邮箱和所选学校的后缀。','請核對完整電郵及所選學校的後綴。','Check the full address and the domain for your selected school.'],
  invalid:['请使用字母、数字、点、下划线或连字符填写示例用户名。','請使用字母、數字、點、底線或連字號填寫範例用戶名稱。','Use letters, numbers, dots, underscores or hyphens in the example username.']
};
const titles = {
  polyu:['香港理工大學','The Hong Kong Polytechnic University'], hku:['香港大學','The University of Hong Kong'], cuhk:['香港中文大學','The Chinese University of Hong Kong'], hkust:['香港科技大學','The Hong Kong University of Science and Technology'], cityu:['香港城市大學','City University of Hong Kong'], hkbu:['香港浸會大學','Hong Kong Baptist University'], lu:['嶺南大學','Lingnan University'], eduhk:['香港教育大學','The Education University of Hong Kong'], hkmu:['香港都會大學','Hong Kong Metropolitan University'], hksyu:['香港樹仁大學','Hong Kong Shue Yan University'], hsuhk:['香港恒生大學','The Hang Seng University of Hong Kong'], thei:['香港高等教育科技學院','Technological and Higher Education Institute of Hong Kong'], ive:['香港專業教育學院','Hong Kong Institute of Vocational Education'], hkct:['港專（HKCT / CTIHE）','HKCT / CTIHE']
};
const el = id => document.getElementById(id);
const school=el('school'), domain=el('domain'), user=el('user'), msg=el('message'), sample=el('sample'), language=el('lang');
const tr = key => labels[key][language.selectedIndex];
const current = () => schools.find(s => s.id === school.value);
const localValid = text => text.length <= 64 && /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/i.test(text) && !text.includes('..');
function showMessage(text='',error=false) { msg.textContent=text;msg.classList.toggle('bad',error);user.setAttribute('aria-invalid',String(error)); }
function preview() {
  const value=user.value.trim();
  if (!current() || !value) return showMessage();
  if (value.includes('@')) {
    const parts=value.split('@');
    if (parts.length !== 2 || !current().domains.includes(parts[1].toLowerCase())) return showMessage(tr('incorrect'),true);
    if (!localValid(parts[0])) return showMessage(tr('invalid'),true);
    domain.value=parts[1].toLowerCase();
    user.value=parts[0];
  }
  if (!localValid(user.value.trim())) return showMessage(tr('invalid'),true);
  showMessage(tr('result')+' · '+user.value.trim()+'@'+domain.value);
}
function renderDomains(preferred) {
  const allowed=current()?.domains || [];
  domain.replaceChildren(...(allowed.length ? allowed.map(d=>new Option('@'+d,d)) : [new Option(tr('first'),'')]));
  if (allowed.includes(preferred)) domain.value=preferred;
  domain.disabled=user.disabled=sample.disabled=!allowed.length;
}
function render() {
  const savedSchool=school.value,savedDomain=domain.value;
  document.documentElement.lang=['zh-Hans','zh-Hant','en'][language.selectedIndex];
  document.title=tr('title')+' · PolyMart';
  document.querySelectorAll('[data-t]').forEach(node=>{node.textContent=tr(node.dataset.t);});
  user.placeholder=tr('placeholder');
  school.replaceChildren(new Option(tr('empty'),''),...schools.map(s=>new Option(language.selectedIndex ? titles[s.id][language.selectedIndex-1] : s.name,s.id)));
  school.value=savedSchool;
  renderDomains(savedDomain);
  preview();
}
school.addEventListener('change',()=>{user.value='';renderDomains();preview();});
domain.addEventListener('change',preview);
user.addEventListener('input',event=>{
  // Resolve complete pasted addresses immediately. Let typed addresses finish on blur.
  if (user.value.includes('@') && event.inputType==='insertText') return showMessage();
  preview();
});
user.addEventListener('blur',preview);
sample.addEventListener('click',()=>{user.value='campus-demo';preview();});
language.addEventListener('change',render);
render();
