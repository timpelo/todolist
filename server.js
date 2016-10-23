(function() {
  "use strict";
  // Load modules
  var express = require('express');
  var mongo = require('./mongo-client');
  var bodyParser = require('body-parser');
  var app = express();
  var serverPort = 8080;
  var lastListId = 0;
  var lastItemId = 0;


  mongo.getLastId('todolist', function(result) {
    lastListId = result;
    console.log("init id of last list " + lastListId);
  });

  mongo.getLastId('todoitem', function(result) {
    lastItemId = result;
    console.log("init id of last item " + lastItemId);
  });


  // Configuration
  app.use(bodyParser.json());
  app.use(express.static('client'));

  /* Endpoints for maganing todo lists */

  // Gets all todo lists.
  app.get("/list", function(req, res) {
    mongo.getLists(function(result) {
      res.json(result)
    });
  });

  // Gets specific todo list.
  app.get("/list\/:listId([0-9]+?)$", function(req, res) {
    mongo.getListById(req.params.listId, function(result) {
      res.json(result);
    })
  });

  // Adds new list to the database.
  app.post("/list/add", function(req, res) {
    var name = req.body.name;
    var desc = req.body.description;

    console.log(name);
    console.log(desc);

    if(name != null && desc != null) {
      var todoList = TodoList(name, desc, null);
      mongo.addList(todoList, function(result) {

        if(result.success === "true") {
          lastListId += 1;
        }
        res.json(result);
      })
    } else {
      res.json(JSONResponse(false, "Invalid name or description"));
    }
  });

  // Updates list.
  app.post("/list/update", function(req, res) {
    var name = req.body.name;
    var desc = req.body.description;
    var checked = req.body.checked;
    var priority = req.body.priority;
    var id = req.body.id;

    if(id != null) {
      mongo.getListById(id, function(result) {
        var todoList = result[0];

        if(todoList != null && todoList != undefined) {
          if(desc != null) {
            todoList.description = desc;
          }
          if(name != null) {
            todoList.name = name;
          }
          if(checked != null) {
            todoList.checked = checked;
          }
          if(priority != null) {
            todoList.priority = priority;
          }

          mongo.updateList(todoList, function(result) {
            res.json(result);
          });
        } else {
          res.json(JSONResponse(false, "Invalid id"));
        }
      });
    } else {
      res.json(JSONResponse(false, "Invalid id"));
    }
  });

  // Deletes list.
  app.delete("/list/delete\/:id([0-9]+?)$", function(req, res) {
    mongo.getListById(req.params.id, function(result) {
      var todoList = result[0];
      if(todoList != null && todoList != undefined) {
        mongo.deleteList(todoList, function(result) {
          res.json(result);
        });
      }
    });
  });

  /* Endpoints for managin todo items */

  // Add item.
  app.post("/items/add", function(req, res) {
    var name = req.body.name;
    var desc = req.body.description;
    var listId = req.body.listId;
    var prio = req.body.priority;

    if(name != null && desc != null && listId != null && prio != null) {
      var todoItem = TodoItem(name, desc, listId, prio);
      mongo.addItem(todoItem, function(result) {

        if(result.success === "true") {
          lastItemId += 1;
        }
        res.json(result);
      })
    } else {
      res.json(JSONResponse(false, "Invalid name or description"));
    }
  });

  // Gets item with id
  app.get("/item\/:id([0-9]+?)$", function(req, res) {
    mongo.getItemById(req.params.id, function(result) {
      res.json(result);
    })
  });

  // Gets items from the list
  app.get("/items\/:listId([0-9]+?)$", function(req, res) {
    mongo.getItemsByList(req.params.listId, function(result) {
      res.json(result);
    })
  });

  // Updates item
  app.post("/items/update", function(req, res) {
    var name = req.body.name;
    var desc = req.body.description;
    var checked = req.body.checked;
    var priority = req.body.priority;
    var listId = req.body.listId;
    var id = req.body.id;

    if(id != null) {
      mongo.getItemById(id, function(result) {
        var todoItem = result[0];

        if(todoItem != null && todoItem != undefined) {
          if(desc != null) {
            todoItem.description = desc;
          }
          if(name != null) {
            todoItem.name = name;
          }
          if(checked != null) {
            todoItem.checked = checked;
          }
          if(priority != null) {
            todoItem.priority = priority;
          }

          if(listId != null) {
            todoItem.listId = listId;
          }

          mongo.updateItem(todoItem, function(result) {
            res.json(result);
          });
        } else {
          res.json(JSONResponse(false, "Invalid id"));
        }
      });
    } else {
      res.json(JSONResponse(false, "Invalid id"));
    }
  });

  // Deletes item.
  app.delete("/items/delete\/:id([0-9]+?)$", function(req, res) {
    mongo.getItemById(req.params.id, function(result) {
      var item = result[0];
      if(item != null && item != undefined) {
        mongo.deleteItem(item, function(result) {
          res.json(result);
        });
      } else {
        res.json(JSONResponse(false, "Item does not exist"));
      }
    });
  });



  /* Server */
  var server = app.listen(serverPort, function() {

  });

  /* Models */
  var TodoList = function(name, description) {
    var list = {
      "id":lastListId+1,
      "name":name,
      "description":description,
      "checked":0,
      "priority":1
    };

    return list;
  }

  var TodoItem = function(name, description, todoListId, priority) {
    var item = {
      "id":lastItemId+1,
      "name":name,
      "description":description,
      "todolist":todoListId,
      "checked":0,
      "priority":priority
    };

    return item;
  }

  var JSONResponse = function(success, message) {
    var response = {
      "success":success,
      "message":message
    }

    return response;
  }

}())
