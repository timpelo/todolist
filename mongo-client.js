(function() {
  "use strict";

  var MongoClient = require('mongodb').MongoClient
  var url = "mongodb://localhost:27017/test";
  var listCollection = "todolist";
  var itemCollection = "todoitem";

  /* List functions */
  function getLists(callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(listCollection);
      collection.find({}).toArray(function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
    });
  }

  function addList(todolist, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(listCollection);
      collection.insertOne(todolist, function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback({"success":"true", "message":result});
        }
        db.close();
      });
    });
  }

  function getListById(listId, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(listCollection);
      collection.find({"id":Number(listId)}).toArray(function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
    });
  }

  function updateList(listItem, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(listCollection);
      collection.update({"_id":listItem._id},{$set:listItem}, function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
    });
  }

  function deleteList(listItem, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(listCollection);
      console.log(listItem._id);
      collection.remove({_id:listItem._id}, function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          var items = db.collection(itemCollection);
          items.remove({todolist:listItem.id}, function(err2, result2) {
            if(err2 != null) {
              callback({"success" : "false", "message":err2});
            } else {
              callback(result);
            }
          });
        }
        db.close();
      });
    });
  }

  /* Item functions */
  function addItem(item, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(itemCollection);
      collection.insertOne(item, function(err, result) {
        if(err != null) {
          callback({"success":"false", "message":err});
        } else {
          callback({"success":"true", "message":result});
        }
        db.close();
      });
    });
  }

  function getItemsByList(listId, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(itemCollection);
      collection.find({"todolist":Number(listId)}).toArray(function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
    });
  }

  function getItemById(id, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(itemCollection);
      collection.find({"id":Number(id)}).toArray(function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
    });
  }

  function updateItem(todoItem, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(itemCollection);
      collection.update({"_id":todoItem._id},{$set:todoItem}, function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
    });
  }

  function deleteItem(item, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(itemCollection);
      collection.remove({_id:item._id}, function(err, result) {
        if(err != null) {
          callback({"success" : "false", "message":err});
        } else {
          callback(result);
        }
        db.close();
      });
    });
  }

  /* Utils */
  function getLastId(collectionName, callback) {
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection(collectionName);
      collection.find({}).sort({"id":-1}).limit(1).toArray(function(err, result) {
        if(result.length > 0) {
          callback(result[0].id);
        } else {
          callback(0);
        }
        db.close();
      });
    });
  }

  exports.getLists = getLists;
  exports.getListById = getListById;
  exports.addList = addList;
  exports.updateList = updateList;
  exports.deleteList = deleteList;

  exports.getItemById = getItemById;
  exports.getItemsByList = getItemsByList;
  exports.addItem = addItem;
  exports.updateItem = updateItem;
  exports.deleteItem = deleteItem;

  exports.getLastId = getLastId;
}())
