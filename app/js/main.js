// Initialize your app
var myApp = new Framework7({
	modalTitle: 'Выберите город',
	modalButtonOk: 'Ok',
	modalButtonCancel: 'Отмена'
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var key = '250157f0427f4a248a71dbcd7e30d3cb';
//город
var weatherData;
var city = localStorage.getItem('city');
//скрипт для выявления дня или ночи
var time = new Date();
var dayNight = time.getHours() > 6 && time.getHours() < 18 ? 'day' : 'night';//день с 6:00 до 18:00

// if (city === null || city == '') {
//     selectCity();
// }else{
// 	currentWeather(city);
// 	weather(city);
// }

$$('.city').html(city);//просто вставляется название города
//функция для смены города
$$('#changeCity').on('click', function(){
	selectCity();
});

function currentWeather(city){
	$$.ajax({
        async: false,
        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&lang=ru&appid=' + key,
        dataType: 'json',
        success: function(data) {
            currentWeatherData = data;
        },
        statusCode: {
            404: function(xhr) {
                alert('Данные о погоде не пришли');
            }
        }
   	});

   	var today = currentWeatherData,
	todayDate = timestamp2date(currentWeatherData);

	$$('#date').html('<span class="pull-right">' + timestamp2date(today.dt) + '</span>');//вставка названия города

	var weatherTemplate = '<div class="row wi-lg margin-top-20">' +
							'<div class="col-50">' +
								'<i class="wi wi-thermometer"></i> ' + parseInt(today.main.temp_max) + ' <i class="wi wi-celsius"></i> макс.' +
							'</div>' +
							'<div class="col-50">' +
								'<span class="pull-right"><i class="wi wi-thermometer-exterior"></i> ' + parseInt(today.main.temp_min) + ' <i class="wi wi-celsius"></i> мин.</span>' +
							'</div>' +
						'</div>' +
						'<p class="text-center margin-top-40"><i class="wi wi-owm-' + dayNight + '-' + today.weather[0].id + ' wi-x8"></i></p>' +
						'<p class="text-center font-15rem">' + ucFirst(today.weather[0].description) + ', ' + parseInt(today.main.temp) + '<i class="wi wi-celsius"></i></p>' +
						'<div class="row font-small text-center">' +
							'<div class="col-20"><i class="wi wi-wind-beaufort-' + parseInt(today.wind.speed) + ' wi-2x"></i>м/с</div>' +
							'<div class="col-20"><i class="wi wi-sunrise wi-2x"></i><br/>' + timestamp2date(today.sys.sunrise, '','time') + '</div>' +
							'<div class="col-20"><i class="wi wi-sunset wi-2x"></i><br/>' + timestamp2date(today.sys.sunset, '','time') + '</div>' +
							'<div class="col-20"><i class="wi wi-humidity wi-2x"></i><br/>' + today.main.humidity + '%</div>' +
							'<div class="col-20"><i class="wi wi-barometer wi-2x"></i><br/>' + today.main.pressure + '</div>' +
						'</div><hr>';
	$$('#weatherTemplate').html(weatherTemplate);
}

function weather(city){
    $$.ajax({
        async: false,
        url: 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&units=metric&lang=ru&appid=' + key,
        dataType: 'json',
        success: function(data) {
            weatherData = data;
        },
        statusCode: {
            404: function(xhr) {
                alert('Данные о погоде не пришли');
            }
        }
    });

	var otherDays = '';
	for(var i = 0; i < weatherData.list.length; i++){
		if(i != 0 && i <= 5){
			otherDays += '<div class="col-20 text-center"><a href="#" class="day" data-day="' + i + '">' + timestamp2date(weatherData.list[i].dt, 'short') + ' ' + 
							parseInt(weatherData.list[i].temp.day) + ' <i class="wi wi-celsius"></i><br>' +
							'<i class="wi wi-owm-' + dayNight + '-' + weatherData.list[i].weather[0].id + ' wi-lg"></i>' +
						'</a></div>';
		}
	}
	$$('#nextDays').html(otherDays);
    
}

$$('.day').on('click', function (e) {
	console.log(e);
	var d = $$(this).data('day');
  	var template = '<div class="popup">'+
	  					'<div class="navbar">' +
						    '<div class="navbar-inner">' +
						        '<div class="right close-popup">Х</div>' +
						    '</div>' +
						'</div>' +
                    '<div class="content-block">'+
	  					'<div class="text-right">' + timestamp2date(weatherData.list[d].dt) + '</div>' +
	  					'<div class="row wi-lg margin-top-20">' +
								'<div class="col-50">' +
									'<i class="wi wi-thermometer"></i> ' + parseInt(weatherData.list[d].temp.max) + ' <i class="wi wi-celsius"></i> макс.' +
								'</div>' +
								'<div class="col-50">' +
									'<span class="pull-right"><i class="wi wi-thermometer-exterior"></i> ' + parseInt(weatherData.list[d].temp.min) + ' <i class="wi wi-celsius"></i> мин.</span>' +
								'</div>' +
							'</div>' +
							'<p class="text-center margin-top-40"><i class="wi wi-owm-' + dayNight + '-' + weatherData.list[d].weather[0].id + ' wi-x8"></i></p>' +
							'<p class="text-center font-15rem">' + ucFirst(weatherData.list[d].weather[0].description) + ', ' + parseInt(weatherData.list[d].temp.day) + '<i class="wi wi-celsius"></i></p>' +
							'<div class="row font-small text-center">' +
								'<div class="col-20"><i class="wi wi-wind-beaufort-' + parseInt(weatherData.list[d].speed) + ' wi-2x"></i>м/с</div>' +
								'<div class="col-20"><i class="wi wi-wind-direction wi-2x" style="transform: rotate(' + weatherData.list[d].deg + 'deg);"></i>Ветер</div>' +
								'<div class="col-20"><i class="wi wi-cloudy wi-2x"></i><br/>' + weatherData.list[d].clouds + '%</div>' +
								'<div class="col-20"><i class="wi wi-humidity wi-2x"></i><br/>' + weatherData.list[d].humidity + '%</div>' +
								'<div class="col-20"><i class="wi wi-barometer wi-2x"></i><br/>' + weatherData.list[d].pressure + '</div>' +
							'</div>' +
						'</div>'+
                  	'</div>';

	myApp.popup(template);
});

//приводит дату в человеческий вид
function timestamp2date(timestamp, type, time) { 
    var theDate = new Date(timestamp * 1000); 
    var date = theDate.toGMTString();
    var monthsFull = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    var monthsShort = ["янв", "фев", "март", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
    var daysShort = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    var daysFull = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
    var minutes = (theDate.getMinutes() <= 9) ? '0' + theDate.getMinutes() : theDate.getMinutes();
    if(type == 'short'){
    	return '<div>' + daysShort[theDate.getDay()] + '</div>'; 
    }else if(time == 'time'){
    	return theDate.getHours() + ':' + minutes;
    }else{
    	return theDate.getDate() + ' ' + monthsFull[theDate.getMonth()] + ', ' + daysFull[theDate.getDay()];
    }
}
//первый символ в большой регистр
function ucFirst(str) {
  // только пустая строка в логическом контексте даст false
  	if (!str) return str;
  	return str[0].toUpperCase() + str.slice(1);
}
//изменить город
function selectCity(){
	myApp.prompt('', function(value) {
		if(value == '' || value == undefined || value == null){
			selectCity();
		}
        city = value;
        localStorage.setItem('city', city);
        $$('.city').html(localStorage.getItem('city'));
        currentWeather(city);
        weather(city);
        location.reload();
    });
}

