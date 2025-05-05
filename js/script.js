let menuToggle = document.querySelector("a.menu-toggle");
let menu = document.querySelector(".menu-container");

menuToggle.onclick = function() {
	this.classList.toggle("open");
	menu.classList.toggle("open");
}