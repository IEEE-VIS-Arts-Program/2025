let db;
let hash = "";
let focusClasses = ["normal", "focus", "featured"];

const groupView = document.getElementById("project-group-view");
const projectView = document.getElementById("project-view");

const pictCardsContainer = document.getElementById("pictorials-cc");
const paperCardsContainer = document.getElementById("papers-cc");
const artCardsContainer = document.getElementById("artworks-cc");

const projectTitle = document.getElementById("project-title");
const projectTitleAuthors = document.getElementById("project-title-authors");
const projectGallery = document.getElementById("project-gallery-container");
const projectDesc = document.getElementById("project-description");
const projectAuthors = document.getElementById("project-author-container");
const projectPager = document.getElementById("project-pager-container");
const projectPagerPrev = document.getElementById("project-pager-prev");
const projectPagerNext = document.getElementById("project-pager-next");


fetch('contributions.json')
	.then(response => response.json())
	.then(data => setupJson(data))
	.catch(error => console.log(error));

function setupJson(obj) {
	db = obj.data;
	
	createCards(db.pictorials, pictCardsContainer);	
	createCards(db.papers, paperCardsContainer);	
	createCards(db.artworks, artCardsContainer);

	setupPage();	
}

function createCards(projects, container) {
	for(const project of projects) {
		let title = project.title;
		let slug = project.slug;
		let firstImg = project.images[0].filename;

		let card = document.createElement("a");
		card.setAttribute("href", "#"+slug);
		card.setAttribute("class", "card");
		card.addEventListener("click", (e) => {
			/*e.preventDefault();
			window.location.hash = project.slug;
			setupPage();*/
		});
		
		let cardImg = document.createElement("div");
		cardImg.setAttribute("class", "image");

		let img = document.createElement("img");
		img.setAttribute("src", "gallery/project-thumbs/"+firstImg);

		cardImg.appendChild(img);

		let cardText = document.createElement("div");
		cardText.setAttribute("class", "title");
		cardText.innerHTML = title;

		card.appendChild(cardImg);
		card.appendChild(cardText);

		container.appendChild(card);
	}
}

function getProjectObj(slug) {
	let arr = db.pictorials;
	for (var i=0; i<arr.length; i++) {
		if(arr[i].slug == slug) {
			if((i+1) < arr.length) {
				arr[i].nextSlug = arr[i+1].slug;
				arr[i].nextTitle = arr[i+1].title;
			}else {
				arr[i].nextSlug = "";
				arr[i].nextTitle = "";
			}

			if((i-1) > -1) {
				arr[i].prevSlug = arr[i-1].slug;
				arr[i].prevTitle = arr[i-1].title;
			}else {
				arr[i].prevSlug = "";
				arr[i].prevTitle = "";
			}
			return arr[i];
		}
	}

	arr = db.papers;
	for (var i=0; i<arr.length; i++) {
		if(arr[i].slug == slug) {
			if((i+1) < arr.length) {
				arr[i].nextSlug = arr[i+1].slug;
				arr[i].nextTitle = arr[i+1].title;
			}else {
				arr[i].nextSlug = "";
				arr[i].nextTitle = "";
			}

			if((i-1) > -1) {
				arr[i].prevSlug = arr[i-1].slug;
				arr[i].prevTitle = arr[i-1].title;
			}else {
				arr[i].prevSlug = "";
				arr[i].prevTitle = "";
			}
			return arr[i];
		}
	}

	arr = db.artworks;
	for (var i=0; i<arr.length; i++) {
		if(arr[i].slug == slug) {
			if((i+1) < arr.length) {
				arr[i].nextSlug = arr[i+1].slug;
				arr[i].nextTitle = arr[i+1].title;
			}else {
				arr[i].nextSlug = "";
				arr[i].nextTitle = "";
			}

			if((i-1) > -1) {
				arr[i].prevSlug = arr[i-1].slug;
				arr[i].prevTitle = arr[i-1].title;
			}else {
				arr[i].prevSlug = "";
				arr[i].prevTitle = "";
			}
			return arr[i];
		}
	}

	return false;
}

function setupPage() {
	if(window.location.hash) {
		var slug = window.location.hash.substring(1);
		setupProject(slug);
		groupView.hidden = true;
		projectView.hidden = false;
	}else {
		projectView.hidden = true;
		groupView.hidden = false;
	}
}

function setupProject(slug) {
	window.scrollTo(0, 0);

	let proj = getProjectObj(slug);
	projectTitle.innerHTML = '<span class="category">'+proj.type+'</span>'+proj.title;

	projectAuthors.innerHTML = "";
	let authorsList = [];
	for(const author of proj.authors) {
		authorsList.push(author.name);

		let aut = document.createElement("div");
		aut.classList.add("author");

		let autImgCont = document.createElement("div");
		autImgCont.classList.add("image-container");

		let autImg = document.createElement("div");
		autImg.classList.add("image");
		autImg.style.backgroundImage = "url(gallery/authors/"+author.image+")";

		autImgCont.appendChild(autImg);

		let autBio = document.createElement("div");
		autBio.classList.add("author-bio");
		
		if(author.web != "") {
			autBio.innerHTML = "<h3><a href='"+author.web+"' target='_blank'>"+author.name+"</a></h3> <p>"+author.bio+"</p>";
		}else {
			autBio.innerHTML = "<h3>"+author.name+"</h3> <p>"+author.bio+"</p>";
		}

		aut.appendChild(autImgCont);
		aut.appendChild(autBio);

		projectAuthors.appendChild(aut);
	}

	projectTitleAuthors.innerHTML = authorsList.join(", ");
	projectGallery.innerHTML = "";

	let c = 0;
	for(const imgitem of proj.images) {
		//let fclass = focusClasses[Math.floor(Math.random()*focusClasses.length)];
		let item = document.createElement("div");
		item.classList.add("item");
		//item.classList.add(fclass);
		if(c==0) item.classList.add("featured");
		let img = document.createElement("img");
		img.setAttribute("src", "gallery/project-images/"+imgitem.filename);

		item.appendChild(img);

		projectGallery.appendChild(item);

		c++;
	}

	let descLead = proj.desc.substring(0, proj.desc.indexOf(".")+1);
	let descMore = proj.desc.substring(proj.desc.indexOf(".")+2);
	projectDesc.innerHTML = "<p class='lead'>"+descLead+"</p><p>"+descMore+"</p>";

	if(proj.prevSlug != "") {
		projectPagerPrev.setAttribute("href", "#"+proj.prevSlug);
		projectPagerPrev.hidden = false;
	}else {
		projectPagerPrev.hidden = true;
	}

	if(proj.nextSlug != "") {
		projectPagerNext.setAttribute("href", "#"+proj.nextSlug);
		projectPagerNext.hidden = false;
	}else {
		projectPagerNext.hidden = true;
	}
	
	

}

window.addEventListener('popstate', function(event) {
	window.scrollTo(0, 0);
    setupPage();
});
