const systemeAPI = fetch("https://api.le-systeme-solaire.net/rest/bodies/");
console.log("systemeAPI = " +systemeAPI);
systemeAPI.then(response => {
    return response.json();
}).then(json => {
    console.log(json.bodies[0].name)
})

function setup(){
    createCanvas(600, 600, WEBGL);
}

function draw(){
    background(255);
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