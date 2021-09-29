
'use strict';

const fs = require('fs');
var ffmetadata = require("ffmetadata");
var folder='./media/chi-balm-hsk1_flac/flac';
fs.readdir(folder, (err, files) => {
    files.forEach(file => {
        // Read song.mp3 metadata
        ffmetadata.read(file, function(err, data) {
            if (err) console.error("Error reading metadata", err);
            else console.log(data);
        });
    });
});


