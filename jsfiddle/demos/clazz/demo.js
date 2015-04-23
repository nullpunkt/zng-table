var app = angular.module('demo', ['ui.bootstrap', 'zng.table']);

app.controller('MyCtrl', ['$scope', 'zngTable', function($scope, zngTable) {
    $scope.table = zngTable.create(zng.table.handler.BasicHandler, [
        ["Jensx", "jens@web.de", "", 12],
        ["Hanna", "hanna@web.de", "http://www.focusfeatures.com/hanna", 10]
    ], {styles: {table: ['table', 'table-striped']}})
        .addField("Name", 0, {
            clazz: ['name-class']
        })
        .addField("Mail", 1, {
            clazz: function(value, raw, index) {
                return ['func-class'];
            }
        })
        .addField("Web", 2)
        .addField("Visits", 3)
    ;
}]);