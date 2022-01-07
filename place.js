window.onload = () => {
    let method = 'static';

    // if you want to statically add places, de-comment following line:
    // method = 'static';
    if (method === 'static') {
        let places = staticLoadPlaces();
        return renderPlaces(places);
    }

    if (method !== 'static') {
        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

            // than use it to load from remote APIs some places nearby
            dynamicLoadPlaces(position.coords)
                .then((places) => {
                    renderPlaces(places);
                })
        },
            (err) => console.error('Error in retrieving position', err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};

function staticLoadPlaces() {
    return [
    	 {
             name: "office",
             location: {
                 lat: 37.413210, 
                 lng: 127.129945
             }
         },
         { 
             name: "사무실2",
             location: {  
           	  lat: 37.413185, 
                 lng: 127.129935
             }
         },
         {
             name: "사무실3",
             location: {
           	  lat: 37.4131869, 
                 lng: 127.1299709
             }
         }
         ,
         {
             name: "사무실3",
             location: {
           	  lat: 37.4131869, 
                 lng: 127.1299709
             }
         }
         ,
         {
             name: "사무실5",
             location: {
           	  lat: 37.4131151, 
                 lng: 127.1299483
             }
         }
         ,
         {
             name: "사무실6",
             location: { 
           	  lat: 37.4131225, 
                 lng: 127.1299816
             }
         }
    ];
}

// getting places from REST APIs
function dynamicLoadPlaces(position) {
    let params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'HZIJGI4COHQ4AI45QXKCDFJWFJ1SFHYDFCCWKPIJDWHLVQVZ',
        clientSecret: '',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    let corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;
        let title =  place.name ;
        // add place name
        let text = document.createElement('a-link');
        text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        text.setAttribute('title', place.name);
        text.setAttribute('href', 'javascript:alert(${title})');
        text.setAttribute('scale', '0.5 0.5 0.5');

        text.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(text);
    });
}
