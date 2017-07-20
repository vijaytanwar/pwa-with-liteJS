liteJS.component("indexComponent", ["todoService"], function (todoService) {
    this.init = function () {
        var todos = todoService.getAll();
        this.render("indexTemplate", { title: "hello Vijay", totalTodoList: todos.length });
    };
});