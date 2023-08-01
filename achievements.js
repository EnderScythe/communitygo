// Haversine formula to calculate distance between two points in kilometers
function haversine_distance(lat1, lon1, lat2, lon2) {
  const R = 6371.0; // Earth's radius in kilometers
  const lat1_rad = (lat1 * Math.PI) / 180;
  const lon1_rad = (lon1 * Math.PI) / 180;
  const lat2_rad = (lat2 * Math.PI) / 180;
  const lon2_rad = (lon2 * Math.PI) / 180;

  const dlon = lon2_rad - lon1_rad;
  const dlat = lat2_rad - lat1_rad;

  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
}

// Check if a given latitude and longitude are within a certain radius (in kilometers) of another coordinate.
function is_within_radius(lat1, lon1, lat2, lon2, radius) {
  const distance = haversine_distance(lat1, lon1, lat2, lon2);
  return distance <= radius;
}

class Player {
  constructor() {
    this.score = 0;
    this.current_location = { latitude: 0, longitude: 0 };
  }

  update_location(new_location) {
    this.current_location = { latitude: new_location[0], longitude: new_location[1] };
  }

  check_location(target_location) {
    const distance = haversine_distance(
      this.current_location.latitude,
      this.current_location.longitude,
      target_location[0],
      target_location[1]
    );

    if (distance <= 25) {
      this.score += 1;
      return true;
    }

    return false;
  }
}

const player = new Player();

function your_code_to_execute() {
  // Update player location
  const currentLocation = getCurrentLocation(); // Assume you have a function to get the current location.
  player.update_location(currentLocation);

  // Latitude/Longitude of county targeted for visit
  const target_location = [39.9612, -82.9988]; // IMPORTANT: this should be county_coords

  // Check if player's current location is within 25 miles radius of the target location
  if (player.check_location(target_location)) {
    console.log('You reached a new location!');
    console.log(`Total locations visited increased to: ${player.score}`);
  } else {
    console.log(`Player is not within 25 miles of target location. Score remains: ${player.score}`);
  }

  // Achievements
  if (player.score === 1) {
    console.log('First Quest: Visit Your First Location');
  } else if (player.score === 5) {
    console.log('Journeys: Visit Five Locations');
  } else if (player.score === 10) {
    console.log('Seasoned Traveler: Visit Ten Locations');
  }
}

// New York City coordinates:
const predetermined_latitude = 40.7128;
const predetermined_longitude = -74.0060;
const radius_in_km = 50;

// User's current location
const current_latitude = player.current_location.latitude;
const current_longitude = player.current_location.longitude;

if (is_within_radius(current_latitude, current_longitude, predetermined_latitude, predetermined_longitude, radius_in_km)) {
  console.log("The Big Apple: Visit New York City");
}

function getCurrentLocation() {
  // Assuming you have a function to get the user's current location
  // Implement this function based on your use case.
  // For demonstration purposes, I'll return fixed coordinates here.
  return [37.7749, -122.4194]; // San Francisco, CA
}

// Run the code every 15 minutes
setInterval(your_code_to_execute, 15 * 60 * 1000);
