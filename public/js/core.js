let locations = [
  [40.7426777, -111.8653479],
  [40.7426777, -111.8653479],
];

function initMap() {
  // console.log("initMap");
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 40.7426777, lng: -111.8653479 },
  });

  window.onload = () => {
    getLocationAndNavigate(map);
  };
  setMarkers(map);
  // Alternatively, you can use the following:
  // window.onload = getLocationAndNavigate.bind(null, map);
}

function getLocationAndNavigate(map) {
  // console.log("getLocationAndNavigate");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      // console.log(latlng);

      map.setZoom(17);

      const marker = new google.maps.Marker({
        position: latlng,
        map: map,
      });

      map.setCenter(latlng);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

const beaches = [
  ["BYU Creamery", 40.2504645, -111.6528796, 4],
  ["Heritage Halls", 40.2503183, -111.6538495, 5],
  ["Helaman Halls", 40.2508742, -111.6517756, 3],
  ["U Lot", 40.2505775, -111.6503044, 2],
  ["Hinckley Building", 40.2508435, -111.6513156, 1],
];

function setMarkers(map) {
  // Adds markers to the map.
  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.
  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  const image = {
    url: "/img/giraffe.png",
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(92, 92),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32),
  };
  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  const shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: "poly",
  };

  for (let i = 0; i < beaches.length; i++) {
    const beach = beaches[i];

    new google.maps.Marker({
      position: {
        lat: beach[1],
        lng: beach[2],
      },
      map,
      icon: image,
      shape: shape,
      title: beach[0],
      zIndex: beach[3],
    });
  }
}

window.initMap = initMap;
const protocol = window.location.protocol === "http:" ? "ws" : "wss";
const socket = new WebSocket(`${protocol}://${window.location.host}`);

socket.onopen = () => {
  console.log("connected");
};

socket.onmessage = async (event) => {
  // console.log(event.data);
  const data = await event.data.text();
};

function sellSpot() {
  // console.log("sellSpot");
  socket.send(`{}`);
}


function getTime() {
  // Why TF doesnt JS have something built in I hate it here
  const currentDate = new Date();

  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();

  const ampm = currentHours >= 12 ? 'PM' : 'AM';
  const formattedHours = currentHours % 12 || 12;

  const formattedTime = `${formattedHours}:${currentMinutes} ${ampm}`;
  console.log(formattedTime)
  return formattedTime;
}

// Use this stuff here:
let openings = []
// Fix this so it actually is dynamic
function getCoordinates() {
  // Simulating the coordinates retrieval
  const latitude = 37.7749;
  const longitude = -122.4194;

  // Return an array with latitude and longitude
  console.log([latitude, longitude]);
  return [latitude, longitude];
}


function addOpening(id, name, price, wait, lat, long) {
  const newOpening = {
    id: id,
    name: name,
    price: price,
    wait: wait,
    lat: lat,
    long: long,
    time: getTime()
  }
  openings.push(newOpening)
}

function postOpening() {
  const price = parseFloat(document.getElementById("price").value);
  const wait = parseFloat(document.getElementById("wait").value);
  const coordinates = getCoordinates();

  addOpening(user.id, user.name, price, wait, coordinates[0], coordinates[1]);
  displayOpenings();
}

function displayOpenings() {
  let displayList = document.getElementById("displayList");
  displayList.innerHTML = '';

  openings.forEach(function(opening) {
    // Create a new list item
    const listItem = document.createElement("li");

    // Set the inner HTML of the list item with the opening details
    listItem.innerHTML = `${opening.name} is selling a spot! $${opening.price} - ${opening.wait}`;

    // Append the list item to the displayList
    displayList.appendChild(listItem);
  });
}



displayOpenings()