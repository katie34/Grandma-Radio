// global variables
// create an new XMLHttpRequest object and assign it to the http variable
// this will retrive data from the url without having to do a full page refresh
let http = new XMLHttpRequest();
// create the stations variable and initalize it to an empty object
let stations = []; 

// prepare the http request to be sent
// open(method, url, async)
http.open('get', 'stations.json', true);
// send the http request that was prepared above
http.send();

// run this function once there is a response from the http request
http.onload = function() {
	// if the status of the http request is 4 (request finished and response is ready)
	// and if the returned status number of the request is 200 (OK) run the code below
	if (this.readyState == 4 && this.status == 200) {
		// return the response data as a string and assign it to the stations object variable
		stations = JSON.parse(this.responseText);
		// create and initalize the output variable to an empty string
		let output = "";
		// loop over the parsed json items and place them them into html elements
		// assign the resulting div sections to the output variable
		for (let item of stations) {
			output += `
				<div class="response-cards">
					<a href="${item.url}" target="_blank">
					  <img src="${item.logo}" class="img">
					</a>
					<p class="name">${item.name}</p>
					<p class="country">${item.location}</p>
					<p class="genre">${item.genre}</p>
                                        <button onclick="select(this)" url= ${item.url} type="button">Select</button>
				</div>
			`;
		}
		// output the created html div sections to the the stations div in filter.html
		document.querySelector(".stations").innerHTML = output;
	}
} 

// this function runs only once there is a keyed entry in the search box,
// but then it continues to run on each keyed entry
function searchResults(){
	// refrence the search box and place the input value in the input variable
	// set the input value to lowercase for thurough comparison
	let input = document.getElementById('search-bar').value.toLowerCase();
	//console.log(input);
	// clear the initally fetched http request data from the stations div in filter.html
	// so that we can display the search results
	let clearData = document.querySelector('.stations');
	clearData.innerHTML = ""
    // create output variable and initalize it to an empty string
    let output = "";
    //console.log(stations);

	// loop through the json data and filter based on entered search field input value
	for (let item of stations){

		// local search variables
		let name = item.name.toLowerCase();
		let location = item.location.toLowerCase();
		let genre = item.genre.toLowerCase();

        // check to see if the search input value matches the name, location, or genre
		if (name.includes(input) || location.includes(input) || genre.includes(input)) {

			// log the items to the console when the are found 	
			console.log("found item by name: " + item.name);
			console.log("found item by location: " + item.location);
			console.log("found item by genre: " + item.genre);

			// inset the items data into html elements 
			// and assign the resulting div sections to the output variable
		    output += `
		    	<div class="response-cards">
		    		<a href="${item.url}" target="_blank">
					  <img src="${item.logo}" class="img">
					</a>
		    		<p class="name">${item.name}</p>
		    		<p class="country">${item.location}</p>
		    		<p class="genre">${item.genre}</p>
		    	</div>
		    `;
		}
	}
	// output the created html div sections to the the stations div in filter.html
	document.querySelector(".stations").innerHTML = output;
}


var arr= [];
function select(btn){
	img = btn.parentElement.childNodes[3].textContent + ".jpg"
	url = btn.getAttribute('url');
	name = btn.parentElement.childNodes[3].textContent;
	radio = String(document.getElementById("myInput1").value);
	arr[radio].Name = name;
	arr[radio].Url = url;
	arr[radio].Img = img;
	alert("Stream Was Changed")
}

function csvToArray(str, delimiter = ",") {
const headers = ['Name','Url','Img'];

const rows = str.slice(str.indexOf("\n") + 1).split("\n");

const arr = rows.map(function (row) {
  const values = row.split(delimiter);
  const el = headers.reduce(function (object, header, index) {
    object[header] = values[index];
    return object;
  }, {});
  return el;
});
return arr;
}

async function getData(){
  var response = await fetch('http://ssh.noglider.com:8088/katie/table_radio/uploads/user1.csv');
  var data = await response.text();
  var final = csvToArray(data);  
  arr = final;	
  return;
}

function pushfile(){

    var s = "Name,Url,Img\n";
    for (let i = 0; i< (arr.length-1); i++) {
    var a = arr[i].Name + "," + arr[i].Url + "," + arr[i].Img + "\n";
    var s = s + a;}
    

    var blob = new Blob([s], { type: "text/xml"});
    
    const url = 'http://ssh.noglider.com:8088/katie/table_radio/process.php'
    const formData = new FormData()
    formData.append('files[]', blob, 'user1.csv')
  

    fetch(url, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      console.log(response)
      if (response.status === 200) {
      alert("Uploaded Successfully");
    } else {
      console.log("Failed To Upload");
    }
    })

}
getData();