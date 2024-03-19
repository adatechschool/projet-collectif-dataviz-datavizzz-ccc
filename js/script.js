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

// liElement.classList.remove("invisible");
  //  liElement.classList.add("visible");

//});
//buttonTerre.addEventListener("click",()=>{
  //  liElement.classList.remove("invisible");
    //liElement.classList.add("visible");

//});
function setup(){
    createCanvas(600, 600, WEBGL);
}


function draw(){
    background(0,0,0,0);
    //sphere(100);
    normalMaterial();
  stroke(0);
  
  push();
  rotateY(-millis()/1000);
  sphere(80);
  pop();
  
  push();
  rotateY(-millis()/1000);
  translate(200,0);
  
  fill(80,10,60);
  sphere(40);
  pop();
}