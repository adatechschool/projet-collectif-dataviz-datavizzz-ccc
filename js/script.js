const ulElement = document.querySelector("ul");
const systemeAPI = fetch("https://api.le-systeme-solaire.net/rest/bodies/");
let orbitSpeed = [];
let equaRadius = [];
let aphelion = [];
let semiMajorAxis = [];
let sideralOrbit = [];
const colorPlanet = [[174,233,255],[30,95,247],[238,200,112],[232,130,28],[201,164,62],[249,235,109],[116,116,213],[246,182,7]];

systemeAPI.then(response => {
    return response.json();
}).then(json => {
    console.log(json.bodies);
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
        const buttonPlanet = document.createElement("button"); 
        buttonPlanet.innerText = json.bodies[n].name;      
    }
}
   
})
// buttonTerre.addEventListener("click",()=>{
//  liElement.classList.remove("invisible");
//     liElement.classList.add("visible");

// });
// buttonTerre.addEventListener("click",()=>{
//     liElement.classList.remove("invisible");
//     liElement.classList.add("visible");

// });

function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    //console.log(equaRadius);
    zoom = createSlider(0,700,0,1);
    zoom.position(windowWidth-300,100);
    zoom.size(200);

}

function draw(){
    background(0,0,0,0);
    ambientLight(5, 5, 5); // white light
    pointLight(250, 250, 250, 0, 0, 200);
    noStroke();
    fill(255);
    angleMode(DEGREES);
    translate(0,0,zoom.value());
    rotateX(-20);
    push();
    emissiveMaterial(255, 255, 100);
    rotateY(-millis()/30);
    sphere(70);
    pop();
    

    // push();
    // specularMaterial(0, 0, 255, 10);
    // shininess(10);
    // rotateY(-millis()/30);
    // translate(400,0);
    // sphere(equaRadius[6]/500);
    // pop();

    // push();
    // specularMaterial(255, 50, 0, 10);
    // shininess(0);
    // rotateY(-millis()/15);
    // translate(200,0);
    // sphere(15);
    // pop();

    //translate(100,0);
    createPlanet();
}

function createPlanet(){
    calculOrbitSpeed()
    for (let i = 0; i < equaRadius.length; i++){ 
        rotateY(millis()/orbitSpeed[i]);
        push();
        sphere(1);
        emissiveMaterial(colorPlanet[i]);
        translate(aphelion[i]/10000000+120,0);
        sphere(equaRadius[i]/5000);
        pop();   
    }
}

// ajuste la taille du sketch en fonction de la taille de la fenêtre
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  function calculOrbitSpeed(){
    for (let i = 0; i < equaRadius.length; i++) {
        orbitSpeed.push((2*Math.PI*semiMajorAxis[i]/sideralOrbit[i])/8640);
  }
}