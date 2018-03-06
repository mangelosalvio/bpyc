const moment = require('moment')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
var Schema = mongoose.Schema
var CaseSchema = new Schema({
    case_number : String,
    offense_committed : String,
    case_status : String,
    referring_party : String,
    name_of_victim : String,
    name_of_prosecutor : String,
    name_of_lawyer : String,
    name_of_judge : String,
    case_filed : String,
    date_offense_committed : Date,
    age_committed : Number
});

CaseSchema
    .virtual('date_offense_committed_yyyy_mm_dd')
    .get( function () {
        if ( this.date_offense_committed ) {
            return moment(this.date_offense_committed).format('YYYY-MM-DD');
        } 

        return '';
        
    } );

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
    status_after_release : String,
    civil_status : String,
    parents_civil_status : String,
    date_of_death : Date,
    family_members : [{
        name : String,
        relationship : String,
        age : Number
    }],
    cases : [CaseSchema]
})

residentSchema
    .virtual('deceased')
    .get( function () {
        if ( this.date_of_death ) {
            return 'Deceased';
        } else {
            return ''
        }
    })



residentSchema
    .virtual('dob_yyyy_mm_dd')
    .get( function () {
        if ( this.dob ) {
            return moment(this.dob).format('YYYY-MM-DD');
        } 

        return '';
        
    } );


residentSchema
    .virtual('date_admitted_yyyy_mm_dd')
    .get( function () {
        if ( this.date_admitted ) {
            return moment(this.date_admitted).format('YYYY-MM-DD');
        }

        return '';
        
    } );

residentSchema
    .virtual('date_admitted_ll')
    .get( function () {
        return moment(this.date_admitted).format('LL');
    } );

residentSchema
    .virtual('date_released_yyyy_mm_dd')
    .get( function () {
        if ( this.date_released ) {
            return moment(this.date_released).format('YYYY-MM-DD');
        }
        return '';
        
    } );

residentSchema
    .virtual('date_released_ll')
    .get( function () {
        if ( this.date_released ) {
            return moment(this.date_released).format('LL');
        } 
        return '';
    } );

residentSchema
    .virtual('date_of_death_yyyy_mm_dd')
    .get( function () {
        if ( this.date_of_death ) {
            return moment(this.date_of_death).format('YYYY-MM-DD');
        }
        return ''
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