
// const cel=document.getElementById("celcius");
// const far=document.getElementById("farenheit");

// cel.addEventListener("click", function () { celcius() });
// far.addEventListener("click", function () { farenheit() });

// function celcius(){
//     cel.checked=true;
//     far.checked=false;
// }

// function farenheit(){
//     cel.checked=false;
//     far.checked=true;
// }


let metunit="";
let longitude="";
let latitude="";

const cButton=document.getElementById("btn2");
cButton.addEventListener("click", function(){clearF()});


//make spinner
var el1=document.createElement("div");
el1.classList.add("d-flex");
el1.classList.add("justify-content-center");
el1.id="el1";

var el2=document.createElement("div");
el2.classList.add("spinner-border");
el2.setAttribute("role","status");

var el3=document.createElement("span");
el3.classList.add("visually-hidden");
el3.textContent="Loading..."

el2.append(el3);
el1.append(el2);

document.getElementById("cardbody").append(el1);


{/* <div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                    </div> */}



function clearF(){
    document.getElementById("waddr").style.opacity=0;
    document.getElementById("wreg").style.opacity=0;
    document.getElementById("wcity").style.opacity=0;
    document.getElementById("address").value="";
    document.getElementById("region").value="";
    document.getElementById("city").value="Select";
    document.getElementById("celcius").checked=true;
    document.getElementById("hr1").classList.add("d-none");
    document.getElementById("results").classList.add("d-none");
    document.getElementById("hr2").classList.add("d-none");
    document.getElementById("card").classList.add("d-none");


    document.getElementById("curren-tab").classList.add("active");

    document.getElementById("attp").remove();
    document.getElementById("cardbody").append(el1);

    
}









const sButton=document.getElementById("btn1");

btn1.addEventListener("click", function() {searchF()});


function searchF(){

    document.getElementById("waddr").style.opacity=0;
    document.getElementById("wreg").style.opacity=0;
    document.getElementById("wcity").style.opacity=0;


    const addr=document.getElementById("address");
    const reg=document.getElementById("region");
    const city=document.getElementById("city");
    var b1=0;
    var b2=0;
    var b3=0;

    if(addr.value.trim().length === 0){
        b1=1;
    }
    if(reg.value.trim().length === 0){
        b2=1;
    }
    if(city.options[city.selectedIndex].value === "Select"){
        b3=1;
    }

    if(b1===1 || b2===1 || b3===1){

        

        if(b1===1){
            
            document.getElementById("waddr").style.opacity=1;
        }
        if(b2===1){
            
            document.getElementById("wreg").style.opacity=1;
        }
        if(b3===1){
            
            document.getElementById("wcity").style.opacity=1;
        }

    }

    else{
        if(document.querySelector('input[name=CF]:checked').value==="celcius"){
            metunit="metric";
        }
        else{
            metunit="imperial";
        }

        console.log(addr.value);
        console.log(reg.value);
        console.log(city.value);

        NominaF(addr.value, reg.value, city.value);
        

        
    }
}



function NominaF(address, region, city){
        // Set up our HTTP request
    var xhr = new XMLHttpRequest();
    // Setup our listener to process completed requests
    xhr.onreadystatechange = function () {
    // Only run if the request is complete
    if (xhr.readyState !== 4) return;
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
        // console.log(xhr.responseText);
        
        var t1;
        t1=JSON.parse(xhr.responseText);
        // console.log(JSON.parse(xhr.responseText));
        if(xhr.responseText!=='[]'){
            longitude=t1[0].lon;
            latitude=t1[0].lat;
            rightNowF();
            
            next24F();
            attractionsF(city);

            document.getElementById("hr1").classList.remove("d-none");
            document.getElementById("results").classList.remove("d-none");
            document.getElementById("hr2").classList.remove("d-none");
            document.getElementById("card").classList.remove("d-none");

            makeMap();
            
        }
        else{
            alert("No result for that location.");

        }


    } else {
        console.log('error', xhr);
    }
    };
    // console.log('https://nominatim.openstreetmap.org/search?q='+address+', '+region+', '+city+'&format=json');
    xhr.open('GET', 'https://nominatim.openstreetmap.org/search?q='+address+', '+region+', '+city+'&format=json');
    xhr.send();
}




function attractionsF(city){

    document.getElementById("cardheader").textContent="Attractions in "+city;


    var xhr = new XMLHttpRequest();
    // Setup our listener to process completed requests
    xhr.onreadystatechange = function () {
    // Only run if the request is complete
    if (xhr.readyState !== 4) return;
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.responseText);
        
        var t4;
        t4=JSON.parse(xhr.responseText);
        // t4=xhr.responseText;
        var answer=t4.choices[0].text;
        console.log(answer);

        var attp=document.createElement("p");
        attp.id="attp";
        attp.innerHTML=answer;
        document.getElementById("el1").remove();
        document.getElementById("cardbody").append(attp);


    } else {
        console.log('error', xhr);
    }
    };
    // console.log('https://nominatim.openstreetmap.org/search?q='+address+', '+region+', '+city+'&format=json');
    xhr.open('POST', 'https://api.openai.com/v1/completions');

    xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("Authorization", "Bearer $OPENAI_API_KEY");
    xhr.setRequestHeader("Authorization", "Bearer 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");

    const mpar = {};
    

    mpar.model="text-davinci-003";
    mpar.prompt="Top 3 attractions in "+city;
    mpar.temperature=0.7;
    mpar.max_tokens=256;
    mpar.top_p=1;
    mpar.frequency_penalty=0;
    mpar.presence_penalty=0;

    xhr.send(JSON.stringify(mpar));




}






// if(document.getElementById("celcius").checked===true){
//     metunit="metric";
// }
// else{
//     metunit="imperial";
// }


function makeMap(){

    document.getElementById("map").innerHTML="";

    var map = new ol.Map({ // a map object is created
        target: 'map', // the id of the div in html to contain the map
        layers: [ // list of layers available in the map
            new ol.layer.Tile({ // first and only layer is the OpenStreetMap tiled layer
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({ // view allows to specify center, resolution, rotation of the map
            center: ol.proj.fromLonLat([longitude, latitude]), // center of the map
            zoom: 15 // zoom level (0 = zoomed out)
        })
   });

   temp_new = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=f79c0e875296d15f39b31adf107bc37b',
        })
    });
    map.addLayer(temp_new); // a temp layer on map

    prec_new = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=f79c0e875296d15f39b31adf107bc37b',
        })
    });
    map.addLayer(prec_new); // a temp layer on map

    map.updateSize();

   
       
}




function rightNowF(){
        // Set up our HTTP request
    var xhr = new XMLHttpRequest();
    // Setup our listener to process completed requests
    xhr.onreadystatechange = function () {
    // Only run if the request is complete
    if (xhr.readyState !== 4) return;
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
        // console.log(JSON.parse(xhr.responseText));
        // var t2=[];
        var t2;
        t2=JSON.parse(xhr.responseText);
        buildrightNow(t2);


    } else {
        console.log('error', xhr);
    }
    };

    xhr.open('GET', 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&units='+metunit+'&APPID=f79c0e875296d15f39b31adf107bc37b');
    xhr.send();
}


let t3;
function next24F(){
    // Set up our HTTP request
    var xhr = new XMLHttpRequest();
    // Setup our listener to process completed requests
    xhr.onreadystatechange = function () {
    // Only run if the request is complete
    if (xhr.readyState !== 4) return;
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
        // console.log(JSON.parse(xhr.responseText));
        t3=JSON.parse(xhr.responseText);
        buildnext24(t3);


    } else {
        console.log('error', xhr);
    }
    };

    xhr.open('GET', 'http://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&units='+metunit+'&APPID=f79c0e875296d15f39b31adf107bc37b');
    xhr.send();
}



document.getElementById("button0").addEventListener("click", function(){modalF(0)});
document.getElementById("button1").addEventListener("click", function(){modalF(1)});
document.getElementById("button2").addEventListener("click", function(){modalF(2)});
document.getElementById("button3").addEventListener("click", function(){modalF(3)});
document.getElementById("button4").addEventListener("click", function(){modalF(4)});
document.getElementById("button5").addEventListener("click", function(){modalF(5)});
document.getElementById("button6").addEventListener("click", function(){modalF(6)});
document.getElementById("button7").addEventListener("click", function(){modalF(7)});



function buildnext24(t3){
    let tmp="";
    let pr="";
    let ws="";
    if(metunit==="metric"){
        tmp="oC";
        pr=" hPa";
        ws=" meters / sec";
    }
    else{
        tmp="oF";
        pr=" Mb";
        ws=" miles / hour";
    }

    for(let i=0; i<8; i++){
        let t="time"+i;
        let s="summ"+i;
        let te="temp"+i;
        let cl="cloud"+i;
        let bu="button"+i;

        var date = new Date(t3.list[i].dt * 1000);
        var hours=date.getHours();
        if(hours<10){
            hours="0"+hours;
        }
        var min=date.getMinutes();
        if(min<10){
            min="0"+min;
        }
        document.getElementById(t).textContent=hours+":"+min;

        document.getElementById(s).setAttribute("src", "https://openweathermap.org/img/w/" + t3.list[i].weather[0].icon + ".png");
        document.getElementById(te).textContent=t3.list[i].main.temp+tmp;
        document.getElementById(cl).textContent=t3.list[i].clouds.all+" %";


        

    }
}




function buildrightNow(t2){
    let tmp="";
    let pr="";
    let ws="";
    if(metunit==="metric"){
        tmp="oC";
        pr=" hPa";
        ws=" meters / sec";
    }
    else{
        tmp="oF";
        pr=" Mb";
        ws=" miles / hour";
    }

    document.getElementById("icon").setAttribute("src", "https://openweathermap.org/img/w/" + t2.weather[0].icon + ".png");
    document.getElementById("p1").textContent=t2.weather[0].description + "  in  " + t2.name;
    document.getElementById("temp").textContent=t2.main.temp+tmp;
    document.getElementById("span1").textContent="L: "+t2.main.temp_min+tmp;
    document.getElementById("span2").textContent="H: "+t2.main.temp_max + tmp;
    document.getElementById("pr").textContent=t2.main.pressure + pr;
    document.getElementById("hum").textContent=t2.main.humidity + " %";
    document.getElementById("ws").textContent=t2.wind.speed + ws;
    document.getElementById("cc").textContent=t2.clouds.all + " %";

    var date = new Date(t2.sys.sunrise * 1000);
    var hours=date.getHours();
    if(hours<10){
        hours="0"+hours;
    }
    var min=date.getMinutes();
    if(min<10){
        min="0"+min;
    }

    document.getElementById("sr").textContent=hours+":"+min;




    var date = new Date(t2.sys.sunset * 1000);
    var hours=date.getHours();
    if(hours<10){
        hours="0"+hours;
    }
    var min=date.getMinutes();
    if(min<10){
        min="0"+min;
    }
    document.getElementById("ss").textContent=hours+":"+min;

}


const montharr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function modalF(n){

    
    let tmp="";
    let pr="";
    let ws="";
    if(metunit==="metric"){
        tmp="oC";
        pr=" hPa";
        ws=" meters / sec";
    }
    else{
        tmp="oF";
        pr=" Mb";
        ws=" miles / hour";
    }


    

    var date = new Date(t3.list[n].dt * 1000);
    var h2 = date.getDate() + " " + montharr[date.getMonth()] + " " + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() +"0";

    document.getElementById("mtitle").textContent="Weather in "+t3.city.name+" on "+ h2;
    document.getElementById("micon").setAttribute("src", "https://openweathermap.org/img/w/" + t3.list[n].weather[0].icon + ".png");
    document.getElementById("mp1").textContent=t3.list[n].weather[0].main + " ("+t3.list[n].weather[0].description+")";
    document.getElementById("mspan1").textContent=t3.list[n].main.humidity+" %";
    document.getElementById("mspan2").textContent=t3.list[n].main.pressure+pr;
    document.getElementById("mspan3").textContent=t3.list[n].wind.speed+ws;
    


}


