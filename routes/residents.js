
const { body, check, validationResult } = require('express-validator/check')
const { matchedData, sanitize, sanitizeBody } = require('express-validator/filter')

var express = require('express');
var router = express.Router();
var octicons = require('octicons')
var moment = require('moment')

const Resident = require('../models/Resident');

router.post('/',[
    check('name').isLength({ min : 1}).withMessage('Name is required'),
    body('dob', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    sanitizeBody('dob').toDate()
], (req, res, next) => {
    var id = req.body.id;
    Resident.findById(id,(err, resident) => {
        if ( err ) next(err)

        resident.set({
            name : req.body.name,
            age : req.body.age,
            gender : req.body.gender,
            dob : req.body.dob,
            nationality : req.body.nationality,
            educational_level : req.body.educational_level,
            legal_status : req.body.legal_status,
            rehabilitation_status : req.body.rehabilitation_status,
            address : req.body.address,
            city : req.body.city,
            province : req.body.province,
            place_of_origin : req.body.place_of_origin,
            fathers_name : req.body.fathers_name,
            mothers_name : req.body.mothers_name,
            number_of_siblings : req.body.number_of_siblings,
            admission_number : req.body.admission_number,
            date_admitted : req.body.date_admitted,
            date_released : req.body.date_released,
            current_status : req.body.current_status,
            remarks : req.body.remarks,
            cases : (req.body.cases === undefined) ? [] : req.body.cases
        });

        if ( req.body.action == "Add" ) {
            if ( req.body.case_number ) {
                resident.cases.push({
                    case_number : req.body.case_number,
                    offense_committed : req.body.offense_committed,
                    case_status : req.body.case_status,
                    referring_party : req.body.referring_party,
                    name_of_victim : req.body.name_of_victim,
                    name_of_prosecutor : req.body.name_of_prosecutor,
                    name_of_lawyer : req.body.name_of_lawyer,
                    name_of_judge : req.body.name_of_judge
                });
            }
            
        }

        resident.save((err, updatedResident) => {
            if ( err ) next(err)
            
            req.flash('success_message','Resident successfully updated');
            res.redirect(`/residents/${updatedResident._id}/edit`);
        })

    })
});

router.put('/',[
    check('name')
        .isLength({ min : 1 }).withMessage('Name is required'),
    body('dob', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    sanitizeBody('dob').toDate()
],(req, res, next) => {
    
    var resident = new Resident({
        name : req.body.name,
        age : req.body.age,
        gender : req.body.gender,
        dob : req.body.dob,
        nationality : req.body.nationality,
        educational_level : req.body.educational_level,
        legal_status : req.body.legal_status,
        rehabilitation_status : req.body.rehabilitation_status,
        address : req.body.address,
        city : req.body.city,
        province : req.body.province,
        place_of_origin : req.body.place_of_origin,
        fathers_name : req.body.fathers_name,
        mothers_name : req.body.mothers_name,
        number_of_siblings : req.body.number_of_siblings,
        admission_number : req.body.admission_number,
        date_admitted : req.body.date_admitted,
        date_released : req.body.date_released,
        current_status : req.body.current_status,
        remarks : req.body.remarks,
        cases : (req.body.cases === undefined) ? [] : req.body.cases
    });

    if ( req.body.action == "Add" ) {
        if ( req.body.case_number ) {
            resident.cases.push({
                case_number : req.body.case_number,
                offense_committed : req.body.offense_committed,
                case_status : req.body.case_status,
                referring_party : req.body.referring_party,
                name_of_victim : req.body.name_of_victim,
                name_of_prosecutor : req.body.name_of_prosecutor,
                name_of_lawyer : req.body.name_of_lawyer,
                name_of_judge : req.body.name_of_judge
            });
        }
        
    }

    const errors = validationResult(req)
    
    if ( !errors.isEmpty() ) {
        res.status(401);
        res.render('residents/residents', {
            resident,
            errors : errors.mapped()
        });
    }

    Resident.create(resident, (err, resident) => {

        if ( err ) {
            return next(err);
        } 

        req.flash('success_message','Resident successfully registered')
        return res.redirect(`/residents/${resident._id}/edit`)

    });

});

router.get('/', (req, res, next) => {

    var msg = {
		success_message : req.flash('success_message')
	}

    var pencil = octicons.pencil;


    var filter = {};

    if ( req.query.search_keyword ) {
        filter = {
            $text : { 
                $search : req.query.search_keyword
             }
        };

    }
    
    
    
    Resident.find(filter,{score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).exec((err, residents) => {
        if ( err ) next(err);
        res.render('residents/search_residents', { residents, pencil, msg })
    })
});

router.get('/:id/edit', (req, res, next) => {
    
    var msg = {
		success_message : req.flash('success_message')
	}

    var R = new Resident({ name : 'Mike' });
    

    Resident.findOne({ _id : req.params.id }).exec((err, resident) => {

        if ( err ) next(err);

        res.render('residents/residents', {
            resident, 
            errors : { },
            msg,
            id : req.params.id,
            moment
        })

    })
})

router.get('/create', (req, res, next) => {
    var resident = new Resident({});
    var msg = {
		success_message : req.flash('success_message')
    }
    
    res.render('residents/residents', {  
        errors : {}, 
        resident, 
        msg,
        id : req.params.id
    })
});

router.delete('/', (req, res, next) => {

    if ( req.body.case_id ) {
        console.log(req.body.case_id);
        Resident.update({ _id : req.body.id }, { $pull : { cases : { _id : req.body.case_id } } }, (err) => {
            if ( err ) next(err)
    
            req.flash('success_message','Resident Case Deleted')
            res.redirect(`/residents/${req.body.id}/edit`);
        });
    } else {
        Resident.remove({ _id : req.body.id }, (err) => {
            if ( err ) next(err)
    
            req.flash('success_message','Resident deleted')
            res.redirect('/residents');
        })
    }
    
});



module.exports = router;