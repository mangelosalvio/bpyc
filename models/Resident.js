const moment = require('moment')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
var Schema = mongoose.Schema

var residentSchema = new Schema({
    name : String,
    age : Number,
    gender : String,
    dob : Date,
    nationality : String,
    educational_level : String,
    legal_status : String,
    rehabilitation_status : String,
    address : String,
    city : String,
    province : String,
    place_of_origin : String,
    fathers_name : String,
    mothers_name : String,
    number_of_siblings : Number,
    admission_number : String,
    date_admitted : Date,
    date_released : String,
    current_status : String,
    remarks : String,

    cases : [{
        case_number : String,
        offense_committed : String,
        case_status : String,
        referring_party : String,
        name_of_victim : String,
        name_of_prosecutor : String,
        name_of_lawyer : String,
        name_of_judge : String
    }]
})

residentSchema
    .virtual('dob_yyyy_mm_dd')
    .get( function () {
        return moment(this.dob).format('YYYY-MM-DD');
    } );

residentSchema
    .virtual('date_admitted_yyyy_mm_dd')
    .get( function () {
        return moment(this.date_admitted).format('YYYY-MM-DD');
    } );

    residentSchema
    .virtual('date_released_yyyy_mm_dd')
    .get( function () {
        return moment(this.date_released).format('YYYY-MM-DD');
    } );

residentSchema
    .virtual('length_of_stay')
    .get(function () {
        if ( this.date_admitted ) {
            var date_admitted = moment(this.date_admitted).set({hour:0,minute:0,second:0,millisecond:0});
            var date_released = ( this.date_released ) ? moment(this.date_released).set({hour:0,minute:0,second:0,millisecond:0}) : moment().set({hour:0,minute:0,second:0,millisecond:0});

            return date_released.diff(date_admitted,'days');
        }

        return 0;
    });

module.exports = mongoose.model('Resident',residentSchema)