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
    project_name:'summer_olympics_gb'//has to match the file name
  }
  
  $EVE_API = 'http://localhost:5000/api/';//adress where the servor api is serving the database
  nbviz.DATA_PATH = 'static/viz/' + nbviz.STORY.project_name + '/data_sources/'
  nbviz.FULL_DATA = 'main_linechart'

  nbviz.FILTERS = [
    {locationID:'medal-select select', name:'Medal', dimension:'Medal', defaultValue:'Gold', type:'Dropdown'},
    {locationID:'value-select select', name:'Type de valeur', dimension:'value_filter', defaultValue:'Nombre', type:'Radio'}
  ];

  nbviz.DATA_PROVIDER= {
    getterFunction:nbviz.prepareDatasets,
    params:[
    //   {
    //     name:'fullData',
    //     source:'fullData.json',
    //     getterFunction:nbviz.getDataFromJSON
    //   }
    // ,
      {
        name:'main_linechart',
        source:'main_linechart.json',
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
    {
      _type:'Linechart',
      _id:'mainLinechart',
      margins: {top:0, right:15, bottom:40, left:15},
      padding: {interbar:.1, left:5, bottom:0, legend:5},
      dataGetter:nbviz.nestDataByKey,
      dataGetterParams:{nestKey:'country_name', xKey:'Edition', sort:{'type':'ascending','on':'Edition'}},
      xStep: 4,
      xTicksFreq:'2',
      domain:'main_linechart',
      _value:'value',
      dim:{height:'150px',width:"col-md-12"},
      title:'Graph info (period,etc.)',
      format:{'dimension':'Edition','type':'date','format':'%Y', flag:true}
    }
  ];

  nbviz.TEXT = {'domain':'text'}


}(window.nbviz=window.nbviz || {}));