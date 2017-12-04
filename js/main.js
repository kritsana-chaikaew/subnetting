var subnet = document.getElementById("subnet");
var ip = document.getElementById("ip");
var button = document.getElementById("calculate");
button.onclick = calculate;
var table = document.getElementById("table");

header = ["Network Address", "Usable Host Range", "Broadcast Address:"]
data = ["test1", "test2", "test3"];

function calculate () {
  var tr = document.createElement("tr");
  for (var i=0; i<header.length; i++) {
    var txt = document.createTextNode(header[i]);
    var th = document.createElement("th");
    th.appendChild(txt);
    tr.appendChild(th)
    table.appendChild(tr);
  }

  var tr = document.createElement("tr");
  for (var i=0; i<data.length; i++) {
    var txt = document.createTextNode(data[i]);
    var td = document.createElement("td");
    td.appendChild(txt);
    tr.appendChild(td)
    table.appendChild(tr);
  }
}
