"use strict";var ReactGrabText=(()=>{var Ut="text",Vt="text",Ft="Text";var ie="data-react-grab-text-editing",q="data-react-grab-text-flash",ee="data-react-grab-text-ui",W="data-react-grab-ignore",F="data-react-grab-ignore-events",Ee="data-react-grab-input";var Wt=new Set(["INPUT","TEXTAREA","SELECT","OPTION","IMG","VIDEO","AUDIO","CANVAS","IFRAME","SCRIPT","STYLE","HTML","BODY"]),Kt="deck",Y="data-react-grab-deck-ui",st="react-grab-deck",ct="react-grab-deck-mode",te=50,jt=`
--
`,Xt=1600,Zt=5;var lt="http://www.w3.org/2000/svg",zt=window.matchMedia("(prefers-reduced-motion: reduce)").matches,qt={back:"M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657Z",mid:"M5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z",front:"M2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6Z"},Yt={opacity:0,tx:0,ty:3,scale:.94,delayMs:0},mo={back:{collapsed:Yt,expanded:{opacity:.55,tx:.75,ty:-6,scale:.84,delayMs:0}},mid:{collapsed:Yt,expanded:{opacity:.8,tx:.35,ty:-3,scale:.92,delayMs:35}},front:{collapsed:{opacity:1,tx:0,ty:0,scale:1,delayMs:0},expanded:{opacity:1,tx:0,ty:0,scale:1,delayMs:70}}},fo=(e,t,n)=>{let o=zt?"":` ${t.delayMs}ms`;e.style.transition=zt?"none":`opacity 200ms cubic-bezier(0.32, 0.72, 0, 1)${o}, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)${o}`,e.style.transformOrigin=n,e.style.opacity=String(t.opacity),e.style.transform=`translate(${t.tx}px, ${t.ty}px) scale(${t.scale})`},Jt=()=>{let e=document.createElementNS(lt,"svg");e.setAttribute("width","14"),e.setAttribute("height","14"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","currentColor"),e.setAttribute("aria-hidden","true"),e.style.display="block",e.style.pointerEvents="none",e.style.overflow="visible";let t=Object.keys(qt).map(i=>{let s=document.createElementNS(lt,"g"),a=document.createElementNS(lt,"path");return a.setAttribute("d",qt[i]),s.append(a),e.append(s),{key:i,group:s}}),n=!1,o=!1,r=()=>{let i=n||o;for(let{key:s,group:a}of t){let c=mo[s];fo(a,i?c.expanded:c.collapsed,"12px 16px")}};return r(),{svg:e,setActive:i=>{n=i,i&&(o=!1),r()},setPreview:i=>{n||(o=i,r())}}};var Qt="http://www.w3.org/2000/svg",go=()=>{let e=document.createElementNS(Qt,"svg");return e.setAttribute("width","14"),e.setAttribute("height","14"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","currentColor"),e.setAttribute("aria-hidden","true"),e.style.display="block",e.style.pointerEvents="none",e},en=e=>{let t=go();for(let{d:n,fillRule:o,clipRule:r}of[e].flat()){let i=document.createElementNS(Qt,"path");i.setAttribute("d",n),o&&i.setAttribute("fill-rule",o),r&&i.setAttribute("clip-rule",r),t.append(i)}return t};var ho=()=>en({d:"M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z"});var tn=ho;var nn=()=>en({d:"M20.285 6.709a1 1 0 0 1 .006 1.414l-9.2 9.25a1 1 0 0 1-1.435.01L3.71 12.09a1 1 0 0 1 1.414-1.414l5.2 5.2 8.49-8.54a1 1 0 0 1 1.471.373z",fillRule:"evenodd",clipRule:"evenodd"});var dt="group contain-layout flex items-center justify-center cursor-pointer interactive-scale a11y-hitbox",ut="relative contain-layout flex items-center justify-center shrink-0",on="relative overflow-visible flex items-center shrink-0",rn=4,bo="text-[var(--rg-text-primary)]",Eo="text-[var(--rg-text-secondary)] group-hover:text-[var(--rg-text-primary)] transition-[color] duration-150 ease-drawer";var pt=e=>{e.setAttribute(W,"true"),e.setAttribute(F,"true")},J=(e,t)=>{e.setAttribute("class",t?bo:Eo)};var $e=(e,t,n,o=!1)=>{let r=document.createElement("div");r.className=ut;let i=document.createElement("button");return i.type="button",i.setAttribute(Y,e),i.className=dt,i.setAttribute("aria-label",t),i.title=t,pt(i),J(n,o),i.append(n),r.append(i),{wrapper:r,button:i}};var mt="data-react-grab-deck-face",ft="opacity 160ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",xo=e=>({opacity:e?"1":"0",transform:e?"scale(1)":"scale(0.82)"}),an=()=>{let e=document.createElement("div");e.className=ut;let t=document.createElement("button");t.type="button",t.setAttribute(Y,"mode-toggle"),t.className=`${dt} relative`,t.setAttribute("aria-live","polite"),t.setAttribute("aria-pressed","false"),pt(t);let n=document.createElement("span");Object.assign(n.style,{position:"relative",display:"block",width:"14px",height:"14px",overflow:"visible"});let o=document.createElement("span");o.setAttribute(mt,"stack"),Object.assign(o.style,{position:"absolute",inset:"0",display:"flex",alignItems:"center",justifyContent:"center",transition:ft,pointerEvents:"none",overflow:"visible"});let r=Jt(),i=r.svg;o.append(i);let s=document.createElement("span");s.setAttribute(mt,"count"),Object.assign(s.style,{position:"absolute",inset:"0",display:"flex",alignItems:"center",justifyContent:"center",transition:ft,pointerEvents:"none",fontSize:"13px",lineHeight:"14px",letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums"});let a=document.createElement("span");a.setAttribute(mt,"check"),Object.assign(a.style,{position:"absolute",inset:"0",display:"flex",alignItems:"center",justifyContent:"center",transition:ft,pointerEvents:"none"});let c=nn();a.append(c),n.append(o,s,a),t.append(n),e.append(t);let f=!1,k="stack",y=(l,h=0)=>{k=l,l==="count"&&(s.textContent=String(h));for(let[A,b]of[["stack",o],["count",s],["check",a]])Object.assign(b.style,xo(A===l));J(i,f&&l==="stack"),J(c,l==="check"),l!=="stack"&&r.setPreview(!1),l==="count"&&(s.className="text-[var(--rg-text-primary)] font-variant-numeric tabular-nums transition-[color] duration-150 ease-drawer")},x=l=>{f=l,t.setAttribute("aria-pressed",l?"true":"false"),r.setActive(l),l||r.setPreview(!1),k==="stack"&&J(i,l)},_=()=>{if(k!=="stack"||f){r.setPreview(!1);return}r.setPreview(t.matches(":hover"))};return t.addEventListener("pointerenter",_),t.addEventListener("pointerleave",()=>r.setPreview(!1)),t.addEventListener("focus",_),t.addEventListener("blur",()=>r.setPreview(!1)),y("stack"),{wrapper:e,button:t,setFace:y,setBatchActive:x}};var O=[],gt=new Set,sn=!1,vo=e=>typeof e=="object"&&e!==null&&typeof e.id=="string"&&typeof e.content=="string",pe=()=>{if(!sn){sn=!0;try{let e=window.sessionStorage.getItem(st);if(!e)return;let t=JSON.parse(e);Array.isArray(t)&&(O=t.filter(vo).slice(-te))}catch{}}},yo=()=>{try{window.sessionStorage.setItem(st,JSON.stringify(O))}catch{}},De=()=>{yo();let e=ae();for(let t of gt)t(e);window.dispatchEvent(new CustomEvent("react-grab-deck:change",{detail:{items:e}}))},Ao=()=>typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,ae=()=>(pe(),[...O]),cn=e=>{pe();let t=e.trim();if(!t)return null;let n={id:Ao(),content:t};return O.length>=te&&console.warn(`[react-grab-text] deck full (${te}) \u2014 dropping the oldest grab to queue this one`),O=[...O,n].slice(-te),De(),n},xe=e=>{pe();let t=new Set(e),n=O.filter(o=>!t.has(o.id));n.length!==O.length&&(O=n,De())},ln=(e,t)=>{pe();let n=t.trim();if(!n){xe([e]);return}let o=O.findIndex(r=>r.id===e);o!==-1&&O[o].content!==n&&(O=O.map(r=>r.id===e?{...r,content:n}:r),De())},dn=()=>{pe(),O.length!==0&&(O=[],De())},Be=e=>(pe(),gt.add(e),e(ae()),()=>{gt.delete(e)});var wo=e=>{let t=e.indexOf("```");if(t===-1)return{comment:null,body:e.trim()};let n=e.slice(0,t).trim()||null,o=e.slice(t+3),r=o.lastIndexOf("```"),i=r===-1?o.trim():o.slice(0,r).replace(/^\n/,"").trim();return{comment:n,body:i}},un=e=>{let{comment:t,body:n}=wo(e);return{comment:t,body:n.trim()}};var fn=3,ve="\u2026",To=/<([a-z][\w-]*)\b[^>]*>/i,ko=/(?:^|\s)in ([A-Z][\w$.]*)(?= \(at |\]|$)/m,So=e=>e.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&amp;/g,"&"),pn=(e,t)=>{let n=e.match(new RegExp(`^${t}:\\n"""\\n([\\s\\S]*?)\\n"""$`,"m"));if(n)return n[1];let o=e.match(new RegExp(`^${t}: "(.*)"$`,"m"));return o?o[1]:null},mn=e=>e.match(/\s+|[\p{L}\p{N}\p{M}'’_-]+|[^\s\p{L}\p{N}\p{M}]/gu)??[],gn=e=>/[\p{L}\p{N}]/u.test(e),Ne=(e,t)=>{let n=t?[...e].reverse():e,o=[],r=0;for(let a of n){if(gn(a)){if(r===fn)break;r+=1}o.push(a)}let i=o.length<e.length,s=(t?o.reverse():o).join("");return i?t?`${ve}${s.trimStart()}`:`${s.trimEnd()}${ve}`:s},_o=4e4,Io=(e,t)=>{if(e.length*t.length>_o)return[{kind:"removed",tokens:e},{kind:"added",tokens:t}];let n=Array.from({length:e.length+1},()=>new Uint16Array(t.length+1));for(let a=e.length-1;a>=0;a-=1)for(let c=t.length-1;c>=0;c-=1)n[a][c]=e[a]===t[c]?n[a+1][c+1]+1:Math.max(n[a+1][c],n[a][c+1]);let o=[],r=(a,c)=>{let f=o[o.length-1];f?.kind===a?f.tokens.push(c):o.push({kind:a,tokens:[c]})},i=0,s=0;for(;i<e.length&&s<t.length;)e[i]===t[s]?(r("same",e[i]),i+=1,s+=1):n[i+1][s]>=n[i][s+1]?(r("removed",e[i]),i+=1):(r("added",t[s]),s+=1);for(;i<e.length;)r("removed",e[i++]);for(;s<t.length;)r("added",t[s++]);return o},Co=e=>e.filter(gn).length,Ro=(e,t)=>{let n=Io(mn(e),mn(t)),o=[],r=s=>{if(!s)return;let a=o[o.length-1];a?.kind==="same"?a.text+=s:o.push({kind:"same",text:s})},i=(s,a)=>{let c=a.trim();if(!c){s==="added"&&r(a);return}let[,f="",k=""]=a.match(/^(\s*)[\s\S]*?(\s*)$/)??[];r(f);let y=o[o.length-1];!f&&y&&y.kind!=="same"&&r(" "),o.push({kind:s,text:c}),r(k)};for(let[s,a]of n.entries()){if(a.kind!=="same"){i(a.kind,a.tokens.join(""));continue}if(s===0)r(Ne(a.tokens,!0));else if(s===n.length-1)r(Ne(a.tokens,!1));else if(Co(a.tokens)>fn*2){let c=Ne(a.tokens,!1),f=Ne(a.tokens,!0);r(`${c.slice(0,-ve.length)} ${ve} ${f.slice(ve.length)}`)}else r(a.tokens.join(""))}return o},Lo=e=>{let t=e.match(To);if(!t||t.index===void 0)return{element:null,text:null,component:null};let n=e.slice(t.index),o=n.match(ko),r=o?.index===void 0?n:n.slice(0,o.index),i=So(r.replace(/<[^>]*>/g," ").replace(/[\[\]`]/g,"")).replace(/\s+/g," ").trim();return{element:t[1].toLowerCase(),text:i||null,component:o?.[1]??null}},Mo=e=>e.split(`
`).map(t=>t.trim()).find(t=>t&&!/^`{3,}$/.test(t))??"",hn=e=>{let t=Lo(e),n={element:t.element,component:t.component},o=pn(e,"BEFORE"),r=pn(e,"AFTER");if(o!==null&&r!==null)return{kind:"text",parts:Ro(o,r),...n};let{comment:i,body:s}=un(e);return i?{kind:"comment",parts:[{kind:"same",text:i}],...n}:t.element?{kind:"grab",parts:[{kind:"same",text:t.text??`<${t.element}>`}],...n}:{kind:"note",parts:[{kind:"same",text:Mo(s)}],...n}},bn={text:"Text edit",comment:"Comment",grab:"Grab",note:"Note"};var Po="[data-react-grab]",$o=["--rg-panel-bg","--rg-text-primary","--rg-text-primary-85","--rg-text-secondary","--rg-border-subtle","--rg-border-button","--rg-surface-hover","--rg-surface-active","--rg-submit-bg","--rg-submit-fg","--rg-shadow","--rg-error-text"],u={panelBg:"var(--rg-panel-bg, #161616)",text:"var(--rg-text-primary, #ffffff)",text85:"var(--rg-text-primary-85, #ffffffd9)",textMuted:"var(--rg-text-secondary, #a7a7a7)",borderSubtle:"var(--rg-border-subtle, #ffffff1a)",borderButton:"var(--rg-border-button, #ffffff33)",surfaceHover:"var(--rg-surface-hover, #ffffff1a)",surfaceActive:"var(--rg-surface-active, #ffffff26)",submitBg:"var(--rg-submit-bg, #ffffff)",submitFg:"var(--rg-submit-fg, #161616)",shadow:"var(--rg-shadow, 0 2px 8px #00000014)",errorText:"var(--rg-error-text, #f87171)",font:"Geist, ui-sans-serif, system-ui, sans-serif",easeDrawer:"cubic-bezier(0.32, 0.72, 0, 1)",easeSpring:"cubic-bezier(0.34, 1.56, 0.64, 1)"},He=e=>{let t=document.querySelector(Po);if(!t)return;let n=getComputedStyle(t);for(let o of $o){let r=n.getPropertyValue(o).trim();r&&e.style.setProperty(o,r)}};var Oe="data-deck-item-id",En="react-grab-deck-panel-styles",Ge="http://www.w3.org/2000/svg",E=e=>`[${Y}="${e}"]`,g=E("panel"),Do=320,xn=220,Ue=120,ht=75,Bo=`
${g} *:not(svg, svg *) { all: revert; }
${g} {
  position: fixed;
  flex-direction: column;
  box-sizing: border-box;
  width: min(${Do}px, calc(100vw - 24px));
  max-height: min(400px, 52vh);
  overflow: hidden;
  border-radius: 14px;
  corner-shape: superellipse(1.25);
  background: ${u.panelBg};
  color: ${u.text};
  filter: drop-shadow(${u.shadow});
  font: 500 13px/16px ${u.font};
  letter-spacing: normal;
  text-align: left;
  -webkit-font-smoothing: antialiased;
  font-synthesis: none;
  z-index: 2147483645;
  opacity: 0;
  transform: scale(0.92);
  pointer-events: none;
  transition: opacity ${Ue}ms ${u.easeDrawer}, transform ${Ue}ms ${u.easeDrawer};
}
${g}[data-state="open"] {
  opacity: 1;
  transform: none;
  pointer-events: auto;
  transition: opacity ${xn}ms ${u.easeSpring}, transform ${xn}ms ${u.easeSpring};
}
${g} [hidden] { display: none !important; }
${g} *, ${g} *::before, ${g} *::after { box-sizing: border-box; }
${g} button {
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
${g} button:focus-visible {
  outline: 1px solid ${u.borderButton};
  outline-offset: 1px;
}

${g} ${E("panel-header")} {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 28px;
  padding: 0 4px 0 8px;
}
${g} ${E("panel-title")} { display: flex; align-items: baseline; gap: 4px; min-width: 0; }
${g} ${E("panel-count")} { color: ${u.textMuted}; font-variant-numeric: tabular-nums; }
${g} ${E("clear-all")},
${g} ${E("panel-back")} {
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  color: ${u.textMuted};
  transition: color 150ms ease-out, background-color 150ms ease-out;
}
${g} ${E("panel-back")} { gap: 2px; margin-left: -4px; padding: 0 6px 0 2px; color: ${u.text}; }
${g} ${E("clear-all")}:hover,
${g} ${E("panel-back")}:hover { color: ${u.text}; background: ${u.surfaceHover}; }
${g} ${E("panel-position")} {
  padding-right: 4px;
  color: ${u.textMuted};
  font-variant-numeric: tabular-nums;
}

${g} ${E("panel-list")} {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-top: 0.5px solid ${u.borderSubtle};
  scrollbar-width: thin;
  scrollbar-color: ${u.borderButton} transparent;
}
${g} ${E("panel-highlight")} {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  background: ${u.surfaceHover};
  opacity: 0;
  pointer-events: none;
  transition: top ${ht}ms ease-out, height ${ht}ms ease-out, opacity ${ht}ms ease-out;
}
${g} ${E("panel-item")} {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 6px 6px 8px;
}
${g} ${E("panel-index")} {
  flex: none;
  min-width: 12px;
  color: ${u.textMuted};
  line-height: 16px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
${g} ${E("panel-summary")} {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  text-align: left;
  cursor: pointer;
}
${g} ${E("panel-summary")}::after {
  content: "";
  position: absolute;
  inset: 0;
}
${g} ${E("panel-summary")}:focus-visible { outline: none; }
${g} ${E("panel-item")}:has(${E("panel-summary")}:focus-visible) {
  box-shadow: inset 0 0 0 1px ${u.borderButton};
}
${g} ${E("panel-summary-text")} {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: ${u.text85};
  font-weight: 400;
  overflow-wrap: anywhere;
}
${g} ${E("panel-summary-text")}[data-kind="text"] { color: ${u.textMuted}; }
${g} ${E("panel-summary-text")} del {
  color: ${u.textMuted};
  text-decoration: line-through;
  text-decoration-color: ${u.textMuted};
}
${g} ${E("panel-summary-text")} ins {
  color: ${u.text};
  font-weight: 500;
  text-decoration: none;
}
${g} ${E("panel-meta")} {
  overflow: hidden;
  color: ${u.textMuted};
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
${g} ${E("panel-preview")} {
  flex: 1;
  min-width: 0;
  min-height: 16px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: ${u.text};
  font: 400 13px/16px ${u.font};
  resize: none;
  outline: none;
  overflow: hidden;
  overflow-wrap: anywhere;
}
${g}[data-editing] ${E("panel-item")}:not([data-editing]) { display: none; }
${g} ${E("delete-item")} {
  position: relative;
  z-index: 1;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  color: ${u.textMuted};
  opacity: 0;
  transition: opacity 150ms ease-out, color 150ms ease-out, background-color 150ms ease-out;
}
${g} ${E("panel-item")}:hover ${E("delete-item")},
${g} ${E("panel-item")}:focus-within ${E("delete-item")} { opacity: 1; }
${g} ${E("delete-item")}:hover { color: ${u.text}; background: ${u.surfaceActive}; }

${g} ${E("panel-footer")} {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 6px 6px 8px;
  border-top: 0.5px solid ${u.borderSubtle};
}
${g} ${E("panel-mode-toggle")} {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  color: ${u.textMuted};
  transition: color 150ms ease-out;
}
${g} ${E("panel-mode-toggle")}:hover,
${g} ${E("panel-mode-toggle")}[aria-pressed="true"] { color: ${u.text}; }
${g} ${E("panel-switch")} {
  position: relative;
  width: 22px;
  height: 12px;
  border-radius: 9999px;
  background: ${u.surfaceActive};
  transition: background-color 200ms ${u.easeDrawer};
}
${g} ${E("panel-switch")}::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${u.textMuted};
  transition: transform 200ms ${u.easeDrawer}, background-color 200ms ${u.easeDrawer};
}
${g} [aria-pressed="true"] ${E("panel-switch")} { background: ${u.text}; }
${g} [aria-pressed="true"] ${E("panel-switch")}::after { transform: translateX(10px); background: ${u.panelBg}; }
${g} ${E("copy-all")} {
  height: 28px;
  padding: 0 12px;
  font-variant-numeric: tabular-nums;
  border-radius: 9999px;
  background: ${u.submitBg};
  color: ${u.submitFg};
  transition: transform 400ms ${u.easeSpring};
}
${g} ${E("copy-all")}:active {
  transform: scale(0.97);
  transition: transform 60ms cubic-bezier(0, 0, 0.2, 1);
}
@media (prefers-reduced-motion: reduce) {
  ${g}, ${g} *, ${g} *::after { transition: none !important; animation: none !important; }
}
`,No=()=>{if(document.getElementById(En))return;let e=document.createElement("style");e.id=En,e.setAttribute(W,"true"),e.textContent=Bo,document.head.appendChild(e)},Ve=e=>{e.setAttribute(W,"true"),e.setAttribute(F,"true")},B=(e,t)=>{let n=document.createElement(e);return n.setAttribute(Y,t),n},ye=(e,t)=>{let n=B("button",e);return n.type="button",n.title=t,n.setAttribute("aria-label",t),Ve(n),n},Ho=()=>{let e=document.createElementNS(Ge,"svg");e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("width","10"),e.setAttribute("height","10"),e.setAttribute("aria-hidden","true");let t=document.createElementNS(Ge,"path");return t.setAttribute("d","M6 6l12 12M18 6L6 18"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","2.5"),t.setAttribute("stroke-linecap","round"),e.append(t),e},Oo=()=>{let e=document.createElementNS(Ge,"svg");e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("width","14"),e.setAttribute("height","14"),e.setAttribute("aria-hidden","true");let t=document.createElementNS(Ge,"path");return t.setAttribute("d","M15 18l-6-6 6-6"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","2"),t.setAttribute("stroke-linecap","round"),t.setAttribute("stroke-linejoin","round"),e.append(t),e},Go=()=>{No();let e=B("div","panel");return Ve(e),e.style.display="none",e},vn=e=>{e.style.height="auto",e.style.height=`${e.scrollHeight}px`},bt=(e,t,n)=>{let o=hn(n);e.setAttribute("data-kind",o.kind),e.replaceChildren(...o.parts.map(r=>{if(r.kind==="same")return document.createTextNode(r.text);let i=document.createElement(r.kind==="removed"?"del":"ins");return i.textContent=r.text,i})),t.textContent=[bn[o.kind],o.element?`<${o.element}>`:null,o.component].filter(Boolean).join(" \xB7 ")},yn=e=>{e.addEventListener("mousedown",t=>t.stopPropagation()),e.addEventListener("pointerdown",t=>t.stopPropagation())},Uo=(e,t,n)=>{let o=e.content,r=null,i=B("article","panel-item");i.setAttribute(Oe,e.id);let s=B("span","panel-index");s.setAttribute("data-deck-item-index","true");let a=B("button","panel-summary");a.type="button",a.title="Edit this item",a.setAttribute("aria-expanded","false"),Ve(a),yn(a);let c=B("span","panel-summary-text"),f=B("span","panel-meta");a.append(c,f);let k=ye("delete-item","Remove from deck");k.append(Ho()),k.setAttribute(Oe,e.id),k.addEventListener("click",h=>{h.stopPropagation(),t.onRemoveItem(e.id)});let y=()=>{let h=r;if(!h)return;r=null;let A=h.value;if(h.remove(),a.hidden=!1,a.setAttribute("aria-expanded","false"),i.removeAttribute("data-editing"),n.onEditEnd(i),!A.trim()){t.onRemoveItem(e.id);return}o=A.trim(),bt(c,f,o),t.onUpdateItem(e.id,A)},x=()=>{let h=r;y(),h&&i.isConnected&&a.focus({preventScroll:!0})},_=()=>{r||(r=B("textarea","panel-preview"),r.value=o,r.rows=1,r.spellcheck=!1,r.setAttribute(Oe,e.id),r.setAttribute("aria-label","Deck item"),Ve(r),yn(r),r.addEventListener("input",()=>{r&&vn(r)}),r.addEventListener("blur",y),r.addEventListener("keydown",h=>{h.stopPropagation(),h.key==="Escape"&&(h.preventDefault(),x())}),a.hidden=!0,a.setAttribute("aria-expanded","true"),i.setAttribute("data-editing",""),n.onEditStart(i),a.after(r),vn(r),r.focus({preventScroll:!0}),r.setSelectionRange(0,0),i.scrollIntoView({block:"nearest"}))};a.addEventListener("click",h=>{h.stopPropagation(),_()}),i.append(s,a,k);let l=h=>{r||h===o||(o=h,bt(c,f,o))};return bt(c,f,o),{row:i,setIndex:h=>{s.textContent=String(h+1)},setContent:l,field:()=>r,close:x}},Vo=e=>{let t=B("div","panel-highlight");t.setAttribute("aria-hidden","true");let n=null,o=c=>{t.style.top=`${c.offsetTop}px`,t.style.height=`${c.offsetHeight}px`},r=c=>{if(c.hasAttribute("data-editing")){i();return}let f=n===null;n=c,f?(t.style.transitionProperty="opacity",o(c),t.offsetHeight,t.style.transitionProperty=""):o(c),t.style.opacity="1"},i=()=>{n=null,t.style.opacity="0"},s=()=>{n?.isConnected?o(n):n&&i()},a=c=>c instanceof Element?c.closest(E("panel-item")):null;return e.addEventListener("pointerover",c=>{let f=a(c.target);f&&f!==n&&r(f)}),e.addEventListener("pointerleave",i),e.addEventListener("focusin",c=>{let f=a(c.target);f&&r(f)}),e.addEventListener("focusout",c=>{a(c.relatedTarget)||i()}),{element:t,hide:i,refresh:s}},An=()=>{let e=Go(),t=B("div","panel-header"),n=B("div","panel-title"),o=document.createElement("span");o.textContent="Deck";let r=B("span","panel-count");n.append(o,r);let i=ye("clear-all","Clear all deck items");i.textContent="Clear";let s=ye("panel-back","Back to all items");s.title="Back to all items (Esc)";let a=document.createElement("span");a.textContent="All items",s.append(Oo(),a),s.hidden=!0;let c=B("span","panel-position");c.hidden=!0,t.append(s,n,c,i);let f=B("div","panel-list"),k=Vo(f),y=B("div","panel-rows");f.append(k.element,y);let x=B("div","panel-footer"),_=ye("panel-mode-toggle","Turn batch mode off"),l=document.createElement("span");l.textContent="Batch";let h=B("span","panel-switch");h.setAttribute("aria-hidden","true"),_.append(l,h);let A=ye("copy-all","Copy all deck items");A.textContent="Copy all",x.append(_,A),e.append(t,f,x);let b=null,T=new Map,S=null,I=()=>{let d=S!==null;if(s.hidden=!d,n.hidden=d,i.hidden=d,c.hidden=!d,d){let w=Array.prototype.indexOf.call(y.children,S);c.textContent=`${w+1} of ${y.children.length}`}},L={onEditStart:d=>{S=d,e.setAttribute("data-editing",""),k.hide(),I()},onEditEnd:d=>{S===d&&(S=null,e.removeAttribute("data-editing"),I())}};s.addEventListener("mousedown",d=>d.preventDefault()),s.addEventListener("click",d=>{d.stopPropagation();let w=S?.getAttribute(Oe);w&&T.get(w)?.close()}),_.addEventListener("click",d=>{d.stopPropagation(),b?.onToggleMode()}),i.addEventListener("click",d=>{d.stopPropagation(),b?.onClearAll()}),A.addEventListener("click",d=>{d.stopPropagation(),b?.onCopyAll()});let U=d=>{_.title=d?"Batch mode on: grabs queue in the deck":"Batch mode off: grabs copy to the clipboard only",_.setAttribute("aria-label",d?"Turn batch mode off":"Turn batch mode on"),_.setAttribute("aria-pressed",String(d))};return U(!0),{panel:e,hasFocusedField:()=>y.contains(document.activeElement)&&document.activeElement instanceof HTMLTextAreaElement&&document.activeElement.matches(`textarea${E("panel-preview")}`),setBatchActive:U,sync:(d,w)=>{if(d.length===0){y.replaceChildren(),T.clear(),S=null,e.removeAttribute("data-editing"),I(),k.hide();return}b=w,He(e);let K=d.length===1?"item":"items";r.textContent=`${d.length} ${K}`,A.textContent=`Copy ${d.length} ${K}`,A.setAttribute("aria-label",`Copy all ${d.length} deck ${K}`),A.title=`Copy all ${d.length} deck ${K}`;let N=new Set(d.map(M=>M.id));for(let[M,C]of T)N.has(M)||C.field()===document.activeElement||(C.row.remove(),T.delete(M));let R=[];for(let[M,C]of d.entries()){let D=T.get(C.id);D?D.setContent(C.content):(D=Uo(C,w,L),T.set(C.id,D)),D.setIndex(M),R.push(D.row)}for(let[M,C]of R.entries())y.children[M]!==C&&y.insertBefore(C,y.children[M]??null);for(;y.children.length>R.length;)y.lastElementChild?.remove();I(),k.refresh(),e.style.display="flex"}}};var se="batch",Et=new Set,wn=!1,Fo=e=>e==="single"||e==="batch",xt=()=>{if(!wn){wn=!0;try{let e=window.sessionStorage.getItem(ct);Fo(e)&&(se=e)}catch{}}},Wo=()=>{try{window.sessionStorage.setItem(ct,se)}catch{}},Ko=()=>{Wo();for(let e of Et)e(se)},Tn=()=>(xt(),se),vt=()=>Tn()==="batch",jo=e=>{xt(),se!==e&&(se=e,Ko())},yt=()=>(jo(vt()?"single":"batch"),Tn()),kn=e=>(xt(),Et.add(e),e(se),()=>{Et.delete(e)});var Fe=16,wt=8,Sn=12,Ae=28,_n=125,Zo="http://www.w3.org/2000/svg",zo="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289C17.3166 8.90237 16.6834 8.90237 16.2929 9.29289L11 14.5858L8.70711 12.2929C8.31658 11.9024 7.68342 11.9024 7.29289 12.2929C6.90237 12.6834 6.90237 13.3166 7.29289 13.7071L10.2929 16.7071C10.6834 17.0976 11.3166 17.0976 11.7071 16.7071L17.7071 10.7071Z",me=(e,t)=>{let n=document.createElementNS(Zo,e);for(let[o,r]of Object.entries(t))n.setAttribute(o,r);return n},At=(e,t)=>{let n=me("svg",{viewBox:"0 0 24 24",width:"14",height:"14","aria-hidden":"true"});if(n.style.flexShrink="0",n.style.color=t,e==="check")return n.append(me("path",{fill:"currentColor","fill-rule":"evenodd","clip-rule":"evenodd",d:zo})),n;n.append(me("circle",{cx:"12",cy:"12",r:"10",fill:"currentColor"}));let o=e==="minus"?"M8 12h8":"M9 9l6 6M15 9l-6 6";return n.append(me("path",{d:o,fill:"none",stroke:u.panelBg,"stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"})),n},qo=()=>{let e=me("svg",{width:String(Fe),height:String(wt),viewBox:`0 0 ${Fe} ${wt}`,"aria-hidden":"true"});return e.append(me("path",{fill:u.panelBg,d:"M0 8 L7.2929 0.7071 A1 1 0 0 1 8.7071 0.7071 L16 8 Z"})),Object.assign(e.style,{position:"absolute",display:"block"}),e},We=()=>{let e=document.createElement("div");e.setAttribute(W,"true"),e.setAttribute(F,"true"),e.setAttribute(ee,"true"),e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),He(e),Object.assign(e.style,{position:"fixed",pointerEvents:"none",top:"0",left:"0",zIndex:String(2147483646),fontFamily:u.font,fontSize:"13px",WebkitFontSmoothing:"antialiased",userSelect:"none",filter:`drop-shadow(${u.shadow})`,visibility:"hidden",opacity:"0",transition:`opacity ${_n}ms ease-out`});let t=qo(),n=document.createElement("div");Object.assign(n.style,{display:"flex",alignItems:"center",gap:"4px",boxSizing:"border-box",height:`${Ae}px`,padding:"6px 10px 6px 8px",borderRadius:"9999px",background:u.panelBg,whiteSpace:"nowrap"}),e.append(t,n),document.body.appendChild(e);let o=(r,i)=>{let s=document.createElement("span");s.textContent=i,Object.assign(s.style,{color:u.text,fontSize:"13px",lineHeight:"16px",fontWeight:"500"}),n.replaceChildren(r,s)};return{showCopied:(r="Copied")=>{o(At("check",u.text85),r)},showNoChange:()=>{o(At("minus",u.textMuted),"No text change")},showError:r=>{o(At("cross",u.errorText),r)},reposition:r=>{let i=e.getBoundingClientRect().width,s=8,a=r.left+r.width/2,c=r.bottom+Sn,f=c+Ae<=window.innerHeight-s;f||(c=r.top-Sn-Ae),c=Math.max(c,s);let k=window.innerWidth-i-s,y=Math.min(Math.max(a-i/2,s),k),x=Ae/2+Fe/2,_=Math.min(Math.max(a-y,x),i-x);Object.assign(t.style,{left:`${_-Fe/2}px`,top:f?`${1-wt}px`:`${Ae-1}px`,transform:f?"none":"rotate(180deg)"}),e.style.top=`${c}px`,e.style.left=`${y}px`,e.style.visibility="visible",requestAnimationFrame(()=>{e.style.opacity="1"})},destroy:()=>{e.style.opacity="0",window.setTimeout(()=>e.remove(),_n)}}};var Ke=e=>{let t=null,n=null,o=()=>{if(!t||!n)return;let i=getComputedStyle(t);e.style.flexDirection=getComputedStyle(n).flexDirection,e.style.marginRight=i.marginRight,e.style.marginBottom=i.marginBottom},r=new MutationObserver(o);return{attach:i=>{i===t&&i.parentElement===n||(r.disconnect(),t=i,n=i.parentElement,r.observe(i,{attributes:!0,attributeFilter:["class","style"]}),n&&r.observe(n,{attributes:!0,attributeFilter:["class","style"]}),o())},destroy:()=>r.disconnect()}};var we=e=>{let t=e.closest("[data-react-grab-toolbar-panel]");if(!t)return"bottom";let n=t.getBoundingClientRect();return getComputedStyle(t).flexDirection==="column"?n.left+n.width/2<window.innerWidth/2?"left":"right":n.top+n.height/2<window.innerHeight/2?"top":"bottom"};var In="[data-react-grab]",Yo='[data-react-grab-toolbar-action="text"]',Jo=500,Qo=20,Cn=e=>e?e.parentElement??e:null,er=()=>{window.dispatchEvent(new MouseEvent("mousedown"))},Rn=e=>{let t=0,n=!1,o=!1,r="idle",i,s=null,a=document.createElement("div");a.setAttribute(Y,"controls"),a.className=on,Object.assign(a.style,{gap:`${rn}px`});let c=Ke(a),f=an(),k=f.button,y=$e("panel-toggle","Review deck items",tn(),!1),x=y.button;x.setAttribute("aria-expanded","false"),y.wrapper.style.display="none";let _=An(),l=_.panel;a.append(f.wrapper,y.wrapper);let h=()=>r==="flash"?"check":t>0?"count":"stack",A=()=>{let v=x.getBoundingClientRect(),Z=l.offsetHeight||240,G=10,V=we(x);if(V==="left"||V==="right"){let de=x.closest("[data-react-grab-toolbar-panel]").getBoundingClientRect(),ue=l.offsetWidth||420,he=V==="left"?de.right+G:de.left-G-ue;l.style.left=`${Math.max(12,Math.min(he,window.innerWidth-ue-12))}px`;let be=Math.max(12,Math.min(v.top,window.innerHeight-Math.min(Z,360)-12));l.style.top=`${be}px`,l.style.right="auto",l.style.bottom="auto",l.style.maxHeight=`${Math.min(360,window.innerHeight-24)}px`,l.style.transformOrigin=`${V==="left"?"0":"100%"} ${v.top+v.height/2-be}px`;return}let z=v.top-G,oe=z>=Math.min(Z,200)||z>window.innerHeight-v.bottom;oe?(l.style.top="auto",l.style.bottom=`${window.innerHeight-v.top+G}px`):(l.style.bottom="auto",l.style.top=`${v.bottom+G}px`);let re=l.offsetWidth||420,Q=v.right-re;Q=Math.max(12,Math.min(Q,window.innerWidth-re-12)),l.style.left=`${Q}px`,l.style.right="auto",l.style.transformOrigin=`${v.left+v.width/2-Q}px ${oe?"100%":"0"}`,l.style.maxHeight=oe?`${Math.max(160,Math.min(360,z-8))}px`:`${Math.max(160,Math.min(360,window.innerHeight-v.bottom-G-12))}px`},b,T=()=>{if(o&&t>0){window.clearTimeout(b),b=void 0;let v=!l.isConnected;v&&(l.removeAttribute("data-state"),document.body.append(l)),l.style.display="flex",A(),x.setAttribute("aria-expanded","true"),v&&l.offsetHeight,l.setAttribute("data-state","open");return}let m=document.activeElement;m instanceof HTMLElement&&l.contains(m)&&m.blur(),x.setAttribute("aria-expanded","false"),!(!l.isConnected||b!==void 0)&&(l.removeAttribute("data-state"),b=window.setTimeout(()=>{b=void 0,l.style.display="none",l.remove()},Ue))},S=()=>r==="flash"?"Deck copied to clipboard":r==="copying"?`Copying ${t} deck items`:t>0?t>=te?`Copy all ${t} deck items \u2014 deck full (${te})`:`Copy all ${t} deck items`:n?"Batch mode on \u2014 grabs queue in the deck":"Batch mode off \u2014 grabs copy to clipboard only",I=()=>{f.setBatchActive(n),_.setBatchActive(n),f.setFace(h(),t);let m=S();k.title=m,k.setAttribute("aria-label",m)},L=()=>{let m=t>0;y.wrapper.style.display=m?"":"none",m||(o=!1);let v=x.querySelector("svg");v&&J(v,o),x.title=o?"Close deck panel":"Review deck items",x.setAttribute("aria-label",o?"Close deck panel":"Review deck items")},U=m=>{let v=We();v.showCopied(`Copied ${m} ${m===1?"item":"items"}`),requestAnimationFrame(()=>v.reposition(k.getBoundingClientRect())),window.setTimeout(()=>v.destroy(),1600)},p=()=>{if(r!=="idle"||t===0)return;let m=t;o=!1,R("copying"),e().then(v=>{v&&(U(m),ae().length===0&&R("flash"))}).catch(()=>{}).finally(()=>{r==="copying"&&R("idle")})},$={onCopyAll:p,onClearAll:()=>{dn()},onRemoveItem:m=>{xe([m])},onUpdateItem:(m,v)=>{ln(m,v)},onToggleMode:()=>{yt()}},d=m=>{if(m.length===0){_.sync([],$),o=!1,T();return}_.sync(m,$),T(),o&&A()},w=(m=ae())=>{I(),L(),d(m)},K=()=>{o&&(o=!1,w())},N=m=>{if(!o)return;let v=m.composedPath();v.includes(l)||v.includes(a)||K()};window.addEventListener("pointerdown",N,!0);let R=m=>{if(r!==m){if(i!==void 0&&(window.clearTimeout(i),i=void 0),r=m,m==="flash"){I(),i=window.setTimeout(()=>{i=void 0,r="idle",w()},Xt);return}w()}},M=m=>{s&&(s.peak=Math.max(s.peak,Math.hypot(m.clientX-s.x,m.clientY-s.y)))},C=()=>{window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",C),window.removeEventListener("pointercancel",C)};k.addEventListener("pointerdown",m=>{s={x:m.clientX,y:m.clientY,peak:0},window.addEventListener("pointermove",M),window.addEventListener("pointerup",C),window.addEventListener("pointercancel",C)}),k.addEventListener("click",()=>{let m=s!==null&&s.peak>Zt;if(s=null,!(m||r!=="idle")){if(t>0){p();return}yt()}}),x.addEventListener("click",()=>{t!==0&&(o=!o,o&&er(),w())});let D=()=>{o&&A()};window.addEventListener("resize",D),window.addEventListener("scroll",D,!0);let le=null,ne=0,Ie=()=>{ne+=1,ne===Qo&&console.warn("[react-grab-text] deck UI found no toolbar anchor after 10s \u2014 host toolbar markup may have changed");let m=document.querySelector(In)?.shadowRoot?.querySelector(In),v=m?.querySelectorAll("[data-react-grab-toolbar-action]"),Z=m?.querySelector(Yo),G=v?.length?v[v.length-1]:null,V=Cn(Z)??Cn(G);if(!V?.parentElement)return;c.attach(V);let z=m?.querySelector(`[${Y}="controls"]`);z&&z!==a&&z.remove(),a.isConnected&&a.previousElementSibling===V&&a.parentElement===V.parentElement||(a.isConnected&&a.remove(),V.insertAdjacentElement("afterend",a));let re=we(x);re!==le&&(le=re,o&&A()),ne=0};Ie();let et=window.setInterval(Ie,Jo),j=Be(m=>{t=m.length,t===0&&(o=!1),t>0&&r==="flash"?R("idle"):w(m)}),X=kn(m=>{n=m==="batch",w()});return{update:m=>{t=m,t===0&&(o=!1),t>0&&r==="flash"?R("idle"):w()},destroy:()=>{window.clearInterval(et),c.destroy(),window.removeEventListener("resize",D),window.removeEventListener("scroll",D,!0),window.removeEventListener("pointerdown",N,!0),i!==void 0&&window.clearTimeout(i),window.clearTimeout(b),C(),j(),X(),l.remove(),a.remove()}}};var Xe=e=>vt()?cn(e):null;var Ln=e=>e.map((t,n)=>`${n+1}.
${t.content}`).join(jt);var Ze=async e=>{if(navigator.clipboard&&window.isSecureContext)try{return await navigator.clipboard.writeText(e),!0}catch{}let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.setAttribute(W,"true"),t.setAttribute(F,"true"),t.setAttribute(ee,"true"),t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.opacity="0";let n=document.activeElement,o=window.getSelection(),r=o&&o.rangeCount>0?o.getRangeAt(0).cloneRange():null;document.body.appendChild(t),t.select();let i=!1;try{i=document.execCommand("copy")}catch{i=!1}return t.remove(),n instanceof HTMLElement&&n.isConnected&&n.focus({preventScroll:!0}),r&&o&&(o.removeAllRanges(),o.addRange(r)),i};var tr=e=>{let t=e.match(/`+/g)?.reduce((o,r)=>Math.max(o,r.length),0)??0,n="`".repeat(Math.max(3,t+1));return n+`
`+e+`
`+n},nr=async()=>{let e=ae(),t=Ln(e),n=e.length>0&&await Ze(t);n&&xe(e.map(r=>r.id));let o={itemCount:e.length,output:t,didCopy:n};return window.dispatchEvent(new CustomEvent("react-grab-deck:copy",{detail:o})),o},Mn=()=>({name:Kt,hooks:{transformCopyContent:tr,onCopySuccess:(e,t)=>{Xe(t)}},setup:()=>{let e=Rn(async()=>(await nr()).didCopy),t=Be(n=>e.update(n.length));return{cleanup:()=>{t(),e.destroy()}}}});var Pn=e=>{if(!e.includes("%"))return e;try{return decodeURIComponent(e)}catch{return e}};var or=(e,t)=>{let n=[t];if(e.componentName&&n.push(`in ${e.componentName}`),e.filePath){let o=e.lineNumber?`:${e.lineNumber}`:"";n.push(`(at ${Pn(e.filePath)}${o})`)}return`[${n.join(" ")}]`},$n=(e,t,n)=>{let o=n?t:t.trim();return o.includes(`
`)?`${e}:
"""
${o}
"""`:`${e}: "${o}"`},Dn=({source:e,elementPreview:t,before:n,after:o,textTransform:r,preserveWhitespace:i})=>[["Edit this text in the source: make the rendered text read as AFTER instead of BEFORE. Preserve surrounding markup, interpolations, and formatting.",!!r&&r!=="none"?` NOTE: this element renders with CSS text-transform: ${r}; BEFORE/AFTER are shown as rendered \u2014 keep the source string's original casing.`:""].join(""),"",or(e,t),$n("BEFORE",n,i),$n("AFTER",o,i)].join(`
`);var sr=new Set(["contenteditable","spellcheck",ie,q,Ee]),cr=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;"),lr=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Bn=(e,t)=>{let n=Array.from(e);return n.length<=t?e:`${n.slice(0,t-1).join("")}\u2026`},Nn=(e,t)=>{let n=e.tagName.toLowerCase(),o=[];for(let a of Array.from(e.attributes)){if(o.length>=4)break;if(sr.has(a.name))continue;let c=Bn(a.value,40);o.push(`${a.name}="${cr(c)}"`)}let r=o.length>0?` ${o.join(" ")}`:"",i=t.trim().split(`
`)[0]??"",s=lr(Bn(i,60));return`<${n}${r}>${s}</${n}>`};var Hn=(e,t)=>{if(typeof document.caretPositionFromPoint=="function"){let n=document.caretPositionFromPoint(e,t);if(!n)return null;try{let o=document.createRange();return o.setStart(n.offsetNode,n.offset),o.collapse(!0),o}catch{return null}}return typeof document.caretRangeFromPoint=="function"?document.caretRangeFromPoint(e,t):null};var On="react-grab-text-styles",Gn=()=>{if(document.getElementById(On))return;let e=document.createElement("style");e.id=On,e.setAttribute(W,"true"),e.setAttribute(ee,"true"),e.textContent=`
[${ie}] {
  outline: 1.5px solid #a855f7 !important;
  outline-offset: 2px !important;
  cursor: text !important;
}
[${q}] {
  outline: 1.5px solid #22c55e !important;
  outline-offset: 2px !important;
  transition: outline-color 0.9s ease 0.5s;
}
[${q}="fading"] {
  outline-color: transparent !important;
}
`,document.head.appendChild(e)};var ze=null,ce=null,qe=0,Ye=!1,ke=()=>ze,dr=(e,t)=>{let n=window.getSelection();if(!n)return;if(t){let r=Hn(t.x,t.y);if(r&&e.contains(r.startContainer)){n.removeAllRanges(),n.addRange(r);return}}let o=document.createRange();o.selectNodeContents(e),o.collapse(!1),n.removeAllRanges(),n.addRange(o)},ur=e=>{let t=window.getSelection();!t||!t.anchorNode||e.contains(t.anchorNode)&&t.removeAllRanges()},Te=new WeakMap,Un=e=>{let t=Te.get(e);t&&(cancelAnimationFrame(t.frame),window.clearTimeout(t.timeout),Te.delete(e))},pr=e=>{Un(e),e.setAttribute(q,"true");let t=requestAnimationFrame(()=>{let o=requestAnimationFrame(()=>{e.setAttribute(q,"fading")}),r=Te.get(e);r&&(r.frame=o)}),n=window.setTimeout(()=>{e.removeAttribute(q),Te.delete(e)},1600);Te.set(e,{frame:t,timeout:n})},mr=e=>e.key==="Enter"||e.code==="Enter"||e.code==="NumpadEnter",fr=(e,t)=>{let n=e;return t?.().then(o=>{n=o}).catch(()=>{}),()=>n},Vn=e=>{let t=ce;if(!t)return!1;let n=e.composedPath()[0]??e.target;return n instanceof Node&&t.element.contains(n)},Fn=e=>{let t=ce;if(!t||e.isComposing||e.keyCode===229)return;let n=Vn(e);if(e.key==="Escape"){n?(e.preventDefault(),e.stopImmediatePropagation(),t.cancel()):t.commit();return}if(n){if(mr(e)&&!e.shiftKey){e.preventDefault(),e.stopImmediatePropagation(),t.commit();return}if(e.key==="Tab"){e.preventDefault(),e.stopImmediatePropagation(),t.commit();return}e.stopImmediatePropagation()}},Je=e=>{Vn(e)&&e.stopImmediatePropagation()},Wn=e=>{let t=ce;if(!t)return;let n=e.composedPath()[0]??e.target;n instanceof Node&&(t.element.contains(n)||t.commit())},Kn=()=>{window.addEventListener("keydown",Fn,{capture:!0}),window.addEventListener("keyup",Je,{capture:!0}),window.addEventListener("keypress",Je,{capture:!0}),window.addEventListener("pointerdown",Wn,{capture:!0})},gr=()=>{window.removeEventListener("keydown",Fn,{capture:!0}),window.removeEventListener("keyup",Je,{capture:!0}),window.removeEventListener("keypress",Je,{capture:!0}),window.removeEventListener("pointerdown",Wn,{capture:!0})},jn=()=>{qe+=1,Ye=!1,Kn();let e=!1;return()=>{e||(e=!0,qe-=1,qe===0&&!Ye&&gr())}},hr=()=>{qe>0||Ye||(Ye=!0,Kn())},Xn=e=>{ze?.commit({quiet:!0}),hr();let{element:t,source:n,resolveSource:o,caretPoint:r,onFinish:i}=e;Gn(),Un(t),t.removeAttribute(q);let s=t.innerHTML,a=t.innerText,c=Nn(t,a),f=getComputedStyle(t),k=f.textTransform,y=f.whiteSpace.startsWith("pre"),x=fr(n,o),_=t.getAttribute("contenteditable"),l=t.hasAttribute(F),h=document.activeElement,A=t.getBoundingClientRect(),b=!0,T=$=>{if(t.getAttribute("contenteditable")!=="true")return;$.preventDefault();let d=$.clipboardData?.getData("text/plain");d&&document.execCommand("insertText",!1,d)};t.setAttribute("contenteditable","plaintext-only"),t.isContentEditable||t.setAttribute("contenteditable","true"),t.setAttribute(ie,"true"),t.setAttribute(Ee,"true"),t.setAttribute(F,"true"),t.addEventListener("paste",T),t.focus({preventScroll:!0}),dr(t,r);let S=$=>{let d=We();$(d),d.reposition(t.isConnected?t.getBoundingClientRect():A),window.setTimeout(()=>{d.destroy()},1600)},I=()=>{b=!1,ze=null,ce=null,t.removeEventListener("paste",T),t.removeAttribute(ie),t.removeAttribute(Ee),l||t.removeAttribute(F),_===null?t.removeAttribute("contenteditable"):t.setAttribute("contenteditable",_),ur(t),t.blur(),h instanceof HTMLElement&&h.isConnected&&h!==document.body&&h.focus({preventScroll:!0})},L=()=>{b&&(I(),t.isConnected&&(t.innerHTML=s),i?.(null))},U=async $=>{if(!b)return null;let d=!!$?.quiet,w=t.innerText;if(I(),y?w===a:w.trim()===a.trim()){let C=t.isConnected&&t.innerHTML!==s;return C&&(t.innerHTML=s),!d&&(C||w!==a)&&S(D=>D.showNoChange()),i?.(null),null}let N=Dn({source:x(),elementPreview:c,before:a,after:w,textTransform:k,preserveWhitespace:y});t.isConnected&&pr(t);let R=await Ze(N);R&&Xe(N),d||S(C=>{R?C.showCopied():C.showError("Copy failed")});let M={before:a,after:w,payload:N,didCopy:R};return window.dispatchEvent(new CustomEvent("react-grab-text:edit",{detail:M})),i?.(M),M},p={commit:U,cancel:L,isActive:()=>b};return ce&&ce.commit({quiet:!0}),ze=p,ce={element:t,commit:U,cancel:L},p};var kt=e=>!(e instanceof HTMLElement)||Wt.has(e.tagName)||e.closest(`svg, [${ee}]`)||e.querySelector("input, textarea, select, iframe, canvas, video, audio")?!1:e.innerText.trim().length>0;var fe=null,Qe=0,br=e=>e.composedPath().some(t=>t instanceof Element&&t.getAttributeNames().some(n=>n.startsWith("data-react-grab"))),Zn=e=>{br(e)||(fe={x:e.clientX,y:e.clientY,recordedAt:Date.now()})},zn=()=>{Qe+=1,Qe===1&&window.addEventListener("pointerdown",Zn,{capture:!0,passive:!0});let e=!1;return()=>{e||(e=!0,Qe-=1,Qe===0&&(window.removeEventListener("pointerdown",Zn,{capture:!0}),fe=null))}},qn=()=>!fe||Date.now()-fe.recordedAt>1e4?null:{x:fe.x,y:fe.y};var xr=e=>({filePath:e.filePath,lineNumber:e.lineNumber,componentName:e.componentName,tagName:e.tagName}),vr=(e,t,n)=>async()=>{if(!e||n.filePath&&n.componentName)return n;let o=await e.getSource(t).catch(()=>null);return{filePath:n.filePath??o?.filePath,lineNumber:n.lineNumber??o?.lineNumber??void 0,componentName:n.componentName??o?.componentName??e.getDisplayName(t)??void 0,tagName:n.tagName}},Yn=()=>{let e=null,t=null,n=()=>{let r=t;return t=null,r&&Date.now()-r.recordedAt<=1e4?{x:r.x-window.scrollX,y:r.y-window.scrollY}:qn()??void 0};return{name:Ut,hooks:{onDragStart:(r,i)=>{t={x:r,y:i,recordedAt:Date.now()}},onStateChange:r=>{r.isActive?ke()?.commit():t=null}},setup:r=>{e=r;let i=zn(),s=jn();return{cleanup:()=>{ke()?.commit({quiet:!0}),e=null,t=null,i(),s()}}},actions:[{id:Vt,label:Ft,shortcut:"T",shortcutModifier:!1,showInToolbarMenu:!0,enabled:r=>r.elements.length<=1&&kt(r.element),onAction:r=>{let{element:i}=r;if(!kt(i))return;let s=xr(r);r.hideContextMenu();let a=n();e?.deactivate(),Xn({element:i,source:s,resolveSource:vr(e,i,s),caretPoint:a})}}]}};var Jn=(e,t,n,o)=>t<=n?[[t,n]]:o<=e?[[o,e]]:[[Math.min(e,n),Math.max(e,n)],[Math.min(t,o),Math.max(t,o)]],Qn=(e,t)=>{let n=[],o=(e.top+e.bottom)/2,r=(e.left+e.right)/2;for(let[i,s]of Jn(e.left,e.right,t.left,t.right))i===void 0||s===void 0||i===s||n.push({x1:i,y1:o,x2:s,y2:o,value:s-i});for(let[i,s]of Jn(e.top,e.bottom,t.top,t.bottom))i===void 0||s===void 0||i===s||n.push({x1:r,y1:i,x2:r,y2:s,value:s-i});return n},ge=e=>String(Math.round(e*10)/10);var It="http://www.w3.org/2000/svg",P=8,_t=22,eo="negative-margin",Se=(e,t)=>{let n=document.createElementNS(It,e);for(let[o,r]of Object.entries(t))n.setAttribute(o,String(r));return n},to=e=>{let t=document.createElement("div");t.setAttribute("data-react-grab-measure","overlay"),t.setAttribute("data-react-grab-ignore","true"),t.style.cssText=`all:initial;position:fixed;inset:0;pointer-events:none;z-index:${2147483646};`;let n=t.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=`
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
  `;let r=document.createElementNS(It,"svg");r.setAttribute("aria-hidden","true");let i=Se("pattern",{id:eo,width:6,height:6,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"});i.append(Se("rect",{width:6,height:6,fill:"#f59e0b26"}),Se("line",{x1:0,y1:0,x2:0,y2:6,stroke:"#f59e0b","stroke-width":2,"stroke-opacity":.5}));let s=Se("defs",{});s.append(i),r.append(s);let a=document.createElement("div");a.className="details",a.setAttribute("data-measure-details","");let c=document.createElement("div");c.className="hint",c.setAttribute("data-measure-hint",""),c.setAttribute("role","status"),n.append(o,r,a,c),document.body.append(t);let f="",k={text:"",maxWidth:"",width:0,height:0},y=(h,A)=>{r.append(Se(h,A))},x=(h,A,b,T,S,I="none")=>{y("rect",{x:h,y:A,width:Math.max(0,b),height:Math.max(0,T),fill:S,stroke:I})},_=(h,A,b,T,S,I=!1)=>{y("line",{x1:h,y1:A,x2:b,y2:T,stroke:S,"stroke-width":1,...I?{"stroke-dasharray":"3 3"}:{}})},l=(h,A,b)=>{let T=b.length*7+12,S=Math.max(P,Math.min(h-T/2,innerWidth-T-P)),I=Math.max(P,Math.min(A-_t/2,innerHeight-_t-P));y("rect",{x:S,y:I,width:T,height:_t,rx:4,fill:"var(--measure-ink)"});let L=document.createElementNS(It,"text");L.setAttribute("x",String(S+T/2)),L.setAttribute("y",String(I+15)),L.setAttribute("text-anchor","middle"),L.setAttribute("data-measure-distance",b),L.textContent=b,r.append(L)};return{host:t,render:(h,A)=>{let b=h??A,T=b?.getBoundingClientRect(),S=A?.getBoundingClientRect(),I=b?getComputedStyle(b):null,L=["Top","Right","Bottom","Left"].map(H=>parseFloat(I?.getPropertyValue(`padding-${H.toLowerCase()}`)??"0")||0),U=["top","right","bottom","left"].map(H=>parseFloat(I?.getPropertyValue(`margin-${H}`)??"0")||0),p=["top","right","bottom","left"].map(H=>parseFloat(I?.getPropertyValue(`border-${H}-width`)??"0")||0),$=b?`${b.localName}${b.id?`#${b.id}`:""}`:"",d=e.closest("[data-react-grab-toolbar-panel]")?.getBoundingClientRect()??e.getBoundingClientRect(),w=we(e),K=JSON.stringify([T,S,L,U,p,$,h===A,innerWidth,innerHeight,d,w]);if(K===f)return;f=K;let N=b instanceof HTMLElement&&T&&b.offsetWidth?T.width/b.offsetWidth:1,R=b instanceof HTMLElement&&T&&b.offsetHeight?T.height/b.offsetHeight:1;r.replaceChildren(s);let M=A?"Hover another element to measure \xB7 Click to change anchor \xB7 Esc to clear":"Measure \xB7 Hover to inspect \xB7 Click to anchor \xB7 Esc to exit",D=`${Math.min(w==="left"||w==="right"?260:600,window.innerWidth-P*2)}px`;(M!==k.text||D!==k.maxWidth)&&(c.textContent=M,c.style.maxWidth=D,k={text:M,maxWidth:D,width:c.offsetWidth,height:c.offsetHeight});let{width:le,height:ne}=k,Ie=w==="left"?d.right+P:w==="right"?d.left-le-P:d.left+(d.width-le)/2,et=w==="top"?d.bottom+P:w==="bottom"?d.top-ne-P:d.top+(d.height-ne)/2;if(c.style.left=`${Math.max(P,Math.min(Ie,window.innerWidth-le-P))}px`,c.style.top=`${Math.max(P,Math.min(et,window.innerHeight-ne-P))}px`,a.hidden=!T,!T||!b)return;let{left:j,top:X,right:m,bottom:v,width:Z,height:G}=T,[V=0,z=0,oe=0,re=0]=L,[Q=0,de=0,ue=0,he=0]=U,[be=0,Rt=0,Lt=0,Mt=0]=p,lo="#f59e0b30",Ce=H=>H<0?`url(#${eo})`:lo,Pt=Math.abs(Q)*R,$t=Math.abs(de)*N,Dt=Math.abs(ue)*R,Bt=Math.abs(he)*N;x(j,Q<0?X:X-Pt,Z,Pt,Ce(Q)),x(de<0?m-$t:m,X,$t,G,Ce(de)),x(j,ue<0?v-Dt:v,Z,Dt,Ce(ue)),x(he<0?j:j-Bt,X,Bt,G,Ce(he));let tt=j+Mt*N,nt=X+be*R,Nt=Math.max(0,Z-(Mt+Rt)*N),Ht=Math.max(0,G-(be+Lt)*R),Re="#22c55e35";x(tt,nt,Nt,V*R,Re),x(m-(Rt+z)*N,nt,z*N,Ht,Re),x(tt,v-(Lt+oe)*R,Nt,oe*R,Re),x(tt,nt,re*N,Ht,Re),x(j,X,Z,G,"#7c3aed08","var(--measure-ink)");for(let H of[j,m])_(H,0,H,window.innerHeight,"#7c3aed35",!0);for(let H of[X,v])_(0,H,window.innerWidth,H,"#7c3aed35",!0);if(S&&h&&h!==A){x(S.left,S.top,S.width,S.height,"none","var(--measure-anchor)");for(let H of Qn(S,T)){let{x1:ot,y1:Le,x2:rt,y2:Me,value:po}=H,Pe=Le===Me;_(ot,Le,rt,Me,"var(--measure-ink)");for(let[it,at]of[[ot,Le],[rt,Me]])it===void 0||at===void 0||_(it-(Pe?0:3),at-(Pe?3:0),it+(Pe?0:3),at+(Pe?3:0),"var(--measure-ink)");l((ot+rt)/2,(Le+Me)/2,`${ge(po)} px`)}}a.textContent=`${h===A?"Anchor \xB7 ":""}${$}  ${ge(Z)} \xD7 ${ge(G)} px
Padding  ${L.map(ge).join("  ")}
Margin    ${U.map(ge).join("  ")}
Top \xB7 Right \xB7 Bottom \xB7 Left`;let uo=a.offsetWidth,Ot=a.offsetHeight,Gt=X-Ot-P;a.style.left=`${Math.max(P,Math.min(j,window.innerWidth-uo-P))}px`,a.style.top=`${Math.max(P,Math.min(Gt>=P?Gt:v+P,window.innerHeight-Ot-P))}px`},destroy:()=>t.remove()}};var yr=500,Ar=20,wr=5,oo="[data-react-grab], [data-react-grab-ignore], [data-react-grab-ignore-events]",Tr=()=>{let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("width","14"),e.setAttribute("height","14"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("aria-hidden","true"),e.style.pointerEvents="none";let t=document.createElementNS(e.namespaceURI,"path");return t.setAttribute("d","M3 7h18v10H3z M7 7v5 M11 7v3 M15 7v5 M19 7v3"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","1.8"),t.setAttribute("stroke-linejoin","round"),e.append(t),e},_e=e=>e.composedPath().some(t=>t instanceof Element&&t.matches(oo)),no=(e,t)=>{let n=document.elementFromPoint(e,t);for(;n?.shadowRoot;){let o=n.shadowRoot.elementFromPoint(e,t);if(!o||o===n)break;n=o}return!n||n.closest(oo)||n===document.documentElement?null:n},ro=()=>{let e=()=>{};return{name:"measure",hooks:{onStateChange:t=>{t.isActive&&e()}},setup:t=>{let n=null,o=null,r=null,i=0,s=null,a=Tr(),{wrapper:c,button:f}=$e("measure","Measure",a);f.removeAttribute("data-react-grab-deck-ui"),f.setAttribute("data-react-grab-measure","toggle"),f.setAttribute("aria-pressed","false");let k=Ke(c);e=()=>{cancelAnimationFrame(i),n?.destroy(),n=null,o=null,r=null,f.setAttribute("aria-pressed","false"),J(a,!1)};let y=()=>{if(!n)return;o&&!o.isConnected&&(o=null);let p=r?no(r.x,r.y):null;n.render(p??o,o),i=requestAnimationFrame(y)};f.addEventListener("click",p=>{if(p.stopPropagation(),s&&s.peak>wr){s=null;return}if(s=null,n){e();return}ke()?.commit(),t.deactivate(),n=to(f),f.setAttribute("aria-pressed","true"),J(a,!0),y()});let x=p=>{s&&(s.peak=Math.max(s.peak,Math.hypot(p.clientX-s.x,p.clientY-s.y))),n&&(r=_e(p)?null:{x:p.clientX,y:p.clientY})},_=p=>{if(p.composedPath().includes(f)){s={x:p.clientX,y:p.clientY,peak:0};return}if(n){if(_e(p)){e();return}p.preventDefault(),p.stopPropagation()}},l=p=>{!n||_e(p)||(p.preventDefault(),p.stopPropagation(),p.button===0&&(o=no(p.clientX,p.clientY),r={x:p.clientX,y:p.clientY}))},h=p=>{!n||_e(p)||(p.preventDefault(),p.stopPropagation())},A=p=>{!n||_e(p)||(p.preventDefault(),p.stopPropagation())},b=p=>{n&&(p.code==="Escape"||p.key==="Escape"?(p.preventDefault(),p.stopPropagation(),o?o=null:e()):p.key==="Tab"&&e())},T=p=>{p.relatedTarget||(r=null)},S=()=>{s=null};window.addEventListener("pointermove",x,!0),window.addEventListener("pointerdown",_,!0),window.addEventListener("click",l,!0),window.addEventListener("auxclick",l,!0),window.addEventListener("dblclick",l,!0),window.addEventListener("contextmenu",h,!0),window.addEventListener("pointerup",A,!0),window.addEventListener("keydown",b,!0),window.addEventListener("mouseout",T),window.addEventListener("blur",S),window.addEventListener("pointercancel",S);let I=0,L=()=>{I+=1,I===Ar&&console.warn("[react-grab-text] measure found no toolbar anchor after 10s \u2014 host toolbar markup may have changed");let p=document.querySelector("[data-react-grab]")?.shadowRoot,$=p?.querySelectorAll("[data-react-grab-toolbar-action]"),w=(p?.querySelector('[data-react-grab-toolbar-action="text"]')??($?.length?$[$.length-1]:null))?.parentElement;w?.parentElement&&c.nextElementSibling!==w&&w.before(c),w&&k.attach(w),n&&!c.isConnected&&e(),w&&(I=0)};L();let U=window.setInterval(L,yr);return{cleanup:()=>{e(),window.clearInterval(U),k.destroy(),window.removeEventListener("pointermove",x,!0),window.removeEventListener("pointerdown",_,!0),window.removeEventListener("click",l,!0),window.removeEventListener("auxclick",l,!0),window.removeEventListener("dblclick",l,!0),window.removeEventListener("contextmenu",h,!0),window.removeEventListener("pointerup",A,!0),window.removeEventListener("keydown",b,!0),window.removeEventListener("mouseout",T),window.removeEventListener("blur",S),window.removeEventListener("pointercancel",S),c.remove()}}}}};var kr=()=>window.__REACT_GRAB__,io=e=>{let t=kr();if(!t||typeof t.registerPlugin!="function")return!1;try{t.registerPlugin(e())}catch(n){console.error("[react-grab-text] Failed to register plugin:",n)}return!0},Ct=e=>{if(typeof window>"u"||io(e))return;let t=()=>{io(e)};window.addEventListener("react-grab:init",t,{once:!0})},ao=()=>{Ct(Yn)},so=()=>{Ct(Mn)},co=()=>{Ct(ro)};ao();so();co();})();
