var app       =     require("express")();
var mysql     =     require("mysql");
var http      =     require('http').Server(app);
var io        =     require("socket.io")(http);

/* Creating POOL MySQL connection.*/

var conn    =    mysql.createPool({
      connectionLimit   :   100,
      host              :   'host-ip',
      user              :   'db-user',
      password          :   'db-pass',
      database          :   'db-name',
      debug             :   false
});

var dataLen = 5000;

app.get("/",function(req,res){
    res.sendFile(__dirname + '/app.html');
});

// merge new data to cache, return the diff
function mergediff(orig_data, new_data) {
    var diff = {needUpdate:false, data:{}};
    var diff_data = diff.data;

    for (var key in new_data) {
        if (!orig_data.hasOwnProperty(key)
         || JSON.stringify(orig_data[key])!== JSON.stringify(new_data[key])) {
            diff.needUpdate = true;
            orig_data[key] = new_data[key];
            diff_data[key] = new_data[key];
        }
    }

    if (Object.keys(orig_data).length > dataLen) {
        var ordered = Object.keys(orig_data).sort();
        var delNum = ordered.length - dataLen;
        for (var i = 0; i < delNum; i++) {
            delete orig_data[ordered[i]];
        }
    }
    return diff;
}

// this is the query loop.
function dataSync(conn, orig_data, lastUpdate) {
    //var queryString = mysql.format("select `time`,value,updateTime from `KPI` where network='vzwca' and `kpi`='xxx' and updateTime > ? order by `time` desc limit 50", lastUpdate);
    var queryString = mysql.format("select `id` ,`degree`, `humidity`, `date` from `temperature` where id > ? order by `date` desc limit "+dataLen, lastUpdate);
    conn.query(queryString, function(err, rows, fields) {
        if (err) {
            console.log('Query [' + queryString + '] failed: ', err);
        } else {
            console.log('query success. rows: ', rows.length);
            if (rows && rows.length >= 0) {
                var new_data = {};
                for (var i = 0; i < rows.length; i++) {
                    var row = {};
                    var row_key = 'date';
                    for (var field in rows[i]) {
                        var value = rows[i][field];
                        if (value instanceof Date) {
                            value = value.getTime();
                        }
                        if (field === 'id') {
                            if (rows[i][field] > lastUpdate) {
                                lastUpdate = rows[i][field];
                            }
                        } else if (field === row_key) {
                            row_key = value;
                        } else {
                            row[field] = value;
                        }
                    }
                    new_data[row_key] = row;
                }
                var diff = mergediff(orig_data, new_data);
                if (diff.needUpdate) {
                    pushUpdate(diff.data);
                }
            }
        }
        setTimeout(function() {dataSync(conn, orig_data, lastUpdate);}, 1000);
    });
}

http.listen(3001,function(){
    console.log("Listening on 3001");
});

// cache 
var data = {};

// start data sychonization
dataSync(conn, data, 0);

// send complete data at the first connect
io.on('connection', function(socket) {
    socket.emit('completeData', data);
});

// push new data
function pushUpdate(new_data) {
    io.sockets.emit('dataUpdate', new_data);
}
