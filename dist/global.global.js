"use strict";var ReactGrabText=(()=>{var Ht="text",Ot="text",Gt="Text";var te="data-react-grab-text-editing",j="data-react-grab-text-flash",J="data-react-grab-text-ui",F="data-react-grab-ignore",U="data-react-grab-ignore-events",he="data-react-grab-input";var Ut=new Set(["INPUT","TEXTAREA","SELECT","OPTION","IMG","VIDEO","AUDIO","CANVAS","IFRAME","SCRIPT","STYLE","HTML","BODY"]),Vt="deck",X="data-react-grab-deck-ui",ot="react-grab-deck",rt="react-grab-deck-mode",Q=50,Ft=`
--
`,Wt=1600,Kt=5;var it="http://www.w3.org/2000/svg",jt=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Xt={back:"M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657Z",mid:"M5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z",front:"M2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6Z"},Zt={opacity:0,tx:0,ty:3,scale:.94,delayMs:0},lo={back:{collapsed:Zt,expanded:{opacity:.55,tx:.75,ty:-6,scale:.84,delayMs:0}},mid:{collapsed:Zt,expanded:{opacity:.8,tx:.35,ty:-3,scale:.92,delayMs:35}},front:{collapsed:{opacity:1,tx:0,ty:0,scale:1,delayMs:0},expanded:{opacity:1,tx:0,ty:0,scale:1,delayMs:70}}},uo=(e,t,n)=>{let o=jt?"":` ${t.delayMs}ms`;e.style.transition=jt?"none":`opacity 200ms cubic-bezier(0.32, 0.72, 0, 1)${o}, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)${o}`,e.style.transformOrigin=n,e.style.opacity=String(t.opacity),e.style.transform=`translate(${t.tx}px, ${t.ty}px) scale(${t.scale})`},zt=()=>{let e=document.createElementNS(it,"svg");e.setAttribute("width","14"),e.setAttribute("height","14"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","currentColor"),e.setAttribute("aria-hidden","true"),e.style.display="block",e.style.pointerEvents="none",e.style.overflow="visible";let t=Object.keys(Xt).map(i=>{let a=document.createElementNS(it,"g"),s=document.createElementNS(it,"path");return s.setAttribute("d",Xt[i]),a.append(s),e.append(a),{key:i,group:a}}),n=!1,o=!1,r=()=>{let i=n||o;for(let{key:a,group:s}of t){let l=lo[a];uo(s,i?l.expanded:l.collapsed,"12px 16px")}};return r(),{svg:e,setActive:i=>{n=i,i&&(o=!1),r()},setPreview:i=>{n||(o=i,r())}}};var qt="http://www.w3.org/2000/svg",po=()=>{let e=document.createElementNS(qt,"svg");return e.setAttribute("width","14"),e.setAttribute("height","14"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","currentColor"),e.setAttribute("aria-hidden","true"),e.style.display="block",e.style.pointerEvents="none",e},Yt=e=>{let t=po();for(let{d:n,fillRule:o,clipRule:r}of[e].flat()){let i=document.createElementNS(qt,"path");i.setAttribute("d",n),o&&i.setAttribute("fill-rule",o),r&&i.setAttribute("clip-rule",r),t.append(i)}return t};var mo=()=>Yt({d:"M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z"});var Jt=mo;var Qt=()=>Yt({d:"M20.285 6.709a1 1 0 0 1 .006 1.414l-9.2 9.25a1 1 0 0 1-1.435.01L3.71 12.09a1 1 0 0 1 1.414-1.414l5.2 5.2 8.49-8.54a1 1 0 0 1 1.471.373z",fillRule:"evenodd",clipRule:"evenodd"});var at="group contain-layout flex items-center justify-center cursor-pointer interactive-scale a11y-hitbox",st="relative contain-layout flex items-center justify-center shrink-0",en="relative overflow-visible flex items-center shrink-0",tn=4,fo="text-[var(--rg-text-primary)]",go="text-[var(--rg-text-secondary)] group-hover:text-[var(--rg-text-primary)] transition-[color] duration-150 ease-drawer";var ct=e=>{e.setAttribute(F,"true"),e.setAttribute(U,"true")},Z=(e,t)=>{e.setAttribute("class",t?fo:go)};var Ce=(e,t,n,o=!1)=>{let r=document.createElement("div");r.className=st;let i=document.createElement("button");return i.type="button",i.setAttribute(X,e),i.className=at,i.setAttribute("aria-label",t),i.title=t,ct(i),Z(n,o),i.append(n),r.append(i),{wrapper:r,button:i}};var lt="data-react-grab-deck-face",dt="opacity 160ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",ho=e=>({opacity:e?"1":"0",transform:e?"scale(1)":"scale(0.82)"}),nn=()=>{let e=document.createElement("div");e.className=st;let t=document.createElement("button");t.type="button",t.setAttribute(X,"mode-toggle"),t.className=`${at} relative`,t.setAttribute("aria-live","polite"),t.setAttribute("aria-pressed","false"),ct(t);let n=document.createElement("span");Object.assign(n.style,{position:"relative",display:"block",width:"14px",height:"14px",overflow:"visible"});let o=document.createElement("span");o.setAttribute(lt,"stack"),Object.assign(o.style,{position:"absolute",inset:"0",display:"flex",alignItems:"center",justifyContent:"center",transition:dt,pointerEvents:"none",overflow:"visible"});let r=zt(),i=r.svg;o.append(i);let a=document.createElement("span");a.setAttribute(lt,"count"),Object.assign(a.style,{position:"absolute",inset:"0",display:"flex",alignItems:"center",justifyContent:"center",transition:dt,pointerEvents:"none",fontSize:"13px",lineHeight:"14px",letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums"});let s=document.createElement("span");s.setAttribute(lt,"check"),Object.assign(s.style,{position:"absolute",inset:"0",display:"flex",alignItems:"center",justifyContent:"center",transition:dt,pointerEvents:"none"});let l=Qt();s.append(l),n.append(o,a,s),t.append(n),e.append(t);let g=!1,w="stack",E=(u,S=0)=>{w=u,u==="count"&&(a.textContent=String(S));for(let[k,p]of[["stack",o],["count",a],["check",s]])Object.assign(p.style,ho(k===u));Z(i,g&&u==="stack"),Z(l,u==="check"),u!=="stack"&&r.setPreview(!1),u==="count"&&(a.className="text-[var(--rg-text-primary)] font-variant-numeric tabular-nums transition-[color] duration-150 ease-drawer")},x=u=>{g=u,t.setAttribute("aria-pressed",u?"true":"false"),r.setActive(u),u||r.setPreview(!1),w==="stack"&&Z(i,u)},h=()=>{if(w!=="stack"||g){r.setPreview(!1);return}r.setPreview(t.matches(":hover"))};return t.addEventListener("pointerenter",h),t.addEventListener("pointerleave",()=>r.setPreview(!1)),t.addEventListener("focus",h),t.addEventListener("blur",()=>r.setPreview(!1)),E("stack"),{wrapper:e,button:t,setFace:E,setBatchActive:x}};var B=[],ut=new Set,on=!1,bo=e=>typeof e=="object"&&e!==null&&typeof e.id=="string"&&typeof e.content=="string",de=()=>{if(!on){on=!0;try{let e=window.sessionStorage.getItem(ot);if(!e)return;let t=JSON.parse(e);Array.isArray(t)&&(B=t.filter(bo).slice(-Q))}catch{}}},xo=()=>{try{window.sessionStorage.setItem(ot,JSON.stringify(B))}catch{}},Me=()=>{xo();let e=ne();for(let t of ut)t(e);window.dispatchEvent(new CustomEvent("react-grab-deck:change",{detail:{items:e}}))},Eo=()=>typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,ne=()=>(de(),[...B]),rn=e=>{de();let t=e.trim();if(!t)return null;let n={id:Eo(),content:t};return B.length>=Q&&console.warn(`[react-grab-text] deck full (${Q}) \u2014 dropping the oldest grab to queue this one`),B=[...B,n].slice(-Q),Me(),n},be=e=>{de();let t=new Set(e),n=B.filter(o=>!t.has(o.id));n.length!==B.length&&(B=n,Me())},an=(e,t)=>{de();let n=t.trim();if(!n){be([e]);return}let o=B.findIndex(r=>r.id===e);o!==-1&&B[o].content!==n&&(B=B.map(r=>r.id===e?{...r,content:n}:r),Me())},sn=()=>{de(),B.length!==0&&(B=[],Me())},Le=e=>(de(),ut.add(e),e(ne()),()=>{ut.delete(e)});var vo=e=>{let t=e.indexOf("```");if(t===-1)return{comment:null,body:e.trim()};let n=e.slice(0,t).trim()||null,o=e.slice(t+3),r=o.lastIndexOf("```"),i=r===-1?o.trim():o.slice(0,r).replace(/^\n/,"").trim();return{comment:n,body:i}},cn=e=>{let{comment:t,body:n}=vo(e);return{comment:t,body:n.trim()}};var un=3,xe="\u2026",yo=/<([a-z][\w-]*)\b[^>]*>/i,wo=/(?:^|\s)in ([A-Z][\w$.]*)(?= \(at |\]|$)/m,Ao=e=>e.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&amp;/g,"&"),ln=(e,t)=>{let n=e.match(new RegExp(`^${t}:\\n"""\\n([\\s\\S]*?)\\n"""$`,"m"));if(n)return n[1];let o=e.match(new RegExp(`^${t}: "(.*)"$`,"m"));return o?o[1]:null},dn=e=>e.match(/\s+|[\p{L}\p{N}\p{M}'’_-]+|[^\s\p{L}\p{N}\p{M}]/gu)??[],pn=e=>/[\p{L}\p{N}]/u.test(e),Pe=(e,t)=>{let n=t?[...e].reverse():e,o=[],r=0;for(let s of n){if(pn(s)){if(r===un)break;r+=1}o.push(s)}let i=o.length<e.length,a=(t?o.reverse():o).join("");return i?t?`${xe}${a.trimStart()}`:`${a.trimEnd()}${xe}`:a},To=4e4,ko=(e,t)=>{if(e.length*t.length>To)return[{kind:"removed",tokens:e},{kind:"added",tokens:t}];let n=Array.from({length:e.length+1},()=>new Uint16Array(t.length+1));for(let s=e.length-1;s>=0;s-=1)for(let l=t.length-1;l>=0;l-=1)n[s][l]=e[s]===t[l]?n[s+1][l+1]+1:Math.max(n[s+1][l],n[s][l+1]);let o=[],r=(s,l)=>{let g=o[o.length-1];g?.kind===s?g.tokens.push(l):o.push({kind:s,tokens:[l]})},i=0,a=0;for(;i<e.length&&a<t.length;)e[i]===t[a]?(r("same",e[i]),i+=1,a+=1):n[i+1][a]>=n[i][a+1]?(r("removed",e[i]),i+=1):(r("added",t[a]),a+=1);for(;i<e.length;)r("removed",e[i++]);for(;a<t.length;)r("added",t[a++]);return o},So=e=>e.filter(pn).length,Io=(e,t)=>{let n=ko(dn(e),dn(t)),o=[],r=a=>{if(!a)return;let s=o[o.length-1];s?.kind==="same"?s.text+=a:o.push({kind:"same",text:a})},i=(a,s)=>{let l=s.trim();if(!l){a==="added"&&r(s);return}let[,g="",w=""]=s.match(/^(\s*)[\s\S]*?(\s*)$/)??[];r(g);let E=o[o.length-1];!g&&E&&E.kind!=="same"&&r(" "),o.push({kind:a,text:l}),r(w)};for(let[a,s]of n.entries()){if(s.kind!=="same"){i(s.kind,s.tokens.join(""));continue}if(a===0)r(Pe(s.tokens,!0));else if(a===n.length-1)r(Pe(s.tokens,!1));else if(So(s.tokens)>un*2){let l=Pe(s.tokens,!1),g=Pe(s.tokens,!0);r(`${l.slice(0,-xe.length)} ${xe} ${g.slice(xe.length)}`)}else r(s.tokens.join(""))}return o},_o=e=>{let t=e.match(yo);if(!t||t.index===void 0)return{element:null,text:null,component:null};let n=e.slice(t.index),o=n.match(wo),r=o?.index===void 0?n:n.slice(0,o.index),i=Ao(r.replace(/<[^>]*>/g," ").replace(/[\[\]`]/g,"")).replace(/\s+/g," ").trim();return{element:t[1].toLowerCase(),text:i||null,component:o?.[1]??null}},Ro=e=>e.split(`
`).map(t=>t.trim()).find(t=>t&&!/^`{3,}$/.test(t))??"",mn=e=>{let t=_o(e),n={element:t.element,component:t.component},o=ln(e,"BEFORE"),r=ln(e,"AFTER");if(o!==null&&r!==null)return{kind:"text",parts:Io(o,r),...n};let{comment:i,body:a}=cn(e);return i?{kind:"comment",parts:[{kind:"same",text:i}],...n}:t.element?{kind:"grab",parts:[{kind:"same",text:t.text??`<${t.element}>`}],...n}:{kind:"note",parts:[{kind:"same",text:Ro(a)}],...n}},fn={text:"Text edit",comment:"Comment",grab:"Grab",note:"Note"};var Co="[data-react-grab]",Mo=["--rg-panel-bg","--rg-text-primary","--rg-text-primary-85","--rg-text-secondary","--rg-border-subtle","--rg-border-button","--rg-surface-hover","--rg-surface-active","--rg-submit-bg","--rg-submit-fg","--rg-shadow","--rg-error-text"],m={panelBg:"var(--rg-panel-bg, #161616)",text:"var(--rg-text-primary, #ffffff)",text85:"var(--rg-text-primary-85, #ffffffd9)",textMuted:"var(--rg-text-secondary, #a7a7a7)",borderSubtle:"var(--rg-border-subtle, #ffffff1a)",borderButton:"var(--rg-border-button, #ffffff33)",surfaceHover:"var(--rg-surface-hover, #ffffff1a)",surfaceActive:"var(--rg-surface-active, #ffffff26)",submitBg:"var(--rg-submit-bg, #ffffff)",submitFg:"var(--rg-submit-fg, #161616)",shadow:"var(--rg-shadow, 0 2px 8px #00000014)",errorText:"var(--rg-error-text, #f87171)",font:"Geist, ui-sans-serif, system-ui, sans-serif",easeDrawer:"cubic-bezier(0.32, 0.72, 0, 1)",easeSpring:"cubic-bezier(0.34, 1.56, 0.64, 1)"},De=e=>{let t=document.querySelector(Co);if(!t)return;let n=getComputedStyle(t);for(let o of Mo){let r=n.getPropertyValue(o).trim();r&&e.style.setProperty(o,r)}};var pt="data-deck-item-id",gn="react-grab-deck-panel-styles",hn="http://www.w3.org/2000/svg",b=e=>`[${X}="${e}"]`,f=b("panel"),Lo=`
${f} *:not(svg, svg *) { all: revert; }
${f} {
  position: fixed;
  flex-direction: column;
  box-sizing: border-box;
  min-width: min(360px, calc(100vw - 24px));
  max-width: min(400px, calc(100vw - 24px));
  max-height: min(400px, 52vh);
  overflow: hidden;
  border-radius: 14px;
  corner-shape: superellipse(1.25);
  background: ${m.panelBg};
  color: ${m.text};
  box-shadow: ${m.shadow};
  font: 500 13px/16px ${m.font};
  letter-spacing: normal;
  text-align: left;
  -webkit-font-smoothing: antialiased;
  font-synthesis: none;
  z-index: 2147483645;
  animation: react-grab-deck-panel-in 180ms ${m.easeDrawer};
}
@keyframes react-grab-deck-panel-in {
  from { opacity: 0; transform: scale(0.98); }
}
${f} *, ${f} *::before, ${f} *::after { box-sizing: border-box; }
${f} button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
${f} button:focus-visible {
  outline: 1px solid ${m.borderButton};
  outline-offset: 1px;
}

${f} ${b("panel-header")} {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 4px 4px 8px;
}
${f} ${b("panel-title")} { display: flex; align-items: baseline; gap: 4px; min-width: 0; }
${f} ${b("panel-count")} { color: ${m.textMuted}; font-variant-numeric: tabular-nums; }
${f} ${b("clear-all")} {
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  color: ${m.textMuted};
  transition: color 150ms ease-out, background-color 150ms ease-out;
}
${f} ${b("clear-all")}:hover { color: ${m.text}; background: ${m.surfaceHover}; }

${f} ${b("panel-list")} {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-top: 0.5px solid ${m.borderSubtle};
  scrollbar-width: thin;
  scrollbar-color: ${m.borderButton} transparent;
}
${f} ${b("panel-item")} {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 6px 8px 8px;
  transition: background-color 150ms ease-out;
}
${f} ${b("panel-item")} + ${b("panel-item")} { border-top: 0.5px solid ${m.borderSubtle}; }
${f} ${b("panel-item")}:hover,
${f} ${b("panel-item")}:focus-within { background: ${m.surfaceHover}; }
${f} ${b("panel-index")} {
  flex: none;
  min-width: 12px;
  color: ${m.textMuted};
  line-height: 18px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
${f} ${b("panel-summary")} {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  text-align: left;
  cursor: text;
}
${f} ${b("panel-summary")}[hidden] { display: none; }
${f} ${b("panel-summary")}::after {
  content: "";
  position: absolute;
  inset: 0;
}
${f} ${b("panel-summary")}:focus-visible { outline: none; }
${f} ${b("panel-item")}:has(${b("panel-summary")}:focus-visible) {
  box-shadow: inset 0 0 0 1px ${m.borderButton};
}
${f} ${b("panel-summary-text")} {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: ${m.text85};
  font-weight: 400;
  line-height: 18px;
  overflow-wrap: anywhere;
}
${f} ${b("panel-summary-text")}[data-kind="text"] { color: ${m.textMuted}; }
${f} ${b("panel-summary-text")} del {
  color: ${m.textMuted};
  text-decoration: line-through;
  text-decoration-color: ${m.textMuted};
}
${f} ${b("panel-summary-text")} ins {
  color: ${m.text};
  font-weight: 500;
  text-decoration: none;
}
${f} ${b("panel-meta")} {
  overflow: hidden;
  color: ${m.textMuted};
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
${f} ${b("panel-preview")} {
  flex: 1;
  min-width: 0;
  min-height: 18px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: ${m.text};
  font: 400 13px/18px ${m.font};
  resize: none;
  outline: none;
  overflow: hidden;
  overflow-wrap: anywhere;
}
${f} ${b("delete-item")} {
  position: relative;
  z-index: 1;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border-radius: 4px;
  color: ${m.textMuted};
  opacity: 0;
  transition: opacity 150ms ease-out, color 150ms ease-out, background-color 150ms ease-out;
}
${f} ${b("panel-item")}:hover ${b("delete-item")},
${f} ${b("panel-item")}:focus-within ${b("delete-item")} { opacity: 1; }
${f} ${b("delete-item")}:hover { color: ${m.text}; background: ${m.surfaceActive}; }

${f} ${b("panel-footer")} {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 6px 6px 8px;
  border-top: 0.5px solid ${m.borderSubtle};
}
${f} ${b("panel-mode-toggle")} {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  color: ${m.textMuted};
  transition: color 150ms ease-out;
}
${f} ${b("panel-mode-toggle")}:hover,
${f} ${b("panel-mode-toggle")}[aria-pressed="true"] { color: ${m.text}; }
${f} ${b("panel-switch")} {
  position: relative;
  width: 22px;
  height: 12px;
  border-radius: 9999px;
  background: ${m.surfaceActive};
  transition: background-color 200ms ${m.easeDrawer};
}
${f} ${b("panel-switch")}::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${m.textMuted};
  transition: transform 200ms ${m.easeDrawer}, background-color 200ms ${m.easeDrawer};
}
${f} [aria-pressed="true"] ${b("panel-switch")} { background: ${m.text}; }
${f} [aria-pressed="true"] ${b("panel-switch")}::after { transform: translateX(10px); background: ${m.panelBg}; }
${f} ${b("copy-all")} {
  height: 28px;
  padding: 0 12px;
  font-variant-numeric: tabular-nums;
  border-radius: 9999px;
  background: ${m.submitBg};
  color: ${m.submitFg};
  transition: transform 400ms ${m.easeSpring};
}
${f} ${b("copy-all")}:active {
  transform: scale(0.97);
  transition: transform 60ms cubic-bezier(0, 0, 0.2, 1);
}
@media (prefers-reduced-motion: reduce) {
  ${f}, ${f} *, ${f} *::after { transition: none !important; animation: none !important; }
}
`,Po=()=>{if(document.getElementById(gn))return;let e=document.createElement("style");e.id=gn,e.setAttribute(F,"true"),e.textContent=Lo,document.head.appendChild(e)},Be=e=>{e.setAttribute(F,"true"),e.setAttribute(U,"true")},O=(e,t)=>{let n=document.createElement(e);return n.setAttribute(X,t),n},$e=(e,t)=>{let n=O("button",e);return n.type="button",n.title=t,n.setAttribute("aria-label",t),Be(n),n},Do=()=>{let e=document.createElementNS(hn,"svg");e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("width","10"),e.setAttribute("height","10"),e.setAttribute("aria-hidden","true");let t=document.createElementNS(hn,"path");return t.setAttribute("d","M6 6l12 12M18 6L6 18"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","2.5"),t.setAttribute("stroke-linecap","round"),e.append(t),e},$o=()=>{Po();let e=O("div","panel");return Be(e),e.style.display="none",e},bn=e=>{e.style.height="auto",e.style.height=`${e.scrollHeight}px`},mt=(e,t,n)=>{let o=mn(n);e.setAttribute("data-kind",o.kind),e.replaceChildren(...o.parts.map(r=>{if(r.kind==="same")return document.createTextNode(r.text);let i=document.createElement(r.kind==="removed"?"del":"ins");return i.textContent=r.text,i})),t.textContent=[fn[o.kind],o.element?`<${o.element}>`:null,o.component].filter(Boolean).join(" \xB7 ")},xn=e=>{e.addEventListener("mousedown",t=>t.stopPropagation()),e.addEventListener("pointerdown",t=>t.stopPropagation())},Bo=(e,t)=>{let n=e.content,o=null,r=O("article","panel-item");r.setAttribute(pt,e.id);let i=O("span","panel-index");i.setAttribute("data-deck-item-index","true");let a=O("button","panel-summary");a.type="button",a.title="Edit this item",a.setAttribute("aria-expanded","false"),Be(a),xn(a);let s=O("span","panel-summary-text"),l=O("span","panel-meta");a.append(s,l);let g=$e("delete-item","Remove from deck");g.append(Do()),g.setAttribute(pt,e.id),g.addEventListener("click",h=>{h.stopPropagation(),t.onRemoveItem(e.id)});let w=()=>{if(!o)return;let h=o.value;if(o.remove(),o=null,a.hidden=!1,a.setAttribute("aria-expanded","false"),!h.trim()){t.onRemoveItem(e.id);return}n=h.trim(),mt(s,l,n),t.onUpdateItem(e.id,h)},E=()=>{o||(o=O("textarea","panel-preview"),o.value=n,o.rows=1,o.spellcheck=!1,o.setAttribute(pt,e.id),o.setAttribute("aria-label","Deck item"),Be(o),xn(o),o.addEventListener("input",()=>{o&&bn(o)}),o.addEventListener("blur",w),o.addEventListener("keydown",h=>{if(h.stopPropagation(),h.key==="Escape"){h.preventDefault();let u=o;w(),u&&a.focus()}}),a.hidden=!0,a.setAttribute("aria-expanded","true"),a.after(o),bn(o),o.focus({preventScroll:!0}),o.setSelectionRange(0,0),r.scrollIntoView({block:"nearest"}))};a.addEventListener("click",h=>{h.stopPropagation(),E()}),r.append(i,a,g);let x=h=>{o||h===n||(n=h,mt(s,l,n))};return mt(s,l,n),{row:r,setIndex:h=>{i.textContent=String(h+1)},setContent:x,field:()=>o}},En=()=>{let e=$o(),t=O("div","panel-header"),n=O("div","panel-title"),o=document.createElement("span");o.textContent="Deck";let r=O("span","panel-count");n.append(o,r);let i=$e("clear-all","Clear all deck items");i.textContent="Clear",t.append(n,i);let a=O("div","panel-list"),s=O("div","panel-footer"),l=$e("panel-mode-toggle","Turn batch mode off"),g=document.createElement("span");g.textContent="Batch";let w=O("span","panel-switch");w.setAttribute("aria-hidden","true"),l.append(g,w);let E=$e("copy-all","Copy all deck items");E.textContent="Copy all",s.append(l,E),e.append(t,a,s);let x=null;l.addEventListener("click",p=>{p.stopPropagation(),x?.onToggleMode()}),i.addEventListener("click",p=>{p.stopPropagation(),x?.onClearAll()}),E.addEventListener("click",p=>{p.stopPropagation(),x?.onCopyAll()});let h=new Map,u=p=>{l.title=p?"Batch mode on: grabs queue in the deck":"Batch mode off: grabs copy to the clipboard only",l.setAttribute("aria-label",p?"Turn batch mode off":"Turn batch mode on"),l.setAttribute("aria-pressed",String(p))};return u(!0),{panel:e,hasFocusedField:()=>a.contains(document.activeElement)&&document.activeElement instanceof HTMLTextAreaElement&&document.activeElement.matches(`textarea${b("panel-preview")}`),setBatchActive:u,sync:(p,A)=>{if(p.length===0){a.replaceChildren(),h.clear();return}x=A,De(e);let v=p.length===1?"item":"items";r.textContent=`${p.length} ${v}`,E.textContent=`Copy ${p.length} ${v}`,E.setAttribute("aria-label",`Copy all ${p.length} deck ${v}`),E.title=`Copy all ${p.length} deck ${v}`;let C=new Set(p.map(M=>M.id));for(let[M,c]of h)C.has(M)||c.field()===document.activeElement||(c.row.remove(),h.delete(M));let I=[];for(let[M,c]of p.entries()){let _=h.get(c.id);_?_.setContent(c.content):(_=Bo(c,A),h.set(c.id,_)),_.setIndex(M),I.push(_.row)}for(let[M,c]of I.entries())a.children[M]!==c&&a.insertBefore(c,a.children[M]??null);for(;a.children.length>I.length;)a.lastElementChild?.remove();e.style.display="flex"}}};var oe="batch",ft=new Set,vn=!1,No=e=>e==="single"||e==="batch",gt=()=>{if(!vn){vn=!0;try{let e=window.sessionStorage.getItem(rt);No(e)&&(oe=e)}catch{}}},Ho=()=>{try{window.sessionStorage.setItem(rt,oe)}catch{}},Oo=()=>{Ho();for(let e of ft)e(oe)},yn=()=>(gt(),oe),ht=()=>yn()==="batch",Go=e=>{gt(),oe!==e&&(oe=e,Oo())},bt=()=>(Go(ht()?"single":"batch"),yn()),wn=e=>(gt(),ft.add(e),e(oe),()=>{ft.delete(e)});var Ne=16,Et=8,An=12,Ee=28,Tn=125,Vo="http://www.w3.org/2000/svg",Fo="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289C17.3166 8.90237 16.6834 8.90237 16.2929 9.29289L11 14.5858L8.70711 12.2929C8.31658 11.9024 7.68342 11.9024 7.29289 12.2929C6.90237 12.6834 6.90237 13.3166 7.29289 13.7071L10.2929 16.7071C10.6834 17.0976 11.3166 17.0976 11.7071 16.7071L17.7071 10.7071Z",ue=(e,t)=>{let n=document.createElementNS(Vo,e);for(let[o,r]of Object.entries(t))n.setAttribute(o,r);return n},xt=(e,t)=>{let n=ue("svg",{viewBox:"0 0 24 24",width:"14",height:"14","aria-hidden":"true"});if(n.style.flexShrink="0",n.style.color=t,e==="check")return n.append(ue("path",{fill:"currentColor","fill-rule":"evenodd","clip-rule":"evenodd",d:Fo})),n;n.append(ue("circle",{cx:"12",cy:"12",r:"10",fill:"currentColor"}));let o=e==="minus"?"M8 12h8":"M9 9l6 6M15 9l-6 6";return n.append(ue("path",{d:o,fill:"none",stroke:m.panelBg,"stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"})),n},Wo=()=>{let e=ue("svg",{width:String(Ne),height:String(Et),viewBox:`0 0 ${Ne} ${Et}`,"aria-hidden":"true"});return e.append(ue("path",{fill:m.panelBg,d:"M0 8 L7.2929 0.7071 A1 1 0 0 1 8.7071 0.7071 L16 8 Z"})),Object.assign(e.style,{position:"absolute",display:"block"}),e},He=()=>{let e=document.createElement("div");e.setAttribute(F,"true"),e.setAttribute(U,"true"),e.setAttribute(J,"true"),e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),De(e),Object.assign(e.style,{position:"fixed",pointerEvents:"none",top:"0",left:"0",zIndex:String(2147483646),fontFamily:m.font,fontSize:"13px",WebkitFontSmoothing:"antialiased",userSelect:"none",filter:`drop-shadow(${m.shadow})`,visibility:"hidden",opacity:"0",transition:`opacity ${Tn}ms ease-out`});let t=Wo(),n=document.createElement("div");Object.assign(n.style,{display:"flex",alignItems:"center",gap:"4px",boxSizing:"border-box",height:`${Ee}px`,padding:"6px 10px 6px 8px",borderRadius:"9999px",background:m.panelBg,whiteSpace:"nowrap"}),e.append(t,n),document.body.appendChild(e);let o=(r,i)=>{let a=document.createElement("span");a.textContent=i,Object.assign(a.style,{color:m.text,fontSize:"13px",lineHeight:"16px",fontWeight:"500"}),n.replaceChildren(r,a)};return{showCopied:(r="Copied")=>{o(xt("check",m.text85),r)},showNoChange:()=>{o(xt("minus",m.textMuted),"No text change")},showError:r=>{o(xt("cross",m.errorText),r)},reposition:r=>{let i=e.getBoundingClientRect().width,a=8,s=r.left+r.width/2,l=r.bottom+An,g=l+Ee<=window.innerHeight-a;g||(l=r.top-An-Ee),l=Math.max(l,a);let w=window.innerWidth-i-a,E=Math.min(Math.max(s-i/2,a),w),x=Ee/2+Ne/2,h=Math.min(Math.max(s-E,x),i-x);Object.assign(t.style,{left:`${h-Ne/2}px`,top:g?`${1-Et}px`:`${Ee-1}px`,transform:g?"none":"rotate(180deg)"}),e.style.top=`${l}px`,e.style.left=`${E}px`,e.style.visibility="visible",requestAnimationFrame(()=>{e.style.opacity="1"})},destroy:()=>{e.style.opacity="0",window.setTimeout(()=>e.remove(),Tn)}}};var Oe=e=>{let t=null,n=null,o=()=>{if(!t||!n)return;let i=getComputedStyle(t);e.style.flexDirection=getComputedStyle(n).flexDirection,e.style.marginRight=i.marginRight,e.style.marginBottom=i.marginBottom},r=new MutationObserver(o);return{attach:i=>{i===t&&i.parentElement===n||(r.disconnect(),t=i,n=i.parentElement,r.observe(i,{attributes:!0,attributeFilter:["class","style"]}),n&&r.observe(n,{attributes:!0,attributeFilter:["class","style"]}),o())},destroy:()=>r.disconnect()}};var ve=e=>{let t=e.closest("[data-react-grab-toolbar-panel]");if(!t)return"bottom";let n=t.getBoundingClientRect();return getComputedStyle(t).flexDirection==="column"?n.left+n.width/2<window.innerWidth/2?"left":"right":n.top+n.height/2<window.innerHeight/2?"top":"bottom"};var kn="[data-react-grab]",Ko='[data-react-grab-toolbar-action="text"]',jo=500,Xo=20,Sn=e=>e?e.parentElement??e:null,In=e=>{let t=0,n=!1,o=!1,r="idle",i,a=null,s=document.createElement("div");s.setAttribute(X,"controls"),s.className=en,Object.assign(s.style,{gap:`${tn}px`});let l=Oe(s),g=nn(),w=g.button,E=Ce("panel-toggle","Review deck items",Jt(),!1),x=E.button;x.setAttribute("aria-expanded","false"),E.wrapper.style.display="none";let h=En(),u=h.panel;s.append(g.wrapper,E.wrapper);let S=()=>r==="flash"?"check":t>0?"count":"stack",k=()=>{let y=x.getBoundingClientRect(),K=u.offsetHeight||240,H=10,D=ve(x);if(D==="left"||D==="right"){let ce=x.closest("[data-react-grab-toolbar-panel]").getBoundingClientRect(),le=u.offsetWidth||420,ge=D==="left"?ce.right+H:ce.left-H-le;u.style.left=`${Math.max(12,Math.min(ge,window.innerWidth-le-12))}px`,u.style.top=`${Math.max(12,Math.min(y.top,window.innerHeight-Math.min(K,360)-12))}px`,u.style.right="auto",u.style.bottom="auto",u.style.maxHeight=`${Math.min(360,window.innerHeight-24)}px`;return}let z=y.top-H,se=z>=Math.min(K,200)||z>window.innerHeight-y.bottom;se?(u.style.top="auto",u.style.bottom=`${window.innerHeight-y.top+H}px`):(u.style.bottom="auto",u.style.top=`${y.bottom+H}px`);let Y=u.offsetWidth||420,fe=y.right-Y;fe=Math.max(12,Math.min(fe,window.innerWidth-Y-12)),u.style.left=`${fe}px`,u.style.right="auto",u.style.maxHeight=se?`${Math.max(160,Math.min(360,z-8))}px`:`${Math.max(160,Math.min(360,window.innerHeight-y.bottom-H-12))}px`},p=()=>{if(o&&t>0){u.isConnected||document.body.append(u),u.style.display="flex",k(),x.setAttribute("aria-expanded","true");return}let d=document.activeElement;d instanceof HTMLElement&&u.contains(d)&&d.blur(),u.style.display="none",x.setAttribute("aria-expanded","false"),u.isConnected&&u.remove()},A=()=>r==="flash"?"Deck copied to clipboard":r==="copying"?`Copying ${t} deck items`:t>0?t>=Q?`Copy all ${t} deck items \u2014 deck full (${Q})`:`Copy all ${t} deck items`:n?"Batch mode on \u2014 grabs queue in the deck":"Batch mode off \u2014 grabs copy to clipboard only",v=()=>{g.setBatchActive(n),h.setBatchActive(n),g.setFace(S(),t);let d=A();w.title=d,w.setAttribute("aria-label",d)},C=()=>{let d=t>0;E.wrapper.style.display=d?"":"none",d||(o=!1);let y=x.querySelector("svg");y&&Z(y,o),x.title=o?"Close deck panel":"Review deck items",x.setAttribute("aria-label",o?"Close deck panel":"Review deck items")},I=d=>{let y=He();y.showCopied(`Copied ${d} ${d===1?"item":"items"}`),requestAnimationFrame(()=>y.reposition(w.getBoundingClientRect())),window.setTimeout(()=>y.destroy(),1600)},M=()=>{if(r!=="idle"||t===0)return;let d=t;o=!1,P("copying"),e().then(y=>{y&&(I(d),ne().length===0&&P("flash"))}).catch(()=>{}).finally(()=>{r==="copying"&&P("idle")})},c={onCopyAll:M,onClearAll:()=>{sn()},onRemoveItem:d=>{be([d])},onUpdateItem:(d,y)=>{an(d,y)},onToggleMode:()=>{bt()}},_=d=>{if(d.length===0){h.sync([],c),o=!1,p();return}h.sync(d,c),p(),o&&k()},T=(d=ne())=>{v(),C(),_(d)},R=()=>{o&&(o=!1,T())},ie=d=>{if(!o)return;let y=d.composedPath();y.includes(u)||y.includes(s)||R()};window.addEventListener("pointerdown",ie,!0);let P=d=>{if(r!==d){if(i!==void 0&&(window.clearTimeout(i),i=void 0),r=d,d==="flash"){v(),i=window.setTimeout(()=>{i=void 0,r="idle",T()},Wt);return}T()}},N=d=>{a&&(a.peak=Math.max(a.peak,Math.hypot(d.clientX-a.x,d.clientY-a.y)))},G=()=>{window.removeEventListener("pointermove",N),window.removeEventListener("pointerup",G),window.removeEventListener("pointercancel",G)};w.addEventListener("pointerdown",d=>{a={x:d.clientX,y:d.clientY,peak:0},window.addEventListener("pointermove",N),window.addEventListener("pointerup",G),window.addEventListener("pointercancel",G)}),w.addEventListener("click",()=>{let d=a!==null&&a.peak>Kt;if(a=null,!(d||r!=="idle")){if(t>0){M();return}bt()}}),x.addEventListener("click",()=>{t!==0&&(o=!o,T())});let V=()=>{o&&k()};window.addEventListener("resize",V),window.addEventListener("scroll",V,!0);let q=null,ee=0,ae=()=>{ee+=1,ee===Xo&&console.warn("[react-grab-text] deck UI found no toolbar anchor after 10s \u2014 host toolbar markup may have changed");let d=document.querySelector(kn)?.shadowRoot?.querySelector(kn),y=d?.querySelectorAll("[data-react-grab-toolbar-action]"),K=d?.querySelector(Ko),H=y?.length?y[y.length-1]:null,D=Sn(K)??Sn(H);if(!D?.parentElement)return;l.attach(D);let z=d?.querySelector(`[${X}="controls"]`);z&&z!==s&&z.remove(),s.isConnected&&s.previousElementSibling===D&&s.parentElement===D.parentElement||(s.isConnected&&s.remove(),D.insertAdjacentElement("afterend",s));let Y=ve(x);Y!==q&&(q=Y,o&&k()),ee=0};ae();let Ze=window.setInterval(ae,jo),ze=Le(d=>{t=d.length,t===0&&(o=!1),t>0&&r==="flash"?P("idle"):T(d)}),W=wn(d=>{n=d==="batch",T()});return{update:d=>{t=d,t===0&&(o=!1),t>0&&r==="flash"?P("idle"):T()},destroy:()=>{window.clearInterval(Ze),l.destroy(),window.removeEventListener("resize",V),window.removeEventListener("scroll",V,!0),window.removeEventListener("pointerdown",ie,!0),i!==void 0&&window.clearTimeout(i),G(),ze(),W(),u.remove(),s.remove()}}};var Ue=e=>ht()?rn(e):null;var _n=e=>e.map((t,n)=>`${n+1}.
${t.content}`).join(Ft);var Ve=async e=>{if(navigator.clipboard&&window.isSecureContext)try{return await navigator.clipboard.writeText(e),!0}catch{}let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.setAttribute(F,"true"),t.setAttribute(U,"true"),t.setAttribute(J,"true"),t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.opacity="0";let n=document.activeElement,o=window.getSelection(),r=o&&o.rangeCount>0?o.getRangeAt(0).cloneRange():null;document.body.appendChild(t),t.select();let i=!1;try{i=document.execCommand("copy")}catch{i=!1}return t.remove(),n instanceof HTMLElement&&n.isConnected&&n.focus({preventScroll:!0}),r&&o&&(o.removeAllRanges(),o.addRange(r)),i};var Zo=e=>{let t=e.match(/`+/g)?.reduce((o,r)=>Math.max(o,r.length),0)??0,n="`".repeat(Math.max(3,t+1));return n+`
`+e+`
`+n},zo=async()=>{let e=ne(),t=_n(e),n=e.length>0&&await Ve(t);n&&be(e.map(r=>r.id));let o={itemCount:e.length,output:t,didCopy:n};return window.dispatchEvent(new CustomEvent("react-grab-deck:copy",{detail:o})),o},Rn=()=>({name:Vt,hooks:{transformCopyContent:Zo,onCopySuccess:(e,t)=>{Ue(t)}},setup:()=>{let e=In(async()=>(await zo()).didCopy),t=Le(n=>e.update(n.length));return{cleanup:()=>{t(),e.destroy()}}}});var Cn=e=>{if(!e.includes("%"))return e;try{return decodeURIComponent(e)}catch{return e}};var qo=(e,t)=>{let n=[t];if(e.componentName&&n.push(`in ${e.componentName}`),e.filePath){let o=e.lineNumber?`:${e.lineNumber}`:"";n.push(`(at ${Cn(e.filePath)}${o})`)}return`[${n.join(" ")}]`},Mn=(e,t,n)=>{let o=n?t:t.trim();return o.includes(`
`)?`${e}:
"""
${o}
"""`:`${e}: "${o}"`},Ln=({source:e,elementPreview:t,before:n,after:o,textTransform:r,preserveWhitespace:i})=>[["Edit this text in the source: make the rendered text read as AFTER instead of BEFORE. Preserve surrounding markup, interpolations, and formatting.",!!r&&r!=="none"?` NOTE: this element renders with CSS text-transform: ${r}; BEFORE/AFTER are shown as rendered \u2014 keep the source string's original casing.`:""].join(""),"",qo(e,t),Mn("BEFORE",n,i),Mn("AFTER",o,i)].join(`
`);var er=new Set(["contenteditable","spellcheck",te,j,he]),tr=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;"),nr=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Pn=(e,t)=>{let n=Array.from(e);return n.length<=t?e:`${n.slice(0,t-1).join("")}\u2026`},Dn=(e,t)=>{let n=e.tagName.toLowerCase(),o=[];for(let s of Array.from(e.attributes)){if(o.length>=4)break;if(er.has(s.name))continue;let l=Pn(s.value,40);o.push(`${s.name}="${tr(l)}"`)}let r=o.length>0?` ${o.join(" ")}`:"",i=t.trim().split(`
`)[0]??"",a=nr(Pn(i,60));return`<${n}${r}>${a}</${n}>`};var $n=(e,t)=>{if(typeof document.caretPositionFromPoint=="function"){let n=document.caretPositionFromPoint(e,t);if(!n)return null;try{let o=document.createRange();return o.setStart(n.offsetNode,n.offset),o.collapse(!0),o}catch{return null}}return typeof document.caretRangeFromPoint=="function"?document.caretRangeFromPoint(e,t):null};var Bn="react-grab-text-styles",Nn=()=>{if(document.getElementById(Bn))return;let e=document.createElement("style");e.id=Bn,e.setAttribute(F,"true"),e.setAttribute(J,"true"),e.textContent=`
[${te}] {
  outline: 1.5px solid #a855f7 !important;
  outline-offset: 2px !important;
  cursor: text !important;
}
[${j}] {
  outline: 1.5px solid #22c55e !important;
  outline-offset: 2px !important;
  transition: outline-color 0.9s ease 0.5s;
}
[${j}="fading"] {
  outline-color: transparent !important;
}
`,document.head.appendChild(e)};var Fe=null,re=null,We=0,Ke=!1,we=()=>Fe,or=(e,t)=>{let n=window.getSelection();if(!n)return;if(t){let r=$n(t.x,t.y);if(r&&e.contains(r.startContainer)){n.removeAllRanges(),n.addRange(r);return}}let o=document.createRange();o.selectNodeContents(e),o.collapse(!1),n.removeAllRanges(),n.addRange(o)},rr=e=>{let t=window.getSelection();!t||!t.anchorNode||e.contains(t.anchorNode)&&t.removeAllRanges()},ye=new WeakMap,Hn=e=>{let t=ye.get(e);t&&(cancelAnimationFrame(t.frame),window.clearTimeout(t.timeout),ye.delete(e))},ir=e=>{Hn(e),e.setAttribute(j,"true");let t=requestAnimationFrame(()=>{let o=requestAnimationFrame(()=>{e.setAttribute(j,"fading")}),r=ye.get(e);r&&(r.frame=o)}),n=window.setTimeout(()=>{e.removeAttribute(j),ye.delete(e)},1600);ye.set(e,{frame:t,timeout:n})},ar=e=>e.key==="Enter"||e.code==="Enter"||e.code==="NumpadEnter",sr=(e,t)=>{let n=e;return t?.().then(o=>{n=o}).catch(()=>{}),()=>n},On=e=>{let t=re;if(!t)return!1;let n=e.composedPath()[0]??e.target;return n instanceof Node&&t.element.contains(n)},Gn=e=>{let t=re;if(!t||e.isComposing||e.keyCode===229)return;let n=On(e);if(e.key==="Escape"){n?(e.preventDefault(),e.stopImmediatePropagation(),t.cancel()):t.commit();return}if(n){if(ar(e)&&!e.shiftKey){e.preventDefault(),e.stopImmediatePropagation(),t.commit();return}if(e.key==="Tab"){e.preventDefault(),e.stopImmediatePropagation(),t.commit();return}e.stopImmediatePropagation()}},je=e=>{On(e)&&e.stopImmediatePropagation()},Un=e=>{let t=re;if(!t)return;let n=e.composedPath()[0]??e.target;n instanceof Node&&(t.element.contains(n)||t.commit())},Vn=()=>{window.addEventListener("keydown",Gn,{capture:!0}),window.addEventListener("keyup",je,{capture:!0}),window.addEventListener("keypress",je,{capture:!0}),window.addEventListener("pointerdown",Un,{capture:!0})},cr=()=>{window.removeEventListener("keydown",Gn,{capture:!0}),window.removeEventListener("keyup",je,{capture:!0}),window.removeEventListener("keypress",je,{capture:!0}),window.removeEventListener("pointerdown",Un,{capture:!0})},Fn=()=>{We+=1,Ke=!1,Vn();let e=!1;return()=>{e||(e=!0,We-=1,We===0&&!Ke&&cr())}},lr=()=>{We>0||Ke||(Ke=!0,Vn())},Wn=e=>{Fe?.commit({quiet:!0}),lr();let{element:t,source:n,resolveSource:o,caretPoint:r,onFinish:i}=e;Nn(),Hn(t),t.removeAttribute(j);let a=t.innerHTML,s=t.innerText,l=Dn(t,s),g=getComputedStyle(t),w=g.textTransform,E=g.whiteSpace.startsWith("pre"),x=sr(n,o),h=t.getAttribute("contenteditable"),u=t.hasAttribute(U),S=document.activeElement,k=t.getBoundingClientRect(),p=!0,A=_=>{if(t.getAttribute("contenteditable")!=="true")return;_.preventDefault();let T=_.clipboardData?.getData("text/plain");T&&document.execCommand("insertText",!1,T)};t.setAttribute("contenteditable","plaintext-only"),t.isContentEditable||t.setAttribute("contenteditable","true"),t.setAttribute(te,"true"),t.setAttribute(he,"true"),t.setAttribute(U,"true"),t.addEventListener("paste",A),t.focus({preventScroll:!0}),or(t,r);let v=_=>{let T=He();_(T),T.reposition(t.isConnected?t.getBoundingClientRect():k),window.setTimeout(()=>{T.destroy()},1600)},C=()=>{p=!1,Fe=null,re=null,t.removeEventListener("paste",A),t.removeAttribute(te),t.removeAttribute(he),u||t.removeAttribute(U),h===null?t.removeAttribute("contenteditable"):t.setAttribute("contenteditable",h),rr(t),t.blur(),S instanceof HTMLElement&&S.isConnected&&S!==document.body&&S.focus({preventScroll:!0})},I=()=>{p&&(C(),t.isConnected&&(t.innerHTML=a),i?.(null))},M=async _=>{if(!p)return null;let T=!!_?.quiet,R=t.innerText;if(C(),E?R===s:R.trim()===s.trim()){let V=t.isConnected&&t.innerHTML!==a;return V&&(t.innerHTML=a),!T&&(V||R!==s)&&v(q=>q.showNoChange()),i?.(null),null}let P=Ln({source:x(),elementPreview:l,before:s,after:R,textTransform:w,preserveWhitespace:E});t.isConnected&&ir(t);let N=await Ve(P);N&&Ue(P),T||v(V=>{N?V.showCopied():V.showError("Copy failed")});let G={before:s,after:R,payload:P,didCopy:N};return window.dispatchEvent(new CustomEvent("react-grab-text:edit",{detail:G})),i?.(G),G},c={commit:M,cancel:I,isActive:()=>p};return re&&re.commit({quiet:!0}),Fe=c,re={element:t,commit:M,cancel:I},c};var yt=e=>!(e instanceof HTMLElement)||Ut.has(e.tagName)||e.closest(`svg, [${J}]`)||e.querySelector("input, textarea, select, iframe, canvas, video, audio")?!1:e.innerText.trim().length>0;var pe=null,Xe=0,dr=e=>e.composedPath().some(t=>t instanceof Element&&t.getAttributeNames().some(n=>n.startsWith("data-react-grab"))),Kn=e=>{dr(e)||(pe={x:e.clientX,y:e.clientY,recordedAt:Date.now()})},jn=()=>{Xe+=1,Xe===1&&window.addEventListener("pointerdown",Kn,{capture:!0,passive:!0});let e=!1;return()=>{e||(e=!0,Xe-=1,Xe===0&&(window.removeEventListener("pointerdown",Kn,{capture:!0}),pe=null))}},Xn=()=>!pe||Date.now()-pe.recordedAt>1e4?null:{x:pe.x,y:pe.y};var pr=e=>({filePath:e.filePath,lineNumber:e.lineNumber,componentName:e.componentName,tagName:e.tagName}),mr=(e,t,n)=>async()=>{if(!e||n.filePath&&n.componentName)return n;let o=await e.getSource(t).catch(()=>null);return{filePath:n.filePath??o?.filePath,lineNumber:n.lineNumber??o?.lineNumber??void 0,componentName:n.componentName??o?.componentName??e.getDisplayName(t)??void 0,tagName:n.tagName}},Zn=()=>{let e=null,t=null,n=()=>{let r=t;return t=null,r&&Date.now()-r.recordedAt<=1e4?{x:r.x-window.scrollX,y:r.y-window.scrollY}:Xn()??void 0};return{name:Ht,hooks:{onDragStart:(r,i)=>{t={x:r,y:i,recordedAt:Date.now()}},onStateChange:r=>{r.isActive?we()?.commit():t=null}},setup:r=>{e=r;let i=jn(),a=Fn();return{cleanup:()=>{we()?.commit({quiet:!0}),e=null,t=null,i(),a()}}},actions:[{id:Ot,label:Gt,shortcut:"T",shortcutModifier:!1,showInToolbarMenu:!0,enabled:r=>r.elements.length<=1&&yt(r.element),onAction:r=>{let{element:i}=r;if(!yt(i))return;let a=pr(r);r.hideContextMenu();let s=n();e?.deactivate(),Wn({element:i,source:a,resolveSource:mr(e,i,a),caretPoint:s})}}]}};var zn=(e,t,n,o)=>t<=n?[[t,n]]:o<=e?[[o,e]]:[[Math.min(e,n),Math.max(e,n)],[Math.min(t,o),Math.max(t,o)]],qn=(e,t)=>{let n=[],o=(e.top+e.bottom)/2,r=(e.left+e.right)/2;for(let[i,a]of zn(e.left,e.right,t.left,t.right))i===void 0||a===void 0||i===a||n.push({x1:i,y1:o,x2:a,y2:o,value:a-i});for(let[i,a]of zn(e.top,e.bottom,t.top,t.bottom))i===void 0||a===void 0||i===a||n.push({x1:r,y1:i,x2:r,y2:a,value:a-i});return n},me=e=>String(Math.round(e*10)/10);var Tt="http://www.w3.org/2000/svg",L=8,At=22,Yn="negative-margin",Ae=(e,t)=>{let n=document.createElementNS(Tt,e);for(let[o,r]of Object.entries(t))n.setAttribute(o,String(r));return n},Jn=e=>{let t=document.createElement("div");t.setAttribute("data-react-grab-measure","overlay"),t.setAttribute("data-react-grab-ignore","true"),t.style.cssText=`all:initial;position:fixed;inset:0;pointer-events:none;z-index:${2147483646};`;let n=t.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=`
    :host { --measure-ink: #7c3aed; --measure-anchor: #2563eb; }
    svg { position:fixed; inset:0; width:100%; height:100%; overflow:hidden; }
    .details, .hint { position:fixed; box-sizing:border-box; margin:0; color:#fafafa;
      background:#202024; border:1px solid #414147; border-radius:6px;
      box-shadow:0 2px 8px #0002; font:12px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      font-variant-numeric:tabular-nums; -webkit-font-smoothing:antialiased; }
    .details { padding:6px 9px; max-width:calc(100vw - 16px); white-space:pre-wrap; }
    .hint { width:max-content; padding:5px 10px;
      max-width:calc(100vw - 16px); text-align:center; }
    text { font:11px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      font-variant-numeric:tabular-nums; fill:white; }
  `;let r=document.createElementNS(Tt,"svg");r.setAttribute("aria-hidden","true");let i=Ae("pattern",{id:Yn,width:6,height:6,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"});i.append(Ae("rect",{width:6,height:6,fill:"#f59e0b26"}),Ae("line",{x1:0,y1:0,x2:0,y2:6,stroke:"#f59e0b","stroke-width":2,"stroke-opacity":.5}));let a=Ae("defs",{});a.append(i),r.append(a);let s=document.createElement("div");s.className="details",s.setAttribute("data-measure-details","");let l=document.createElement("div");l.className="hint",l.setAttribute("data-measure-hint",""),l.setAttribute("role","status"),n.append(o,r,s,l),document.body.append(t);let g="",w={text:"",maxWidth:"",width:0,height:0},E=(S,k)=>{r.append(Ae(S,k))},x=(S,k,p,A,v,C="none")=>{E("rect",{x:S,y:k,width:Math.max(0,p),height:Math.max(0,A),fill:v,stroke:C})},h=(S,k,p,A,v,C=!1)=>{E("line",{x1:S,y1:k,x2:p,y2:A,stroke:v,"stroke-width":1,...C?{"stroke-dasharray":"3 3"}:{}})},u=(S,k,p)=>{let A=p.length*7+12,v=Math.max(L,Math.min(S-A/2,innerWidth-A-L)),C=Math.max(L,Math.min(k-At/2,innerHeight-At-L));E("rect",{x:v,y:C,width:A,height:At,rx:4,fill:"var(--measure-ink)"});let I=document.createElementNS(Tt,"text");I.setAttribute("x",String(v+A/2)),I.setAttribute("y",String(C+15)),I.setAttribute("text-anchor","middle"),I.setAttribute("data-measure-distance",p),I.textContent=p,r.append(I)};return{host:t,render:(S,k)=>{let p=S??k,A=p?.getBoundingClientRect(),v=k?.getBoundingClientRect(),C=p?getComputedStyle(p):null,I=["Top","Right","Bottom","Left"].map($=>parseFloat(C?.getPropertyValue(`padding-${$.toLowerCase()}`)??"0")||0),M=["top","right","bottom","left"].map($=>parseFloat(C?.getPropertyValue(`margin-${$}`)??"0")||0),c=["top","right","bottom","left"].map($=>parseFloat(C?.getPropertyValue(`border-${$}-width`)??"0")||0),_=p?`${p.localName}${p.id?`#${p.id}`:""}`:"",T=e.closest("[data-react-grab-toolbar-panel]")?.getBoundingClientRect()??e.getBoundingClientRect(),R=ve(e),ie=JSON.stringify([A,v,I,M,c,_,S===k,innerWidth,innerHeight,T,R]);if(ie===g)return;g=ie;let P=p instanceof HTMLElement&&A&&p.offsetWidth?A.width/p.offsetWidth:1,N=p instanceof HTMLElement&&A&&p.offsetHeight?A.height/p.offsetHeight:1;r.replaceChildren(a);let G=k?"Hover another element to measure \xB7 Click to change anchor \xB7 Esc to clear":"Measure \xB7 Hover to inspect \xB7 Click to anchor \xB7 Esc to exit",q=`${Math.min(R==="left"||R==="right"?260:600,window.innerWidth-L*2)}px`;(G!==w.text||q!==w.maxWidth)&&(l.textContent=G,l.style.maxWidth=q,w={text:G,maxWidth:q,width:l.offsetWidth,height:l.offsetHeight});let{width:ee,height:ae}=w,Ze=R==="left"?T.right+L:R==="right"?T.left-ee-L:T.left+(T.width-ee)/2,ze=R==="top"?T.bottom+L:R==="bottom"?T.top-ae-L:T.top+(T.height-ae)/2;if(l.style.left=`${Math.max(L,Math.min(Ze,window.innerWidth-ee-L))}px`,l.style.top=`${Math.max(L,Math.min(ze,window.innerHeight-ae-L))}px`,s.hidden=!A,!A||!p)return;let{left:W,top:d,right:y,bottom:K,width:H,height:D}=A,[z=0,se=0,Y=0,fe=0]=I,[ce=0,le=0,ge=0,qe=0]=M,[St=0,It=0,_t=0,Rt=0]=c,ao="#f59e0b30",ke=$=>$<0?`url(#${Yn})`:ao,Ct=Math.abs(ce)*N,Mt=Math.abs(le)*P,Lt=Math.abs(ge)*N,Pt=Math.abs(qe)*P;x(W,ce<0?d:d-Ct,H,Ct,ke(ce)),x(le<0?y-Mt:y,d,Mt,D,ke(le)),x(W,ge<0?K-Lt:K,H,Lt,ke(ge)),x(qe<0?W:W-Pt,d,Pt,D,ke(qe));let Ye=W+Rt*P,Je=d+St*N,Dt=Math.max(0,H-(Rt+It)*P),$t=Math.max(0,D-(St+_t)*N),Se="#22c55e35";x(Ye,Je,Dt,z*N,Se),x(y-(It+se)*P,Je,se*P,$t,Se),x(Ye,K-(_t+Y)*N,Dt,Y*N,Se),x(Ye,Je,fe*P,$t,Se),x(W,d,H,D,"#7c3aed08","var(--measure-ink)");for(let $ of[W,y])h($,0,$,window.innerHeight,"#7c3aed35",!0);for(let $ of[d,K])h(0,$,window.innerWidth,$,"#7c3aed35",!0);if(v&&S&&S!==k){x(v.left,v.top,v.width,v.height,"none","var(--measure-anchor)");for(let $ of qn(v,A)){let{x1:Qe,y1:Ie,x2:et,y2:_e,value:co}=$,Re=Ie===_e;h(Qe,Ie,et,_e,"var(--measure-ink)");for(let[tt,nt]of[[Qe,Ie],[et,_e]])tt===void 0||nt===void 0||h(tt-(Re?0:3),nt-(Re?3:0),tt+(Re?0:3),nt+(Re?3:0),"var(--measure-ink)");u((Qe+et)/2,(Ie+_e)/2,`${me(co)} px`)}}s.textContent=`${S===k?"Anchor \xB7 ":""}${_}  ${me(H)} \xD7 ${me(D)} px
Padding  ${I.map(me).join("  ")}
Margin    ${M.map(me).join("  ")}
Top \xB7 Right \xB7 Bottom \xB7 Left`;let so=s.offsetWidth,Bt=s.offsetHeight,Nt=d-Bt-L;s.style.left=`${Math.max(L,Math.min(W,window.innerWidth-so-L))}px`,s.style.top=`${Math.max(L,Math.min(Nt>=L?Nt:K+L,window.innerHeight-Bt-L))}px`},destroy:()=>t.remove()}};var fr=500,gr=20,hr=5,eo="[data-react-grab], [data-react-grab-ignore], [data-react-grab-ignore-events]",br=()=>{let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("width","14"),e.setAttribute("height","14"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("aria-hidden","true"),e.style.pointerEvents="none";let t=document.createElementNS(e.namespaceURI,"path");return t.setAttribute("d","M3 7h18v10H3z M7 7v5 M11 7v3 M15 7v5 M19 7v3"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","1.8"),t.setAttribute("stroke-linejoin","round"),e.append(t),e},Te=e=>e.composedPath().some(t=>t instanceof Element&&t.matches(eo)),Qn=(e,t)=>{let n=document.elementFromPoint(e,t);for(;n?.shadowRoot;){let o=n.shadowRoot.elementFromPoint(e,t);if(!o||o===n)break;n=o}return!n||n.closest(eo)||n===document.documentElement?null:n},to=()=>{let e=()=>{};return{name:"measure",hooks:{onStateChange:t=>{t.isActive&&e()}},setup:t=>{let n=null,o=null,r=null,i=0,a=null,s=br(),{wrapper:l,button:g}=Ce("measure","Measure",s);g.removeAttribute("data-react-grab-deck-ui"),g.setAttribute("data-react-grab-measure","toggle"),g.setAttribute("aria-pressed","false");let w=Oe(l);e=()=>{cancelAnimationFrame(i),n?.destroy(),n=null,o=null,r=null,g.setAttribute("aria-pressed","false"),Z(s,!1)};let E=()=>{if(!n)return;o&&!o.isConnected&&(o=null);let c=r?Qn(r.x,r.y):null;n.render(c??o,o),i=requestAnimationFrame(E)};g.addEventListener("click",c=>{if(c.stopPropagation(),a&&a.peak>hr){a=null;return}if(a=null,n){e();return}we()?.commit(),t.deactivate(),n=Jn(g),g.setAttribute("aria-pressed","true"),Z(s,!0),E()});let x=c=>{a&&(a.peak=Math.max(a.peak,Math.hypot(c.clientX-a.x,c.clientY-a.y))),n&&(r=Te(c)?null:{x:c.clientX,y:c.clientY})},h=c=>{if(c.composedPath().includes(g)){a={x:c.clientX,y:c.clientY,peak:0};return}if(n){if(Te(c)){e();return}c.preventDefault(),c.stopPropagation()}},u=c=>{!n||Te(c)||(c.preventDefault(),c.stopPropagation(),c.button===0&&(o=Qn(c.clientX,c.clientY),r={x:c.clientX,y:c.clientY}))},S=c=>{!n||Te(c)||(c.preventDefault(),c.stopPropagation())},k=c=>{!n||Te(c)||(c.preventDefault(),c.stopPropagation())},p=c=>{n&&(c.code==="Escape"||c.key==="Escape"?(c.preventDefault(),c.stopPropagation(),o?o=null:e()):c.key==="Tab"&&e())},A=c=>{c.relatedTarget||(r=null)},v=()=>{a=null};window.addEventListener("pointermove",x,!0),window.addEventListener("pointerdown",h,!0),window.addEventListener("click",u,!0),window.addEventListener("auxclick",u,!0),window.addEventListener("dblclick",u,!0),window.addEventListener("contextmenu",S,!0),window.addEventListener("pointerup",k,!0),window.addEventListener("keydown",p,!0),window.addEventListener("mouseout",A),window.addEventListener("blur",v),window.addEventListener("pointercancel",v);let C=0,I=()=>{C+=1,C===gr&&console.warn("[react-grab-text] measure found no toolbar anchor after 10s \u2014 host toolbar markup may have changed");let c=document.querySelector("[data-react-grab]")?.shadowRoot,_=c?.querySelectorAll("[data-react-grab-toolbar-action]"),R=(c?.querySelector('[data-react-grab-toolbar-action="text"]')??(_?.length?_[_.length-1]:null))?.parentElement;R?.parentElement&&l.nextElementSibling!==R&&R.before(l),R&&w.attach(R),n&&!l.isConnected&&e(),R&&(C=0)};I();let M=window.setInterval(I,fr);return{cleanup:()=>{e(),window.clearInterval(M),w.destroy(),window.removeEventListener("pointermove",x,!0),window.removeEventListener("pointerdown",h,!0),window.removeEventListener("click",u,!0),window.removeEventListener("auxclick",u,!0),window.removeEventListener("dblclick",u,!0),window.removeEventListener("contextmenu",S,!0),window.removeEventListener("pointerup",k,!0),window.removeEventListener("keydown",p,!0),window.removeEventListener("mouseout",A),window.removeEventListener("blur",v),window.removeEventListener("pointercancel",v),l.remove()}}}}};var xr=()=>window.__REACT_GRAB__,no=e=>{let t=xr();if(!t||typeof t.registerPlugin!="function")return!1;try{t.registerPlugin(e())}catch(n){console.error("[react-grab-text] Failed to register plugin:",n)}return!0},kt=e=>{if(typeof window>"u"||no(e))return;let t=()=>{no(e)};window.addEventListener("react-grab:init",t,{once:!0})},oo=()=>{kt(Zn)},ro=()=>{kt(Rn)},io=()=>{kt(to)};oo();ro();io();})();
