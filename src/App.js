import React, { Component, createRef } from 'react';
import './App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import Plotly from 'plotly.js'
import _ from 'lodash'
import L from 'leaflet'

type State = {
  lat: number,
  lng: number,
  zoom: number
}

function drawPopup(data,marker,popup){
  console.log(marker)
  console.log(popup)
  let div = document.getElementById('plotly');
  let plot = [{
    x: _.values(data.timestamp),
    y: _.values(data.windspeed),
    type: 'scatter'
  }];
  var layout = {
    autosize: false,
    width: 800,
    height: 600,
    staticPlot: true
  };
  console.log(plot)
  Plotly.newPlot( div, plot, layout);
}

export class App extends Component<{},State> {

  refmarker = createRef();
  mapRef = createRef();

  updatePosition = () => {
    var marker = this.refmarker.current.leafletElement;
    var latlng = marker.getLatLng();
    this.state.lat = latlng.lat
    this.state.lng = latlng.lng
    this.mapRef.current.leafletElement.panTo(latlng);
    trackPromise(
        Axios.get('http://localhost:8080/v1/timeseries/windspeed?height=67.00m&lat='+this.state.lat.toString()+'&lon='+this.state.lng.toString()+
            '&start_date=20070302&stop_date=20070402&vertical_interpolation=nearest&spatial_interpolation=idw').then(function(response){
          var popup = L.popup({maxWidth: null}).setContent('<div id="plotly"></div><br/>You clicked the map at ' + latlng.toString());
          marker.bindPopup(popup).openPopup();
          drawPopup(response.data,marker,popup)
        }).catch(function(error){
          console.log(error);
        }));
  }

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
          <Map center={position} zoom={this.state.zoom} ref={this.mapRef}>
            <TileLayer
                attribution={attribution}
                url='https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
            />
            <Marker position={position} draggable='true' onDragend={this.updatePosition} ref={this.refmarker}>
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
