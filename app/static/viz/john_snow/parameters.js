// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts
// abstract the filters

(function(nbviz){

  nbviz.TRANS_DURATION = 1500; // length in ms for our transitions
  nbviz.COLORS = {palegold:'#E6BE8A'}; // any named colors we use

  nbviz.STORY = {
    title :'Une (bonne) datavisualisation peut sauver des vies',
    edito:'edito',
    project_name:'john_snow'//has to match the file name
  }
  
  $EVE_API = 'http://localhost:5000/api/';//adress where the servor api is serving the database
  nbviz.DATA_PATH = 'static/viz/' + nbviz.STORY.project_name + '/data_sources/';
  nbviz.IMG_PATH = 'static/viz/' + nbviz.STORY.project_name + '/images/';
  nbviz.FULL_DATA = 'cholera';

  nbviz.DATA_PROVIDER= {
    getterFunction:nbviz.prepareDatasets,
    params:[
      {
        name:'heatmap',
        source:'data_heatmap.csv',
        getterFunction:nbviz.getDataFromCSV,
        type:'local'
      }
    ,
      {
        name:'cholera',
        source:'cholera_6.csv',
        getterFunction:nbviz.getDataFromCSV,
        type:'local'
      }
    ,
      {
        name:'edito',
        source:'edito.csv',
        getterFunction:nbviz.getDataFromCSV
      }
    ,
      {
        name:'histoire',
        source:'histoire.csv',
        getterFunction:nbviz.getDataFromCSV
      }
    ,
      {
        name:'notre_graph',
        source:'notre_graph.csv',
        getterFunction:nbviz.getDataFromCSV
      }
    ]
  };

  nbviz.CHARTS = [
    {
      _id:'original_map',
      
      chartsParams:[
        {
          _id:'map_img',
          _type:'IMG',
          domain:'Snow_cholera_map.jpg',
          dim:{height:'500px',width:"col-md-12"}
        }
      ],

      filters : [
      ],
      
      story:{
        title:'John Snow vs Vibrio cholerae',
        comment:"Pour une fois qu'une carte est utilisée à bon escient, parlons-en!",
        sources:'The Guardian Datablog, Visual Explanations, E.R.Tufte',
        text:{
          'domain':'histoire'
        }
      }
    }
  ,
    {
      _id:'cholera',
      
      chartsParams:[
        {
          _id:'cholera',
          _type:'Heatmap',
          _xKey:'pump',
          _yKey:'location',
          domain:'cholera',
          margins: {top:10, right:10, bottom:10, left:10},
          padding: {interbar:.05, left:0, bottom:65, legend:0},
          _value:'distance',
          xDimension:'pump',
          yDimension:'location',
          xIndex:'x_index',
          yIndex:'y_index',
          dataGetterParams:{_sort:'desc',sortKey:'pump'},
          dataGetter:nbviz.fullData,
          dim:{height:'500px',width:"col-md-12"},
          hideYScale:true,
          posXScale:'top',
          orientXScale:'horizontal',
          anchorXScale:'middle',
          wrapXLegend:true,
          precision:{'distance':',.1f', 'my_value':',.0f'}
        }
      ],

      filters : [
      ],
      
      story:{
        title:'A nous',
        comment:'Pas de triche, on reste sur du noir et blanc!',
        sources:'The Guardian Datablog, Visual Explanations, E.R.Tufte',
        text:{
          'domain':'notre_graph'
        }
      }
    }
  ];

  nbviz.TEXT = {'domain':'edito'}


}(window.nbviz=window.nbviz || {}));