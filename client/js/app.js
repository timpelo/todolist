var app = angular.module("TodoList", ['ngResource']);
var endpoint = "http://localhost:8080/"
var table;
var selectedListId;

$(function() {
  table = document.getElementById("todo-list-table");
});

app.filter('menutrim', function () {
  return function(value) {
    if(value.length < 15) {
      return value;
    } else {
      var trimVal = value.substring(0, 10);
      trimVal += "...";
      return trimVal;
    }
  }
});

app.controller("ListController", function($scope, $resource) {
  $scope.listDesc = "Select a list";
  $scope.selectedList = "";
  var result = $resource(endpoint + "list");
  var root = result.query(function() {
    $scope.todoLists = root;
  });

  $scope.updateItems = function(listId) {

    if(listId == null) {
      $scope.listDesc = "Select a list";
      $scope.selectedList = "";
      table.style.display = "none";
      newItemButton.style.display = "none";
    } else {
      var result = $resource(endpoint + "items/" + listId);
      var result2 = $resource(endpoint + "list/" + listId);
      selectedListId = listId;

      var list = result2.query(function() {
        var selectedList = list[0].name;

        var root = result.query(function() {
          $scope.items = root;
          if(root.length > 0) {
            $scope.listDesc = "Items in " + selectedList;
            table.style.display="inline-block";
          } else {
            $scope.listDesc = "No items in " + selectedList;
            table.style.display = "none";
          }

          var newItemButton = document.getElementById("newItemButton");
          newItemButton.style.display = "inline";
        });
      });
    }
  }

  $scope.sort = function(sortBy) {
    $scope.sortOrder = sortBy;
  }

  $scope.addList = function() {

    var newList = {};
    newList.name = $scope.modalTitle;
    newList.description = $scope.modalContent;
    console.log(newList);

    $.ajax({
      url:endpoint + "list/add",
      type:"post",
      data: JSON.stringify(newList),
      headers:{"Content-Type":"application/json"},
      dataType:"json",
      success: function(res) {
          console.log(res);

          var result = $resource(endpoint + "list");
          var root = result.query(function() {
            $scope.todoLists = root;
          });
      }
    });
  }

  $scope.addItem = function() {
    console.log(selectedListId);

    var newItem = {};
    newItem.name = $scope.itemModalTitle;
    newItem.description = $scope.itemModalContent;
    newItem.priority = $scope.itemModalPriority;
    newItem.listId = selectedListId;
    console.log(newItem);
    console.log(selectedListId);

    if(newItem.name != null && newItem.description
     != null && newItem.priority != null && newItem.listId != null) {

      $.ajax({
        url:endpoint + "items/add",
        type:"post",
        data: JSON.stringify(newItem),
        headers:{"Content-Type":"application/json"},
        dataType:"json",
        success: function(res) {
            console.log(res);
            $scope.updateItems(selectedListId);
        }
      });
    } else {
      window.alert("Form has invalid values!");
    }
  }

  $scope.deleteItem = function(itemId) {
    var confirm = window.confirm("Do you really want to delete?");
    if(confirm) {
      $.ajax({
        url:endpoint + "items/delete/" + itemId,
        type:"delete",
        headers:{"Content-Type":"application/json"},
        dataType:"json",
        success: function(res) {
            console.log(res);
            $scope.updateItems(selectedListId);
        }
      });
    }
  }

  $scope.deleteList = function(listId) {

    var confirm = window.confirm("Do you really want to delete?");

    if(confirm) {
      $.ajax({
        url:endpoint + "list/delete/" + listId,
        type:"delete",
        headers:{"Content-Type":"application/json"},
        dataType:"json",
        success: function(res) {
            console.log(res);
            var result = $resource(endpoint + "list");
            var root = result.query(function() {
              $scope.todoLists = root;
            });

            selectedListId = null;
            $scope.updateItems(null);
        }
      });
    }
  }
});
