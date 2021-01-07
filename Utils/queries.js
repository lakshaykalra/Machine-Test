const saveData=(model,data)=>{
    return  new model(data).saveAsync();
  }


  const findOneandPopulate = (model, query, projection, options, collectionOptions)=> {
    return model.findOne(query, projection, options).populate(collectionOptions).execAsync();
 };

 const remove = function (model, condition) {
    return model.removeAsync(condition);
};


const aggregateData =  (model, group)=> {
    return model.aggregateAsync(group);
 };

 const findOne =  (model, query, projection, options)=> {
    return model.findOneAsync(query, projection, options);
 };
  
  module.exports = {
      saveData,
      findOneandPopulate,
      remove,
      aggregateData,
      findOne
  }