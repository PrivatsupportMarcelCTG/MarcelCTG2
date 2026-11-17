const menu=document.querySelector('.menu'),links=document.querySelector('.links');
if(menu)menu.addEventListener('click',()=>links.classList.toggle('open'));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const form=document.querySelector('#contact-form');
if(form)form.addEventListener('submit',e=>{e.preventDefault();alert('Danke! Verbinde dieses Formular mit deinem E-Mail- oder Form-Service, damit Nachrichten ankommen.');form.reset()});