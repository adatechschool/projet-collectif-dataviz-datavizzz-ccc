const ulElement = document.querySelector("ul");
const systemeAPI = fetch("https://api.le-systeme-solaire.net/rest/bodies/");
let orbitSpeed = [];
let equaRadius = [];
let aphelion = [];
let semiMajorAxis = [];
let sideralOrbit = [];
const colorPlanet = [[174,233,255],[30,95,247],[238,200,112],[232,130,28],[201,164,62],[249,235,109],[116,116,213],[246,182,7]];

/**
 * Créer le lien avec l'API et récupère les données.
 */
systemeAPI.then(response => {
    return response.json();
}).then(json => {
    for (n=0; n<json.bodies.length;n++){
        if (json.bodies[n].isPlanet === true){
            equaRadius.push(json.bodies[n].equaRadius);
            aphelion.push(json.bodies[n].aphelion);
            semiMajorAxis.push(json.bodies[n].semimajorAxis);
            sideralOrbit.push(json.bodies[n].sideralOrbit);
            const liElement = document.createElement("li");
            liElement.classList.add("visible");
            liElement.innerText = json.bodies[n].name;
            ulElement.appendChild(liElement);    
        }
    } 
})

/**
 * Initialise le canvas
 */
function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    createSliders()
}

function createSliders(){
    zoom = createSlider(0,700,0,1);
    zoom.position(windowWidth-300,800);
    zoom.size(200);
    translateX = createSlider(-500,500,0,1);
    translateX.position(windowWidth-600,800)
    translateX.size(200)
    orbitSpeedSlider = createSlider(0,1,1,0.001)
    orbitSpeedSlider.position(windowWidth-900,800)
    orbitSpeedSlider.size(200)    
}

/**
 * Affiche l'animation chaque frames
 */
function draw(){
    background(0,0,0,0);
    ambientLight(5, 5, 5); // white light
    pointLight(250, 250, 250, 0, 0, 200);
    noStroke();
    fill(255);
    angleMode(DEGREES);
    translate(-translateX.value(),0,zoom.value());
    rotateX(-20);
    push();
    emissiveMaterial(255, 255, 100);
    rotateY(-millis()/30);
    sphere(70);
    pop();
    createPlanet();
}
/**
 * Lance le calcul de la vitesse orbital, une fois terminé, créée les planetes
 */
function createPlanet(){
    if (orbitSpeed.length === 0) {
        calculOrbitSpeed()
    }
    for (let i = 0; i < equaRadius.length; i++){ 
        rotateY(millis()/orbitSpeed[i]*orbitSpeedSlider.value());
        console.log(millis());
        push();
        sphere(1);
        emissiveMaterial(colorPlanet[i]);
        translate(aphelion[i]/10000000+120,0);
        sphere(equaRadius[i]/5000);
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
 * Calcul la vitesse orbital des sphères
 */
function calculOrbitSpeed(){
    for (let i = 0; i < equaRadius.length; i++) {
        orbitSpeed.push((2*Math.PI*semiMajorAxis[i]/sideralOrbit[i])/8640);
    }
}