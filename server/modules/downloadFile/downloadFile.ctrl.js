exports.downloadFileExampleLocation = function (req, res) {

    console.log('--- Path ', req.query.path)
    try {

        res.download(req.query.path)
        return res;

    } catch (e) {

        console.log('Err : ', e.message)

        return res.send('Fail to download file.');
    }
};