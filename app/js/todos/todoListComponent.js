liteJS.component("todoListComponent", ["ajax", "query", "todoService"], function (ajax, query, todoService) {
    var todoListElement,
        editTodo,
        self = this,
        editTodoDeferred;

    function addTodo() {
        self.createAddChild("editTodoComponent", {}, query.new("div"), editTodo);
    }
    function renderTodoList(todoList) {
        setTimeout(function () {
            if (todoList && todoList.length) {
                todoListElement.innerHTML = "";
                for (var i = 0; i < todoList.length; i++) {
                    var tr = query.new("tr");
                    self.createAddChild("todoComponent", todoList[i], tr, todoListElement);
                    if (todoList[i].done) {
                        tr.className = "done";
                    }

                }
            } else {
                todoListElement.innerHTML = "<span>There are no task to show!</span>";
            }
        }, 0);
    }
    this.events = {
        "click .add-todo": addTodo
    };

    this.init = function () {
        this.render("todoListTemplate");
        todoListElement = query(this.element).find(".todo-list").get(0);
        editTodo = query(self.element).find("#edit-todo").get(0);

        renderTodoList(todoService.getAll());

        this.on("on:edit-todo", function (e) {
            editTodoDeferred = e.deferred;
            self.createAddChild("editTodoComponent", e.data, query.new("div"), editTodo);
        }, this.key);

        this.on("on:save-todo", function (e) {
            if (e.data.id) {
                if (editTodoDeferred) {
                    editTodoDeferred.resolve(e.data);
                    editTodoDeferred = null;
                }
                todoService.updateTodo(e.data);

            } else {
                todoService.addTodo(e.data);
                renderTodoList(todoService.getAll());
            }
        }, this.key);

        this.on("on:remove-todo", function (e) {
            todoService.removeTodo(e.data);
            renderTodoList(todoService.getAll());
        }, this.key);
    }
});

liteJS.service("loggerService", [], function () {
    this.log = function () {
        this.trigger("log:msg", msg);
    }
});