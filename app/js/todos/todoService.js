liteJS.service("todoService", [], function () {
    function getTodoList() {
        return JSON.parse(localStorage.getItem("todo-list"));
    }
    function addTodo(todo) {
        var todoList = getTodoList();
        if (todoList) {
            todo.id = todoList.length + 1;
        } else {
            todoList = [];
            todo.id = 1;
        }
        todoList.push(todo);
        localStorage.setItem("todo-list", JSON.stringify(todoList));
        return todo;
    }
    function removeTodo(todo) {
        var todoList = getTodoList();
        for (var i = 0; i < todoList.length; i++) {
            if (todoList[i].id == todo.id) {
                todoList.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("todo-list", JSON.stringify(todoList));
    }
    function updateTodo(todo) {
        var todoList = getTodoList();
        for (var i = 0; i < todoList.length; i++) {
            if (todoList[i].id == todo.id) {
                todoList[i].title = todo.title;
                todoList[i].description = todo.description;
                todoList[i].done = todo.done;
                break;
            }
        }
        localStorage.setItem("todo-list", JSON.stringify(todoList));
    }
    this.export = {
        getAll: getTodoList,
        addTodo: addTodo,
        removeTodo: removeTodo,
        updateTodo: updateTodo
    };
});