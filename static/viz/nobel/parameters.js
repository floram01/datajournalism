// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts
// abstract the filters

(function(nbviz){

  nbviz.valuePerCapita = 0; // metric flag
  nbviz.activeCountry = null;
  nbviz.TRANS_DURATION = 1500; // length in ms for our transitions
  nbviz.MAX_CENTROID_RADIUS = 30;
  nbviz.MIN_CENTROID_RADIUS = 2;
  nbviz.COLORS = {palegold:'#E6BE8A'}; // any named colors we use

  $EVE_API = 'http://localhost:5000/api/';//adress where the servor api is serving the database
  nbviz.FULL_DATA = 'full_data'

  nbviz.STORY = {
    title :' Visualising the Nobel Prize',
    _info : 'Placeholder for info',
  }

  nbviz.FILTERS = [
    {locationID:'category-select select', name:'Category',dimension:'category', resetValue:'All Categories'},
    {locationID:'gender-select select', name:'Gender', dimension:'gender', resetValue:'All'},
    {locationID:'country-select select', name:'Country', dimension:'country', resetValue:'All Countries'}
  ];

  nbviz.DATA_PROVIDER= {
    getterFunction:nbviz.getDataFromJSON,
    params:{
      file:'static/viz/nobel/full_data_records.json'
    }
  };

  nbviz.CHARTS = [
    {
      _type:'Barchart',
      _id:'barchart',
      margins: {top:20, right:20, bottom:60, left:40},
      padding: {interbar:.1, left:20, bottom:20},
      divID: 'nobel-bar',
      _key:'key',
      dataGetter:nbviz.groupBy,
      dataGetterParams:{groupDim:'country'},
      dim:{height:'240px',width:"col-md-8"}
    }
  ,
    {
      _type:'Timeline',
      _id:'timeline',
      margins: {top:20, right:20, bottom:40, left:20},
      padding: {interbar:.1, left:20, bottom:20},
      divID: 'nobel-time',
      xTicksFreq:'10',
      _key:'key',
      timeID:'year',
      groupID:'values',
      dataGetter:nbviz.nestDataByKey,
      dataGetterParams:{groupDim:'category'},
      dim:{height:'240px',width:"col-md-12"}
    } 
  ];

}(window.nbviz=window.nbviz || {}));