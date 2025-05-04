const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Id: {
        type: Number,
        required: true,
        unique: true              
    },
    name: String,
    description: String,
    variantType: {
        type: String,
        enum: ['CHICKEN', 'MUTTON', 'PRAWNS', 'GONGURA', 'GONGURA CHICKEN' , 'GONGURA MUTTON', 'GONGURA PRAWNS'], // Cold pressed or refined oil
        required: true
      },
    variantOil: {
        type: String,
        enum: ['CP_PO', 'RO_PO', 'CP_SO'], // Cold pressed or refined oil
        required: true
      },
      variantSpicy: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'], // Cold pressed or refined oil
        required: true
      },
      variantWeight: {
        type: String,
        enum: ['Half kg', '1kg' ], // Cold pressed or refined oil
        required: true
      },     
    price: Number,
    image: String,
    rating: {
        type: Number,
        default: 0,
    },    
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);