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
    title :'MY TITLE',
    comment:'My comment',
    sources : 'My sources',
  }

  nbviz.FILTERS = [
    {locationID:'gender-select select', name:'Gender', dimension:'Gender', defaultValue:'All'},
  ];

  nbviz.OLD_DATA_PROVIDER= {
    getterFunction:nbviz.getDataFromJSON,
    params:{
      file:'static/viz/summer_olympics/full_data_records_total.json'
    }
  };

  nbviz.DATA_PROVIDER= {
    getterFunction:nbviz.prepareDatasets,
    params:[
      {
        name:'fullData',
        source:'static/viz/summer_olympics/france_best_disciplines_total.json',
        getterFunction:nbviz.getDataFromJSON
      }
    ,
      {
        name:'text',
        source:'static/viz/summer_olympics/text.csv',
        getterFunction:nbviz.getDataFromCSV
      }
    ]
  };

  nbviz.CHARTS = [
    {
      _type:'HorizontalBarchart',
      _id:'horizontalBarchartFrance',
      margins: {top:30, right:20, bottom:0, left:72},
      padding: {interbar:.1, left:5, bottom:0, legend:5},
      divID: 'nobel-vBar-France',
      dataGetter:nbviz.myGetter,
      dataGetterParams:{groupDim:'Gender',top:true,top_num:10},
      _key:'Discipline',
      _value:'value',
      _yKey:'Discipline',
      domain:'fullData',
      dim:{height:'230px',width:"col-md-12"},
      format:'.0%',
      title:'Graph info (period,etc.)'
    }
  ];

  nbviz.TEXT = {'domain':'text'}


}(window.nbviz=window.nbviz || {}));