const form = document.querySelector("#todo-form");
    const todoInput = document.querySelector("#todo");
    const todoList = document.querySelector(".list-group");
    const firstCardBody = document.querySelectorAll(".card-body")[0];
    const secondCardBody = document.querySelectorAll(".card-body")[1];
    const filter = document.querySelector("#filter");
    const clearButton = document.querySelector("#clear-todos");

    eventListeners();

    function eventListeners() {
        form.addEventListener("submit", addTodo);
        document.addEventListener("DOMContentLoaded", loadAllTodosToPage);
        secondCardBody.addEventListener("click", deleteTodo);
        filter.addEventListener("keyup", filterTodos);
        clearButton.addEventListener("click", clearAllTodos)
    }

    // *****  ALL EVENTS ****

    //Delete All Todos
    function clearAllTodos() {
        if (confirm("Do you want to delete all tasks?")) {
            // todoList.innerHTML = ""; // Slow method

            while (todoList.firstElementChild != null) {
                todoList.removeChild(todoList.firstElementChild);
            }

            //Remove from storage  / Delete the Key
            localStorage.removeItem("todos");
        }
    }

    //Filter Todos
    function filterTodos(e) {
        const filteredValue = e.target.value.toLowerCase();
        const listItems = document.querySelectorAll(".list-group-item");

        listItems.forEach(function (listItem) {
            const text = listItem.textContent.toLowerCase();
            if (text.indexOf(filteredValue) === -1) {
                //Could not find
                listItem.classList.remove("d-flex");
                listItem.classList.add("d-none");
            }
            else {
                //Found
                listItem.classList.remove("d-none");
                listItem.classList.add("d-flex");
            }
        })
    }

    //Delete todo
    function deleteTodo(e) {
        if (e.target.className === "fa fa-remove") {
            e.target.parentElement.parentElement.remove();
            deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
            showAlert("success", "Task has been deleted.")
        }
    }

    //Delete todo from storage
    function deleteTodoFromStorage(deletedTask) {
        let todos = getTodosFromStorage();
        todos.forEach(function (todo, index) {
            if (todo === deletedTask) {
                //Delete it from array
                todos.splice(index, 1);
            }
        });

        localStorage.setItem("todos", JSON.stringify(todos));
    }

    //Add a new todo
    function addTodo(e) {
        const newTodo = todoInput.value.trim();

        if (newTodo === "") {
            showAlert("danger", "Please enter a task.");
        }
        else {
            addTodotoList(newTodo);
            addTodoToStorage(newTodo);
            showAlert("success", "Task has been added successfully.");
        }

        e.preventDefault();
    }

    //Load todos
    function loadAllTodosToPage() {
        let todos = getTodosFromStorage();
        todos.forEach(function (todo) {
            addTodotoList(todo);
        })
    }

    //Get todos from storage
    function getTodosFromStorage() {
        let todos;
        if (localStorage.getItem("todos") === null) {
            todos = []
        } else {
            todos = JSON.parse(localStorage.getItem("todos"));
        }
        return todos;
    }

    //Add todos to storage
    function addTodoToStorage(newTodo) {
        let todos = getTodosFromStorage();
        todos.push(newTodo);
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    //Show Alert
    function showAlert(type, message) {
        //Create alert div
        const alert = document.createElement("div");
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        //Add alert to card-body
        firstCardBody.append(alert);

        //Set timeout for alert
        setTimeout(function () {
            alert.remove();
        }, 1000);
    }

    //Create List Item
    function addTodotoList(newTodo) {
        //Create list item
        const listItem = document.createElement("li");
        //Create link
        const link = document.createElement("a");
        link.href = "#";
        link.className = "delete-item";
        link.innerHTML = "<i class = 'fa fa-remove'></i>"
        listItem.className = "list-group-item d-flex justify-content-between";

        //Create text node
        listItem.appendChild(document.createTextNode(newTodo));
        listItem.appendChild(link);

        //Add list item to Todo List
        todoList.appendChild(listItem);

        //Clear input
        todoInput.value = "";
    }