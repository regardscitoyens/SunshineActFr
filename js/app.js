/* Dependency: underscore.js and d3.js */

var sunshine = {};

// Return a hierarchical object set by dimensions and attr value from an array data
sunshine.nestData = function(dimensions, attr, data) {
    var nested_data = d3.nest();
    _.each(dimensions, function(dim) {
        nested_data.key(function(d) {
            return d[dim];
        });
    });
    return nested_data.rollup(function(leaves) {
        return {
            sum: d3.sum(leaves, function(d) {
                    return +d[attr];
                }),
            count: leaves.length
            }
        })
        .sortValues(function(a,b) { return +b.sum - +a.sum; } )
        .entries(data);
};

// Experiment filter function on nestedData
sunshine.filterLeavesByQ = function(nestedData, q) {
    // TODO: use a generic getter
    var filteredNestedData = [];
    _.each(nestedData, function(d) {
        var data = {};
        data.key = d.key;
        var total = d3.sum(d.values, function(d) {
            return d.values.sum;
        });
        data.values = d.values.filter(function(d) {
            return d.values.sum/total > q;
        });
        filteredNestedData.push(data);
    });
    return filteredNestedData
};

// Set default accessor for sunshine treemap
sunshine.treemap = function() {
    return d3.layout.treemap().children(function(d) { return d.values; });
};


function position() { 

		this.style("left", function(d) { return d.x + "px"; })
    	.style("top", function(d) { return d.y + "px"; })
    	.style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
    	.style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	
	}
