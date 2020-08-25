import React from 'react';
import './App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

/*var nwtc = [39.9140131,-105.2176275];
var mymap = L.map('mapid').setView(nwtc, 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);

var marker = new L.marker(nwtc,{draggable:'true'}).addTo(mymap).bindPopup("To display the wind resource at a cocation, click somewhere on the map or drag this marker.").openPopup();

marker.on('dragend', function(event){
  marker = event.target;
  var position = marker.getLatLng();
  marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
  mymap.panTo(new L.LatLng(position.lat, position.lng));
  createPopup(marker);
});

function createPopup(marker){
    var ll = marker.getLatLng();
    trackPromise(
        Axios.get('http://localhost:8080/v1/timeseries/windspeed?height=67.00m&lat='+ll.lat.toString()+'&lon='+ll.lng.toString()+
            '&start_date=20070302&stop_date=20070402&vertical_interpolation=nearest&spatial_interpolation=idw').then(function(response){
            marker.setPopupContent("You clicked the map at " + marker.getLatLng().toString()).openPopup();
        }).catch(function(error){
            console.log(error);
        }));
};
*/

export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lat: 39.9140131,
      lng: -105.2176275,
      zoom: 13
    }
  }

  render() {
    const position = [this.state.lat,this.state.lng]
    const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    return (
        <div className='map-container'>
          <Map center={position} zoom={this.state.zoom}>
            <TileLayer
                attribution={attribution}
                url='https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
            />
            <Marker position={position} draggable='true'>
              <Popup>
                To display the wind resource at a cocation, click somewhere on the map or drag this marker.
              </Popup>
            </Marker>
          </Map>
        </div>
    );
  }
};

export const LoadingSpinnerComponent = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  if(promiseInProgress === true){
    console.log("test")
  }
  return (
      promiseInProgress &&
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        zIndex: "9999",
        transform: "translate(-50%, -50%)"
      }}>
        <Loader type="ThreeDots" color="grey" height="100" width="100" />
      </div>
  )
};
