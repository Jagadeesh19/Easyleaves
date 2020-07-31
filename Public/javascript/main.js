const toggleButton=document.querySelector(".toggle-button");
const mobileNav=document.querySelector(".mobile-nav");
const backdrop=document.querySelector(".backdrop");

toggleButton.addEventListener("click",()=>{
   mobileNav.style.display="block";
   backdrop.style.display="block";
});

backdrop.addEventListener("click",()=>{
   mobileNav.style.display="none";
   backdrop.style.display="none";
})
