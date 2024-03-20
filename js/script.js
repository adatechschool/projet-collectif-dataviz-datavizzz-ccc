const ulElement = document.querySelector("ul");
const systemeAPI = fetch("https://api.le-systeme-solaire.net/rest/bodies/");

console.log("systemeAPI = " +systemeAPI);

systemeAPI.then(response => {
    return response.json();
}).then(json => {
    //console.log(json.bodies[0].name)
for (n=0; n<json.bodies.length;n++){
    if (json.bodies[n].isPlanet === true){
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
}

function draw(){
    background(0,0,0,0);
    ambientLight(5, 5, 5); // white light
    pointLight(250, 250, 250, 0, 0, 200);
    noStroke();
    
    fill(255);
    angleMode(DEGREES);
    
    rotateX(-20);
    
    push();
    emissiveMaterial(255, 255, 100);
    rotateY(-millis()/30);
    sphere(80);
    pop();
    

    push();
    specularMaterial(0, 0, 255, 10);
    shininess(0);
    rotateY(-millis()/30);
    translate(400,0);
    sphere(40);
    pop();

    push();
    specularMaterial(255, 50, 0, 10);
    shininess(0);
    rotateY(-millis()/15);
    translate(200,0);
    sphere(15);
    pop();
}

// ajuste la taille du sketch en fonction de la taille de la fenêtre
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }