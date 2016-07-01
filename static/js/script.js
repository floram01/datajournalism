var API_URL='http://localhost:5000/api'

var displayJSON=function(query){
  d3.json(API_URL + query, function(error, data){
    if (error){
      console.log(error)
    };

    d3.select('div#query pre').html(query);
    d3.select('div#data pre').html(JSON.stringify(data, null, 4));
    console.log(data);
  });
};

var query='/full_data?projection=' + JSON.stringify({
  'mini_bio':0
});

displayJSON(query); 