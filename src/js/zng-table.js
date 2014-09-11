'use strict';

var table = angular.module('zng.table', []);

table.directive('zngTable', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/template/zng-table/table.html',
        scope: {
        },
        controller: function($scope) {
            $scope.columns = [
                {
                    value: "topic1",
                    css: "topic1"
                },
                {
                    value: "topic2",
                    css: "topic2"
                },
                {
                    value: "topic3",
                    css: "topic3"
                }
            ];
            
            $scope.rows = [
                {
                    id: 0,
                    fields: [
                        {
                            value: 'bla1',
                            class: {
                                horst1: true
                            }
                        },
                        {
                            value: 'bla2',
                            class: {
                                horst1: true
                            }
                        },
                        {
                            value: 'bla3',
                            class: {
                                horst1: false
                            }
                        }
                    ]
                }
            ];
        }
    };
});