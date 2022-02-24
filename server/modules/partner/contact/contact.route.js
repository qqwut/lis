module.exports = function (app) {
    var contactCtrl = app.modules.partner.contact.contactCtrl;

    app.get('/api/phxpartner/contact/list',
        contactCtrl.getContactList
    );

    app.put('/api/phxpartner/contact/info',
        contactCtrl.updLocationContact
    );


    // app.get('/api/phxpartner/company/contact',
    //     contactCtrl.getCompanyContact
    // );

    // app.put('/api/phxpartner/company/contact',
    //     contactCtrl.updCompanyContact
    // );
};