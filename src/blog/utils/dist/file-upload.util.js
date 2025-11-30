"use strict";
exports.__esModule = true;
exports.separateFiles = void 0;
function separateFiles(files) {
    if (!files || files.length === 0) {
        return {
            featuredImage: null,
            images: [],
            videos: []
        };
    }
    var separated = {
        featuredImage: null,
        images: [],
        videos: []
    };
    files.forEach(function (file) {
        if (file.fieldname === 'featuredImage') {
            separated.featuredImage = file;
        }
        else if (file.fieldname === 'images') {
            separated.images.push(file);
        }
        else if (file.fieldname === 'videos') {
            separated.videos.push(file);
        }
    });
    return separated;
}
exports.separateFiles = separateFiles;
