// var data = [
//   ["", "Ford", "Volvo", "Toyota", "Honda"],
//   ["2016", 10, 11, 12, 13],
//   ["2017", 20, 11, 14, 13],
//   ["2018", 30, 15, 12, 13]
// ];

// var container = document.getElementById('example');
// var hot = new Handsontable(container, {
//   data: data,
//   rowHeaders: true,
//   colHeaders: true
// });

function getCarData() {
    return [
      ["Nissan", 2012, "black", "black",  'a'],
      ["Nissan", 2013, "blue", "blue", 'b#,c'],
      ["Chrysler", 2014, "yellow", "red", 'c'],
      ["Volvo", 2015, "white", "gray",  'd']
    ];
}

var
    container = document.getElementById('example'),
    hot;

  hot = new Handsontable(container, {
    data: getCarData(),
    colHeaders: ['Car', 'Year', 'Chassis color', 'Bumper color', 'Multiselect optoins'],
    columns: [
      {},
      {type: 'numeric'},
      {
        type: 'dropdown',
        source: ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']
      },
      {
        type: 'dropdown',
        source: ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']
      },
      {
      	editor: 'multiselect',
      	// type: 'dvirH',
      	selectOptions: ['a', 'b','c','d','e'],

      	// multiple: true
      }
    ]
  });