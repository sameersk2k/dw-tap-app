import React, { Component, createRef } from 'react';
import './App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import Plotly from 'plotly.js'
import _ from 'lodash'
import L from 'leaflet'
import LoadingSpinnerComponent from './LoadingSpinnerComponent'
import SimpleModal from './SimpleModal'
import ControlsDrawer from "./ControlsDrawer";

function drawPopup(data,marker,popup){
  var plot = [{
    r: _.zipWith(_.zipWith(data[">20 m/s"],data["10-20 m/s"],data["5-10 m/s"],data["<5 m/s"],function(a,b,c,d) {
        return a + b + c + d;
      }),data["Any"],function(a,b) {
      return a * (b / 100.0);
      }),
    theta: ["North", "N-E", "East", "S-E", "South", "S-W", "West", "N-W"],
    name: "> 20 m/s",
    marker: {color: "rgb(106,81,163)"},
    type: "barpolar"
  }, {
    r: _.zipWith(_.zipWith(data["10-20 m/s"],data["5-10 m/s"],data["<5 m/s"],function(a,b,c) {
      return a + b + c;
    }),data["Any"],function(a,b) {
      return a * (b / 100.0);
    }),
    theta: ["North", "N-E", "East", "S-E", "South", "S-W", "West", "N-W"],
    name: "10-20 m/s",
    marker: {color: "rgb(158,154,200)"},
    type: "barpolar"
  }, {
    r: _.zipWith(_.zipWith(data["5-10 m/s"],data["<5 m/s"],function(a,b) {
      return a + b;
    }),data["Any"],function(a,b) {
      return a * (b / 100.0);
    }),
    theta: ["North", "N-E", "East", "S-E", "South", "S-W", "West", "N-W"],
    name: "5-10 m/s",
    marker: {color: "rgb(203,201,226)"},
    type: "barpolar"
  }, {
    r: _.zipWith(data["<5 m/s"],data["Any"],function(a,b){
      return a * (b / 100.0);
    }),
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
  drawerRef = createRef();

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
        Axios.get('http://localhost:8080/v1/windrose?height=67.00m&lat='+this.state.lat.toString()+'&lon='+this.state.lng.toString()+
            '&start_date=20070101&stop_date=20070301&vertical_interpolation=nearest&spatial_interpolation=idw').then(function(response){
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
      openModal: false,
      openDrawer: false
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
          <ControlsDrawer ref={this.drawerRef} />
          <LoadingSpinnerComponent />
          <SimpleModal ref={this.modalRef} />
        </div>
    );
  }
};

export default App;