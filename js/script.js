const ulElement = document.querySelector("ul");
const systemeAPI = fetch("https://api.le-systeme-solaire.net/rest/bodies/");
const colorPlanet = [[174,233,255],[30,95,247],[238,200,112],[232,130,28],[201,164,62],[249,235,109],[116,116,213],[246,182,7]];
const mockPlanetData = {
    "mercure": { discoveredBy: "Anciens Sumériens", discoveryDate: "3000 av. J.-C." },
    "venus": { discoveredBy: "Anciens Babyloniens", discoveryDate: "1600 av. J.-C." },
    "terre": { discoveredBy: "N/A", discoveryDate: "N/A" },
    "mars": { discoveredBy: "Anciens Égyptiens", discoveryDate: "1534 av. J.-C." },
    "jupiter": { discoveredBy: "Anciens Babyloniens", discoveryDate: "VIIe siècle av. J.-C." },
    "saturne": { discoveredBy: "Anciens Assyriens", discoveryDate: "VIIIe siècle av. J.-C." }
};
let listObjects = [];
let planetWindow, planetList, planetInfo, backButton, toggleButton;
let stars = [];
let sky = 0;
let cameraX = 0;
let cameraY = 0;
let cameraSpeed = 5;

let cols = 40;
let rows = 40;
let vertices = [];

/**
 * Créer le lien avec l'API et récupère les données.
*/
systemeAPI.then(response => {
    return response.json();
}).then(json => {
    const orbitSpeed = calculOrbitSpeed(json.bodies)
    json.bodies.forEach(element => {
        if (element.isPlanet === true){
            listObjects.push(element)
            addColorAndOrbitSpeed(listObjects, orbitSpeed);
        }
    });
    createPlanetList(listObjects)
})

/**
 * Initialise le canvas
*/
let btnD;

function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    createSliders();
    btnD = createButtonDirectional();

    // Create stars
    for (let i = 0; i < 300; i++) {
        stars[i] = new Star(
        random(-width/1.5, width/1.5),  // x position
        random(-height/1.5, height/1.5), // y position
        random(-500, 0),  // z position (depth)
        random(255),  // color
        random(0.1, 3),  // twinkle speed
        random(1)  // twinkle direction
        );
    }

    planetWindow = document.getElementById("planet-window");
    planetList = document.getElementById("planet-list");
    planetInfo = document.getElementById("planet-info");
    backButton = document.getElementById("back-button");
    toggleButton = document.getElementById("toggle-planet-window");

    backButton.addEventListener("click", showPlanetList);
    toggleButton.addEventListener("click", togglePlanetWindow);

    //texture planet and sun
    imageMode(CENTER);
    createSun()

}

/**
 * Créé les sliders
 */
function createSliders() {
    
    // Create sliders
    zoom = createSlider(0, 600, 0, 1);
    zoom.parent('zoom-slider');
    zoom.class('slider');

    orbitSpeedSlider = createSlider(0, 0.8, 0.4, 0.001);
    orbitSpeedSlider.parent('orbit-speed-slider');
    orbitSpeedSlider.class('slider');

    // Array of sliders for easy iteration if needed
    let sliders = [zoom, orbitSpeedSlider];

    // Additional configuration can be done here if needed
    sliders.forEach(slider => {
        slider.style('width', '100%');
    });
}

function togglePlanetWindow() {
    if (planetWindow.classList.contains("hidden")) {
        planetWindow.classList.remove("hidden");
        toggleButton.textContent = "Hide Planets";
    } else {
        planetWindow.classList.add("hidden");
        toggleButton.textContent = "Show Planets";
    }
}

function createButtonDirectional() {
    return new Directional(
        width * 0.5,  // Changez la position si nécessaire
        height * 0.5, // Changez la position si nécessaire
        250,           // Taille du bouton
        () => {
            console.log("Bouton directionnel pressé");
        }
    );
}

/**
 * Affiche l'animation chaque frames
*/
function draw() {
    background(sky);
  
    for (let i = 0; i < stars.length; i++) {
        stars[i].twinkle();
        stars[i].showStar();
    }
    
    // Add a subtle ambient light
    ambientLight(20, 20, 20);
    
    noStroke();
    fill(255);
    angleMode(DEGREES);
    btnD.show();
    translate(cameraX, cameraY, zoom.value());
    rotateX(-20);
    push();
    rotateY(millis()/100);
    drawSun();
    pop();
    createPlanet();
}

function createSun() {
    noStroke();
    for (let theta = 0; theta <= rows; theta++) {
        vertices.push([]);
        for (let phi = 0; phi <= cols; phi++) {
            let noiseX = map(sin(theta * PI / rows) * cos(phi * TWO_PI / cols), -1, 1, 0, 2);
            let noiseY = map(cos(theta * PI / rows), -1, 1, 0, 4);
            let noiseZ = map(sin(theta * PI / rows) * sin(phi * TWO_PI / cols), -1, 1, 0, 2);

            let noiseValue = noise(noiseX, noiseY, noiseZ);
            noiseValue = pow(noiseValue, 0.5); // Increase contrast
            
            // Base color (brighter)
            let r = map(noiseValue, 0, 1, 220, 255);
            let g = map(noiseValue, 0, 1, 150, 240);
            let b = map(noiseValue, 0, 1, 50, 100);
            
            // Emissive color (even brighter)
            let emissiveR = map(noiseValue, 0, 1, 200, 255);
            let emissiveG = map(noiseValue, 0, 1, 100, 220);
            let emissiveB = map(noiseValue, 0, 1, 0, 80);
            
            let pos = createVector(
                70 * sin(theta * PI / rows) * cos(phi * TWO_PI / cols),
                70 * cos(theta * PI / rows),
                70 * sin(theta * PI / rows) * sin(phi * TWO_PI / cols)
            );
            
            vertices[theta].push([
                pos, 
                color(r, g, b),
                color(emissiveR, emissiveG, emissiveB)
            ]);
        }
    }
}

function drawSun(){
    push();
    for(let theta = 0; theta < vertices.length - 1; theta++){
        for(let phi = 0; phi < vertices[theta].length - 1; phi++){
            let colorValue1 = vertices[theta][phi][1];
            let emissiveValue1 = vertices[theta][phi][2];
            let colorValue2 = vertices[theta+1][phi][1];
            let emissiveValue2 = vertices[theta+1][phi][2];
            let colorValue3 = vertices[theta+1][phi+1][1];
            let emissiveValue3 = vertices[theta+1][phi+1][2];
            let colorValue4 = vertices[theta][phi+1][1];
            let emissiveValue4 = vertices[theta][phi+1][2];
            
            beginShape(TRIANGLES);
            
            fill(colorValue1);
            emissiveMaterial(emissiveValue1);
            vertex(vertices[theta][phi][0].x, vertices[theta][phi][0].y, vertices[theta][phi][0].z);
            
            fill(colorValue2);
            emissiveMaterial(emissiveValue2);
            vertex(vertices[theta+1][phi][0].x, vertices[theta+1][phi][0].y, vertices[theta+1][phi][0].z);
            
            fill(colorValue3);
            emissiveMaterial(emissiveValue3);
            vertex(vertices[theta+1][phi+1][0].x, vertices[theta+1][phi+1][0].y, vertices[theta+1][phi+1][0].z);
            
            fill(colorValue1);
            emissiveMaterial(emissiveValue1);
            vertex(vertices[theta][phi][0].x, vertices[theta][phi][0].y, vertices[theta][phi][0].z);
            
            fill(colorValue3);
            emissiveMaterial(emissiveValue3);
            vertex(vertices[theta+1][phi+1][0].x, vertices[theta+1][phi+1][0].y, vertices[theta+1][phi+1][0].z);
            
            fill(colorValue4);
            emissiveMaterial(emissiveValue4);
            vertex(vertices[theta][phi+1][0].x, vertices[theta][phi+1][0].y, vertices[theta][phi+1][0].z);
            
            endShape();
        }
    }
    pop();
}

/**
 * Créée les planètes les unes après les autres
*/
function createPlanet(){
    for (let i = 0; i < listObjects.length; i++){
        rotateY(millis()/listObjects[i].orbitSpeed*orbitSpeedSlider.value());
        push();
        sphere(1);
        emissiveMaterial(listObjects[i].colorPlanet);
        translate(listObjects[i].aphelion/10000000+120,0);
        sphere(listObjects[i].equaRadius/5000);
        pop();
    }
}

/**
 * Ajuste la taille du sketch en fonction de la taille de la fenêtre
*/
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/**
 * @param {Array} json Tableau contenant tout les objets de l'API
 * Calcul la vitesse orbital des sphères
*/
function calculOrbitSpeed(json){
    let orbitSpeed = []
    for (let i = 0; i < json.length; i++) {
        if (json[i].isPlanet === true){
            orbitSpeed.push((2*Math.PI*json[i].semimajorAxis/json[i].sideralOrbit)/8640);
        }
    }
    return orbitSpeed
}

/**
 * @param {Array} listObjects Tableau contenant toute les planetes
 * @param {Array} orbitSpeed  Tableau contenant toute les vitesses orbital
 * Ajoute les données 'colorPlanet' et 'orbitSpeed' à la liste des objets
*/
function addColorAndOrbitSpeed(listObjects,orbitSpeed){
    for (i = 0; i < listObjects.length; i++) {
        listObjects[i].colorPlanet = colorPlanet[i]
        listObjects[i].orbitSpeed = orbitSpeed[i]
    }
}

/**
 * @param {Array} listObjects Tableau contenant toute les planetes
 * Range les planetes dans l'ordre croissant de leurs aphelion, 
 * créé la balise <li> ainsi que les boutons
 * AddEventListener pour chaque boutons
 */
function createPlanetList(listObjects){
    let buttonArray= [];
    const copyListObjects = [...listObjects]
    copyListObjects.sort((a, b) => a.aphelion - b.aphelion);
    const ulElement = document.getElementById("planet-buttons");
    ulElement.innerHTML = ""; // Vider la liste existante
   
    copyListObjects.forEach(element => {
        const liElement = document.createElement("li");
        const planetButton = document.createElement("button");
        // liElement.classList.add("visible");
        planetButton.setAttribute("id",element.id);
        planetButton.innerText = element.name;
        planetButton.classList.add("planet-button");
        ulElement.appendChild(liElement); 
        liElement.appendChild(planetButton);
        buttonArray.push(planetButton)
    });

    for(i=0; i<copyListObjects.length; i++){
        buttonArray[i].addEventListener("click",(e)=> {
            const planet = e.target.id;
            displayPlanetInfo(planet, copyListObjects);  
        });
    }
    showPlanetList();
    if (window.innerWidth <= 768) {
        planetWindow.classList.add("hidden"); // Initially hide on mobile
    }

}

/**
 * @param {String} planet Chaine de caractère représantant le nom des planetes
 * @param {Array} listPlanets Copie du tableau contenant toute les planetes
 * Fonction appelée lors du 'click' et affiche les infos choisis préalablement choisis
 */
function displayPlanetInfo(planet, listPlanets){
    const whiteList = ['name', 'englishName', 'perihelion', 'aphelion', 'inclination', 'density', 'gravity', 'meanRadius', 'sideralOrbit', 'sideralRotation', 'discoveredBy', 'bodyType', 'discoveryDate']
    const infoContent = document.getElementById("info-content");
    infoContent.innerText = "";
    
    listPlanets.forEach(element =>{
        if (element.id === planet){
            // Merge mock data with API data
            const mergedElement = { ...element, ...mockPlanetData[element.id] };

            for(const [key, value] of Object.entries(mergedElement)) {
                for (i=0; i<key.length; i++){
                    if (key === whiteList[i]) {
                        const pElement = document.createElement("p");
                        const titreElement = document.createElement("span");
                        const valueElement = document.createElement("span");
                        titreElement.classList.add("titre")
                        titreElement.innerText = key
                        valueElement.innerText = value
                        pElement.appendChild(titreElement)
                        pElement.appendChild(valueElement)
                        infoContent.appendChild(pElement);
                    }
                }
                    
            }
        }
    })
    showPlanetInfo();
    if (window.innerWidth <= 768) {
        planetWindow.classList.remove("hidden"); // Show window when displaying planet info
    }
}

function showPlanetList() {
    planetList.classList.remove("hidden");
    planetInfo.classList.add("hidden");
}

function showPlanetInfo() {
    planetList.classList.add("hidden");
    planetInfo.classList.remove("hidden");
}

class Star {
    constructor(tx, ty, tz, tc, tf, td) {
      this.x = tx;
      this.y = ty;
      this.z = tz;
      this.c = tc;
      this.f = tf;
      this.down = td;
    }
  
    showStar() {
      push();
      translate(this.x, this.y, this.z);
      stroke(this.c);
      strokeWeight(1.9);  // Adjust this value to change star size
      point(0, 0);
      pop();
    }
  
    twinkle() {
      if (this.c >= 255) {
        this.down = true;
      }
      if (this.c <= 0) {
        this.down = false;
      }
  
      if (this.down) {
        this.c -= this.f;
      } else {
        this.c += this.f;
      }
    }
  }


function mousePressed() {
    if (btnD && typeof btnD.isPressed === 'function') {
        btnD.isPressed();
    }
}

class Button {
    constructor(x, y, r, lbl, callback) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.lbl = lbl;
        this.color = "white";
        this.callback = callback;
    }

    show() {
        push();
        ellipseMode(RADIUS);
        fill(this.color);
        stroke("black");
        strokeWeight(2);
        circle(this.x, this.y, this.r);
        fill("black");
        textSize(this.r);
        textAlign(CENTER, CENTER);
        textFont("Courier New");
        text(this.lbl, this.x, this.y);
        pop();
    }

    isPressed() {
        if (dist(mouseX, mouseY, this.x, this.y) < this.r) {
            this.color = color(63, 250, 203);
            this.execute();
            return true;
        }
        return false;
    }

    release() {
        this.color = "white";
    }
    
    execute() {
        this.callback();
    }
}

class Directional extends Button {
    constructor(x, y, r, callback) {
        super(x, y, r, "", callback);
        this.sensitivityFactor = 0.3; // Adjust this value to change sensitivity
        this.deadZone = 10; // Pixels from center where movement is ignored

    }
    show() {
        push();
        // Utilisez le mode 2D pour dessiner le bouton
        camera(0, 0, height / 2 / tan(PI / 6), 0, 0, 0, 0, 1, 0);
        ortho(-width/2, width/2, -height/2, height/2, 0, 1000);
        translate(-width/2, -height/2, 0);
        ellipseMode(RADIUS);
        fill(this.color);
        stroke("black");
        strokeWeight(2);
        circle(this.x, this.y, this.r);
        if (this.isPressed()) {
            fill(229, 22, 185, 150);
            circle(mouseX, mouseY, this.r * 0.4);
        }
        pop();
    }
    isPressed() {
        if (dist(mouseX, mouseY, this.x, this.y) < this.r && mouseIsPressed) {
            this.changeDir();
            return true;
        }
        return false;
    }
    changeDir() {
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let distance = dist(mouseX, mouseY, this.x, this.y);

        // Apply dead zone
        if (distance < this.deadZone) {
            return;
        }

        // Calculate normalized direction
        let dirX = dx / distance;
        let dirY = dy / distance;

        // Apply sensitivity factor and scale by distance from center
        let scaleFactor = map(distance, this.deadZone, this.r, 0, 1);
        let moveX = dirX * this.sensitivityFactor * scaleFactor;
        let moveY = dirY * this.sensitivityFactor * scaleFactor;

        // Update camera position
        cameraX += moveX * cameraSpeed;
        cameraY += moveY * cameraSpeed;
    }
}
