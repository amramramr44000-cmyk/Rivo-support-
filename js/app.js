const {createClient}=window.supabase;
const sb=createClient(RIVO_SUPPORT_CONFIG.url,RIVO_SUPPORT_CONFIG.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fmt=d=>new Intl.DateTimeFormat(getLang()==='ar'?'ar-EG':'en-US',{dateStyle:'medium',timeStyle:'short'}).format(new Date(d));
const I18N={
  ar:{brandSub:'مركز الدعم الرسمي',navHome:'الرئيسية',navTickets:'بلاغاتي',navSupport:'الدعم',navNew:'فتح بلاغ',navAdmin:'الإدارة',loginNav:'تسجيل الدخول',logout:'تسجيل الخروج',
      dashboardEyebrow:'لوحة الدعم',dashboardDesc:'افتح بلاغاتك، تابع حالتها، وكمل المحادثة مع فريق الدعم من مكان واحد.',newTicket:'+ فتح بلاغ جديد',recent:'آخر البلاغات',recentDesc:'آخر طلباتك ودعمك الحالي.',allTickets:'كل البلاغات',
      landingTitle:'حل مشكلتك أسرع، من أول رسالة لحد ما الموضوع يخلص.',landingDesc:'مركز الدعم الرسمي لتطبيق Rivo. سجّل دخولك بحسابك الحالي، افتح بلاغًا، ارفع صورًا أو لقطات شاشة، وكمل نفس المحادثة مع فريق الدعم حتى الحل.',start:'ابدأ الآن',how:'كيف يعمل؟',heroEyebrow:'الدعم الرسمي',trust1:'حساب Rivo نفسه',trust1d:'بدون إنشاء حساب دعم جديد.',trust2:'محادثة داخل البلاغ',trust2d:'كل الرسائل في مكان واحد.',trust3:'رفع صور',trust3d:'أرسل لقطة شاشة للمشكلة.',trust4:'متابعة واضحة',trust4d:'حالة وأولوية ومسؤول للطلب.',whyTitle:'كل شيء واضح من أول خطوة',whyDesc:'واجهة مختصرة، وصول سريع، ومحادثة مباشرة مع الدعم.',featTickets:'تذاكر منظمة',featTicketsDesc:'عنوان، قسم، أولوية، حالة ورقم مرجعي لكل مشكلة.',featChat:'شات مع الدعم',featChatDesc:'رسائل ذهاب وعودة مع إمكانية إرسال الصور داخل نفس التذكرة.',featSmart:'مساعدة ذكية',featSmartDesc:'اقتراحات أولية حسب نوع المشكلة لتوفير الوقت.',workflowTitle:'كيف تستخدمه؟',workflowDesc:'ثلاث خطوات فقط.',step1:'سجّل دخولك بحساب Rivo الحالي.',step2:'افتح بلاغًا واكتب التفاصيل وارفع ما يلزم.',step3:'استمر في المحادثة مع موظف الدعم حتى الحل.',legalTitle:'معلومات مهمة',legalDesc:'سياسات مختصرة وواضحة قبل استخدام الخدمة.',privacy:'سياسة الخصوصية',privacyDesc:'كيف نتعامل مع بيانات حسابك ومحتوى البلاغ.',terms:'شروط الاستخدام',termsDesc:'القواعد الأساسية لاستخدام مركز الدعم.',acceptable:'الاستخدام المقبول',acceptableDesc:'محتوى وسلوكيات غير مسموح بها.',footer:'Rivo Support · مركز الدعم الرسمي لتطبيق Rivo',contactLogin:'تواصل مع الدعم',official:'مركز الدعم الرسمي',loginTitle:'تسجيل الدخول',loginDesc:'استخدم نفس حساب Rivo للدخول وفتح البلاغات ومتابعتها والتواصل مع الدعم.',username:'اسم المستخدم',password:'كلمة المرور',loginBtn:'دخول إلى الدعم',backRivo:'العودة إلى Rivo',loginNote:'لن تحتاج لإنشاء حساب جديد. مركز الدعم يستخدم حساب Rivo الحالي.',
      newTicketEyebrow:'فتح بلاغ',newTicketTitle:'ما المشكلة؟',newTicketDesc:'اكتب التفاصيل باختصار ووضوح. يمكنك إرفاق الصور داخل المحادثة بعد فتح البلاغ.',subject:'عنوان المشكلة',subjectPh:'مثال: لا أستطيع تسجيل الدخول',category:'القسم',catAccount:'الحساب وتسجيل الدخول',catTechnical:'مشكلة تقنية',catPayment:'الدفع والاشتراكات',catReport:'إبلاغ عن مشكلة أو إساءة',catPrivacy:'الخصوصية والأمان',catOther:'أخرى',priority:'الأولوية',normal:'عادية',high:'عالية',low:'منخفضة',details:'شرح المشكلة',detailsPh:'اكتب ما حدث، وما الذي كنت تفعله، وأي رسالة خطأ ظهرت لك.',cancel:'إلغاء',createTicket:'إنشاء البلاغ وبدء المحادثة',
      dashboardTitle:'مساحة الدعم الخاصة بك',dashboardRecent:'آخر البلاغات',dashboardCta:'افتح طلبًا جديدًا عندما تحتاج مساعدة.',open:'مفتوح',pending:'بانتظار الرد',closed:'مغلق',
      ticketsEyebrow:'طلباتك',ticketsTitle:'بلاغاتي',ticketsDesc:'راجع الحالات القديمة أو افتح أي بلاغ لإكمال المحادثة.',
      ticketBack:'العودة',quickHelp:'مساعدة سريعة',quickHelpDesc:'اقتراحات مبنية على نوع البلاغ.',chatPh:'اكتب رسالتك...',send:'إرسال',attachment:'مرفق',customer:'العميل',assign:'استلام',release:'ترك',close:'إغلاق',reopen:'إعادة فتح',
      adminEyebrow:'ADMIN CENTER',adminTitle:'إدارة الدعم',adminDesc:'إدارة البلاغات وتوزيع الطلبات ومتابعة محادثات العملاء.',all:'الكل',unassigned:'غير مستلمة',today:'اليوم',adminTickets:'البلاغات',adminTicketsDesc:'استلم طلبًا وكمّل المحادثة مع العميل.',
      privacyTitle:'سياسة الخصوصية',privacyLead:'نستخدم المعلومات اللازمة فقط لتشغيل الدعم وتحسين معالجة البلاغات.',termsTitle:'شروط الاستخدام',termsLead:'باستخدام Rivo Support أنت توافق على استخدامه لأغراض الدعم المشروع والمحترم.',acceptableTitle:'سياسة الاستخدام المقبول',acceptableLead:'نحافظ على بيئة دعم آمنة واحترافية لجميع المستخدمين.',legalUpdated:'آخر تحديث: سبتمبر 2026',legalBack:'العودة لمركز الدعم',p1h:'ما الذي نستخدمه؟',p1:'نعالج بيانات حساب Rivo اللازمة لربط البلاغ بصاحبه، ورسائل التذكرة والمرفقات التي يرسلها المستخدم أو فريق الدعم.',p2h:'من يمكنه الوصول؟',p2:'يتم الوصول إلى بيانات البلاغ من المستخدم صاحب البلاغ وموظفي الدعم المخولين وفق صلاحيات النظام.',p3h:'مدة الاحتفاظ',p3:'قد نحتفظ بسجل البلاغات والمحادثات بالقدر اللازم لتقديم الدعم، متابعة الحالات، وتحسين الخدمة.',p4h:'الأمان',p4:'نستخدم ضوابط وصول وقواعد بيانات محمية، لكن لا توجد وسيلة إلكترونية يمكن ضمان أمانها بنسبة 100%.',t1h:'استخدام الخدمة',t1:'استخدم مركز الدعم لحل مشاكل التطبيق، متابعة البلاغات، والتواصل مع فريق الدعم فقط.',t2h:'المعلومات التي ترسلها',t2:'يجب أن تكون الرسائل والمرفقات مرتبطة بالمشكلة وألا تحتوي على كلمات مرور أو مفاتيح سرية أو بيانات حساسة لا يحتاجها الدعم.',t3h:'التذاكر المتكررة',t3:'تجنب فتح بلاغات متكررة لنفس المشكلة. قد يتم دمج البلاغات المتشابهة لتسهيل المتابعة.',t4h:'التعديلات',t4:'قد تتغير الخدمة أو السياسات عند الحاجة، ويظهر تاريخ آخر تحديث في هذه الصفحات.',a1h:'غير مسموح',a1:'التهديد، الإساءة، الكراهية، التحرش، انتحال الشخصية، الاحتيال، أو أي محتوى غير قانوني.',a2h:'لا ترسل أسرارك',a2:'لا ترسل كلمات المرور، رموز التحقق، مفاتيح API، أو أي بيانات سرية ضمن التذكرة.',a3h:'المرفقات',a3:'ارفع صورًا مرتبطة بالمشكلة فقط، وتجنب ملفات أو صور تحتوي على بيانات شخصية لا يحتاجها فريق الدعم.',a4h:'الإجراءات',a4:'قد يتم إغلاق أو تقييد البلاغات التي تخالف السياسات، مع إمكانية مراجعتها من الإدارة المخولة.'},
  en:{brandSub:'Official support center',navHome:'Home',navTickets:'My tickets',navSupport:'Support',navNew:'New ticket',navAdmin:'Admin',loginNav:'Sign in',logout:'Log out',
      dashboardEyebrow:'SUPPORT DASHBOARD',dashboardDesc:'Open tickets, track their status, and continue your support conversations in one place.',newTicket:'+ New ticket',recent:'Recent tickets',recentDesc:'Your latest support requests.',allTickets:'All tickets',
      landingTitle:'Resolve issues faster, from the first message to the final solution.',landingDesc:'The official Rivo support center. Sign in with your existing account, open a ticket, attach screenshots, and continue the same conversation with support until it is resolved.',start:'Get started',how:'How it works',heroEyebrow:'OFFICIAL SUPPORT',trust1:'Your Rivo account',trust1d:'No separate support account.',trust2:'Ticket conversation',trust2d:'Every message stays together.',trust3:'Image uploads',trust3d:'Attach a screenshot when needed.',trust4:'Clear tracking',trust4d:'Status, priority, and owner.',whyTitle:'Clear from the first step',whyDesc:'Compact pages, fast access, and direct support chat.',featTickets:'Organized tickets',featTicketsDesc:'A subject, category, priority, status, and reference for every issue.',featChat:'Support chat',featChatDesc:'Two-way messages with image attachments inside the same ticket.',featSmart:'Smart assistance',featSmartDesc:'Initial suggestions based on the issue type to save time.',workflowTitle:'How to use it',workflowDesc:'Three simple steps.',step1:'Sign in with your existing Rivo account.',step2:'Open a ticket, explain the issue, and attach anything useful.',step3:'Continue the conversation with the support agent until resolution.',legalTitle:'Important information',legalDesc:'Clear policies before using the service.',privacy:'Privacy policy',privacyDesc:'How account and ticket data are handled.',terms:'Terms of use',termsDesc:'The basic rules for using the support center.',acceptable:'Acceptable use',acceptableDesc:'Content and behaviors that are not allowed.',footer:'Rivo Support · Official support center for Rivo',contactLogin:'Contact support',official:'Official Support Center',loginTitle:'Sign in',loginDesc:'Use your existing Rivo account to open tickets, track requests, and chat with support.',username:'Username',password:'Password',loginBtn:'Sign in to support',backRivo:'Back to Rivo',loginNote:'You do not need a new account. Support uses your existing Rivo account.',
      newTicketEyebrow:'NEW TICKET',newTicketTitle:'What is the issue?',newTicketDesc:'Keep the details clear and focused. You can attach images inside the conversation after the ticket is created.',subject:'Issue title',subjectPh:'Example: I cannot sign in',category:'Category',catAccount:'Account & sign in',catTechnical:'Technical issue',catPayment:'Payments & subscriptions',catReport:'Report a problem or abuse',catPrivacy:'Privacy & security',catOther:'Other',priority:'Priority',normal:'Normal',high:'High',low:'Low',details:'Issue details',detailsPh:'Tell us what happened, what you were doing, and any error message you saw.',cancel:'Cancel',createTicket:'Create ticket & start chat',
      dashboardTitle:'Your support space',dashboardRecent:'Recent tickets',dashboardCta:'Open a new request whenever you need help.',open:'Open',pending:'Waiting for reply',closed:'Closed',
      ticketsEyebrow:'YOUR REQUESTS',ticketsTitle:'My tickets',ticketsDesc:'Review previous cases or open one to continue the conversation.',ticketBack:'Back',quickHelp:'Quick help',quickHelpDesc:'Suggestions based on ticket type.',chatPh:'Write a message...',send:'Send',attachment:'Attachment',customer:'Customer',assign:'Assign to me',release:'Release',close:'Close',reopen:'Reopen',
      adminEyebrow:'ADMIN CENTER',adminTitle:'Support administration',adminDesc:'Manage tickets, distribute requests, and follow customer conversations.',all:'All',unassigned:'Unassigned',today:'Today',adminTickets:'Tickets',adminTicketsDesc:'Take a request and continue the customer conversation.',
      privacyTitle:'Privacy Policy',privacyLead:'We use only the information needed to operate support and handle tickets.',termsTitle:'Terms of Use',termsLead:'By using Rivo Support, you agree to use it for legitimate and respectful support purposes.',acceptableTitle:'Acceptable Use Policy',acceptableLead:'We keep the support environment safe and professional for everyone.',legalUpdated:'Last updated: September 2026',legalBack:'Back to support center',p1h:'What we use',p1:'We process the Rivo account data needed to link a ticket to its owner, plus ticket messages and attachments sent by the user or support team.',p2h:'Who can access it?',p2:'Ticket data is accessible to the ticket owner and authorized support staff according to system permissions.',p3h:'Retention',p3:'We may retain ticket and conversation history as needed to provide support, track cases, and improve the service.',p4h:'Security',p4:'We use access controls and protected databases, but no electronic method can be guaranteed to be 100% secure.',t1h:'Using the service',t1:'Use the support center only for app issues, ticket tracking, and communication with the support team.',t2h:'What you send',t2:'Messages and attachments should be relevant to the issue and must not contain passwords, secret keys, or unnecessary sensitive data.',t3h:'Duplicate tickets',t3:'Avoid opening multiple tickets for the same issue. Similar tickets may be merged to keep support organized.',t4h:'Changes',t4:'The service or policies may change when needed. The latest update date is shown on these pages.',a1h:'Not allowed',a1:'Threats, abuse, hate, harassment, impersonation, fraud, or illegal content are not allowed.',a2h:'Never send secrets',a2:'Do not send passwords, verification codes, API keys, or other secrets inside a ticket.',a3h:'Attachments',a3:'Upload only images related to the issue and avoid files or screenshots containing unnecessary personal data.',a4h:'Enforcement',a4:'Tickets that violate these rules may be closed or restricted and can be reviewed by authorized staff.'}
};
function getLang(){return localStorage.getItem('rivo_support_lang')||'ar'}
function setLang(lang){localStorage.setItem('rivo_support_lang',lang);document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  $$('.lang-ar').forEach(e=>e.classList.toggle('lang-only-en',lang!=='ar'));$$('.lang-en').forEach(e=>e.classList.toggle('lang-only-en',lang!=='en'));
  $$('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(I18N[lang][k])e.textContent=I18N[lang][k]});$$('[data-i18n-placeholder]').forEach(e=>{const k=e.dataset.i18nPlaceholder;if(I18N[lang][k])e.placeholder=I18N[lang][k]});
  $$('.lang-switch button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
}
function languageSwitcher(){return `<div class="lang-switch" aria-label="Language"><button type="button" data-lang="ar">عربي</button><button type="button" data-lang="en">EN</button></div>`}

async function rpc(name,args={}){const {data,error}=await sb.rpc(name,args);if(error){console.error('[Rivo Support]',name,error);throw error}return data}
async function session(){return (await sb.auth.getSession()).data.session}
async function me(){return rpc('rivo_support_me')}
async function requireAuth(){const s=await session();if(!s){location.href='login.html';return null}return s}
async function requireAdmin(){const s=await requireAuth();if(!s)return null;const ok=await rpc('rivo_support_is_admin');if(!ok){location.href='dashboard.html';return null}return s}
function label(key,value){const lang=getLang();const maps={ar:{status:{open:'مفتوح',pending:'بانتظار الرد',closed:'مغلق'},priority:{high:'عالية',normal:'عادية',low:'منخفضة'},category:{account:'الحساب وتسجيل الدخول',technical:'مشكلة تقنية',payment:'الدفع والاشتراكات',report:'إبلاغ عن مشكلة أو إساءة',privacy:'الخصوصية والأمان',other:'أخرى'}},en:{status:{open:'Open',pending:'Waiting for reply',closed:'Closed'},priority:{high:'High',normal:'Normal',low:'Low'},category:{account:'Account & sign in',technical:'Technical issue',payment:'Payments & subscriptions',report:'Report a problem or abuse',privacy:'Privacy & security',other:'Other'}}};return maps[lang]?.[key]?.[value]||value||''}
function nav(admin=false, publicPage=false, loggedIn=null){
  const n=$('#nav'); if(!n)return;
  const inPages=/\/pages\//.test(location.pathname);
  const base=inPages?'':'pages/';
  const page=(name)=>`${base}${name}`;
  const home=page('dashboard.html');
  const tickets=page('tickets.html');
  const newTicket=page('new-ticket.html');
  const login=page('login.html');
  const publicHome=inPages?'../index.html':'index.html';
  const isLoggedIn=loggedIn===true;
  const authAction=isLoggedIn
    ? `<button id="logout" class="nav-auth nav-logout" type="button" data-i18n="logout"><span class="nav-ico">↪</span><span>خروج</span></button>`
    : `<a class="nav-auth nav-login" href="${login}" data-i18n="loginNav"><span class="nav-ico">↪</span><span>تسجيل الدخول</span></a>`;
  const privateLinks=`
           <a href="${home}" data-i18n="navHome"><span class="nav-ico">⌂</span><span>الرئيسية</span></a>
           <a class="nav-support" href="${tickets}" data-i18n="navSupport"><span class="nav-ico">▣</span><span>الدعم</span></a>
           <a class="nav-new" href="${newTicket}" data-nav-new="1" data-i18n="navNew"><span class="nav-ico">＋</span><span>فتح بلاغ</span></a>
           ${admin?`<a class="nav-admin" href="${page('admin.html')}" data-i18n="navAdmin"><span class="nav-ico">⚙</span><span>الإدارة</span></a>`:''}
           ${authAction}`;
  const publicLinks=`
           <a class="nav-home" href="${publicHome}" data-i18n="navHome"><span class="nav-ico">⌂</span><span>الرئيسية</span></a>
           ${isLoggedIn?`<a class="nav-support" href="${newTicket}" data-public-start="1"><span class="nav-ico">＋</span><span data-i18n="start">ابدأ الآن</span></a>`:`<a class="nav-new" href="${login}" data-public-start="1"><span class="nav-ico">＋</span><span data-i18n="start">ابدأ الآن</span></a>`}
           ${authAction}`;
  n.innerHTML=`
    <button class="nav-toggle" id="navToggle" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <div class="nav-links" id="navLinks">
      <div class="menu-head"><strong>Rivo Support</strong><span data-i18n="brandSub">مركز الدعم الرسمي</span></div>
      ${publicPage ? publicLinks : privateLinks}
      <div class="menu-lang">${languageSwitcher()}</div>
    </div>`;
  const toggle=$('#navToggle'), links=$('#navLinks');
  const overlay=document.createElement('button'); overlay.type='button'; overlay.id='navOverlay'; overlay.className='nav-overlay'; overlay.setAttribute('aria-label','Close menu');
  document.body.appendChild(overlay);
  const close=()=>{links?.classList.remove('open');overlay.classList.remove('open');toggle?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')};
  const open=()=>{links?.classList.add('open');overlay.classList.add('open');toggle?.setAttribute('aria-expanded','true');document.body.classList.add('menu-open')};
  toggle?.addEventListener('click',()=>links?.classList.contains('open')?close():open());
  overlay.addEventListener('click',close);
  links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()},{once:true});
  $('#logout')?.addEventListener('click',async()=>{
    const b=$('#logout'); if(b)b.disabled=true;
    try{await sb.auth.signOut({scope:'local'});}catch(e){}
    location.replace(login);
  });
  $$('.lang-switch button').forEach(b=>b.addEventListener('click',()=>{setLang(b.dataset.lang);close()}));
  setLang(getLang());
  if(publicPage){
    links?.querySelector('[data-public-start]')?.addEventListener('click',async e=>{
      e.preventDefault();
      const s=await session();
      location.assign(s?newTicket:login);
    });
  }
  return {close};
}
function navTarget(){return session().then(s=>s?'new-ticket.html':'login.html')}

async function bootCommon(){setLang(getLang());const s=await session();if(!s){if(!location.pathname.endsWith('login.html'))location.href='login.html';return null}const u=await me();const admin=await rpc('rivo_support_is_admin').catch(()=>false);nav(admin,false,true);return {session:s,user:u,admin}}
function login(){
  const f=$('#login');
  if(!f)return;
  session().then(s=>{if(s)location.replace('dashboard.html')}).catch(()=>{});
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    const msg=$('#msg'), btn=f.querySelector('button[type=submit]');
    msg.textContent=''; msg.className='notice hide';
    const username=$('#username').value.trim().replace(/^@/,'').toLowerCase();
    const password=$('#password').value;
    if(!username||!password)return;
    if(btn)btn.disabled=true;
    try{
      const {data:emailData,error:resolveError}=await sb.rpc('rivo_get_login_email',{p_username:username});
      if(resolveError)throw new Error('تعذر الوصول إلى خدمة تسجيل الدخول. تأكد من تشغيل ملف SQL الخاص بمركز الدعم في Supabase.');
      const email=typeof emailData==='string'?emailData:(Array.isArray(emailData)?emailData[0]?.email:null);
      if(!email)throw new Error('الحساب غير موجود.');
      const {error}=await sb.auth.signInWithPassword({email,password});
      if(error)throw error;
      location.replace('dashboard.html');
    }catch(err){
      msg.className='notice error';
      msg.textContent=err.message||'تعذر تسجيل الدخول.';
    }finally{if(btn)btn.disabled=false;}
  });
}

async function dashboard(){const ctx=await bootCommon();if(!ctx)return;$('#welcome').textContent=`${getLang()==='ar'?'أهلًا':'Welcome'} ${ctx.user.display_name || ctx.user.username}`;const st=await rpc('rivo_support_user_stats');$('#openCount').textContent=st.open;$('#pendingCount').textContent=st.pending;$('#closedCount').textContent=st.closed;const recent=await rpc('rivo_support_list_tickets',{p_scope:'mine',p_status:'all',p_limit:6,p_offset:0});renderTickets(recent,$('#recentTickets'))}
function renderTickets(rows,el){if(!rows?.length){el.innerHTML=`<div class="empty">${getLang()==='ar'?'لا توجد بلاغات حاليًا.':'No tickets yet.'}</div>`;return}el.innerHTML=rows.map(t=>`<div class="ticket-item" data-id="${t.id}"><div><strong>${esc(t.subject)}</strong><div class="ticket-meta"><span>#${String(t.id).slice(0,8)}</span><span>${esc(label('category',t.category))}</span><span>${fmt(t.updated_at)}</span></div></div><div class="ticket-meta"><span class="pill ${esc(t.status)}">${esc(label('status',t.status))}</span><span class="pill ${esc(t.priority)}">${esc(label('priority',t.priority))}</span></div></div>`).join('');el.querySelectorAll('[data-id]').forEach(x=>x.onclick=()=>location.href=`ticket.html?id=${x.dataset.id}`)}
async function tickets(){const ctx=await bootCommon();if(!ctx)return;const list=await rpc('rivo_support_list_tickets',{p_scope:'mine',p_status:'all',p_limit:100,p_offset:0});renderTickets(list,$('#tickets'));}
async function newTicket(){
  const s=await requireAuth();if(!s)return;
  const isAdmin=await rpc('rivo_support_is_admin').catch(()=>false); nav(isAdmin,false,true);
  setLang(getLang());
  const form=$('#ticketForm'); if(!form)return;
  const submit=async(e)=>{
    e.preventDefault(); e.stopPropagation();
    const btn=e.submitter||form.querySelector('button[type=submit]');
    const errBox=$('#error'); if(errBox){errBox.className='notice hide';errBox.textContent=''}
    const subject=$('#subject').value.trim(), message=$('#message').value.trim();
    if(!subject||!message){
      if(errBox){errBox.textContent=getLang()==='ar'?'اكتب عنوان المشكلة وشرحها أولًا.':'Please add a title and issue details.';errBox.className='notice error'}
      toast(getLang()==='ar'?'أكمل البيانات أولًا.':'Complete the required fields first.','error'); return;
    }
    if(btn)btn.disabled=true;
    try{
      const row=await rpc('rivo_support_create_ticket',{p_subject:subject,p_category:$('#category').value,p_priority:$('#priority').value,p_message:message});
      const id=row?.id || row?.[0]?.id;
      if(!id)throw new Error(getLang()==='ar'?'تعذر إنشاء البلاغ.':'Could not create the ticket.');
      location.href=`ticket.html?id=${encodeURIComponent(id)}`;
    }catch(err){
      const msg=err?.message||'Could not create ticket.';
      if(errBox){errBox.textContent=msg;errBox.className='notice error'}
      toast(msg,'error');
    }finally{if(btn)btn.disabled=false}
  };
  form.addEventListener('submit',submit);
  smartHint();
}
function smartHint(){const h=$('#smartHint'),f=$('#message');f?.addEventListener('input',()=>{const s=f.value.toLowerCase();let out='';const ar=getLang()==='ar';if(/دخول|تسجيل|كلمه|كلمة|password|login/.test(s))out=ar?'اقتراح: تأكد من اسم المستخدم وكلمة المرور، ولا ترسل كلمة مرورك داخل البلاغ.':'Tip: verify your username and password. Never send your password in a ticket.';else if(/دفع|فلوس|شراء|coins|سعر|payment/.test(s))out=ar?'اقتراح: أرفق صورة إيصال الدفع أو الخطأ الظاهر لتسريع المراجعة.':'Tip: attach a payment receipt or screenshot of the error to speed up review.';else if(/حظر|ban|موقوف/.test(s))out=ar?'اقتراح: اكتب سبب الحظر كما يظهر لك وأرفق لقطة الشاشة.':'Tip: include the ban reason exactly as shown and attach a screenshot.';else if(/صورة|رفع|upload/.test(s))out=ar?'اقتراح: أرفق الصورة من زر إرفاق الملف قبل الإرسال.':'Tip: attach the image using the file button before sending.';h.textContent=out})}
async function ticket(){
  const ctx=await bootCommon();if(!ctx)return;
  const id=new URLSearchParams(location.search).get('id');
  if(!id){location.replace('tickets.html');return}
  // Bind the composer BEFORE the first data load so a rendering issue cannot break sending.
  setupComposer(ctx,id);
  try{await loadTicket(ctx,id)}catch(err){
    console.error(err); toast(err?.message||(getLang()==='ar'?'تعذر تحميل البلاغ.':'Could not load ticket.'),'error');
    const box=$('#messages'); if(box)box.innerHTML=`<div class="empty">${esc(err?.message||'تعذر تحميل البلاغ.')}</div>`;
  }
  subscribeToTicket(ctx,id,false);
}
async function loadTicket(ctx,id){
  const t=await rpc('rivo_support_get_ticket',{p_ticket_id:id});
  if(!t)throw new Error(getLang()==='ar'?'لم يتم العثور على البلاغ.':'Ticket not found.');
  $('#subjectTitle').textContent=t.subject||'';
  $('#ticketMeta').innerHTML=`<span class="pill ${esc(t.status)}">${esc(label('status',t.status))}</span><span class="pill ${esc(t.priority)}">${esc(label('priority',t.priority))}</span><span>${esc(label('category',t.category))}</span><span>#${esc(String(id).slice(0,8))}</span>`;
  const suggestionsBox=$('#suggestions');
  if(suggestionsBox){
    try{
      const suggestions=await rpc('rivo_support_suggestions',{p_category:t.category});
      const list=Array.isArray(suggestions)?suggestions:[];
      suggestionsBox.innerHTML=list.map(x=>`<article><strong>${esc(x.title)}</strong><p class="muted">${esc(x.body)}</p></article>`).join('')||`<div class="empty">${getLang()==='ar'?'لا توجد اقتراحات الآن.':'No suggestions right now.'}</div>`;
    }catch(e){suggestionsBox.innerHTML='';console.warn('suggestions unavailable',e)}
  }
  await renderMessages(ctx,t);
}
async function renderMessages(ctx,t){
  const box=$('#messages'); if(!box)return;
  const messages=Array.isArray(t.messages)?t.messages:[];
  const items=await Promise.all(messages.map(async m=>{
    let url='';
    if(m.attachment_path){const signed=await sb.storage.from('rivo-support-media').createSignedUrl(m.attachment_path,3600).catch(()=>null);url=signed?.data?.signedUrl||'';}
    const body=esc(m.content||'').replace(/\n/g,'<br>');
    const senderLabel = ctx.admin ? (m.sender_id===ctx.session.user.id ? (getLang()==='ar'?'أنت':'You') : (m.sender_name||'Support')) : (m.is_support || m.sender_id!==ctx.session.user.id ? (getLang()==='ar'?'دعم Rivo':'Rivo Support') : (getLang()==='ar'?'أنت':'You')); return `<div class="msg ${m.sender_id===ctx.session.user.id?'me':''}" data-message-id="${esc(m.id)}"><div class="meta">${esc(senderLabel)} · ${fmt(m.created_at)}</div><div>${body}</div>${url?`<a href="${esc(url)}" target="_blank" rel="noopener"><img src="${esc(url)}" alt="مرفق" loading="lazy"></a>`:''}</div>`;
  }));
  box.innerHTML=items.join('')||`<div class="empty">${getLang()==='ar'?'ابدأ المحادثة مع الدعم.':'Start the conversation with support.'}</div>`;
  box.scrollTop=box.scrollHeight;
}
function setupComposer(ctx,id){
  const form=$('#composer'), input=$('#chatText'), file=$('#file'), preview=$('#attachmentPreview');
  if(!form||!input)return;
  let attachment=null, sending=false;
  file?.addEventListener('change',()=>{attachment=file.files[0]||null; if(preview)preview.textContent=attachment?`${attachment.name} · ${(attachment.size/1024/1024).toFixed(2)} MB`:''});
  form.addEventListener('submit',async e=>{
    e.preventDefault();e.stopPropagation();
    if(sending)return;
    if(ctx.admin){ const assigned=window.__rivoAssignedAdminId; const myId=ctx.session?.user?.id; const openState=window.__rivoTicketStatus; if(assigned!==myId || openState==='closed'){ toast(openState==='closed'?(getLang()==='ar'?'البلاغ مغلق.':'Ticket is closed.'):(getLang()==='ar'?'استلم البلاغ أولًا قبل الرد.':'Claim the ticket before replying.'),'error'); return; } }
    const btn=e.submitter||form.querySelector('button[type=submit]');
    const text=input.value.trim(); if(!text&&!attachment)return;
    sending=true;if(btn)btn.disabled=true;
    try{
      let path=null;
      if(attachment){
        if(attachment.size>6*1024*1024)throw new Error(getLang()==='ar'?'الصورة أكبر من 6MB.':'Image is larger than 6MB.');
        if(!attachment.type.startsWith('image/'))throw new Error(getLang()==='ar'?'المسموح صور فقط.':'Only images are allowed.');
        path=`${ctx.session.user.id}/${crypto.randomUUID()}-${attachment.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
        const up=await sb.storage.from('rivo-support-media').upload(path,attachment,{upsert:false,contentType:attachment.type});
        if(up.error)throw up.error;
      }
      await rpc('rivo_support_send_message',{p_ticket_id:id,p_content:text,p_attachment_path:path});
      input.value='';if(file)file.value='';attachment=null;if(preview)preview.textContent='';
      try{await loadTicket(ctx,id)}catch(e){console.warn(e)}
    }catch(err){
      toast(err?.message||(getLang()==='ar'?'تعذر إرسال الرسالة.':'Could not send message.'),'error');
    }finally{sending=false;if(btn)btn.disabled=false;input.focus()}
  });
}
function subscribeToTicket(ctx,id,isAdmin){
  const channel=sb.channel(`rivo-support-ticket-${id}-${isAdmin?'admin':'user'}`)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'rivo_support_messages',filter:`ticket_id=eq.${id}`},async payload=>{
      try{const t=await rpc('rivo_support_get_ticket',{p_ticket_id:id}); if(isAdmin) await window.__renderAdminTicket?.(t); else await loadTicket(ctx,id)}catch(e){console.warn('realtime refresh failed',e)}
    })
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'rivo_support_tickets',filter:`id=eq.${id}`},async()=>{
      try{const t=await rpc('rivo_support_get_ticket',{p_ticket_id:id}); if(isAdmin) await window.__renderAdminTicket?.(t); else await loadTicket(ctx,id)}catch(e){console.warn(e)}
    })
    .subscribe();
  window.__rivoSupportChannel=channel;
  window.addEventListener('beforeunload',()=>{sb.removeChannel(channel)},{once:true});
}
async function admin(){
  const ctx=await requireAdmin();if(!ctx)return;nav(true,false,true);
  const refresh=async()=>{
    try{
      const st=await rpc('rivo_support_admin_stats');['total','open','pending','closed','unassigned','today'].forEach(k=>{const el=$(`#stat-${k}`);if(el)el.textContent=st?.[k]??0});
      const rows=await rpc('rivo_support_list_tickets',{p_scope:'admin',p_status:$('#filter').value,p_limit:100,p_offset:0});
      renderAdmin(Array.isArray(rows)?rows:[],$('#adminTickets'));
    }catch(err){toast(err?.message||(getLang()==='ar'?'تعذر تحميل الإدارة.':'Could not load admin data.'),'error')}
  };
  await refresh(); $('#filter')?.addEventListener('change',refresh);
}
function renderAdmin(rows,el){
  if(!el)return;
  if(!rows.length){el.innerHTML=`<div class="empty">${getLang()==='ar'?'لا توجد بلاغات.':'No tickets found.'}</div>`;return}
  el.innerHTML=rows.map(t=>`<div class="ticket-item" data-id="${esc(t.id)}"><div><strong>${esc(t.subject)}</strong><div class="ticket-meta"><span>${esc(t.username||'')}</span><span>${esc(label('category',t.category))}</span><span>${fmt(t.updated_at)}</span></div></div><div class="ticket-meta"><span class="pill ${esc(t.status)}">${esc(label('status',t.status))}</span>${t.assigned_admin_username?`<span>${getLang()==='ar'?'مستلم:':'Assigned to:'} ${esc(t.assigned_admin_username)}</span>`:`<span>${getLang()==='ar'?'غير مستلم':'Unassigned'}</span>`}</div></div>`).join('');
  el.querySelectorAll('[data-id]').forEach(x=>x.onclick=()=>location.href=`admin-ticket.html?id=${encodeURIComponent(x.dataset.id)}`);
}
async function adminTicket(){
  const sessionCtx=await requireAdmin();if(!sessionCtx)return;
  const adminUser=await me();
  const ctx={session:sessionCtx,user:adminUser,admin:true};
  nav(true,false,true);
  const id=new URLSearchParams(location.search).get('id');if(!id){location.replace('admin.html');return}

  async function loadAdmins(){
    const box=$('#transferAdmin'); if(!box)return;
    try{
      const rows=await rpc('rivo_support_list_admins');
      box.innerHTML=`<option value="">${getLang()==='ar'?'اختر موظفًا':'Choose agent'}</option>`+(Array.isArray(rows)?rows:[]).filter(x=>x.id!==ctx.session.user.id).map(x=>`<option value="${esc(x.id)}">${esc(x.display_name||x.username||'')}</option>`).join('');
    }catch(e){box.innerHTML=`<option value="">${getLang()==='ar'?'تعذر تحميل الفريق':'Could not load team'}</option>`}
  }

  async function render(tArg){
    const t=tArg||await rpc('rivo_support_get_ticket',{p_ticket_id:id});
    if(!t)throw new Error(getLang()==='ar'?'لم يتم العثور على البلاغ.':'Ticket not found.');
    const assignedId=t.assigned_admin_id||null;
    window.__rivoAssignedAdminId=assignedId; window.__rivoTicketStatus=t.status;
    $('#subjectTitle').textContent=t.subject||'';
    const u=t.user||{};$('#customer').textContent=`${u.display_name||u.username||''} @${u.username||''}`;
    const assignedName=t.assigned_admin?.display_name||t.assigned_admin?.username||'';
    $('#ticketMeta').innerHTML=`<span class="pill ${esc(t.status)}">${esc(label('status',t.status))}</span><span class="pill ${esc(t.priority)}">${esc(label('priority',t.priority))}</span><span>${esc(label('category',t.category))}</span>${assignedName?`<span class="assigned-chip">${getLang()==='ar'?'المسؤول:':'Agent:'} ${esc(assignedName)}</span>`:''}`;
    await renderMessages(ctx,t);

    const mine=assignedId===ctx.session.user.id;
    const other=Boolean(assignedId) && !mine;
    const claim=$('#claimTop'),release=$('#releaseBtn'),transfer=$('#transferBtn'),closeBtn=$('#closeBtn'),reopen=$('#reopenBtn'),owner=$('#actionOwner'),menu=$('#ticketActionMenu'),menuToggle=$('#actionMenuToggle');
    // Before claim: show a single clear action outside the menu.
    claim?.classList.toggle('hide',Boolean(assignedId) || t.status==='closed');
    // After claim: management actions live inside the ⋮ menu.
    release?.classList.toggle('hide',!mine || t.status==='closed');
    transfer?.classList.toggle('hide',!mine || t.status==='closed');
    closeBtn?.classList.toggle('hide',!mine || t.status==='closed');
    reopen?.classList.toggle('hide',t.status!=='closed');
    menu?.classList.toggle('has-owner',mine || other || t.status==='closed');
    menuToggle?.classList.toggle('hide',!assignedId && t.status!=='closed');
    if(owner){owner.textContent=mine?(getLang()==='ar'?'مستلم بواسطتك':'Assigned to you'):other?(getLang()==='ar'?'مستلم من موظف آخر':'Assigned to another agent'):t.status==='closed'?(getLang()==='ar'?'البلاغ مغلق':'Ticket closed'):(getLang()==='ar'?'البلاغ غير مستلم':'Unassigned')}
    const locked=other||(!mine && t.status==='closed');
    const composer=$('#composer'); composer?.classList.toggle('composer-disabled',!mine && !!ctx.admin);
    const sendBtn=composer?.querySelector('button[type="submit"]'); if(sendBtn){sendBtn.disabled=locked||t.status==='closed';}
    const text=$('#chatText'); if(text){text.disabled=locked||t.status==='closed';text.placeholder=locked?(getLang()==='ar'?'استلم البلاغ أولًا للرد':'Claim the ticket to reply'):(getLang()==='ar'?'اكتب رد الدعم...':'Write your support reply...')}
    const file=$('#file'); if(file)file.disabled=locked||t.status==='closed';
    await loadAdmins();
  }
  setupComposer(ctx,id);
  window.__renderAdminTicket=render;
  try{await render();}catch(err){toast(err?.message||(getLang()==='ar'?'تعذر تحميل البلاغ.':'Could not load ticket.'),'error')}

  const runAction=async(btn,fn)=>{
    if(!btn||btn.disabled)return;
    const old=btn.innerHTML;btn.disabled=true;btn.classList.add('is-loading');
    try{await fn();await render();closeActionMenu();toast(getLang()==='ar'?'تم تنفيذ العملية بنجاح.':'Done.','success')}
    catch(err){toast(err?.message||(getLang()==='ar'?'تعذر تنفيذ العملية.':'Action failed.'),'error')}
    finally{btn.disabled=false;btn.classList.remove('is-loading');btn.innerHTML=old}
  };
  const menu=$('#ticketActionMenu');
  const closeActionMenu=()=>menu?.classList.remove('open');
  $('#actionMenuToggle')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation(); if($('#claimTop')&&!$('#claimTop').classList.contains('hide')&& !window.__rivoAssignedAdminId){ return; } menu?.classList.toggle('open')});
  document.addEventListener('click',e=>{if(menu&&!menu.contains(e.target)&&e.target!==$('#actionMenuToggle'))closeActionMenu()});
  $('#claimTop')?.addEventListener('click',e=>{e.preventDefault();runAction($('#claimTop'),()=>rpc('rivo_support_assign_ticket',{p_ticket_id:id}))});
  $('#releaseBtn')?.addEventListener('click',e=>{e.preventDefault();runAction($('#releaseBtn'),()=>rpc('rivo_support_release_ticket',{p_ticket_id:id}))});
  $('#closeBtn')?.addEventListener('click',e=>{e.preventDefault();runAction($('#closeBtn'),()=>rpc('rivo_support_set_ticket_status',{p_ticket_id:id,p_status:'closed'}))});
  $('#reopenBtn')?.addEventListener('click',e=>{e.preventDefault();runAction($('#reopenBtn'),()=>rpc('rivo_support_set_ticket_status',{p_ticket_id:id,p_status:'open'}))});
  $('#transferBtn')?.addEventListener('click',e=>{e.preventDefault();$('#transferPanel')?.classList.toggle('open')});
  $('#transferConfirm')?.addEventListener('click',e=>{e.preventDefault();const v=$('#transferAdmin')?.value;if(!v){toast(getLang()==='ar'?'اختر موظفًا أولًا.':'Choose an agent first.','error');return}runAction($('#transferConfirm'),()=>rpc('rivo_support_transfer_ticket',{p_ticket_id:id,p_new_admin_id:v}));$('#transferPanel')?.classList.remove('open')});
  subscribeToTicket(ctx,id,true);
}
function toast(message,type='info'){
  let box=$('#rivoToast');
  if(!box){box=document.createElement('div');box.id='rivoToast';document.body.appendChild(box)}
  box.textContent=message;box.className=`toast ${type}`;
  clearTimeout(window.__rivoToastTimer);window.__rivoToastTimer=setTimeout(()=>box.classList.add('hide'),3200);
}
function setupSmartTopbar(){
  const topbar=document.querySelector('.topbar');
  if(!topbar)return;
  let lastY=Math.max(window.scrollY||0,0);
  let ticking=false;
  const downThreshold=16, upThreshold=7;
  const syncHiddenState=()=>{
    document.body.classList.toggle('topbar-hidden',topbar.classList.contains('nav-hidden'));
  };
  const update=()=>{
    const y=Math.max(window.scrollY||0,0);
    if(document.body.classList.contains('menu-open')){
      topbar.classList.remove('nav-hidden');
      syncHiddenState();
      lastY=y;
      ticking=false;
      return;
    }
    if(y<=18){
      topbar.classList.remove('nav-hidden');
    }else if(y>lastY+downThreshold){
      topbar.classList.add('nav-hidden');
    }else if(y<lastY-upThreshold){
      topbar.classList.remove('nav-hidden');
    }
    syncHiddenState();
    lastY=y;
    ticking=false;
  };
  window.addEventListener('scroll',()=>{
    if(!ticking){ticking=true;requestAnimationFrame(update)}
  },{passive:true});
  update();
}
function setupPasswordToggle(){
  const input=$('#password'), button=$('#passwordToggle');
  if(!input||!button||button.dataset.bound==='1')return;
  button.dataset.bound='1';
  const eyeOpen=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="2.8"></circle></svg>`;
  const eyeClosed=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 18 18"></path><path d="M10.6 6.2A11.8 11.8 0 0 1 12 6c6.5 0 10 6 10 6a18.4 18.4 0 0 1-3.1 3.8"></path><path d="M6.2 8.1C3.4 9.6 2 12 2 12s3.5 6 10 6a10 10 0 0 0 3.4-.6"></path><path d="M9.8 9.8A3 3 0 0 0 14.2 14.2"></path></svg>`;
  const sync=()=>{
    const visible=input.type==='text';
    button.innerHTML=visible?eyeClosed:eyeOpen;
    const ar=getLang()==='ar';
    const label=visible?(ar?'إخفاء كلمة المرور':'Hide password'):(ar?'إظهار كلمة المرور':'Show password');
    button.setAttribute('aria-label',label);
    button.title=label;
    button.setAttribute('aria-pressed',visible?'true':'false');
  };
  button.addEventListener('click',()=>{input.type=input.type==='password'?'text':'password';sync();input.focus();try{const end=input.value.length;input.setSelectionRange(end,end)}catch(e){}});
  sync();
}
async function init(){setupSmartTopbar();setupPasswordToggle();const page=document.body.dataset.page; if(page==='login'){nav(false,true,false);return login();} if(page==='dashboard')return dashboard(); if(page==='tickets')return tickets(); if(page==='new-ticket')return newTicket(); if(page==='ticket')return ticket(); if(page==='admin')return admin(); if(page==='admin-ticket')return adminTicket(); if(page==='legal'){session().then(s=>nav(false,true,Boolean(s)));return;} if(page==='index'){const s=await session();nav(false,true,Boolean(s));const start=$('#startLink');const target=s?'pages/new-ticket.html':'pages/login.html';if(start){start.href=target;start.addEventListener('click',async e=>{e.preventDefault();const live=await session();location.assign(live?'pages/new-ticket.html':'pages/login.html')})}}}
init();
