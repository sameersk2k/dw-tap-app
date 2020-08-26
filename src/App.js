import React, { Component, createRef } from 'react';
import './App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import Plotly from 'plotly.js'
//import _ from 'lodash'
import L from 'leaflet'
import LoadingSpinnerComponent from './LoadingSpinnerComponent'
import SimpleModal from './SimpleModal'

function drawPopup(data,marker,popup){
  console.log(marker)
  console.log(popup)
  var plot = [{
    r: [77.5, 72.5, 70.0, 45.0, 22.5, 42.5, 40.0, 62.5],
    theta: ["North", "N-E", "East", "S-E", "South", "S-W", "West", "N-W"],
    name: "11-14 m/s",
    marker: {color: "rgb(106,81,163)"},
    type: "barpolar"
  }, {
    r: [57.5, 50.0, 45.0, 35.0, 20.0, 22.5, 37.5, 55.0],
    theta: ["North", "N-E", "East", "S-E", "South", "S-W", "West", "N-W"],
    name: "8-11 m/s",
    marker: {color: "rgb(158,154,200)"},
    type: "barpolar"
  }, {
    r: [40.0, 30.0, 30.0, 35.0, 7.5, 7.5, 32.5, 40.0],
    theta: ["North", "N-E", "East", "S-E", "South", "S-W", "West", "N-W"],
    name: "5-8 m/s",
    marker: {color: "rgb(203,201,226)"},
    type: "barpolar"
  }, {
    r: [20.0, 7.5, 15.0, 22.5, 2.5, 2.5, 12.5, 22.5],
    theta: ["North", "N-E", "East", "S-E", "South", "S-W", "West", "N-W"],
    name: "< 5 m/s",
    marker: {color: "rgb(242,240,247)"},
    type: "barpolar"
  }]
  var layout = {
    title: "Wind Speed Distribution",
    font: {size: 12},
    legend: {font: {size: 10}},
    polar: {
      barmode: "overlay",
      bargap: 0,
      radialaxis: {ticksuffix: "%", angle: 45, dtick: 20},
      angularaxis: {direction: "clockwise"}
    }
  }
  Plotly.newPlot("plotly", plot, layout)
/*  let plot = [{
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
  Plotly.newPlot( div, plot, layout);*/
}

type AppState = {
  lat: number,
  lng: number,
  zoom: number
}

export class App extends Component<{},AppState> {

  markerRef = createRef();
  mapRef = createRef();
  modalRef = createRef();

  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }

  handleLoad = () => {
    var marker = this.markerRef.current.leafletElement;
    marker.openPopup();
  }

  handleClick = (e) => {
    var marker = this.markerRef.current.leafletElement;
    marker.setLatLng(e.latlng);
    this.updatePosition();
  }

  updatePosition = () => {
    var marker = this.markerRef.current.leafletElement;
    var latlng = marker.getLatLng();
    this.setState({lat: latlng.lat, lng: latlng.lng});
    this.mapRef.current.leafletElement.panTo(latlng);
    trackPromise(
        Axios.get('http://localhost:8080/v1/timeseries/windspeed?height=67.00m&lat='+this.state.lat.toString()+'&lon='+this.state.lng.toString()+
            '&start_date=20070302&stop_date=20070402&vertical_interpolation=nearest&spatial_interpolation=idw').then(function(response){
          var popup = L.popup().setContent('You clicked the map at ' + latlng.toString());
          marker.bindPopup(popup).openPopup();
          drawPopup(response.data,marker,popup)
        }).catch(function(error){
          console.log(error);
        })
    );
    this.modalRef.current.handleOpen();
  }

  constructor() {
    super();
    this.state = {
      lat: 39.9140131,
      lng: -105.2176275,
      zoom: 13,
      openModal: false
    }
  }

  render() {
    const position = [this.state.lat,this.state.lng]
    const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    return (
        <div className='map-container'>
          <Map center={position} zoom={this.state.zoom} ref={this.mapRef} onClick={this.handleClick}>
            <TileLayer
                attribution={attribution}
                url='https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
            />
            <Marker position={position} draggable='true' onDragend={this.updatePosition} ref={this.markerRef}>
              <Popup>
                To display the wind resource at a location, click somewhere on the map or drag this marker.
              </Popup>
            </Marker>
          </Map>
          <LoadingSpinnerComponent />
          <SimpleModal ref={this.modalRef} />
        </div>
    );
  }
};

export default App;