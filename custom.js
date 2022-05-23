var currentstream = "";
var clickedplay = 0;

function playAudio(btn) {
  var stream = btn.parentElement.querySelector('audio');
  var playorpause = btn.getAttribute('class');

  if (playorpause === 'play') {
    if (clickedplay == 1){
      if (currentstream != btn.parentElement.querySelector('audio').id){
        document.getElementById(currentstream).pause();
        currentbtn.innerHTML = "Play &#9205;";
        currentbtn.setAttribute('class', 'play');
      }

    }
    clickedplay = 1;
    stream.load();
    stream.play();
    btn.innerHTML = "Pause &#9208;";
    btn.setAttribute('class', 'pause'); 
    currentstream = btn.parentElement.querySelector('audio').id;
    currentbtn = btn;
  } else {
    stream.pause();
    btn.innerHTML = "Play &#9205;";
    btn.setAttribute('class', 'play');
  }

  stream.onended = function () {
    btn.setAttribute('class', 'play');
  }
}

function addstream(name,url,img,num){ 
  var newDiv = document.createElement("div")
  newDiv.id = "radio" + String(num);
  newDiv.setAttribute('class', 'streamplayer');

  var image = document.createElement('img')
  image.src = "/radio_images/" + String(img);
  image.setAttribute('class', 'station_logo');
  image.id = "image" + String(num)
  newDiv.appendChild(image);
  newDiv.innerHTML += name;
  
  var audio = new Audio();
  audio.id = "player" + String(num);
  audio.src = url;
  newDiv.appendChild(audio);
  
  btn = document.createElement("button");
  btn.innerHTML += "Play &#9205;";
  btn.setAttribute('class', 'play');
  btn.setAttribute('onclick', 'playAudio(this)');
  newDiv.appendChild(btn);
  
  document.body.appendChild(newDiv);
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
  for (let i = 0; i< (final.length)-1; i++) {
    addstream(final[i].Name, final[i].Url, final[i].Img, i);
  }
  return;
}

function changestream(){
  info = document.getElementById("personlist").value.split(",")
  playername = "player" + String(document.getElementById("myInput1").value);
  radioname = "radio" + String(document.getElementById("myInput1").value);
  imgname = "image" + String(document.getElementById("myInput1").value);
  document.getElementById(radioname).childNodes[1].data = String(info[0]);
  document.getElementById(playername).src = String(info[1]);
  document.getElementById(imgname).src = "/radio_images/" + String(info[2]);
  alert("Stream Was Changed");
}

async function pop_options(){
  var response = await fetch('http://ssh.noglider.com:8088/katie/table_radio/stations2.csv');
  var data = await response.text();
  var rows = data.split("\n").filter(function (del) {return del.length != 0 });
  rows.sort();
  for (let i = 0; i < rows.length; i++){
    var info = rows[i].split(",")
    var a = new Option;
    a.innerHTML = String(info[0]);
    a.value = String(rows[i]);
    document.getElementById('personlist').options.add(a);
  }
}
async function pushfile(){
  var s = "Name,Url,Img\n";
  for (let i = 0; i< (document.getElementsByClassName("streamplayer").length); i++) {
    playername = "player" + String(i);
    radioname = "radio" + String(i);
    imgname = "image" + String(i);
    var a = document.getElementById(radioname).childNodes[1].data + "," + document.getElementById(playername).src + "," + document.getElementById(imgname).attributes[0].nodeValue.substring(14).replace(/(\r\n|\n|\r)/gm, "") + "\n";
    var s = s + a;
  }
  var blob = new Blob([s], { type: "text/xml"});
    
  const url = 'process.php'
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
pop_options();