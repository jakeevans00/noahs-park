let openings = []

function postOpening(id, name, duration, lat, long, time) {
  const newOpening = {
    id: id,
    name: name,
    duration: duration,
    lat: lat,
    long: long,
    time: time
  }
  openings.push(newOpening)
}

postOpening(1, "A", "3", 0, 0, "time");

console.log(openings)

function updateSpotList() {
  let listArea = document.getElementById("displaySpots");
  openings.forEach(function(opening) {
    // Create a new paragraph element
    const paragraph = document.createElement("p");

    // Set the inner HTML of the paragraph with the opening details
    paragraph.innerHTML = `${opening.name} is available for ${opening.duration} minutes at (${opening.lat}, ${opening.long}) at ${opening.time}.`;

    // Append the paragraph to the list area
    listArea.appendChild(paragraph);
  });
}

updateSpotList()