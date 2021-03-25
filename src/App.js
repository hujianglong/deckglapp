/// app.js
import React,{useState,useEffect} from 'react';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';
import {MVTLayer} from '@deck.gl/geo-layers'
import {StaticMap} from 'react-map-gl';
import geojsonvt from 'geojson-vt';
import SimpleCard from './SimpleCard'
//import cbzdata from '../public/zone.json'
// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaHVqaWFuZ2xvbmciLCJhIjoiY2ttNXdtY2MxMGltdDJ4bjZ1em4xbzdrMiJ9.8qWq5H4lvkIcfINKVNTLMg';


// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 119.100792806844169, 
  latitude: 31.862516829817153,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

// Data to be used by the GeojsonLayer

 const layer = new GeoJsonLayer({
    id: 'geojson-layer',
    data:'https://geojson-data.oss-cn-hangzhou.aliyuncs.com/zone.json',
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 10,
    lineWidthMinPixels: 2,
    getFillColor: [160, 160, 180, 200],
    getLineColor: f =>{
      const bluezone = f.properties.isBlue;
      if (bluezone === 7) {
        return [0,0,255,200]
      }
      else{
        return [255,0,0,200]
      }
    } ,
    getRadius: 100,
    getLineWidth: 1,
    autoHighlight:true,
    highlightColor:[0,0,0,128]
  })


function App({data}) {
   const [clickInfo, setClickInfo] = useState({});
  const [geoDate,setGeoDate] = useState({})
 const getData=async()=> {
   await fetch('fordcbz-alldata.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
       // console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        //console.log(myJson);
        var tileIndex = geojsonvt(myJson,{
        maxZoom: 24,  // max zoom to preserve detail on; can't be higher than 24
        tolerance: 3, // simplification tolerance (higher means simpler)
        extent: 256, // tile extent (both width and height)
        buffer: 64,   // tile buffer on each side
        debug: 0,     // logging level (0 to disable, 1 or 2)
        lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
        promoteId: null,    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
        generateId: true,  // whether to generate feature ids. Cannot be used with `promoteId`
        indexMaxZoom: 24,       // max zoom in the initial tile index
        indexMaxPoints: 100000 // max number of points per tile in the index
      });
        console.log(tileIndex);
        setGeoDate(tileIndex);
      });
  }
  useEffect(()=>{
    //getData()
  },[])

const layermvt = new MVTLayer({
  id: 'MVTLayer',
  data: [
    'http://127.0.0.1:8080/{z}/{x}/{y}.pbf'
  ],
  getLineColor: d =>d.properties.isBlue?[0,0,255]:[255,0,0],
  getFillColor: d =>d.properties.isBlue?[0,0,255]:[255,0,0],
  getLineWidth: 5,
  lineWidthMinPixels: 1,
   /* props from MVTLayer class */
  
  binary: false,
  // highlightedFeatureId: null,
  // loaders: ,
  // uniqueIdProperty: '',
  
  /* props inherited from TileLayer class */
  
  // extent: null,
  // getTileData: null,
  // maxCacheByteSize: null,
  // maxCacheSize: null,
  // maxRequests: 6,
  maxZoom: 23,
  minZoom: 0,
  // onTileError: null,
  // onTileLoad: null,
  // onTileUnload: null,
  // onViewportLoad: null,
  // refinementStrategy: 'best-available',
  // renderSubLayers: null,
  // tileSize: 512,
  // zRange: null,
  
  /* props inherited from Layer class */
  
   autoHighlight: true,
  // coordinateOrigin: [0, 0, 0],
  // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
   highlightColor: [0, 0, 0, 128],
  // modelMatrix: null,
  // opacity: 1,
   pickable: true,
  // visible: true,
  // wrapLongitude: false,
 onHover:(info,event)=>{
   event.preventDefault();
   setClickInfo(info)
 }
  //onClick: (info, event) => console.log('Clicked:', info, event)
});
  const layers = [
   // layer,
    layermvt
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
       <StaticMap 
        mapStyle="mapbox://styles/mapbox/dark-v9"
       mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      {clickInfo.object && (
        <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: clickInfo.x, top: clickInfo.y}}>
          <SimpleCard info = {clickInfo.object.properties} />
        </div>
      )}
     
    </DeckGL>
  );
}
export default App;
