const { Op } = require('sequelize');

function paginationSearchFunc(query) {
    let {page, size} = query;
    //pagination
    page = page === undefined ? 1 : +page;
    size = size === undefined ? 20 : +size;
    let pagination = {};
    if(page >= 1 && size >= 1){
        pagination.limit = size;
        pagination.offset = (page - 1) * size;
    }
    return pagination;
}



module.exports = paginationSearchFunc;