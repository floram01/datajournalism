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
    project_name:'napoleon'//has to match the file name
  }
  
  $EVE_API = 'http://localhost:5000/api/';//adress where the servor api is serving the database
  nbviz.DATA_PATH = 'static/viz/' + nbviz.STORY.project_name + '/data_sources/'
  nbviz.FULL_DATA = 'fullData'

  nbviz.DATA_PROVIDER= {
    getterFunction:nbviz.prepareDatasets,
    params:[
      {
        name:'fullData',
        source:'flare.json',
        getterFunction:nbviz.getDataFromJSON,
        type:'local'
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
      _id:'my_bubbles',
      
      chartsParams:[
        {
          _id:'main_graph',
          _type:'Bubbles',
          margins: {top:30, right:20, bottom:0, left:72},
          padding: {interbar:.1, left:5, bottom:0, legend:10},
          dataGetter:nbviz.fullData,
          dataGetterParams:{top:true,top_num:10, dim:'Gender'},
          _label:'Discipline',
          _value:'value',
          _yKey:'Discipline',
          domain:'fullData',
          // title:'',
          dim:{height:'230px',width:"col-md-12"},
          precision:{value:{precisionCol:'precision',type:'column'}}
        }
      ],

      filters : [
      ],
      
      story:{
        title:'France (1992 - 2012)',
        comment:'Résultats tous genres et toutes médailles confondus',
        sources:'Wikipedia, The guardian Datablog',
        text:{
          'domain':'text'
        }
      }
    }
  ];


}(window.nbviz=window.nbviz || {}));