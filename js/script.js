const systemeAPI = fetch("https://api.le-systeme-solaire.net/rest/bodies/");
console.log("systemeAPI = " +systemeAPI);
systemeAPI.then(response => {
    return response.json();
}).then(json => {
    console.log(json.bodies[0].name)
})