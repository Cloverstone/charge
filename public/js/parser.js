function getItems(item){

      var fields = {};
      for(var i in item){
        if(typeof item[i] === "object"){
          if(item[i] instanceof Array){
              var temp = {fields:{}, label:false};
              temp.fields[i] = {multiple: {duplicate: true}, fields: getItems(item[i][0])};
              fields[i+'_cont'] = temp;
          }else{
            fields[i] = {fields: getItems(item[i])};
          }
        }else{
          if(item[i] === false || item[i] === true){
            fields[i]= {type: 'checkbox'};
          }else if(!isNaN(item[i])){
            fields[i]= {type: 'number'};
          }else{
            fields[i]= {};
          }
        }
      }

  return fields
}