const find_counties_on_edge = require('./backend_county_finder');



const fs = require('fs');

const file_path = "C:\Users\Jeffrey Xie\Documents\GitHub\communitygo\FIPS and counties.csv";

function find_first_high_poverty_county(file_path, county) {
  if (is_high_poverty(file_path, county)) {
    return county;
  }
  return null;
}

const county_fip_list = find_counties_on_edge();

function is_high_poverty(file_path, county_name) {
  if (fs.existsSync(file_path)) {
    const lines = fs.readFileSync(file_path, 'utf8').split('\n');
    for (let line of lines) {
      const list_fips_county_and_num = line.split(",");
      const fip = list_fips_county_and_num[0].toLowerCase();
      if (fip === county_name.toLowerCase()) {
        if (parseFloat(list_fips_county_and_num[2]) >= 20.0) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  return false;
}

let first_high_poverty_county = null;

for (let fip of county_fip_list) {
  first_high_poverty_county = find_first_high_poverty_county(file_path, fip);
  if (first_high_poverty_county) {
    break;
  }
}

const new_file_path = "C:\\Users\\16145\\Downloads\\fips and coords.csv";

function getCoordListForFip(fip, filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (let line of lines) {
    const list_fips_and_coords = line.split(",");
    if (list_fips_and_coords[0] === fip) {
      return [list_fips_and_coords[2], list_fips_and_coords[3].trim()];
    }
  }
  return null;
}



function returnCoordList() {
  const coord_list = getCoordListForFip(first_high_poverty_county, new_file_path);
  return coord_list;
}
if (coord_list) {
  const county_coords = {
    latitude: coord_list[0],
    longitude: coord_list[1]
  };

  console.log("County Coordinates:", county_coords);
} else {
  console.log("County coordinates not found.");
}

module.exports = returnCoordList;
