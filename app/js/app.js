liteJS.ready(function () {
    liteJS
        .app("myApp")
        .run(["router", "config", "ajax"], function (router, config) {
            config.templateFunc = function (templateName, obj) {
                return templates[templateName](obj);
            };
            config.defaultLayout = "site-layout";

            router.registerRoutes({
                "/": {
                    component: 'indexComponent',
                    config: { login: false }
                },
                "/todo-list": {
                    component: 'todoListComponent',
                    config: { login: false }
                }
            });
            router.beforeRouteChange(function (routeObj) {
                routeObj.done();
            });
            router.afterRouteChange(function (routeObj) {
            });
        });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./todo-app-sw.js')
            .then(function () { console.log('Service Worker Registered'); });
    }
});