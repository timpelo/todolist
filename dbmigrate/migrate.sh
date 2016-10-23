#! /bin/bash
mongoimport --db test --collection todolist --file db_import_lists.json --jsonArray
mongoimport --db test --collection todoitem --file db_import_items.json --jsonArray
