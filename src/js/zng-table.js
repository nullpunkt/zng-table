'use strict';

if(typeof zng === 'undefined') {
    var zng = {};
}
zng.TABLE =  {
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
            $scope.$watch('table.handler.pagination', function(pagination) {
                console.log("detected pagination");
//                $scope.table.handler.update();
            });
            
            $scope.sort = function(index) {
                if(!$scope.table.handler.fields[index].sortable)return;
                $scope.config.sort = {
                    direction: (index===$scope.config.sort.index) 
                        ? ($scope.config.sort.direction===zng.TABLE.ORDER_DIRECTION_ASC) 
                            ? zng.TABLE.ORDER_DIRECTION_DESC 
                            : zng.TABLE.ORDER_DIRECTION_ASC
                        : zng.TABLE.ORDER_DIRECTION_ASC,
                    index: index
                };
                $scope.table.handler.update();
            };
        }
    };
});

table.service('zngTable', function() {
    
    
    var zngTable = {
        create: function(cfg) {
            return {
                config: angular.extend(cfg, {
                    sort: {
                        index: 0,
                        direction: zng.TABLE.ORDER_DIRECTION_ASC
                    }
                }),
                headline: [],
                data: [],
                handler: null,
                
                setDataHandler: function(dataHandler) {
                    this.handler = dataHandler;
                    this.handler.initialize(this);
                    return this;
                },
                
                getDataHandler: function() {
                    return this.handler;
                }
            };
        },
        
        pagination: function() {
            return {
                max: 0,
                perPage: 10,
                page: 1,
                
                setPage: function(page) {
                    consoel.log('hi '+page);
                    this.page = page;
                }
            };
        },
        
        dataHandler: function() {
            
            return {
                
                zngTable: null,
                fields: [],
                oos: true,
                
                initialize: function(zngTable) {
                    this.zngTable = zngTable;
                },
                
                setOutOfSync: function() {
                    this.oos = true;
                },
                
                synchronize: function() {
                    if(this.isOutOfSync()) {
                        this.update();
                    }
                },
                
                update: function() {
                    if(this.zngTable===null) {
                        return;
                    }
                    this.zngTable.headline = this.getHeadline();
                    this.zngTable.data = this.getData();
                    this.oos = false;
                },
                
                addField: function(topic, index, sortable) {
                    this.fields.push({
                        topic: topic,
                        index: index,
                        sortable: (sortable !== 'undefined' && sortable)
                    });
                    return this;
                },
                
                // interface
                getHeadline: function() {},
                getData: function() {},
                getPagination: function() { return null; }
            };
        },
        
        basicDataHandler: function(data) {
            var handler = angular.extend(this.dataHandler(), {
                base: null,
                pagination: null,
                
                setBase: function(base) {
                    this.base = base;
                    this.setOutOfSync();
                    console.log(base.length);
                    this.getPagination().max = base.length;
                },
                
                getHeadline: function() {
                    var sort = this.zngTable.config.sort;
                    var ret = {
                        fields: []
                    };
                    angular.forEach(this.fields, function(field, index) {
                        ret.fields.push({
                            value: field.topic,
                            clazz: {
                                sortable: field.sortable,
                                'sort-asc': field.sortable && (sort.index===index&&sort.direction===zng.TABLE.ORDER_DIRECTION_ASC),
                                'sort-desc': field.sortable && (sort.index===index&&sort.direction===zng.TABLE.ORDER_DIRECTION_DESC)
                            }
                        });
                    });
                    return ret;
                },
                
                getData: function() {
                    var ret = [],
                        that = this,
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
                            desc = sort.direction === zng.TABLE.ORDER_DIRECTION_DESC;
                        return (av < bv) ? (desc ? 1 : -1) : (desc ? -1 : 1);
                    });
                    
                    return ret.slice(0, 10);
                },
                
                
                getPagination: function() { 
                    if(this.pagination===null) {
                        this.pagination = zngTable.pagination();
                    }
                    return this.pagination; 
                }
            });
            handler.setBase(data);
            return handler;
        }    
    };
    return zngTable;
});