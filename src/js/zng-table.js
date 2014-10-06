'use strict';

if(typeof zng === 'undefined') {
    var zng = {};
}
zng.table =  {
    ORDER_DIRECTION_ASC: 'tableOrderAsc',
    ORDER_DIRECTION_DESC: 'tableOrderDesc'
};

var table = angular.module('zng.table', []);

table.directive('zngTable', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/template/zng-table/table.html',
        scope: {
            table: "="
        },
        
        link: function(scope, element) {
            scope.$watch(function() {
                scope.__width = element.width();
            }, true);
            
//            console.log(scope.table.config);
        },
        
        controller: function($scope) {
            $scope.$watch('table', function() {
                console.log("detected new table");
                $scope.config = $scope.table.config;
            });
            $scope.$watch('table.handler.oos', function(oos) {
                if(!oos) return;
                console.log("detected out of sync");
                $scope.table.handler.update();
            });
            $scope.$watch('table.config.pagination', function(pagination) {
                console.log("detected pagination");
                $scope.table.handler.update();
            }, true);
            $scope.$watch('__width', function(width) {
                console.log(width);
            });
            
            $scope.sort = function(index) {
                if(!$scope.table.handler.fields[index].sortable)return;
                $scope.config.sort = {
                    direction: (index===$scope.config.sort.index) 
                        ? ($scope.config.sort.direction===zng.table.ORDER_DIRECTION_ASC) 
                            ? zng.table.ORDER_DIRECTION_DESC 
                            : zng.table.ORDER_DIRECTION_ASC
                        : zng.table.ORDER_DIRECTION_ASC,
                    index: index
                };
                $scope.table.handler.update();
            };
            
            $scope.styles =  {
                table: function() {
                    var ret = {};
                    if($scope.config.autoWidth) {
                        ret.width = $scope.__width+"px"
                    };
                    console.log(["styles",ret]);
                    return ret;
                }
            };
        }
    };
});


table.service('zngTable', function() {
    
    return {
        create: function(handlerFunc, handlerOptions, cfg) {
            var ret = {
                config: angular.extend({
                    autoWidth: true,
                    styles: {
                        table: null
                    },
                    sort: {
                        index: 0,
                        direction: zng.table.ORDER_DIRECTION_ASC
                    },
                    pagination: {
                        max: 0,
                        perPage: 10,
                        page: 1,
                        
                        startIndex: function() {
                            return (this.page-1)*this.perPage;
                        },
                        
                        endIndex: function() {
                            var ret = this.startIndex()+this.perPage;
                            if(ret>this.max)ret = this.max;
                            return ret;
                        }
                    }
                }, cfg),
                
                headline: [],
                data: [],
                handler: null,
                
                addField: function(topic, index, sortable) {
                    ret.handler.addField(topic, index, sortable);
                    return this;
                }
            };
            ret.handler = new handlerFunc(ret);
            ret.handler.initialize(handlerOptions);
            return ret;
        }
    };
});

zng.table.handler = {
    AbstractHandler: function(zngTable) {
        if(typeof zngTable === 'undefined') {
            throw 'Please insert zngTable as first argument in handler function.';
        }
        
        this.zngTable = zngTable;
        this.fields = [];
        this.oos = true;

        // abstract
        this.initialize = function(options) {};
        this.getHeadline = function() {};
        this.getData = function() {};

        this.setOutOfSync = function() {
            this.oos = true;
        };

        this.synchronize = function() {
            if(this.oos) {
                this.update();
            }
        };

        this.update = function() {
            zngTable.headline = this.getHeadline();
            zngTable.data = this.getData();
            this.oos = false;
        };

        this.addField = function(topic, index, sortable) {
            this.fields.push({
                topic: topic,
                index: index,
                sortable: (sortable !== 'undefined' && sortable)
            });
            return this;
        };
        
        this.resetFields = function() {
            this.fields.length = 0;
        };
    },
    
    BasicHandler: function(zngTable) {
        
        angular.extend(this, new zng.table.handler.AbstractHandler(zngTable));
                
        this.base = null;
        
        this.initialize = function(options) {
            if(options.length===1)
                this.setBase(options[0]);
        };
        
        this.setBase = function(base) {
            this.base = base;
            this.zngTable.config.pagination.max = this.base.length;
            this.setOutOfSync();
        };
                
        this.getHeadline = function() {
            var sort = this.zngTable.config.sort;
            var ret = {
                fields: []
            };
            angular.forEach(this.fields, function(field, index) {
                ret.fields.push({
                    value: field.topic,
                    clazz: {
                        sortable: field.sortable,
                        'sort-asc': field.sortable && (sort.index===index&&sort.direction===zng.table.ORDER_DIRECTION_ASC),
                        'sort-desc': field.sortable && (sort.index===index&&sort.direction===zng.table.ORDER_DIRECTION_DESC)
                    }
                });
            });
            return ret;
        };
                
        this.getData = function() {
            
            if(this.fields.length===0) {
                return [];
            }
            
            var ret = [],
                that = this,
                pagination = this.zngTable.config.pagination,
                sort = this.zngTable.config.sort;
        
            angular.forEach(this.base, function(row) {
                var tmp = {
                    id: angular.isDefined(row.id) ? row.id : null,
                    fields: []
                };
                angular.forEach(that.fields, function(field) {
                    tmp.fields.push({
                        value: row[field.index],
                        clazz: []
                    });
                });
                ret.push(tmp);
            });
            
            ret = ret.sort(function(a,b) {
                var av = a.fields[sort.index].value,
                    bv = b.fields[sort.index].value,
                    desc = sort.direction === zng.table.ORDER_DIRECTION_DESC;
                return (av < bv) ? (desc ? 1 : -1) : (desc ? -1 : 1);
            });
            
            return ret.slice(pagination.startIndex(), pagination.endIndex());
        };
    }
};