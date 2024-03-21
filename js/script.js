const ulElement = document.querySelector("ul");
const systemeAPI = fetch("https://api.le-systeme-solaire.net/rest/bodies/");
let equaRadius = [];
let aphelion = [];

systemeAPI.then(response => {
    return response.json();
}).then(json => {
    console.log(json.bodies);
for (n=0; n<json.bodies.length;n++){
    if (json.bodies[n].isPlanet === true){
        equaRadius.push(json.bodies[n].equaRadius);
        aphelion.push(json.bodies[n].aphelion);



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
    sphere(80);
    pop();
    

    // push();
    // specularMaterial(0, 0, 255, 10);
    // //shininess(10);
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

    createPlanet();

}

function createPlanet(){
    translate(100,0);
    for (let i = 0; i < equaRadius.length; i++) {
        push();

        emissiveMaterial(255, 255, 100);
        //console.log(aphelion[i]);
        translate(aphelion[i]/10000000,0);
        sphere(equaRadius[i]/5000);
        pop();
        
    }
};

// ajuste la taille du sketch en fonction de la taille de la fenêtre
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }