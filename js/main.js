var subnet
var ip = document.getElementById("ip")

function calculate () {
  subnet = document.getElementById("subnet").value
  ip = document.getElementById("ip").value

  showStats()
  showSubnets()
}

function showStats() {
  var tableBody = document.getElementById("stat-table-body")
  tableBody.innerHTML = ""

  headers = ["IP Address", "Network Address", "Usable Host IP Range", "Broadcast Address", "Total Number of Hosts", "Number of Usable Hosts", "Subnet Mask", "Wildcard Mask", "Binary Subnet Mask", "IP Class", "CIDR Notation", "IP Type", "Short", "Binary ID", "Integer ID", "Hex ID", "in-addr.arpa"]
  data = [];
  data[0] = ip
  data[1] = networkAddress()
  data[2] = ipRange(networkAddress(), broadcastAddress(ip))
  data[3] = broadcastAddress(ip)
  data[4] = Math.pow(2, 32 - subnet)
  data[5] = data[4] > 2 ? data[4] - 2 : 0
  data[6] = subnetMask()
  data[7] = WildcardMask()
  data[8] = binSubnetMask()
  data[9] = ipClass()
  data[10] = '/' + subnet
  data[11] = ipType()
  data[12] = ip + ' /' + subnet
  data[13] = binId()
  data[14] = parseInt(parseInt(data[13], 2),10)
  data[15] = "0x" + data[14].toString(16)
  data[16] = invertAddress()
  getAllGroups()

  for (var i=0; i<headers.length; i++) {
    var tr = document.createElement("tr");
    var text = document.createTextNode(headers[i]);
    var datum = document.createTextNode(data[i]);
    var th = document.createElement("th");
    var td = document.createElement("td");
    td.appendChild(datum)
    th.appendChild(text)
    tr.appendChild(th)
    tr.appendChild(td)
    tableBody.appendChild(tr);
  }
}

function showSubnets() {
  var tableHead = document.getElementById("table-head")
  tableHead.innerHTML = ""
  var tableBody = document.getElementById("table-body")
  tableBody.innerHTML = ""

  header = ["Network Address", "Usable Host Range", "Broadcast Address:"]
  data = getAllGroups()

  var tr = document.createElement("tr")
  for (var i=0; i<header.length; i++) {
    var text = document.createTextNode(header[i])
    var th = document.createElement("th")
    th.appendChild(text)
    tr.appendChild(th)
    tableHead.appendChild(tr)
  }

  for (var i=0; i<data.length; i++) {
    var tr = document.createElement("tr")
    for (var j=0; j<data[i].length; j++) {
      var text = document.createTextNode(data[i][j])
      var td = document.createElement("td")
      td.appendChild(text)
      tr.appendChild(td)
    }
    tableBody.appendChild(tr)
  }
}

function replaceStringAt(string, ch, index) {
  return string.substring(0, index) + ch + string.substring(index + 1)
}

function bitToDec(string) {
  return parseInt(string, 2).toString(10)
}

function decToBit(string) {
  var bitString = parseInt(string, 10).toString(2)
  while (bitString.length < 8) {
    bitString = '0' + bitString
  }
  return bitString
}

function splitBit (ipString) {
  blocks = []
  blocks[0] = ipString.substring(0,8)
  blocks[1] = ipString.substring(8,16)
  blocks[2] = ipString.substring(16,24)
  blocks[3] = ipString.substring(24,32)
  return blocks
}

function dottedIp (ipArray) {
  return ipArray[0] + '.' + ipArray[1] + '.' + ipArray[2] + '.' + ipArray[3]
}

function subnetMask() {
  sub = binSubnetMask().split('.')
  return dottedIp([bitToDec(sub[0]), bitToDec(sub[1]), bitToDec(sub[2]), bitToDec(sub[3])])
}

function WildcardMask () {
  var bitString = binSubnetMask()
  for (var i=0; i<bitString.length; i++) {
    if (bitString[i] == '0') {
      bitString = replaceStringAt(bitString, '1', i)
    } else if (bitString[i] == '1'){
      bitString = replaceStringAt(bitString, '0', i)
    }
  }
  sub = bitString.split('.')
  return dottedIp([bitToDec(sub[0]), bitToDec(sub[1]), bitToDec(sub[2]), bitToDec(sub[3])])
}

function binSubnetMask () {
  var sub = 0xffffffff
  sub = sub.toString(2)
  for(var i=subnet; i<32; i++){
    sub = replaceStringAt(sub, '0', i)
  }
  return dottedIp(splitBit(sub))
}

function networkAddress(){
  var ips = ip.split('.')
  var bitString = ""
  for (var i=0; i<4; i++) {
    bitString += decToBit(ips[i])
  }

  for(var i=subnet; i<32; i++){
    bitString = replaceStringAt(bitString, '0', i)
  }
  bitString = splitBit(bitString)
  return dottedIp([bitToDec(bitString[0]), bitToDec(bitString[1]), bitToDec(bitString[2]), bitToDec(bitString[3])])
}

function broadcastAddress(ip){
  var ips = ip.split('.')
  var bitString = ""
  for (var i=0; i<32; i++) {
    bitString += decToBit(ips[i])
  }

  for(var i=subnet; i<32; i++){
    bitString = replaceStringAt(bitString, '1', i)
  }
  bitString = splitBit(bitString)
  return dottedIp([bitToDec(bitString[0]), bitToDec(bitString[1]), bitToDec(bitString[2]), bitToDec(bitString[3])])
}

function ipRange (ipNetwork, ipBroadcast) {
  if (ipNetwork == ipBroadcast) {
    return "NA"
  }

  var ipNetworks = ipNetwork.split('.')
  var ipBroadcasts = ipBroadcast.split('.')

  ipNetworks[3] = parseInt(ipNetworks[3]) + 1;
  ipBroadcasts[3] -= 1;

  ipNetwork = dottedIp(ipNetworks)
  ipBroadcast = dottedIp(ipBroadcasts)

  return ipNetwork + " - " + ipBroadcast
}

function binId () {
  var ips = ip.split('.')
  var bitString = ""
  for (var i=0; i<4; i++) {
    bitString += decToBit(ips[i])
  }
  return bitString
}

function ipClass(){
  if(subnet <= 8){
    return '-'
  }
  else if(subnet <= 16){
    return 'A'
  }
  else if(subnet <= 24){
    return 'B'
  }
  else if(subnet <= 32){
    return 'C'
  }
}

function ipType() {
  var p = "Private"
  var ips = ip.split('.')
  if(ips[0] == "192" && ips[1] == "168"){
    return p
  }
  else if(ips[0] == "172" && parseInt(ips[1]) >= 16 && parseInt(ips[1]) <= 31 ){
    return p
  }
  else if(ips[0] == "10"){
    return p
  }
  return "Public"
}

function invertAddress () {
  var ips = ip.split('.')
  return ips[3] + '.' + ips[2] + '.' + ips[1] + '.' +  ips[0] + ".in-addr.arpa"
}

function getAllGroups () {
  var startIps = ip.split('.')
  var classNum = subnet / 8
  classNum = parseInt(classNum)
  for(var i = classNum; i < 4; i++) {
    startIps[i] = "0"
  }
  startIps = dottedIp(startIps)

  var range = Math.pow(2, ((classNum + 1) * 8) - subnet)
  var network = startIps
  var broadcast
  var rangeAddress
  var result = []
  var i = 0

  do {
    broadcast = broadcastAddress(network)
    rangeAddress = ipRange(network, broadcast)

    result[i++] = [network, rangeAddress, broadcast]

    network = network.split('.')
    network[classNum] = parseInt(network[classNum]) + range
    network = dottedIp(network)
  } while (parseInt(broadcast.split('.')[classNum]) < 255)
  return result
}
