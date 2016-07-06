// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  nbviz.valuePerCapita = 0; // metric flag
  nbviz.activeCountry = null;
  nbviz.TRANS_DURATION = 1500; // length in ms for our transitions
  nbviz.MAX_CENTROID_RADIUS = 30;
  nbviz.MIN_CENTROID_RADIUS = 2;
  nbviz.COLORS = {palegold:'#E6BE8A'}; // any named colors we use

  $EVE_API = 'http://localhost:5000/api/';//adress where the servor api is serving the database
  nbviz.FULL_DATA = 'full_data'

  nbviz.ALL_CATS = 'All Categories';
  nbviz.ALL_GENDERS = 'All'
  nbviz.ALL_COUNTRIES='All Countries';
  nbviz.FILTERS = [
    {locationID:'cat-select select', dimension:'category', resetValue:nbviz.ALL_CATS},
    {locationID:'gender-select select', dimension:'gender', resetValue:nbviz.ALL_GENDERS},
    {locationID:'country-select select', dimension:'country', resetValue:nbviz.ALL_COUNTRIES}
  ];

  nbviz.BARCHART = 


}(window.nbviz=window.nbviz || {}));