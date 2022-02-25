module.exports = function (app) {
    var contactHRCtrl = app.modules.partner.contactHR.contactHRCtrl;

    app.get('/api/phxpartner/contact-hr/list',
        contactHRCtrl.getContactHrList
    );

    app.get('/api/phxpartner/contactHRInfo/getEmployeeForStaffByPin/list',
        contactHRCtrl.getContactHrOmList
    );

};