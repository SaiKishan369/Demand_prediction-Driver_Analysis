let map;
function initMap() {
    const bangalore = { lat: 12.9716, lng: 77.5946 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: bangalore,
    });
    
    

    // Enable Real-Time Traffic Layer
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    // Load BBMP Wards GeoJSON
    map.data.loadGeoJson("BBMP.geojson");

    
    // Toggle Traffic
    document.getElementById("toggle-traffic").addEventListener("change", (event) => {
        trafficLayer.setMap(event.target.checked ? map : null);
    });

    // Auto-refresh traffic every 2 minutes
    setInterval(() => {
        if (document.getElementById("toggle-traffic").checked) {
            trafficLayer.setMap(null);
            const newTrafficLayer = new google.maps.TrafficLayer();
            newTrafficLayer.setMap(map);
        }
    }, 120000);

    // ✅ Load Metro Locations and Add Orange Circles
    fetch("metro_locations.json")
        .then(response => response.json())
        .then(metroStations => {
            metroStations.forEach(station => {
                new google.maps.Circle({
                    strokeColor: "#FFA500",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FFA500",
                    fillOpacity: 0.5,
                    map,
                    center: { lat: station.Latitude, lng: station.Longitude },
                    radius: 300, // Adjust the radius as needed
                });

                // Show metro station name on hover
                const infoWindow = new google.maps.InfoWindow({
                    content: `<b>${station.Name}</b>`
                });

                const marker = new google.maps.Marker({
                    position: { lat: station.Latitude, lng: station.Longitude },
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 6,
                        fillColor: "transparent", // Hide marker since we use a circle
                        fillOpacity: 0,
                        strokeWeight: 0
                    },
                    title: station.Name
                });

                marker.addListener("mouseover", () => infoWindow.open(map, marker));
                marker.addListener("mouseout", () => infoWindow.close());
            });
        })
        .catch(error => console.error("Error loading metro locations:", error));
}

// Ensure initMap is linked correctly to Google Maps API callback
window.initMap = initMap;

