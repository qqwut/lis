/* ------------- [ADD ROUTE HERE] ------------ */
var routes = [
    require('../routes/draft.routes'),
    require('../routes/chkDuplicate.routes'),
    require('../routes/selectChannel.routes'),
    require('../routes/locationAddress.routes'),
    require('../routes/company.routes'),
    require('../routes/lov.routes'),
    require('../routes/openingHours.routes'),
    require('../routes/mappingRegion.routes'),
    require('../routes/zipcode.routes')
];
/* ------------- [END ROUTE HERE] ------------ */

exports.GET_ALL_ROUTES = function GET_ALL_ROUTES() {
    return routes;
};