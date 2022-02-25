module.exports = function (app) {

    var requestFlowCtrl = app.modules.partnerMongo.requestFlowDraft.requestFlowCtrl;

    app.post('/api/phxpartner/requestFlowDraft',
        requestFlowCtrl.addrequestFlowDraft
    );
    
    
    app.post('/api/phxpartner/uploadFileRequestFlow',
        requestFlowCtrl.uploadFileRequestFlow
    );
    const multer = require('multer');
    const storage = multer.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, 'logs')
        },
        filename: (req, file, callBack) => {
            callBack(null, `${file.originalname}`)
        }
    })

    // const upload = multer({ storage: storage })
    // app.post('/api/phxpartner/uploadFileRequestFlow', upload.array('uploads[]'), (req, res, next) => {
    //     const files = req.files;
    //     console.log(files);
    //     if (!files) {
    //       const error = new Error('No File')
    //       error.httpStatusCode = 400
    //       return next(error)
    //     }
    //     res.json({
    //         responseCode: 200,
    //         responseMessage: 'Success',
            
    //     });
    //     return;
    //   })

};