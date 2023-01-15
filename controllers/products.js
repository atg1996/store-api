
const product = require("../models/product")


const getAllProductsStatic = async (req,res) => {
    const products = await product.find({featured:true, })
    res.status(200).json({products, nbHits:products.length})
}


const getAllProducts = async (req,res) => {
    const {featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = new Object;

    if  (featured) {
        queryObject.featured = featured === "true" ? true:false
    }

    if  (company) {
        queryObject.company = company;
    }

    if  (name) {
        queryObject.name = {$regex: name, $options: "i"}
    }

    if (numericFilters) {

       const operatorMap = {
        '>':'$gt',
        '>=':'$gte',
        '=':'$eq',
        '<':'$lt',
        '<=':'$lte',
       }

       const regEx = /\b(<|>|>=|=|<|<=)\b/g;
       let filters = numericFilters.replace(regEx,(match) => 
        `-${operatorMap[match]}-`
       )
       const options = ['price', 'rating']
       filters = filters.split(',').forEach(element => {
        const [field,operator,value] = element.split('-')

        if  (options.includes(field)) {
            queryObject[field] = {[operator]: Number(value)};
        }
       });
    }
    
    let result = product.find(queryObject)

    if(sort) {
        let sortList  = sort.split(',').join(' ')
        result = result.sort(sortList)
    }

    if(fields) {
        let filedsLIst = fields.split(',').join(' ');
        result = result.select(filedsLIst);
    }

    else {
        result = result.sort("createdAt");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit ;

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products, length: products.length} )
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}