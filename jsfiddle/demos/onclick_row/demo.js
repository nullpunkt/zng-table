var app = angular.module('demo', ['ui.bootstrap', 'zng.table']);

app.controller('MyCtrl', ['$scope', 'zngTable', function($scope, zngTable) {

    $scope.data = [
        ["Jens", "jens@web.de", "", 12, 1],
        ["Hanna", "hanna@web.de", "http://www.focusfeatures.com/hanna", 10, 2],
        ["Jones", "jones@gmx.de", "http://www.jon.es", 54, 3],
        ["Hero", "hero@marvel.com", "http://www.marvel.com", 10, 4],
    ];

    $scope.lastClicked = null;

    $scope.clickHandler = function(dataset) {
        $scope.lastClicked =  dataset;
    };

    $scope.table = zngTable.create(zng.table.handler.BasicHandler, $scope.data, {styles: {table: ['table', 'table-striped']}})
        .addField("ID", 4)
        .addField("Name", 0)
        .addField("Mail", 1)
        .addField("Web", 2)
        .addField("Visits", 3)
        .addEventHandler(zng.table.EVENT_CLICKED_ROW, $scope.clickHandler)
    ;

}]);