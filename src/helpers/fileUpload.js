exports.resizeImage = (image_name, custom_file_name, folder_path = '') => {
    const sharp = require('sharp');
    const input = path.join(__dirname, '../assets/', folder_path, image_name);
    sharp(input)
        .resize(200, 200, {
            fit: sharp.fit.outside,
            withoutEnlargement: true,
        })
        .toFormat('webp')
        .toFile(path.join(__dirname, '../assets/' + custom_file_name))
        .then(() => {
            this.clearImage(image_name, folder_path);
        })
        .catch((err) => {
            console.error(err);
        });
};

/**
 *
 * @param {string} name_prefix
 * @returns {string}
 */
exports.generateCustomFileName = (name_prefix, file_extension) => {
    let custom_file_name =
        name_prefix +
        new Date()
            .toISOString()
            .split('-')
            .join('')
            .split('.')[0]
            .split('T')
            .join('')
            .split(':')
            .join('') +
        Math.floor(Math.random() * (999 - 100) + 1000) +
        '.' +
        file_extension;
    return custom_file_name;
};

/**
 *
 * @param {string} image
 */
exports.clearImage = (image_name, folder_path = '') => {
    const fs = require('fs');
    filePath = path.join(__dirname, '../assets', folder_path, image_name);
    fs.unlink(filePath, (err) => {
        // console.log(err);
    });
};
