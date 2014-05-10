
function LoginFactory () {

    return function (login_type) {
        this.perform_login = function (un, pw) {
            switch (login_type) {
                case "gplus": /* do something */ break;
                case "fb":  /* do sth */  break;
                default:
                   local_login(un, pw);
        };
    }
}

mymod.factory("LoginFactory", LoginFactory);



function UserController ($scope, LoginFactory) {
    $scope.perform_login = function (login_type, un, pw) {
        var logger_inner = new LoginFactory(login_type);

        logger_inner.perform_login(un, pw);
    };
}

mymod.controller("UserController", UserController);

