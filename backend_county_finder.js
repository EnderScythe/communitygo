async function get_public_ip() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

async function get_user_location(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (response.ok) {
      const location_data = await response.json();
      if (location_data.status === "success") {
        return { latitude: location_data.lat, longitude: location_data.lon };
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

function calculate_distance(lat1, lon1, lat2, lon2) {
  const earth_radius = 6371.0;
  const [lat1_rad, lon1_rad, lat2_rad, lon2_rad] = [
    lat1,
    lon1,
    lat2,
    lon2
  ].map((coord) => (coord * Math.PI) / 180);

  const dlat = lat2_rad - lat1_rad;
  const dlon = lon2_rad - lon1_rad;
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earth_radius * c;

  return distance;
}

function find_closest_county(user_latitude, user_longitude, county_data) {
  let min_distance = Number.POSITIVE_INFINITY;
  let closest_county = null;

  county_data.forEach((row) => {
    const county_latitude = row.latitude;
    const county_longitude = row.longitude;
    const distance = calculate_distance(user_latitude, user_longitude, county_latitude, county_longitude);

    if (distance < min_distance) {
      min_distance = distance;
      closest_county = row.fips;
    }
  });

  return closest_county;
}

// Assuming you have a function to read the county_data CSV into an array of objects
// const county_data = readCountyDataFromCSV(); // Replace this line with the actual data

function find_counties_on_edge(user_latitude, user_longitude, radius) {
  const county_data = [
    // Replace this line with your actual county data array
    // Each element should be an object with latitude, longitude, and fips properties
    { latitude: 37.7749, longitude: -122.4194, fips: "12345" },
    { latitude: 39.9612, longitude: -82.9988, fips: "67890" },
    // Add more county objects here
  ];

  const counties_on_edge = [];

  for (let angle = 0; angle < 360; angle++) {
    const x_on_circle = user_latitude + radius * Math.cos((angle * Math.PI) / 180);
    const y_on_circle = user_longitude + radius * Math.sin((angle * Math.PI) / 180);

    const county_x = find_closest_county(x_on_circle, y_on_circle, county_data);
    counties_on_edge.push(county_x);
  }

  const unique_countries_on_edge = Array.from(new Set(counties_on_edge));
  return unique_countries_on_edge;
}

async function main() {
  const public_ip = await get_public_ip();
  if (public_ip) {
    console.log(`Public IP address: ${public_ip}`);
    const user_location = await get_user_location(public_ip);
    if (user_location) {
      const { latitude: user_latitude, longitude: user_longitude } = user_location;
      console.log(`User Latitude: ${user_latitude}`);
      console.log(`User Longitude: ${user_longitude}`);

      // const county_data = readCountyDataFromCSV(); // Replace this line with the actual data
      const closest_county = find_closest_county(user_latitude, user_longitude, county_data);
      console.log(`Closest County FIPS: ${closest_county}`);

      const radius = parseFloat(prompt("Enter the radius in miles for how far you want to travel: "));
      const counties_on_edge = find_counties_on_edge(user_latitude, user_longitude, radius);

      if (counties_on_edge.length > 1) {
        console.log(`These counties were ${counties_on_edge.join(", ")}`);
      } else {
        console.log("Please re-run the search with a larger radius");
      }
    } else {
      console.log("Failed to fetch user location.");
    }
  } else {
    console.log("Failed to fetch public IP address.");
  }
}

main();
