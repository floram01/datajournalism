// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts
// abstract the filters

(function(nbviz){

nbviz.TRANS_DURATION = 1500; // length in ms for our transitions
  nbviz.COLORS = {palegold:'#E6BE8A'}; // any named colors we use

  nbviz.STORY = {
    title :'MY TITLE',
    comment:'My comment',
    sources : 'My sources',
    project_name:'nobel'//has to match the file name
  }
  
  $EVE_API = 'http://localhost:5000/api/';//adress where the servor api is serving the database
  nbviz.DATA_PATH = 'static/viz/' + nbviz.STORY.project_name + '/data_sources/'
  nbviz.FULL_DATA = 'nobelData'

  nbviz.FILTERS = [
    {locationID:'category-select select', name:'Category',dimension:'category', resetValue:'All Categories',type:'Dropdown'},
    {locationID:'gender-select select', name:'Gender', dimension:'gender', resetValue:'All',type:'Dropdown'},
    {locationID:'country-select select', name:'Country', dimension:'country', resetValue:'All Countries',type:'Dropdown'}
  ];

  nbviz.DATA_PROVIDER= {
    getterFunction:nbviz.prepareDatasets,
    params:[
      {
        name:'nobelData',
        source:'full_data_records.json',
        getterFunction:nbviz.getDataFromJSON
      }
    // ,
    //   {
    //     name:'text',
    //     source:'text.csv',
    //     getterFunction:nbviz.getDataFromCSV
    //   }
    ]
  };

  nbviz.CHARTS = [
    // {
  //     _type:'Barchart',
  //     _id:'barchart',
  //     margins: {top:10, right:20, bottom:85, left:20},
  //     padding: {interbar:.1, left:10, bottom:10},
  //     dataGetter:nbviz.groupBy,
  //     dataGetterParams:{groupDim:'country', customAxis:'x'},
  //     _value:'value',
  //     domain:'nobelData',
  //     dim:{height:'240px',width:"col-md-12"},
  //     title:'Graph title exemple'
  //   }
  // ,
  //   {
  //     _type:'Table',
  //     _id:'table',
  //     margins: {top:0, right:0, bottom:0, left:0},
  //     padding: {interbar:0, left:0, bottom:0},
  //     dataGetter:nbviz.allDataSortedByKey,
  //     dataGetterParams:{groupDim:'category', sortKey:'year'},
  //     domain:'nobelData',
  //     dim:{height:'240px',width:"col-md-12"},
  //     tableTitle:'List of selected nobel winners',
  //     tableColumns:['year','category','name']
  //   } 
  // ,
    {
      _type:'Timeline',
      _id:'timeline',
      margins: {top:20, right:0, bottom:40, left:0},
      padding: {interbar:.1, left:0, right:0, bottom:0},
      dataGetter:nbviz.nestDataByKey,
      dataGetterParams:{nestKey:'year', nestedUniqueKey:'name', colorKey:'category'},
      xTicksFreq:'10',
      dim:{height:'240px',width:"col-md-12"}
    } 
  // ,
  //   {
  //     _type:'HorizontalBarchart',
  //     _id:'horizontalBarchartFrance',
  //     margins: {top:30, right:20, bottom:0, left:72},
  //     padding: {interbar:.1, left:5, bottom:0, legend:5},
  //     dataGetter:nbviz.topFlop,
  //     dataGetterParams:{top:true,top_num:10},
  //     _label:'Discipline',
  //     _value:'value',
  //     _yKey:'Discipline',
  //     domain:'fullData',
  //     dim:{height:'230px',width:"col-md-12"},
  //     title:'Graph info (period,etc.)'
  //   }
  // ,
  //   {
  //     _type:'Heatmap',
  //     _id:'heatmap',
  //     _key:'year',
  //     _yKey:'country',
  //     domain:'fullData',
  //     margins: {top:20, right:20, bottom:60, left:40},
  //     padding: {interbar:.05, left:0, bottom:20, legend:0},
  //     _value:'my_value',
  //     xDimension:'year',
  //     yDimension:'country',
  //     xIndex:'x_index',
  //     yIndex:'y_index',
  //     dataGetter:nbviz.fullData,
  //     dim:{height:'500px',width:"col-md-12"}
  //   }
  ];

}(window.nbviz=window.nbviz || {}));