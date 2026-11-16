import{aG as Qe,cl as ue,cm as Xe,cn as Ke,co as Je,aQ as w,cp as et,j as s,aA as tt,at as X,as as K,au as Q,az as ot,bg as at,aO as rt,bZ as nt,cq as it,cr as lt,cs as st,ct as dt,cu as ct,aZ as Ce,aL as pt,aN as ut,aE as ht,aF as mt,cv as gt,a$ as Re,av as Te,cw as ft,cx as bt,r as xt,cy as vt,cz as Ne}from"./vendor-oC9IzGTw.js";import{r as yt,q as wt,t as he,C as ge,a as fe,v as St,x as kt,y as He,z as je,m as Ct,b as re,B as Mt,D as Dt,F as Et,G as $t}from"./index-OFkSNpoV.js";const Be="#e2e8f0",be=()=>{const e=yt(),o=wt(e);return{headerBg:o.bg,headerBgHover:o.hover,headerRule:o.rule,headerText:o.fg,divider:o.divider,soft:e.primarySoft,totalBg:Be,headerBgRgb:he(o.bg),headerRuleRgb:he(o.rule),headerTextRgb:he(o.fg),totalBgRgb:he(Be)}},xe=()=>new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}).replace(/ /g,"-"),Pe=e=>{if(!e)return"";const o=Qe(e);return o.isValid()?o.format("DD-MMM-YYYY"):String(e)},zt=new Set(["ID","EMI","GST","PAN","TDS","ROI","NPA","IFSC","KYC","CIF","NEFT","RTGS","UPI","CR","DR","OD","PCT","YTD","MTD"]),Ie={sno:"S.No",srno:"S.No",slno:"S.No"},Rt=new Set(["of","to","for","and","in","on","at","by","per"]),Ge=(e="")=>{const o=String(e).replace(/[\s_-]+/g,"").toLowerCase();return Ie[o]?Ie[o]:String(e).replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g,"$1 $2").replace(/[_-]+/g," ").trim().split(/\s+/).filter(Boolean).map((r,t)=>{const n=r.toUpperCase();return zt.has(n)?n:t>0&&Rt.has(r.toLowerCase())?r.toLowerCase():r.charAt(0).toUpperCase()+r.slice(1)}).join(" ")},ee=e=>typeof e=="string"?Ge(e):e.headerName||Ge(e.field||""),Tt=e=>typeof e=="string"?e:e.field,N=(e,o)=>e[Tt(o)],te=(e,o)=>{var n,i,l,a,p,d;const r=N(e,o),t=c=>typeof c=="number"?H(c):c;if(typeof o=="string")return(n=t(r))!=null?n:"";if(o.valueGetter)try{return(i=o.valueGetter(r,e,o))!=null?i:""}catch(c){return(l=t(r))!=null?l:""}if(o.valueFormatter)try{return(a=o.valueFormatter(r,e,o))!=null?a:""}catch(c){return(p=t(r))!=null?p:""}return(d=t(r))!=null?d:""},_=(e=[])=>e.filter(o=>typeof o=="string"?o:o.field&&!o.disableExport),H=e=>{const o=Number(e);if(!Number.isFinite(o))return 0;const r=Math.round((o+Number.EPSILON)*100)/100;return Object.is(r,-0)?0:r},W=e=>!!(e&&(e.__isTotal===!0||e.id==="total"||e.id==="TOTAL")),We=(e,o=[])=>{if(typeof e!="string"&&e.align)return e.align;const r=o.find(t=>!W(t)&&N(t,e)!=null&&N(t,e)!=="");return typeof N(r||{},e)=="number"?"right":"left"},ve=({period:e,meta:o}={})=>{const r=[];if(e!=null&&e.fromDate||e!=null&&e.toDate){const t=Pe(e.fromDate),n=Pe(e.toDate);r.push({label:e.label||"Period",value:t&&n?`${t} - ${n}`:t||n})}return(o||[]).forEach(t=>{t&&t.label&&t.value!==""&&t.value!=null&&r.push(t)}),r},jt=7,Me=(e={},o=[])=>e.orientation?e.orientation:_(o).length>=jt?"landscape":"portrait",Ae=(e=0)=>e<=8?10:e<=12?9:8,ne=(e="",o={})=>o.title||String(e).replace(/[_-]+/g," ").trim(),ye=(e={})=>({name:e.appName||St,trail:typeof e.breadcrumb=="string"?e.breadcrumb:kt(e.breadcrumb)}),oe=e=>typeof e=="string"?120:e.width||e.minWidth||120,Fe=e=>typeof e=="number"?e.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}):String(e!=null?e:""),ae=({summary:e}={})=>(e||[]).filter(o=>o&&o.label&&o.value!==null&&o.value!==void 0).map(o=>({label:o.label,value:Fe(o.value)})),po=(e=[],{creditField:o="credit",debitField:r="debit"}={})=>{const t=e.filter(l=>!W(l)),n=H(t.reduce((l,a)=>l+Number(a[o]||0),0)),i=H(t.reduce((l,a)=>l+Number(a[r]||0),0));return[{label:"Credits",value:n},{label:"Debits",value:i},{label:"Balance",value:H(n-i)}]},S=e=>String(e!=null?e:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Bt=(e,o)=>e.map(r=>o.map(t=>{var n;return String((n=te(r,t))!=null?n:"")})),Pt=(e=[],o=[],r="report",t={})=>{const n=_(o);if(!e.length)return;const i=ve(t),l=ye(t),a=[[l.trail?`${l.name} | ${l.trail}`:l.name],[ge],[fe],[`Date: ${xe()}`],...i.map(b=>[`${b.label}: ${b.value}`]),[ne(r,t)],[]],p=e.map(b=>n.map(h=>{const x=N(b,h);return typeof x=="number"?H(x):te(b,h)})),d=ae(t),c=d.length?[[]].concat(d.map(b=>{const h=new Array(Math.max(n.length,2)).fill("");return h[n.length-2]=`${b.label} :`,h[n.length-1]=b.value,h})):[],f=a.length,u=[...a,n.map(ee),...p,...c],m=ue.aoa_to_sheet(u);m["!cols"]=n.map(b=>({wch:Math.min(42,Math.max(12,ee(b).length+2,Math.round(oe(b)/8),...e.map(h=>{var x;return String((x=te(h,b))!=null?x:"").length+2})))}));const D=n.map(b=>e.some(h=>{const x=N(h,b);return typeof x=="number"&&!Number.isInteger(H(x))}));e.forEach((b,h)=>{n.forEach((x,T)=>{if(typeof N(b,x)!="number")return;const E=ue.encode_cell({r:f+1+h,c:T});m[E]&&(m[E].z=D[T]?"#,##0.00":"#,##0")})});const R=ue.book_new();ue.book_append_sheet(R,m,"Report"),Xe(R,`${r}.xlsx`)},It=(e=[],o=[],r="report",t={})=>{const n=_(o);if(!e.length)return;const i=u=>{const m=String(u!=null?u:"");return/[",\n]/.test(m)?`"${m.replace(/"/g,'""')}"`:m},l=ve(t),a=ye(t),p=[i(a.trail?`${a.name} | ${a.trail}`:a.name),i(ge),i(fe),i(`Date: ${xe()}`),...l.map(u=>i(`${u.label}: ${u.value}`)),i(ne(r,t)),"",n.map(ee).map(i).join(",")].concat(e.map(u=>n.map(m=>i(te(u,m))).join(","))).concat(ae(t).length?[""].concat(ae(t).map(u=>i(`${u.label} :`)+","+i(u.value))):[]).join(`
`),d=new Blob(["\uFEFF",p],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(d),f=document.createElement("a");f.href=c,f.download=`${r}.csv`,f.click(),URL.revokeObjectURL(c)},Gt=(e=[],o=[],r="report",t={})=>{var b;const n=_(o);if(!e.length)return;const i=Me(t,n),l=be(),a=new Ke({orientation:i,unit:"mm",format:"a4"}),p=a.internal.pageSize.getWidth(),d=p/2,c=ye(t);a.setFontSize(9),a.setFont(void 0,"bold"),a.setTextColor(...l.headerRuleRgb),a.text(c.trail?`${c.name}  |  ${c.trail}`:c.name,d,9,{align:"center"}),a.setTextColor(17,24,39),a.setDrawColor(226,232,240),a.line(10,11.5,p-10,11.5),a.setFontSize(16),a.text(ge,d,19,{align:"center"}),a.setFont(void 0,"normal"),a.setFontSize(10),a.text(fe,d,25,{align:"center"});let f=31;a.text(`Date: ${xe()}`,p-14,f,{align:"right"}),ve(t).forEach(h=>{a.text(`${h.label} : ${h.value}`,14,f),f+=6}),f=Math.max(f,37),a.setFontSize(12),a.setFont(void 0,"bold"),a.text(ne(r,t),d,f,{align:"center"}),a.setFont(void 0,"normal");const u=n.map(h=>We(h,e)),m=p-20,D=n.reduce((h,x)=>h+oe(x),0);Je(a,{startY:f+6,head:[n.map(ee)],body:Bt(e,n),styles:{fontSize:Ae(n.length)-1.5,cellPadding:2.2,overflow:"linebreak",valign:"middle",minCellWidth:12},headStyles:{fillColor:l.headerBgRgb,textColor:255,fontStyle:"bold",halign:"center",valign:"middle",cellPadding:{top:3.2,bottom:3.2,left:2,right:2},minCellHeight:11,lineWidth:.1},alternateRowStyles:{fillColor:[245,247,251]},columnStyles:n.reduce((h,x,T)=>({...h,[T]:{halign:u[T],cellWidth:oe(x)/D*m}}),{}),willDrawCell:h=>{h.section==="body"&&W(e[h.row.index])&&(a.setFont(void 0,"bold"),h.cell.styles.fillColor=l.totalBgRgb,h.cell.styles.fontStyle="bold")},didDrawPage:()=>{const h=a.internal.getNumberOfPages();a.setFontSize(8),a.text(`Page ${h}`,p-14,a.internal.pageSize.getHeight()-6,{align:"right"})},margin:{top:14,left:10,right:10,bottom:12}});const R=ae(t);if(R.length){let h=(((b=a.lastAutoTable)==null?void 0:b.finalY)||40)+8;a.setFontSize(10),a.setFont(void 0,"bold"),R.forEach(x=>{h>a.internal.pageSize.getHeight()-14&&(a.addPage(),h=20),a.text(`${x.label} :`,p-60,h,{align:"right"}),a.text(x.value,p-14,h,{align:"right"}),h+=6}),a.setFont(void 0,"normal")}a.save(`${r}.pdf`)},Oe=({details:e}={})=>{var r;return!e||!e.length?[]:(Array.isArray((r=e[0])==null?void 0:r.fields)?e:[{fields:e}]).map(t=>({title:t.title||"",color:/^#[0-9a-f]{3,8}$/i.test(t.color||"")?t.color:be().headerBg,columns:t.columns||4,fields:(t.fields||[]).filter(n=>n&&n.label)})).filter(t=>t.fields.length)},Lt=(e={})=>typeof e.photo=="string"&&/^(data:image\/|blob:)/.test(e.photo)?e.photo:"",Nt=(e={})=>{const o=Oe(e),r=Lt(e);if(!o.length)return"";const t=o.map(i=>{const l=i.fields.map(d=>{const c=d.value===""||d.value==null?"-":d.value;return`<td><span class="dl">${S(d.label)}</span><span class="dv">${S(c)}</span></td>`});for(;l.length%i.columns;)l.push("<td></td>");const a=[];for(let d=0;d<l.length;d+=i.columns)a.push(`<tr>${l.slice(d,d+i.columns).join("")}</tr>`);return`${i.title?`<p class="detail-title" style="background:${i.color}">${S(i.title)}</p>`:""}<table class="detail-table">${a.join("")}</table>`}).join("");return`<div class="report-details">${r?`<table class="detail-wrap"><tr><td class="detail-main">${t}</td><td class="detail-photo"><img src="${S(r)}" alt="" /></td></tr></table>`:t}</div>`},_e=(e,o,r,t)=>{const n=o.map(u=>We(u,e)),i=o.reduce((u,m)=>u+oe(m),0),l=`<colgroup>${o.map(u=>`<col style="width:${(oe(u)/i*100).toFixed(2)}%">`).join("")}</colgroup>`,a=o.map((u,m)=>`<th style="text-align:${n[m]}">${S(ee(u))}</th>`).join(""),p=e.map(u=>{const m=o.map((D,R)=>`<td style="text-align:${n[R]}">${S(te(u,D))}</td>`).join("");return`<tr${W(u)?' class="total-row"':""}>${m}</tr>`}).join(""),d=ve(t).map(u=>`<p class="meta"><strong>${S(u.label)} :</strong> ${S(u.value)}</p>`).join(""),c=ye(t);return`<div class="report-head">
      ${`<div class="report-app">
      <span class="report-app-name">${S(c.name)}</span>
      ${c.trail?`<span class="report-app-trail">${S(c.trail)}</span>`:""}
    </div>`}
      <h1>${S(ge)}</h1>
      <p>${S(fe)}</p>
      <p class="report-date"><strong>Date:</strong> ${xe()}</p>
      ${d}
      <h2>${S(ne(r,t))}</h2>
    </div>
    ${Nt(t)}
    <table class="report-table">${l}<thead><tr>${a}</tr></thead><tbody>${p}</tbody></table>
    ${Ht(t)}`},Ht=e=>{const o=ae(e);return o.length?`<table class="report-summary">${o.map((t,n)=>`<tr${n===o.length-1?' class="summary-final"':""}><th>${S(t.label)} :</th><td>${S(t.value)}</td></tr>`).join("")}</table>`:""},Ue=(e,o=0)=>{const r=Ae(o),t=be();return`
  @page{size:A4 ${e};margin:10mm}
  body{font-family:Inter,'Segoe UI',Roboto,Arial,sans-serif;padding:12px;color:#111827}
  h1{font-size:20px;margin:0;text-align:center;letter-spacing:.4px}
  h2{text-align:center;margin:12px 0 10px;font-size:15px}
  p{text-align:center;margin:3px 0;color:#475569;font-size:12px}
  p.meta{text-align:left;color:#111827;margin:2px 0}
  p.report-date{text-align:right;margin-top:-14px}
  .report-head{margin-bottom:8px}
  /* Application band - product name over the breadcrumb of the screen that
     produced the report, so the printed page keeps the on-screen hierarchy. */
  .report-app{display:flex;align-items:baseline;justify-content:center;gap:8px;
    flex-wrap:wrap;padding-bottom:6px;margin-bottom:8px;border-bottom:1px solid #e2e8f0}
  .report-app-name{font-size:12px;font-weight:800;color:${t.headerRule};letter-spacing:.3px}
  .report-app-trail{font-size:11px;font-weight:600;color:#64748b}
  .report-app-trail:before{content:"|";margin-right:8px;color:#cbd5e1}
  table{width:100%;border-collapse:collapse;border:1.5px solid #94a3b8;table-layout:fixed}
  th,td{border:1px solid #cbd5e1;padding:5px 7px;font-size:${r}px;vertical-align:middle}
  /* Cells may wrap, but only between words - break-word on its own was
     splitting names mid-letter ("guaranto r") once a column got narrow. */
  td{overflow-wrap:break-word;word-break:normal;hyphens:none}
  /* A heading never breaks inside a word: it wraps at spaces or not at all,
     which is what keeps "Installment Pending" readable in a tight column. */
  th{background:${t.headerBg};color:${t.headerText};border-bottom:2px solid ${t.headerRule};
    padding:8px 7px;height:auto;min-height:26px;line-height:1.25;
    white-space:normal;overflow-wrap:normal;word-break:keep-all;hyphens:none}
  tbody tr:nth-child(even){background:#f8fafc}
  tr.total-row td{font-weight:700;background:${t.totalBg};border-top:2px solid ${t.headerBg}}
  /* Credits / Debits / Balance block, right aligned under the table. */
  table.report-summary{width:auto;margin:10px 0 0 auto;border:none}
  table.report-summary th,table.report-summary td{border:none;padding:2px 6px;font-size:12px}
  table.report-summary th{background:none;color:#111827;text-align:right;font-weight:700}
  table.report-summary td{text-align:right;min-width:110px;font-weight:700}
  table.report-summary tr.summary-final th,table.report-summary tr.summary-final td{
    border-top:1px solid #94a3b8;padding-top:4px}
  /* Statement detail block - the titled bands of label/value cells above the
     grid, plus the customer photo. Printed on the first page only. */
  .report-details{margin:0 0 8px}
  .report-details table{border:none;table-layout:auto}
  .report-details table.detail-wrap{width:100%}
  .report-details table.detail-wrap>tbody>tr>td{border:none;padding:0;vertical-align:top}
  .report-details .detail-photo{width:26mm;padding-left:8px}
  .report-details .detail-photo img{width:24mm;height:28mm;object-fit:cover;
    border:1px solid #cbd5e1;border-radius:4px}
  p.detail-title{display:inline-block;text-align:left;margin:6px 0 4px;padding:2px 12px;
    border-radius:10px;background:${t.headerBg};color:${t.headerText};font-size:10px;font-weight:700;letter-spacing:.5px}
  table.detail-table{width:100%;border:1px solid #cbd5e1;table-layout:fixed}
  table.detail-table td{border:1px solid #e2e8f0;padding:4px 7px;vertical-align:top}
  .detail-table .dl{display:block;font-size:9px;color:#64748b;letter-spacing:.3px;text-transform:uppercase}
  .detail-table .dv{display:block;font-size:12px;font-weight:700;color:#111827}
  /* Repeat the column headings on every printed page and never split a row. */
  thead{display:table-header-group}
  tr{page-break-inside:avoid;break-inside:avoid}
  @media print{body{padding:0} tr.total-row td{background:#e2e8f0 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    th{background:${t.headerBg} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    p.detail-title{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`},Wt=(e=[],o=[],r="report",t={})=>{const n=_(o);if(!e.length)return;const i=Me(t,n),l=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">
    <style>${Ue(i,n.length)}
    /* Word reads page setup from @page WordSection1. */
    @page WordSection1{size:${i==="landscape"?"841.9pt 595.3pt":"595.3pt 841.9pt"};margin:1cm}
    div.WordSection1{page:WordSection1}</style></head>
    <body><div class="WordSection1">${_e(e,n,r,t)}</div></body></html>`,a=new Blob(["\uFEFF",l],{type:"application/msword"}),p=URL.createObjectURL(a),d=document.createElement("a");d.href=p,d.download=`${r}.doc`,d.click(),URL.revokeObjectURL(p)},At=()=>`
  html,body{height:100%}
  body{margin:0;padding:0;display:flex;flex-direction:column;background:#525659}
  .toolbar{flex:0 0 auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap;
    padding:8px 14px;background:${be().headerRule};color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.35)}
  .toolbar .title{font-weight:700;font-size:14px;margin-right:auto;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:38%}
  .toolbar button,.toolbar select{font-family:inherit;font-size:13px;border:0;border-radius:6px;
    padding:6px 10px;cursor:pointer;background:#eef2ff;color:#1e1b4b}
  .toolbar button:hover:not(:disabled){background:#fff}
  .toolbar button:disabled{opacity:.4;cursor:default}
  .toolbar .print{background:#facc15;font-weight:700;padding:6px 16px}
  .toolbar .grp{display:flex;align-items:center;gap:6px;padding-left:10px;
    border-left:1px solid rgba(255,255,255,.28)}
  .toolbar .grp>label{font-size:12px;display:flex;align-items:center;gap:5px}
  .toolbar .pill{min-width:86px;text-align:center;font-size:13px;font-weight:600}
  .viewport{flex:1 1 auto;overflow:auto;padding:18px 0 40px}
  #sheets{display:flex;flex-direction:column;align-items:center;gap:18px}
  /* Driven by JS so the orientation switch can resize and re-paginate live. */
  .sheet{width:var(--sheet-w);height:var(--sheet-h);padding:10mm;box-sizing:border-box;
    background:#fff;box-shadow:0 6px 20px rgba(0,0,0,.45);position:relative;overflow:hidden}
  .sheet-foot{position:absolute;left:10mm;right:10mm;bottom:4mm;text-align:right;
    font-size:10px;line-height:14px;color:#475569}
  /* Off-screen copy of one printed page that the script fills to find out
     what fits. It has the print geometry below - no padding, the footer in
     the flow, every margin counted inside it. */
  .sheet.measure{position:absolute;left:-10000px;top:0;visibility:hidden;
    height:auto;padding:0;overflow:visible;box-shadow:none;display:flow-root}
  .sheet.measure .sheet-foot{position:static;margin-top:6px}
  @media print{
    body{display:block;height:auto;background:#fff}
    .toolbar{display:none}
    .viewport{overflow:visible;padding:0}
    #sheets{display:block;zoom:1 !important}
    .sheet{width:auto;height:auto;padding:0;box-shadow:none;overflow:visible;display:flow-root;
      page-break-after:always;break-after:page}
    .sheet:last-child{page-break-after:auto;break-after:auto}
    .sheet-foot{position:static;margin-top:6px}
  }`,Ft=(e,o)=>`<div class="toolbar">
  <span class="title">${S(e)}</span>
  <div class="grp">
    <button id="zoomOut" title="Zoom out">&minus;</button>
    <span class="pill" id="zoomLabel">100%</span>
    <button id="zoomIn" title="Zoom in">+</button>
  </div>
  <div class="grp">
    <label>View
      <select id="view">
        <option value="100">100%</option>
        <option value="width">Fit Width</option>
        <option value="page">Fit Page</option>
      </select>
    </label>
  </div>
  <div class="grp">
    <label>Paper
      <select id="paper">
        <option value="portrait"${o==="portrait"?" selected":""}>A4 Portrait</option>
        <option value="landscape"${o==="landscape"?" selected":""}>A4 Landscape</option>
      </select>
    </label>
  </div>
  <div class="grp">
    <button id="prev">&#8249; Prev</button>
    <span class="pill" id="pageLabel">Page 1 of 1</span>
    <button id="next">Next &#8250;</button>
  </div>
  <div class="grp"><button class="print" id="printBtn">Print</button></div>
</div>`,Ot=`
(function(){
  function boot(){
    var src=document.getElementById('report-source');
    var head=src.content.querySelector('.report-head');
    var table=src.content.querySelector('table.report-table');
    var details=src.content.querySelector('.report-details');
    var summary=src.content.querySelector('table.report-summary');
    var sheets=document.getElementById('sheets');
    var viewport=document.querySelector('.viewport');
    var pageRule=document.getElementById('page-rule');
    var srcRows=table.querySelectorAll('tbody tr');
    var SIZES={portrait:{w:210,h:297},landscape:{w:297,h:210}};

    var sheetEls=[],total=1,page=0,zoom=1;
    var pageLabel=document.getElementById('pageLabel');
    var zoomLabel=document.getElementById('zoomLabel');
    var prev=document.getElementById('prev'),next=document.getElementById('next');

    // Fill one page into el: banner, the detail block on the first page only,
    // the grid with the given rows (none for a summary-only page) and the
    // footer. Used both for the off-screen measuring copy and the real sheets.
    function fillSheet(el,pageNo,indexes,withSummary){
      el.innerHTML='';
      el.appendChild(head.cloneNode(true));
      // A statement's detail block belongs to the first page only; the pages
      // after it carry the company banner and the schedule's own headings.
      if(details&&pageNo===0)el.appendChild(details.cloneNode(true));
      var body=null;
      if(indexes){
        var t=table.cloneNode(false);
        var colgroup=table.querySelector('colgroup');
        if(colgroup)t.appendChild(colgroup.cloneNode(true));
        t.appendChild(table.querySelector('thead').cloneNode(true));
        body=document.createElement('tbody');
        for(var i=0;i<indexes.length;i++){body.appendChild(srcRows[indexes[i]].cloneNode(true));}
        t.appendChild(body);
        el.appendChild(t);
      }
      if(withSummary)el.appendChild(summary.cloneNode(true));
      var foot=document.createElement('div');foot.className='sheet-foot';
      foot.textContent='Page 1 of 1';
      el.appendChild(foot);
      return body;
    }

    function range(from,count){var out=[];for(var i=0;i<count;i++){out.push(from+i);}return out;}

    // Lay the report out on the given paper: resize the sheets, work out what
    // fits on each printed page, then rebuild the pages. Called again whenever
    // the paper changes.
    function layout(orientation){
      var size=SIZES[orientation];
      document.documentElement.style.setProperty('--sheet-w',size.w+'mm');
      document.documentElement.style.setProperty('--sheet-h',size.h+'mm');
      pageRule.textContent='@page{size:A4 '+orientation+';margin:10mm}';
      sheets.innerHTML='';

      // Pages are filled on an off-screen copy of one printed page - A4 less
      // the 10mm margins, footer in the flow - and every page is checked
      // there before it is kept. The old row-height sum left out the
      // banner's bottom margin and the footer line, and Windows display
      // scaling makes rows measure shorter on screen than they print (at
      // 125% a row came out 1.4px short), so pages took too many rows and
      // every printed sheet pushed its last row and footer onto a page of
      // their own. Zooming the copy by 1/devicePixelRatio lays it out one CSS
      // pixel to one device pixel, the way the page prints; RESERVE absorbs
      // what is left of the screen / print difference.
      var MM=96/25.4, RESERVE=4*MM;
      var areaW=(size.w-20)*MM, limit=(size.h-20)*MM-RESERVE;
      var meas=document.createElement('div');
      meas.className='sheet measure';
      meas.style.width=areaW+'px';
      meas.style.zoom=String(1/(window.devicePixelRatio||1));
      document.body.appendChild(meas);
      var scale=meas.getBoundingClientRect().width/areaW||1;
      function measured(){return meas.getBoundingClientRect().height/scale;}

      // Row heights from one pass over the whole grid give each page a first
      // guess; the guess is then corrected against the real page.
      var n=srcRows.length, rowH=[];
      var allBody=fillSheet(meas,1,range(0,n),false);
      for(var r=0;r<n;r++){rowH.push(allBody.rows[r].getBoundingClientRect().height/scale);}
      fillSheet(meas,0,[],false);
      var base0=measured();
      fillSheet(meas,1,[],false);
      var base1=measured();

      var pages=[],start=0;
      while(start<n){
        var pageNo=pages.length,k=0,used=pageNo===0?base0:base1;
        while(start+k<n&&(k===0||used+rowH[start+k]<=limit)){used+=rowH[start+k];k++;}
        var mBody=fillSheet(meas,pageNo,range(start,k),false);
        // Too tall: hand rows on to the next page (a page always keeps one).
        while(k>1&&measured()>limit){mBody.removeChild(mBody.lastElementChild);k--;}
        // Room left: take further rows while they still fit.
        while(start+k<n){
          mBody.appendChild(srcRows[start+k].cloneNode(true));
          if(measured()>limit){mBody.removeChild(mBody.lastElementChild);break;}
          k++;
        }
        pages.push(range(start,k));
        start+=k;
      }
      if(!pages.length)pages.push([]);

      // The Credits / Debits / Balance block belongs under the last page's
      // table; if it no longer fits there it gets a continuation page.
      var lastNo=pages.length-1, summaryPage=false;
      if(summary){
        fillSheet(meas,lastNo,pages[lastNo],true);
        summaryPage=measured()>limit;
      }
      document.body.removeChild(meas);

      var count=pages.length+(summaryPage?1:0);
      pages.forEach(function(indexes,pageNo){
        var sheet=document.createElement('div');sheet.className='sheet';
        fillSheet(sheet,pageNo,indexes,!!summary&&!summaryPage&&pageNo===lastNo);
        sheets.appendChild(sheet);
      });
      if(summaryPage){
        var extra=document.createElement('div');extra.className='sheet';
        fillSheet(extra,count-1,null,true);
        sheets.appendChild(extra);
      }
      var feet=sheets.querySelectorAll('.sheet-foot');
      for(var f=0;f<feet.length;f++){feet[f].textContent='Page '+(f+1)+' of '+feet.length;}

      sheetEls=sheets.querySelectorAll('.sheet');
      total=sheetEls.length;
      page=Math.min(page,total-1);
      sync();
    }

    function applyZoom(){sheets.style.zoom=String(zoom);zoomLabel.textContent=Math.round(zoom*100)+'%';}
    function sync(){pageLabel.textContent='Page '+(page+1)+' of '+total;
      prev.disabled=page<=0;next.disabled=page>=total-1;}
    function go(n){page=Math.max(0,Math.min(total-1,n));
      sheetEls[page].scrollIntoView({behavior:'smooth',block:'start'});sync();}

    document.getElementById('zoomIn').onclick=function(){zoom=Math.min(2.5,zoom+0.1);applyZoom();};
    document.getElementById('zoomOut').onclick=function(){zoom=Math.max(0.3,zoom-0.1);applyZoom();};
    document.getElementById('view').onchange=function(e){
      var box=sheetEls[0].getBoundingClientRect();
      var sheetW=box.width/zoom,sheetH=box.height/zoom;
      if(e.target.value==='width')zoom=(viewport.clientWidth-60)/sheetW;
      else if(e.target.value==='page')zoom=Math.min((viewport.clientWidth-60)/sheetW,(viewport.clientHeight-40)/sheetH);
      else zoom=1;
      applyZoom();
    };
    prev.onclick=function(){go(page-1);};
    next.onclick=function(){go(page+1);};
    document.getElementById('paper').onchange=function(e){
      layout(e.target.value);
      if(sheetEls[page])sheetEls[page].scrollIntoView({block:'start'});
    };
    document.getElementById('printBtn').onclick=function(){window.print();};

    viewport.addEventListener('scroll',function(){
      var top=viewport.getBoundingClientRect().top;
      for(var k=0;k<total;k++){
        if(sheetEls[k].getBoundingClientRect().bottom>top+40){page=k;break;}
      }
      sync();
    });
    window.addEventListener('keydown',function(e){
      if(e.key==='PageDown'||e.key==='ArrowRight'){e.preventDefault();go(page+1);}
      if(e.key==='PageUp'||e.key==='ArrowLeft'){e.preventDefault();go(page-1);}
    });

    layout(document.getElementById('paper').value);
    applyZoom();
  }
  if(document.readyState==='complete')boot();
  else window.addEventListener('load',boot);
})();`,_t=(e,o)=>{var f;const r=document.createElement("div");r.setAttribute("role","dialog"),r.setAttribute("aria-label",o),r.style.cssText="position:fixed;inset:0;z-index:2147483000;background:#525659;display:flex;flex-direction:column;";const t=document.createElement("div");t.style.cssText="flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:6px 12px;background:#1e293b;color:#fff;font:600 13px/1.4 Inter,'Segoe UI',Roboto,Arial,sans-serif;";const n=document.createElement("span");n.textContent=o,n.style.cssText="margin-right:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";const i=document.createElement("button");i.type="button",i.textContent="Close preview",i.style.cssText="border:0;border-radius:6px;padding:6px 14px;cursor:pointer;background:#e2e8f0;color:#0f172a;font:inherit;",t.appendChild(n),t.appendChild(i);const l=document.createElement("iframe");l.title=o,l.style.cssText="flex:1 1 auto;width:100%;border:0;background:#525659;",r.appendChild(t),r.appendChild(l),document.body.appendChild(r);const a=document.body.style.overflow;document.body.style.overflow="hidden";const p=()=>{document.body.style.overflow=a,r.parentNode&&document.body.removeChild(r),document.removeEventListener("keydown",d)},d=u=>{u.key==="Escape"&&p()};i.addEventListener("click",p),document.addEventListener("keydown",d);const c=l.contentDocument;c.open(),c.write(e),c.close(),(f=l.contentWindow)==null||f.focus()},De=(e=[],o=[],r="report",t={})=>{const n=_(o);if(!e.length&&!Oe(t).length)return;const i=Me(t,n),l=ne(r,t),a=`<html><head><meta charset="utf-8"><title>${S(l)}</title>
      <style>${Ue(i,n.length)}${At()}</style>
      <style id="page-rule">@page{size:A4 ${i};margin:10mm}</style></head>
      <body>${Ft(l,i)}
      <div class="viewport"><div id="sheets"></div></div>
      <template id="report-source">${_e(e,n,r,t)}</template>
      <script>${Ot}<\/script></body></html>`;let p=null;try{p=window.open("","","width=1280,height=880")}catch(d){p=null}if(!p){_t(a,l);return}p.document.write(a),p.document.close(),p.focus()},Ut=22,Le=46,Zt=80,Vt=2e3,Yt=new Set(["number","date","dateTime","boolean","actions","singleSelect"]);let ke;const me=new Map,J=(e,o)=>{const r=`${o}|${e}`,t=me.get(r);if(t!==void 0)return t;ke||(ke=document.createElement("canvas"));const n=ke.getContext("2d");n.font=o;const i=n.measureText(e).width;return me.size>5e4&&me.clear(),me.set(r,i),i},qt=e=>!Yt.has(e.type)&&e.align!=="right"&&e.align!=="center"&&!/^(sno|s_no|sNo|id|actions)$/i.test(e.field),Qt=(e,o,r)=>{try{let t=o[e.field];return e.valueGetter&&(t=e.valueGetter(t,o,e,r)),e.valueFormatter&&(t=e.valueFormatter(t,o,e,r)),t==null?"":typeof t=="object"?t instanceof Date?t.toLocaleDateString():"":String(t)}catch(t){return""}},Xt=(e,o)=>String(e).split(`
`).reduce((r,t)=>Math.max(r,J(t,o)),0);function Kt({columns:e,rows:o,containerRef:r,enabled:t=!0,hidden:n={},headerScale:i=.875,apiRef:l}){const{settings:a}=He(),[p,d]=w.useState(0);return w.useLayoutEffect(()=>{const c=r==null?void 0:r.current;if(!t||!c||typeof ResizeObserver=="undefined")return;const f=()=>d(Math.floor(c.clientWidth));f();const u=new ResizeObserver(f);return u.observe(c),()=>u.disconnect()},[r,t]),w.useMemo(()=>{if(!t||!(e!=null&&e.length))return{columns:e,wrap:!1};const c=Number((a==null?void 0:a.fontScale)||1),f=(a==null?void 0:a.tableDensity)==="compact"?.92:(a==null?void 0:a.tableDensity)==="spacious"?1.08:1,u=parseFloat(getComputedStyle(document.documentElement).fontSize)||16,m=getComputedStyle((r==null?void 0:r.current)||document.body).fontFamily||"sans-serif",D=je[a==null?void 0:a.textWeight]||je.normal,R=`${D.regular} ${(.875*c*f*u).toFixed(2)}px ${m}`,b=`${D.semibold} ${(.875*c*f*u).toFixed(2)}px ${m}`,h=`${D.semibold} ${(i*c*f*u).toFixed(2)}px ${m}`,x=(o||[]).slice(0,Vt),T=l==null?void 0:l.current,E=[];e.forEach(g=>{var de,Y,q,ce;if(n[g.field]===!1)return;const $=String((Y=(de=g.headerName)!=null?de:g.field)!=null?Y:""),B=Math.ceil(J($,h)+Le),M=$.split(/\s+/).filter(Boolean).reduce((y,I)=>Math.max(y,J(I,h)),0),Z=Math.ceil(Math.max(M,J($,h)/2+6)+Le-26);let k=0;x.forEach(y=>{const I=y!=null&&y.__isTotal||(y==null?void 0:y.id)==="total"?b:R;if(g.fitLines&&!(y!=null&&y.__isTotal||(y==null?void 0:y.id)==="total")){let O=[];try{O=g.fitLines(y)||[]}catch(G){O=[]}O.forEach(G=>{k=Math.max(k,J(String(G!=null?G:""),I))});return}const pe=Qt(g,y,T);pe&&(k=Math.max(k,Xt(pe,I)))}),k=k?Math.ceil(k+Ut):0;const V=(q=g.width)!=null?q:g.minWidth,ie=qt(g),le=!!g.renderCell||g.type==="actions",A=le?Math.max(k,V||0):k,se=Math.min(Math.max(A,B,48),(ce=g.maxWidth)!=null?ce:1/0),F=le?k?Math.ceil(k*1.08):V||0:A,we=ie?Math.min(F,Math.max(Zt,Math.round(F*.5))):F,Se=Math.min(se,Math.max(we,Z,40));E.push({col:g,need:se,floor:Se,text:k||A,wrappable:ie})});const U=E.reduce((g,$)=>g+$.need,0),P=Math.max(0,p-18),j=new Map;if(!P||U<=P)E.forEach(g=>j.set(g.col.field,g.need));else{const g=E.reduce((z,M)=>z+M.floor,0),$=U-g,B=U-P;E.forEach(z=>{const M=$<=0||B>=$?z.floor:z.need-(z.need-z.floor)*B/$;j.set(z.col.field,M)})}const C=E.some(g=>g.wrappable&&j.get(g.col.field)<g.text-1);return{columns:e.map(g=>{const $=E.find(Z=>Z.col===g);if(!$)return g;const B=j.get(g.field),{width:z,...M}=g;return{...M,flex:Math.max(1,Math.round(B)),minWidth:Math.max(40,Math.floor(Math.min($.floor,B)))}}),wrap:C}},[t,e,o,p,n,i,a==null?void 0:a.fontScale,a==null?void 0:a.tableDensity,a==null?void 0:a.fontFamily,a==null?void 0:a.textWeight])}const Jt=re.download,Ze=re.print,eo=re.scrollLeft,to=re.scrollRight,oo={xs:"min(calc(70 * var(--app-vh)), 460px)",sm:"min(calc(66 * var(--app-vh)), 520px)",md:"min(calc(62 * var(--app-vh)), 560px)",lg:"calc(100 * var(--app-vh) - 260px)",xl:"calc(100 * var(--app-vh) - 280px)"},ao=(e=[],o=[],r={})=>{if(!e.length||!o.length)return e;const t=o.reduce((n,i)=>(n[i]=H(e.reduce((l,a)=>l+Number(a[i]||0),0)),n),{});return[...e,{id:"total",__isTotal:!0,...r,...t}]};function Ve({rows:e=[],columns:o=[],fileName:r="report",buttonLabel:t="Download",reportOptions:n={},className:i}){const[l,a]=w.useState(null),p=e.length>0,d=()=>a(null),c=m=>()=>{d(),p&&m(e,o,r,n)},f=[{key:"excel",label:"Download Excel",ext:".xlsx",run:Pt},{key:"pdf",label:"Download PDF",ext:".pdf",run:Gt},{key:"word",label:"Download Word",ext:".doc",run:Wt},{key:"csv",label:"Download CSV",ext:".csv",run:It},{key:"print",label:"Print",ext:"",run:De}],u=m=>{const D=m==="print"?re.print:Et[m];return s.jsx(D,{fontSize:"small",color:m==="print"?"action":$t[m]})};return s.jsxs(s.Fragment,{children:[s.jsx(Ce,{size:"small",variant:"outlined",startIcon:s.jsx(Jt,{}),onClick:m=>a(m.currentTarget),disabled:!p,children:t}),s.jsx(pt,{anchorEl:l,open:!!l,onClose:d,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},slotProps:{paper:{elevation:4,sx:{mt:.75,minWidth:232,borderRadius:1.5,overflow:"hidden",border:"1px solid",borderColor:"divider"}},list:{sx:{py:.5}}},children:f.map(m=>s.jsxs(ut,{onClick:c(m.run),sx:{minHeight:44,px:1.5,gap:1,"&:hover":{bgcolor:"action.hover"},"&:focus-visible":{bgcolor:"action.selected"}},children:[s.jsx(ht,{sx:{minWidth:32,"& .MuiSvgIcon-root":{fontSize:20}},children:u(m.key)}),s.jsx(mt,{primary:m.label,secondary:m.ext||null,primaryTypographyProps:{fontSize:14,fontWeight:"var(--fw-semibold)",lineHeight:1.3},secondaryTypographyProps:{fontSize:11,color:"text.disabled",lineHeight:1.2}})]},m.key))})]})}function uo({enabled:e=!0}){const o=Mt(e),{primary:r}=Dt();if(!o||!r)return null;const{rows:t=[],columns:n=[],fileName:i="report",reportOptions:l={},onPrint:a}=r;return s.jsxs(s.Fragment,{children:[s.jsx(Ve,{rows:t,columns:n,fileName:i,reportOptions:l}),s.jsx(Ce,{size:"small",variant:"outlined",startIcon:s.jsx(Ze,{}),onClick:()=>a?a():De(t,n,i,l),disabled:!t.length,children:"Print"})]})}function ro(){const e=gt(),[o,r]=w.useState({overflow:!1,atStart:!0,atEnd:!0}),t=w.useCallback(()=>{const i=e.current;if(!(i!=null&&i.getRootDimensions))return;const l=i.getRootDimensions();if(!(l!=null&&l.isReady))return;const a=l.contentSize.width-l.viewportInnerSize.width,p=i.getScrollPosition().left,d={overflow:!!l.hasScrollX&&a>4,atStart:p<=2,atEnd:p>=a-2};r(c=>c.overflow===d.overflow&&c.atStart===d.atStart&&c.atEnd===d.atEnd?c:d)},[e]);if(w.useEffect(()=>{t();const l=["scrollPositionChange","virtualScrollerContentSizeChange","viewportInnerSizeChange","columnsChange","debouncedResize"].map(a=>e.current.subscribeEvent(a,t));return()=>l.forEach(a=>a())},[e,t]),!o.overflow)return null;const n=i=>()=>{const l=e.current,a=l.getRootDimensions(),p=Math.max(240,a.viewportInnerSize.width*.8);l.scroll({left:l.getScrollPosition().left+i*p})};return s.jsxs(X,{direction:"row",spacing:.25,alignItems:"center",sx:{ml:.5},children:[s.jsx(Re,{title:"Scroll columns left",children:s.jsx("span",{children:s.jsx(Te,{size:"small",onClick:n(-1),disabled:o.atStart,children:s.jsx(eo,{fontSize:"small"})})})}),s.jsx(Re,{title:"Scroll columns right",children:s.jsx("span",{children:s.jsx(Te,{size:"small",onClick:n(1),disabled:o.atEnd,children:s.jsx(to,{fontSize:"small"})})})})]})}function no({rows:e,columns:o,fileName:r,showExport:t,reportOptions:n}){return s.jsxs(it,{children:[s.jsx(lt,{}),s.jsx(st,{}),s.jsx(dt,{}),s.jsx(ro,{}),s.jsx(K,{sx:{flex:1}}),s.jsx(ct,{debounceMs:350,placeholder:"Search table..."}),t&&s.jsxs(s.Fragment,{children:[s.jsx(Ve,{rows:e,columns:o,fileName:r,reportOptions:n}),s.jsx(Ce,{size:"small",variant:"outlined",startIcon:s.jsx(Ze,{}),onClick:()=>De(e,o,r,n),disabled:!e.length,children:"Print"})]})]})}const ho=({rows:e=[],columns:o=[],loading:r=!1,getRowId:t=C=>C.id,height:n=oo,minHeight:i=420,title:l,subtitle:a,fileName:p,pageSize:d=25,initialState:c,showExport:f=!0,exportColumns:u,actions:m,period:D,reportMeta:R,totalFields:b,totalLabelCell:h,summary:x,headerExport:T=!0,fitColumns:E=!0,apiRef:U,onColumnVisibilityModelChange:P,...j})=>{const{settings:C}=He(),Ee="var(--table-head-bg)",g="var(--table-head-fg)",$="var(--table-head-bg-hover)",B="var(--table-head-divider)",z=p||l||"finance-export",M=w.useMemo(()=>b!=null&&b.length&&!e.some(W)?ao(e,b,h):e,[e,b,h]),Z=w.useMemo(()=>M.filter(v=>!W(v)).length,[M]),k=w.useMemo(()=>({period:D,meta:R,summary:x}),[D,R,x]),V=u||o,ie=w.useMemo(()=>f&&T?{rows:M,columns:V,fileName:z,reportOptions:k}:null,[f,T,M,V,z,k]),le=Ct(ie,{priority:"table"}),A=w.useRef(null),se=et(),F=U||se,[we,Se]=w.useState(()=>{var v;return j.columnVisibilityModel||((v=c==null?void 0:c.columns)==null?void 0:v.columnVisibilityModel)||{}}),de=j.columnVisibilityModel||we,Y=Kt({columns:o,rows:M,containerRef:A,enabled:E,hidden:de,headerScale:.8125,apiRef:F}),q=E&&Y.wrap&&!j.getRowHeight,[ce,y]=w.useState(null),I=C.tableDensity==="compact"?40:C.tableDensity==="spacious"?54:46,pe=C.tableDensity==="compact"?44:C.tableDensity==="spacious"?58:52,O=Number(C.fontScale||1),G=C.tableDensity==="compact"?.92:C.tableDensity==="spacious"?1.08:1,Ye=w.useMemo(()=>Array.from(new Set([10,25,50,100,200,d])).sort((v,L)=>v-L),[d]),[$e,ze]=w.useState({page:0,pageSize:d}),qe=!!j.autoHeight;return w.useEffect(()=>{ze(v=>({...v,page:0,pageSize:d}))},[d,e.length]),s.jsxs(tt,{ref:A,className:"enterprise-card",elevation:0,sx:{...qe?{minHeight:i}:{height:n,minHeight:i,overflow:"hidden"},width:"100%",display:"flex",flexDirection:"column"},children:[(l||a||m)&&s.jsxs(X,{direction:{xs:"column",sm:"row"},justifyContent:"space-between",alignItems:{xs:"flex-start",sm:"center"},spacing:1.5,sx:{px:2,py:1.5,borderBottom:1,borderColor:"divider",background:"var(--surface-1)"},children:[s.jsxs(K,{sx:{minWidth:0},children:[l&&s.jsx(Q,{variant:"subtitle1",sx:{fontSize:"0.9375rem",lineHeight:1.3,color:"var(--text-heading)"},children:l}),a&&s.jsx(Q,{variant:"caption",color:"text.secondary",sx:{display:"block"},children:a})]}),s.jsxs(X,{direction:"row",spacing:1,flexWrap:"wrap",useFlexGap:!0,alignItems:"center",children:[s.jsx(ot,{size:"small",label:`${Z} records`,variant:"outlined",sx:{color:"text.secondary",borderColor:"divider",fontWeight:"var(--fw-medium)"}}),m]})]}),r?s.jsxs(K,{sx:{flex:1,display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",gap:2},children:[C.loadingStyle==="bar"?s.jsx(K,{sx:{width:"min(420px, 80%)"},children:s.jsx(at,{})}):s.jsx(rt,{}),s.jsx(Q,{color:"text.secondary",children:"Loading data..."})]}):s.jsx(nt,{apiRef:F,rows:M,columns:Y.columns,getRowId:t,getRowClassName:v=>[W(v.row)?"datatable-total-row":"",v.id===ce?"datatable-active-row":""].filter(Boolean).join(" "),onRowClick:v=>y(L=>L===v.id?null:v.id),autosizeOnMount:!E,autosizeOptions:{includeHeaders:!0,includeOutliers:!0,expand:!0},...q&&{getRowHeight:()=>"auto",getEstimatedRowHeight:()=>I},onColumnVisibilityModelChange:(v,L)=>{Se(v),P==null||P(v,L)},showToolbar:!0,slots:{toolbar:no},slotProps:{toolbar:{rows:M,columns:u||o,fileName:z,showExport:f&&!le,reportOptions:k}},rowHeight:I,columnHeaderHeight:pe,scrollbarSize:14,sx:{border:"none",flex:1,backgroundColor:"transparent","& .MuiDataGrid-virtualScroller":{overflowAnchor:"none"},"& .MuiDataGrid-scrollbar":{"&::-webkit-scrollbar":{width:14,height:14},"&::-webkit-scrollbar-track":{backgroundColor:"var(--surface-2)",borderRadius:999},"&::-webkit-scrollbar-thumb":{backgroundColor:"var(--table-line-strong)",border:"3px solid var(--surface-2)",borderRadius:999},"&::-webkit-scrollbar-thumb:hover":{backgroundColor:"var(--text-muted)"}},"& .MuiDataGrid-scrollbar--horizontal":{backgroundColor:"var(--surface-2)"},"& .MuiDataGrid-toolbarContainer":{px:1.5,py:1,gap:1,alignItems:"center",justifyContent:"flex-end",borderBottom:"1px solid",borderColor:"divider",background:"var(--surface-1)"},"& .MuiDataGrid-toolbarContainer .MuiButton-root":{minHeight:32},"& .MuiDataGrid-toolbarContainer .MuiButton-text":{color:"text.secondary",fontWeight:"var(--fw-medium)","&:hover":{color:"text.primary",backgroundColor:"var(--surface-3)"}},"& .MuiDataGrid-toolbarQuickFilter":{minWidth:{xs:"100%",sm:260},maxWidth:{xs:"100%",sm:360},marginLeft:{xs:0,sm:"auto"}},"& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader":{backgroundColor:Ee},"& .MuiDataGrid-columnHeader":{borderRight:"1px solid",borderColor:B},"& .MuiDataGrid-columnHeaderTitle":{fontWeight:"var(--fw-semibold)",color:g,textTransform:"none",fontSize:`${.8125*O*G}rem`,letterSpacing:0,whiteSpace:"normal",lineHeight:1.15,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"},"& .MuiDataGrid-columnHeader .MuiDataGrid-sortIcon, & .MuiDataGrid-columnHeader .MuiDataGrid-filterIcon, & .MuiDataGrid-columnHeader .MuiDataGrid-menuIconButton, & .MuiDataGrid-columnHeader .MuiDataGrid-iconButtonContainer .MuiSvgIcon-root":{color:g},"& .MuiDataGrid-columnHeader:hover":{backgroundColor:$},"& .MuiDataGrid-columnSeparator":{color:B},"& .MuiDataGrid-columnHeader--last":{overflow:"hidden"},"& .MuiDataGrid-columnHeader--last .MuiDataGrid-columnSeparator":{display:"none"},"& .MuiDataGrid-cell":{borderBottom:"1px solid",borderColor:"divider",display:"flex",alignItems:"center",fontSize:`${.875*O*G}rem`},...q&&{"& .MuiDataGrid-row .MuiDataGrid-cell":{whiteSpace:"normal",wordBreak:"break-word",lineHeight:1.35,py:.75}},...C.tableStyle==="striped"&&{"& .MuiDataGrid-row:nth-of-type(even)":{backgroundColor:"color-mix(in srgb, var(--surface-2) 58%, transparent)"}},"& .MuiDataGrid-row.datatable-total-row":{backgroundColor:"var(--surface-3)",borderTop:"1px solid var(--table-line-strong)"},"& .MuiDataGrid-row.datatable-total-row .MuiDataGrid-cell":{fontWeight:"var(--fw-semibold)"},"&& .MuiDataGrid-row:hover":{backgroundColor:"var(--surface-3)",cursor:"pointer"},"& .MuiDataGrid-row.Mui-selected":{backgroundColor:"color-mix(in srgb, var(--brand-primary) 8%, var(--surface-1))"},"& .MuiDataGrid-row.Mui-selected:hover":{backgroundColor:"color-mix(in srgb, var(--brand-primary) 11%, var(--surface-1))"},"& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within":{outline:"2px solid color-mix(in srgb, var(--brand-primary) 34%, transparent)",outlineOffset:"-2px"},"& .MuiDataGrid-footerContainer":{minHeight:48,borderTop:"1px solid",borderColor:"divider",backgroundColor:"var(--surface-1)",justifyContent:"flex-start",px:1.5},"& .MuiDataGrid-footerContainer .MuiTablePagination-root":{width:"100%",borderTop:0},"& .MuiDataGrid-footerContainer .MuiTablePagination-toolbar":{width:"100%",justifyContent:"flex-start",gap:1.5,px:0},"& .MuiDataGrid-footerContainer .MuiTablePagination-spacer":{display:"none"},"& .MuiDataGrid-footerContainer .MuiTablePagination-actions":{marginLeft:"auto"},"& .MuiDataGrid-footerContainer .MuiTablePagination-selectLabel, & .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows":{margin:0,color:"text.secondary",fontWeight:"var(--fw-medium)"},"& .MuiDataGrid-overlayWrapper":{minHeight:260},"& .MuiButtonBase-root":{borderRadius:1.5},"&& .MuiDataGrid-row.datatable-active-row, && .MuiDataGrid-row.datatable-active-row:hover":{backgroundColor:"color-mix(in srgb, var(--brand-primary) 9%, var(--surface-1))",boxShadow:"inset 3px 0 0 0 var(--brand-primary)"},"& .MuiDataGrid-row.datatable-active-row .MuiDataGrid-cell":{fontWeight:"var(--fw-medium)",backgroundColor:"transparent"}},initialState:{density:C.tableDensity==="spacious"?"comfortable":C.tableDensity==="standard"?"standard":"compact",pagination:{paginationModel:$e},...c},paginationModel:$e,onPaginationModelChange:ze,pageSizeOptions:Ye,disableRowSelectionOnClick:!0,keepNonExistentRowsSelected:!1,localeText:{toolbarQuickFilterPlaceholder:"Search table...",noRowsLabel:"No records found",footerTotalRows:"Total rows:"},...j}),!!(x!=null&&x.length)&&s.jsx(X,{direction:"row",justifyContent:"flex-end",sx:{flex:"0 0 auto",px:2.5,py:1.5,borderTop:1,borderColor:"divider",backgroundColor:"var(--surface-2)"},children:s.jsx(K,{sx:{minWidth:260},children:x.map((v,L)=>s.jsxs(X,{direction:"row",justifyContent:"space-between",sx:{py:.35,...L===x.length-1&&{mt:.35,pt:.6,borderTop:"1px solid",borderColor:"text.secondary"}},children:[s.jsxs(Q,{variant:"body2",sx:{fontWeight:"var(--fw-medium)",color:"text.secondary"},children:[v.label," :"]}),s.jsx(Q,{variant:"body2",sx:{fontWeight:"var(--fw-semibold)",fontVariantNumeric:"tabular-nums"},children:Fe(v.value)})]},v.label))})})]})};function io(...e){return ft(bt(e))}const lo=xt.forwardRef(({className:e,align:o="center",sideOffset:r=4,...t},n)=>s.jsx(vt,{children:s.jsx(Ne,{ref:n,align:o,sideOffset:r,className:io("z-50 w-72 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-4 shadow-lg outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",e),...t})}));lo.displayName=Ne.displayName;export{ho as D,uo as H,Ve as T,po as c,Pe as f,W as i,De as p,H as r,Kt as u};
