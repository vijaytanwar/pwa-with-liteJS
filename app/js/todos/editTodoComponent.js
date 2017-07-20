liteJS.component("editTodoComponent", ["query", "loggerService"], function (query, loggerService) {
    var self = this;
    function saveTodo(e) {
        var form = $(self.element).find("form").get(0);
        if (!form.title.value) {
            $(form.title).siblings(".error").addClass("show");
            return;
        }
        self.data.title = form.title.value;
        self.data.description = form.description.value;
        self.notifyParent("on:save-todo", self.data);
        closeModal();
    }
    function closeModal() {
        $(self.element).find(".edit-todo").modal("close");
        self.remove();
    }
    this.events = {
        "click .save": saveTodo,
        "click .cancel": closeModal
    };
    this.init = function (data) {
        self.data = data;
        this.render("editTodoTemplate", data);
        $(this.element).find(".edit-todo").modal("open");
        loggerService.on("log:msg", function (msg) {
            alert(msg);
        }, this.key);
    }
    this.destroy = function () {
        loggerService.off("log:msg", this.key);
    }
});