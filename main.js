const container = document.querySelector('.container'),
       inputPart = container.querySelector('.input-part'),
       infoText = inputPart.querySelector('.info-text'),
       inputFiled = inputPart.querySelector('input'),
       locationBtn = inputPart.querySelector('button'),
       weatherIcons = document.querySelector('.weather-part img'),
       arrowIcon = container.querySelector('header i')
let Default = '18f8e0d5f8aca1d14b42da8d59ccb9b1';
let api;
locationBtn.addEventListener('click' ,()=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }else{
        "your browser not support geolocation api"
    }
});
function onSuccess(postion) {
    const{latitude, longitude} = postion.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${Default}`
    fetchData()
}
function onError(error) {
    infoText.innerText = error.message;
    infoText.classList.add('error')
}
inputFiled.addEventListener('keyup' , e =>{
    if (e.key == "Enter" && inputFiled.value !== "") {
        requestApi(inputFiled.value)
    }
});
function  requestApi(city) {
   api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${Default}`;
   fetchData()
}
function fetchData() {
    infoText.innerText = "Getting weather detalies...."
    infoText.classList.add('pending')
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}
function weatherDetails(info){
    infoText.classList.replace('pending' , 'error')
    if (info.cod === '404') {
        infoText.innerText = `${inputFiled.value} isn't a valid city name`
    }else{
        // let's get required properties value from info object
        const city = info.name,
              country = info.sys.country,
              {description, id} = info.weather[0],
              {feels_like, humidity, temp} = info.main;
        // let's pass these values to a particular html element
        container.querySelector('.temp .nump').innerText = Math.floor(temp);
        container.querySelector('.weather-part .weather').innerText = description;
        container.querySelector('.location span').innerText = `${city} ${country}`;
        container.querySelector('.temp .nump-2').innerText = Math.floor(feels_like);
        container.querySelector('.humidity .nump').innerText = `${humidity}%`
        infoText.classList.remove('pending' , 'error');
        container.classList.add('active');
        if (id === 800) {
            weatherIcons.src = "Weather Icons/clear.svg"
        }else if(id >=200 && id <=232){
            weatherIcons.src = "Weather Icons/storm.svg"
        }else if(id >=600 && id <=622){
            weatherIcons.src = "Weather Icons/snow.svg"
        }else if(id >=701 && id <=781){
            weatherIcons.src = "Weather Icons/haze.svg"
        }else if(id >=801 && id <=804){
            weatherIcons.src = "Weather Icons/cloud.svg"
        }else if((id >=300 && id <=321) || (id >= 500 && id <=531)){
            weatherIcons.src = "Weather Icons/storm.svg"
        }
        console.log(info);
    }
}arrowIcon.addEventListener('click', () =>{
    container.classList.remove('active');
    inputFiled.value = ''
    inputFiled.focus()
})
