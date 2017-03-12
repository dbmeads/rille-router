function Route() {
    return {children: {}};
}

function Router(options) {
    let {defaultHandler, delimiter = '/'} = options || {};
    let routes = Route();

    return {
        use(path, handler) {
            path
                .split(delimiter)
                .reduce(
                    (route, value) => route.children[value] || (route.children[value] = Route()),
                    routes
                )
                .handler = handler;

            return this;
        },
        route(request, ...args) {
            if (typeof request !== 'object') {
                request = {path: request};
            }
            let params = request.params = [];
            let route = request.path
                .split(delimiter)
                .reduce(
                    (route, value) => {
                        if (route) {
                            if (route.children[value]) {
                                return route.children[value];
                            } else if (route.children['*']) {
                                params.push(value);
                                return route.children['*'];
                            }
                        }
                    },
                    routes
                );

            let {handler = defaultHandler} = route || {};

            if (handler) {
                handler(request, ...args);
            }

            return this;
        }
    }
}

module.exports = Router;