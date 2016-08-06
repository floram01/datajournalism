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

  nbviz.OLD_DATA_PROVIDER= {
    getterFunction:nbviz.getDataFromJSON,
    params:{
      file:'static/viz/summer_olympics/full_data_records.json'
    }
  };

  nbviz.DATA_PROVIDER= {
    getterFunction:nbviz.prepareDatasets,
    params:[
    //   {
    //     name:'fullData',
    //     source:'static/viz/summer_olympics/full_data_records.json',
    //     getterFunction:nbviz.getDataFromJSON
    //   }
    // ,
    //   {
    //     name:'heatmap',
    //     source:'static/viz/summer_olympics/data_heatmap.csv',
    //     getterFunction:nbviz.getDataFromCSV
    //   }
    // ,
      {
        name:'france_best_disciplines',
        source:'static/viz/summer_olympics/france_best_disciplines.json',
        getterFunction:nbviz.getDataFromJSON
      }
    ,
      {
        name:'france_best_disciplines_men',
        source:'static/viz/summer_olympics/france_best_disciplines_men.json',
        getterFunction:nbviz.getDataFromJSON
      }
    ,
      {
        name:'france_best_disciplines_women',
        source:'static/viz/summer_olympics/france_best_disciplines_women.json',
        getterFunction:nbviz.getDataFromJSON
      }
    ,
      {
        name:'france_best_disciplines_ever',
        source:'static/viz/summer_olympics/france_best_disciplines_ever.json',
        getterFunction:nbviz.getDataFromJSON
      }
    ]
  };

  nbviz.CHARTS = [
  //   {
  //     _type:'Barchart',
  //     _id:'barchart',
  //     margins: {top:10, right:20, bottom:85, left:20},
  //     padding: {interbar:.1, left:10, bottom:10},
  //     divID: 'nobel-bar',
  //     _key:'key',
  //     dataGetter:nbviz.groupBy,
  //     dataGetterParams:{groupDim:'country'},
  //     dim:{height:'240px',width:"col-md-8"}
  //   }
  // ,
    // {
    //   _type:'Table',
    //   _id:'table',
    //   margins: {top:0, right:0, bottom:0, left:0},
    //   padding: {interbar:0, left:0, bottom:0},
    //   divID: 'nobel-table',
    //   dataGetter:nbviz.allDataSortedByKey,
    //   dataGetterParams:{groupDim:'category'},
    //   _key:'year',
    //   dim:{height:'240px',width:"col-md-4"},
    //   tableTitle:'List of selected nobel winners',
    //   tableColumns:['year','category','name']
    // } 
  // ,
  //   {
  //     _type:'Timeline',
  //     _id:'timeline',
  //     margins: {top:20, right:20, bottom:40, left:20},
  //     padding: {interbar:.1, left:0, bottom:0},
  //     divID: 'nobel-time',
  //     xTicksFreq:'10',
  //     _key:'key',
  //     timeID:'year',
  //     groupID:'values',
  //     dataGetter:nbviz.nestDataByKey,
  //     dataGetterParams:{groupDim:'category'},
  //     dim:{height:'240px',width:"col-md-12"}
  //   } 
  // ,
  //   {
  //     _type:'HorizontalBarchart',
  //     _id:'horizontalBarchart',
  //     margins: {top:20, right:20, bottom:20, left:60},
  //     padding: {interbar:.1, left:5, bottom:20, legend:5},
  //     divID: 'nobel-vBar',
  //     _key:'key',
  //     _yKey:'key',
  //     dataGetter:nbviz.groupBy,
  //     dataGetterParams:{groupDim:'category'},
  //     dim:{height:'240px',width:"col-md-6"}
  //   }
  // ,
    {
      _type:'HorizontalBarchart',
      _id:'horizontalBarchartFrance',
      margins: {top:20, right:20, bottom:20, left:65},
      padding: {interbar:.1, left:5, bottom:20, legend:5},
      divID: 'nobel-vBar-France',
      dataGetter:nbviz.fullData,
      _key:'Discipline',
      _yKey:'Discipline',
      domain:'france_best_disciplines',
      dim:{height:'240px',width:"col-md-4"},
      format:'.1%'
    }
  ,
    {
      _type:'HorizontalBarchart',
      _id:'horizontalBarchartFranceWomen',
      margins: {top:20, right:20, bottom:20, left:65},
      padding: {interbar:.1, left:5, bottom:20, legend:5},
      divID: 'nobel-vBar-France-women',
      dataGetter:nbviz.fullData,
      _key:'Discipline',
      _yKey:'Discipline',
      domain:'france_best_disciplines_women',
      dim:{height:'240px',width:"col-md-4"},
      format:'.1%'
    }
  ,
    {
      _type:'HorizontalBarchart',
      _id:'horizontalBarchartFranceMen',
      margins: {top:20, right:20, bottom:20, left:65},
      padding: {interbar:.1, left:5, bottom:20, legend:5},
      divID: 'nobel-vBar-France-men',
      dataGetter:nbviz.fullData,
      _key:'Discipline',
      _yKey:'Discipline',
      domain:'france_best_disciplines_men',
      dim:{height:'240px',width:"col-md-4"},
      format:'.1%'
    }
  ,
    {
      _type:'HorizontalBarchart',
      _id:'horizontalBarchartFranceEver',
      margins: {top:20, right:20, bottom:20, left:65},
      padding: {interbar:.1, left:5, bottom:20, legend:5},
      divID: 'nobel-vBar-France-ever',
      dataGetter:nbviz.fullData,
      _key:'Discipline',
      _yKey:'Discipline',
      domain:'france_best_disciplines_ever',
      dim:{height:'120px',width:"col-md-4"},
      format:'.1%'
    }
  // ,
  //   {
  //     _type:'Heatmap',
  //     _id:'heatmap',
  //     _key:'year',
  //     _yKey:'country',
  //     margins: {top:20, right:20, bottom:60, left:40},
  //     padding: {interbar:.05, left:0, bottom:20, legend:0},
  //     divID: 'nobel-heatmap',
  //     _value:'my_value',
  //     xDimension:'year',
  //     yDimension:'country',
  //     xIndex:'x_index',
  //     yIndex:'y_index',
  //     dataGetter:nbviz.fullData,
  //     domain:'heatmap',
  //     dim:{height:'500px',width:"col-md-6"}
  //   }
  ];

}(window.nbviz=window.nbviz || {}));