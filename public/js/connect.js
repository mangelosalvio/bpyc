var map;
function initMap() {

	center = {lat: 10.521276, lng: 122.998539}
  var red = '#F00';
  var orange = '#FF8C00';
  var yellow = '#ffff00';
  var blue = '#00F';
  var green = '#00ff00';


  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15
  });



	var cityCircle = new google.maps.Circle({
          strokeColor: green,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: green,
          fillOpacity: 0.35,
          map: map,
          center: center,
          radius: 500
        });	

	var socket = io.connect('http://localhost:4000');
	socket.on('lvl', (data) => {
		console.log(data.lvl);
		switch( data.lvl ) {
			case '1':
				cityCircle.setOptions({
					strokeColor : green,
					fillColor : green
				});
				break;
			case '2':
				cityCircle.setOptions({
					strokeColor : blue,
					fillColor : blue
				});
				break;
			case '3':
				console.log("ehre");
				cityCircle.setOptions({
					strokeColor : yellow,
					fillColor : yellow
				});
				break;
			case '4':
				cityCircle.setOptions({
					strokeColor : orange,
					fillColor : orange
				});
				break;
			case '5':
				cityCircle.setOptions({
					strokeColor : red,
					fillColor : red
				});
				break;

			default: 
				cityCircle.setOptions({
					strokeColor : green,
					fillColor : green
				});
		}

	})

	socket.on('data', (logs) => {
		$("ul#log").prepend(logs);
		console.log(logs)
	})

}

