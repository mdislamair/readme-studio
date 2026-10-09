const templates = [
  {id:"01-modern-animated",name:"Modern Animated",category:"Animated",style:"animated",description:"A lively profile with typing text, tech badges, projects, and contact links.",file:"templates/01-modern-animated.md",tags:["Typing effect","Badges","Projects"]},
  {id:"02-minimal",name:"Minimal",category:"Minimal",style:"minimal",description:"A clean, no-fuss layout that puts your introduction and work first.",file:"templates/02-minimal.md",tags:["Clean","Lightweight","Simple"]},
  {id:"03-professional",name:"Professional",category:"Professional",style:"professional",description:"A recruiter-friendly profile focused on skills, experience, and selected work.",file:"templates/03-professional.md",tags:["Career","Portfolio","Skills"]},
  {id:"04-student-learner",name:"Student & Learner",category:"Creative",style:"student",description:"Show your learning roadmap, practice projects, and progress honestly.",file:"templates/04-student-learner.md",tags:["Student","Roadmap","Learning"]},
  {id:"05-creator-freelancer",name:"Creator & Freelancer",category:"Creative",style:"creative",description:"Present services, work samples, process, and ways clients can contact you.",file:"templates/05-creator-freelancer.md",tags:["Freelance","Services","Portfolio"]},
  {id:"06-terminal-style",name:"Terminal Style",category:"Creative",style:"terminal",description:"A command-line-inspired README for fans of a technical aesthetic.",file:"templates/06-terminal-style.md",tags:["Terminal","Code","Developer"]}
];
const grid = document.querySelector("#template-grid");
const search = document.querySelector("#search");
const count = document.querySelector("#result-count");
const noResults = document.querySelector("#no-results");
const toast = document.querySelector("#toast");
let activeFilter = "All";
function previewMarkup(){return `<div class="preview-top"><span class="preview-avatar"></span><span class="preview-lines"><i></i><i></i></span></div><div class="preview-pill-row"><i></i><i></i><i></i></div><div class="preview-heading"></div><div class="preview-copy"></div><div class="preview-copy small"></div><div class="preview-heading"></div><div class="preview-cards"><i></i><i></i><i></i></div>`}
function render(){
 const q=search.value.trim().toLowerCase();
 const filtered=templates.filter(t=>(activeFilter==="All"||t.category===activeFilter||(activeFilter==="Animated"&&t.category==="Animated")) && (t.name+" "+t.description+" "+t.tags.join(" ")).toLowerCase().includes(q));
 grid.innerHTML=filtered.map((t,i)=>`<article class="template-card style-${t.style}" style="animation-delay:${i*55}ms"><div class="card-preview">${previewMarkup()}</div><div class="card-topline"><h3>${t.name}</h3><span class="tag">${t.category}</span></div><p class="card-description">${t.description}</p><div class="card-footer"><a class="card-button" href="${t.file}" target="_blank" rel="noreferrer">Preview ↗</a><button class="card-button download" data-file="${t.file}" data-name="${t.id}.md">↓ Download</button></div></article>`).join("");
 count.textContent=filtered.length;noResults.hidden=filtered.length!==0;
 grid.querySelectorAll("button.download").forEach(btn=>btn.addEventListener("click",()=>downloadTemplate(btn.dataset.file,btn.dataset.name)));
}
async function downloadTemplate(file,name){
 try{
  const response=await fetch(file);
  if(!response.ok) throw new Error("Could not load template");
  const text=await response.text();
  const blob=new Blob([text],{type:"text/markdown;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="README.md";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  showToast("README.md download started");
 }catch(e){
  // Local file:// preview blocks fetch in some browsers; the template page remains available to copy manually.
  window.open(file,"_blank","noopener");
  showToast("Opened template. Use your browser's save or copy option.");
 }
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2800)}
search.addEventListener("input",render);
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.filter;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));render()}));
render();
