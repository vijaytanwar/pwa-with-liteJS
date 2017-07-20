liteJS.component("todoComponent", ["q"], function (q) {
    var self = this;
    function editTodo(e) {
        e.preventDefault();
        q.when(self.notifyParentExP)
            .params(["on:edit-todo", self.data])
            .success(function (data) {
                self.reRender(data);
            });
    }
    function deleteTodo(e) {
        e.preventDefault();
        self.notifyParent("on:remove-todo", self.data);
    }
    function taskDone(e) {
        $(self.element).toggleClass("done");
        self.data.done = !self.data.done;
        self.notifyParent("on:save-todo", self.data);
    }
    this.events = {
        "click .edit": editTodo,
        "click .delete": deleteTodo,
        "click input[type=checkbox]": taskDone
    }
    this.init = function (todo) {
        self.data = todo;
        this.render("todoTemplate", todo);
    }
});