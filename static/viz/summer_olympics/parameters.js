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
    project_name:'summer_olympics'//has to match the file name
  }
  
  $EVE_API = 'http://localhost:5000/api/';//adress where the servor api is serving the database
  nbviz.DATA_PATH = 'static/viz/' + nbviz.STORY.project_name + '/data_sources/'
  nbviz.FULL_DATA = 'nobelData'

  nbviz.FILTERS = [
    // {locationID:'gender-select select', name:'Gender', dimension:'Gender', defaultValue:'All', type:'Dropdown'},
    // {locationID:'country-select select', name:'Country', dimension:'country_name', defaultValue:'France', type:'Dropdown'},
    // {locationID:'period-select select', name:'Period', dimension:'period', defaultValue:'1992 - 2012', type:'Dropdown'},
    // {locationID:'value-select select', name:'Type de valeur', dimension:'value_filter', defaultValue:'%', type:'Radio'}
    {locationID:'category-select select', name:'Category',dimension:'category', resetValue:'All Categories',type:'Dropdown'},
    {locationID:'gender-select select', name:'Gender', dimension:'gender', resetValue:'All',type:'Dropdown'},
    {locationID:'country-select select', name:'Country', dimension:'country', resetValue:'All Countries',type:'Dropdown'}
  ];

  nbviz.DATA_PROVIDER= {
    getterFunction:nbviz.prepareDatasets,
    params:[
      // {
      //   name:'fullData',
      //   source:'full_data.json',
      //   getterFunction:nbviz.getDataFromJSON
      // }
    // ,
      {
        name:'nobelData',
        source:'full_data_records.json',
        getterFunction:nbviz.getDataFromJSON
      }
    ,
      {
        name:'text',
        source:'text.csv',
        getterFunction:nbviz.getDataFromCSV
      }
    ]
  };

  nbviz.CHARTS = [
    {
      // _type:'HorizontalBarchart',
      // _id:'horizontalBarchartFrance',
      // margins: {top:30, right:20, bottom:0, left:72},
      // padding: {interbar:.1, left:5, bottom:0, legend:5},
      // dataGetter:nbviz.topFlop,
      // dataGetterParams:{top:true,top_num:10},
      // _label:'Discipline',
      // _value:'value',
      // _yKey:'Discipline',
      // domain:'fullData',
      // dim:{height:'230px',width:"col-md-12"},
      // title:'Graph info (period,etc.)'
    }
  ];

  nbviz.TEXT = {'domain':'text'}


}(window.nbviz=window.nbviz || {}));