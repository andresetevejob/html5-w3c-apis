(function () {
    let Tasks = function () {
      //Gestion de l'orientation
      let orientation = function () {
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 1000);
      };
      //Gestion de la navigation
      let navigation = function () {
        switch (location.hash) {
          case "#add":
            document.body.className = "add";
            break;
          case "#settings":
            document.body.className = "settings";
            break;
          default:
            document.body.className = "list";
        }
        orientation();
      };
      navigation();
      //liaison des méthodes de navigation et d'orientation au
      //évènements de l'objet window
      window.addEventListener("hashchange", navigation, false);
      window.addEventListener("orientationchange", orientation, false);
      // 5.5
      let localStorageAvailable = "localStorage" in window;
      let loadSettings = function () {
        if (localStorageAvailable) {
          //récuperation des données
          const name = localStorage.getItem("name"),
            colorScheme = localStorage.getItem("colorScheme");
          let nameDisplay = document.getElementById("user_name");
          nameField = document.forms.settings.name;
          doc = document.documentElement;
          colorSchemeField = document.forms.settings.color_scheme;
  
          if (name) {
            nameDisplay.innerHTML = name + "'s";
            nameField.value = name;
          } else {
            nameDisplay.innerHTML = "My";
            nameField.value = "";
          }
          if (colorScheme) {
            doc.className = colorScheme.toLowerCase();
            colorSchemeField.value = colorScheme;
          } else {
            doc.className = "blue";
            colorSchemeField.value = "Blue";
          }
        }
      };
      // 5
      let saveSettings = function (e) {
        e.preventDefault();
        if (localStorageAvailable) {
          var name = document.forms.settings.name.value;
          if (name.length > 0) {
            var colorScheme = document.forms.settings.color_scheme.value;
            localStorage.setItem("name", name);
            localStorage.setItem("colorScheme", colorScheme);
            loadSettings();
            alert("Settings saved successfully", "Settings saved");
            location.hash = "#list";
          } else {
            alert("Please enter your name", "Settings error");
          }
        } else {
          alert("Browser does not support localStorage", "Settings error");
        }
      };
      // 6
      let resetSettings = function (e) {
        e.preventDefault();
        if (confirm("This will erase all data. Are you sure?", "Reset data")) {
          if (localStorageAvailable) {
            localStorage.clear();
          }
          loadSettings();
          dropDatabase();
          alert("Application data has been reset", "Reset successful");
          location.hash = "#list";
        }
      };
      // 7
      loadSettings();
      document.forms.settings.addEventListener("submit", saveSettings, false);
      document.forms.settings.addEventListener("reset", resetSettings, false);
      //verification de l'existance de l'objet indexeddb
      let indexedDB =
          window.indexedDB ||
          window.webkitIndexedDB ||
          window.mozIndexedDB ||
          window.msIndexedDB ||
          false,
        IDBKeyRange =
          window.IDBKeyRange ||
          window.webkitIDBKeyRange ||
          window.mozIDBKeyRange ||
          window.msIDBKeyRange ||
          false,
        webSQLSupport = "openDatabase" in window;
      let db;
      let openDB = function () {
        if (indexedDB) {
          let request = indexedDB.open("tasks", 1),
            upgradeNeeded = "onupgradeneeded" in request;
          request.onsuccess = function (e) {
            db = e.target.result;
            if (!upgradeNeeded && db.version != ";1") {
              let setVersionRequest = db.setVersion("1");
              setVersionRequest.onsuccess = function (e) {
                let objectStore = db.createObjectStore("tasks", {
                  keyPath: "id",
                });
                objectStore.createIndex("desc", "descUpper", {
                  unique: false,
                });
              };
              loadTasks();
            } else {
              loadTasks();
            }
          };
          if (upgradeNeeded) {
            request.onupgradeneeded = function (e) {
              db = e.target.result;
              let objectStore = db.createObjectStore("tasks", {
                keyPath: "id",
              });
              objectStore.createIndex("desc", "descUpper", {
                unique: false,
              });
            };
          }
        } else if (webSQLSupport) {
          db = openDatabase("tasks", "1.0", "Tasks database", 5 * 1024 * 1024);
          db.transaction(function (tx) {
            var sql =
              "CREATE TABLE IF NOT EXISTS tasks (" +
              "id INTEGER PRIMARY KEY ASC," +
              "desc TEXT," +
              "due DATETIME," +
              "complete BOOLEAN" +
              ")";
            tx.executeSql(sql, [], loadTasks);
          });
        }
      };
      openDB();
      let createEmptyItem = function (query, taskList) {
        var emptyItem = document.createElement("li");
        if (query.length > 0) {
          emptyItem.innerHTML =
            '<div class="item_title">' +
            "No tasks match your query <strong>" +
            query +
            "</strong>." +
            "</div>";
        } else {
          emptyItem.innerHTML =
            '<div class="item_title">' +
            'No tasks to display. <a href="#add">Add one</a>?' +
            "</div>";
        }
        taskList.appendChild(emptyItem);
      };
      let showTask = function(task, list) {
        let newItem = document.createElement('li'),
            checked = (task.complete == 1) ? ' checked="checked"' : '';
        newItem.innerHTML =
          '<div class="item_complete">'+
          '<input type="checkbox" name="item_complete" '+
          'id="chk_'+task.id+'"'+checked+'>'+
          '</div>'+
          '<div class="item_delete">'+
          '<a href="#" id="del_'+task.id+'">Delete</a>'+
          '</div>'+
          '<div class="item_title">'+task.desc+'</div>'+
          '<div class="item_due">'+task.due+'</div>';
        list.appendChild(newItem);
        let markAsComplete = function(e) {
          e.preventDefault();
          let updatedTask = {
            id: task.id,
            desc: task.desc,
            descUpper: task.desc.toUpperCase(),
            due: task.due,
            complete: e.target.checked
          };
          updateTask(updatedTask);
        }
        let remove = function(e) {
          e.preventDefault();
          if(confirm('Deleting task. Are you sure?', 'Delete')) {
            deleteTask(task.id);
          }
        }
        document.getElementById('chk_'+task.id).onchange =
          markAsComplete;
        document.getElementById('del_'+task.id).onclick = remove;
      }
      let loadTasks = function (q) {
        let taskList = document.getElementById("task_list"),
          query = q || "";
        taskList.innerHTML = "";
        if (indexedDB) {
          let tx = db.transaction(["tasks"], "readonly"),
            objectStore = tx.objectStore("tasks"),
            cursor,
            i = 0;
          if (query.length > 0) {
            let index = objectStore.index("desc"),
              upperQ = query.toUpperCase(),
              keyRange = IDBKeyRange.bound(upperQ, upperQ + "z");
            cursor = index.openCursor(keyRange);
          } else {
            cursor = objectStore.openCursor();
          }
          cursor.onsuccess = function (e) {
            let result = e.target.result;
            if (result == null) return;
            i++;
            showTask(result.value, taskList);
            result["continue"](); //advance the cursor to the next value in range matching (or immediately after key if given).
          };
          tx.oncomplete = function (e) {
            if (i == 0) {
              createEmptyItem(query, taskList);
            }
          };
        } else if (webSQLSupport) {
          db.transaction(function (tx) {
            var sql,
              args = [];
            if (query.length > 0) {
              sql = "SELECT * FROM tasks WHERE desc LIKE ?";
              args[0] = query + "%";
            } else {
              sql = "SELECT * FROM tasks";
            }
            var iterateRows = function (tx, results) {
              var i = 0,
                len = results.rows.length;
              for (; i < len; i++) {
                showTask(results.rows.item(i), taskList);
              }
              if (len === 0) {
                createEmptyItem(query, taskList);
              }
            };
            tx.executeSql(sql, args, iterateRows);
          });
        }
      };
      let searchTasks = function (e) {
        e.preventDefault();
        let query = document.forms.search.query.value;
        if (query.length > 0) {
          loadTasks(query);
        } else {
          loadTasks();
        }
      };
      console.log(document.forms);
      document.forms.search.addEventListener("submit", searchTasks, false);
      let insertTask = function(e) {
        e.preventDefault();
        let desc = document.forms.add.desc.value,
            dueDate = document.forms.add.due_date.value;
        if(desc.length > 0 && dueDate.length > 0) {
          let task = {
            id: new Date().getTime(),
            desc: desc,
            descUpper: desc.toUpperCase(),
            due: dueDate,
            complete: false
          }
          if(indexedDB) {
            let tx = db.transaction(['tasks'], 'readwrite');
            let objectStore = tx.objectStore('tasks');
            let request = objectStore.add(task);
            tx.oncomplete = updateView;
  
          } else if(webSQLSupport) {
            db.transaction(function(tx) {
              let sql = 'INSERT INTO tasks(desc, due, complete) '+
                  'VALUES(?, ?, ?)',
                  args = [task.desc, task.due, task.complete];
              tx.executeSql(sql, args, updateView);
            });
          }
        } else {
          alert('Please fill out all fields', 'Add task error');
        }
      }
      function updateView(){
        loadTasks();
        alert('Task added successfully', 'Task added');
        document.forms.add.desc.value = '';
        document.forms.add.due_date.value = '';
        location.hash = '#list';
      }
      document.forms.add.addEventListener('submit', insertTask, false);
      let updateTask = function(task) {
        if(indexedDB) {
          let tx = db.transaction(['tasks'], 'readwrite');
          let objectStore = tx.objectStore('tasks');
          let request = objectStore.put(task);
        } else if(webSQLSupport) {
          let complete = (task.complete) ? 1 : 0;
          db.transaction(function(tx) {
            let sql = 'UPDATE tasks SET complete = ? WHERE id = ?',
                args = [complete, task.id];
            tx.executeSql(sql, args);
          });
        }
      }
      let deleteTask = function(id) {
        if(indexedDB) {
          var tx = db.transaction(['tasks'], 'readwrite');
          var objectStore = tx.objectStore('tasks');
          var request = objectStore['delete'](id);
          tx.oncomplete = loadTasks;
        } else if(webSQLSupport) {
          db.transaction(function(tx) {
            var sql = 'DELETE FROM tasks WHERE id = ?',
                args = [id];
            tx.executeSql(sql, args, loadTasks);
          });
        }
      }
      // 5.16
      let dropDatabase = function() {
        if(indexedDB) {
          var delDBRequest = indexedDB.deleteDatabase('tasks');
          delDBRequest.onsuccess = window.location.reload();
        } else if(webSQLSupport) {
          db.transaction(function(tx) {
            var sql = 'DELETE FROM tasks';
            tx.executeSql(sql, [], loadTasks);
          });
        }
      }
    };
  
    window.addEventListener(
      "load",
      function () {
        new Tasks();
      },
      false
    );
  })();  