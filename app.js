const yargs = require('yargs');
const axios = require('axios');

//CLI arguments configurations
const argv = yargs
  .options({
    address: {
      demand: true,
      alias: 'a',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

let address = encodeURI(argv.address);
let geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${address}`

//HTTP Requests 
axios.get(geocodeUrl)
  .then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Sorry, no results came back.')
    }

    let latitude = response.data.results[0].geometry.location.lat;
    let longitude = response.data.results[0].geometry.location.lng;
    let weather = `https://api.darksky.net/forecast/e03590ea6acda5a747875cb20d426f3a/${latitude},${longitude}`
    console.log('Address: ' + response.data.results[0].formatted_address);
    console.log('');
    return axios.get(weather);
  })
  .then((response) => {
    console.log('*** Current Weather ***');
    console.log('Summary: ' + response.data.currently.summary);
    console.log('Current Temperature: ' + response.data.currently.temperature + ' fahrenheit');
    console.log('Feels like: ' + response.data.currently.apparentTemperature + ' fahrenheit');
    console.log('');
    console.log('*** Weekly Forecast ***');
    console.log('Summary: ' + response.data.daily.summary);
    console.log('High: ' + response.data.daily.data[0].temperatureHigh + ' fahrenheit');
    console.log('Low: ' + response.data.daily.data[0].temperatureLow + ' fahrenheit');
  })
  .catch(function (error) {
    if (error.response.data.status === 'INVALID_REQUEST') {
      console.log('Sorry, could not connect to the servers.');
    } else if (error.request) {
      console.log('Sorry, page not found');
    } else {
      console.log(error.message);
    }
});
