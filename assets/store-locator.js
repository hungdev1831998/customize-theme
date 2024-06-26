// window.onload = function () {
//   displayStores();
// };

window.onload = () => {};

var map;
var markers = [];
var infoWindow;
var openStatusText;
var phoneNumber;

function initMap() {
  var losAngeles = {
    // lat: 34.063380,
    // lng: -118.358080
    lat: 10.794011,
    lng: 106.664446,
    // 10.794011, 106.664446
  };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 11,
    mapTypeId: "roadmap",
  });
  infoWindow = new google.maps.InfoWindow();

//   const searchContainerElm = document.querySelector(".search-container");
//   if (searchContainerElm) searchContainerElm.style.display = "none";
//   const storesListContainerElm = document.querySelector(
//     ".stores-list-container"
//   );
//   if (storesListContainerElm) storesListContainerElm.style.display = "none";

//   setTimeout(() => {
//     searchStores();
//     if (searchContainerElm) searchContainerElm.style.display = "flex";
//     if (storesListContainerElm) storesListContainerElm.style.display = "flex";
//   }, 2000);

 setTimeout(() => {
    searchStores();
    const searchContainerElm = document.querySelector(".search-container");
    const storesListContainerElm = document.querySelector(
      ".stores-list-container"
    );
    if (searchContainerElm) searchContainerElm.style.display = "flex";
    if (storesListContainerElm) storesListContainerElm.style.display = "flex";
    // clearInterval(searchInterval);
  }, 2000);
}

// function searchStores() {
//   var foundStores = [];
//   var zipCode = document.getElementById("zip-code-input").value;
//   console.log("zipCode", zipCode)
//   console.log("stores", stores)
//   if (zipCode) {
//     for (var store of stores) {
//       var postal = store["address"]["postalCode"].substring(0, 5);
//       if (postal == zipCode) {
//         foundStores.push(store);
//       }
//     }
//   } else {
//     foundStores = stores;
//   }
//   console.log("foundStores", foundStores)
//   clearLocations();
//   displayStores(foundStores);
//   showStoresMarkers(foundStores);
//   setOnClickListener();
// }

function searchStores() {
  var foundStores = [];
  var searchInput = document.getElementById("zip-code-input").value.trim().toLowerCase();
  
  for (var store of stores) {
      var postal = store["address"]["postalCode"].substring(0, 5);
      var storeName = store["name"].toLowerCase();
      var storeAddress = store["address"]["streetAddressLine1"].toLowerCase();

      if (postal.includes(searchInput) || storeName.includes(searchInput) || storeAddress.includes(searchInput)) {
          foundStores.push(store);
      }
  }
  
  console.log("foundStores", foundStores);
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function displayStores(stores) {
  var storesHtml = "";
  for (var [index, store] of stores.entries()) {
    var address = store["addressLines"];
    var phone = store["phoneNumber"];
    storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index + 1}
                        </div>
                    </div>
                </div>
            </div>
        `;

    document.querySelector(".stores-list").innerHTML = storesHtml;
  }
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var [index, store] of stores.entries()) {
    var name = store["name"];
    var address = store["addressLines"][0];
    openStatusText = store["openStatusText"];
    phoneNumber = store["phoneNumber"];
    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );

    createMarker(latlng, name, address, index + 1);
    bounds.extend(latlng);
  }
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, index) {
  var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                ${address}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
    
    `;

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString(),
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach(function (elem, index) {
    elem.addEventListener("click", function () {
      new google.maps.event.trigger(markers[index], "click");
    });
  });
}
