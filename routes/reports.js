var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const Resident = require('../models/Resident')


router.get('/cases', (req, res, next) => {
  Resident.aggregate([
    {
      $unwind : "$cases"
    },
    { 
      $group : {
        _id : {
          case : {
            $toUpper : "$cases.offense_committed"
          } 
        },
        names : {
          $push : {
            name : {
              $toUpper :"$name"
            },
            _id : "$_id",
            age_committed : "$cases.age_committed"
          }
        },

        youngest : {
          $min : "$cases.age_committed"
        },

        oldest : {
          $max : "$cases.age_committed"
        },
        
        count : {
          $sum : 1
        }
      }
    },
    {
      $project : {
        _id : 0,
        case : "$_id.case",
        names : 1,
        count : 1,
        youngest : 1,
        oldest : 1
      }
    },
    {
      $sort : {
        case : 1
      }
    }
  ]).exec()
    .then((residents) => {
      console.log(residents);
      res.render('reports/cases', { residents })
    })
    .catch((err) => {
      throw err
    })
})

router.get('/cities', (req, res, next) => {
  Resident.aggregate([
    { 
      $group : {
        _id : {
          city : {
            $toUpper : "$city"
          } 
        },
        names : {
          $push : {
            name : {
              $toUpper :"$name"
            },
            _id : "$_id"
            
          }
        },
  
        count : {
          $sum : 1
        }
      }
    },
    {
      $project : {
        _id : 0,
        city : "$_id.city",
        names : 1,
        count : 1
      }
    },
    {
      $sort : {
        city : 1
      }
    }
  ]).exec()
    .then((residents) => {
      console.log(residents);
      res.render('reports/cities', { residents })
    })
    .catch((err) => {
      throw err
    })
})

router.get('/referring-party', (req, res, next) => {
  Resident.aggregate([
    {
      $unwind : "$cases"
    },
    { 
      $group : {
        _id : {
          referring_party : {
            $toUpper : "$cases.referring_party"
          } 
        },
        names : {
          $push : {
            name : {
              $toUpper :"$name"
            },
            _id : "$_id"
          }
        },
  
        count : {
          $sum : 1
        }
      }
    },
    {
      $project : {
        _id : 0,
        referring_party : "$_id.referring_party",
        names : 1,
        count : 1
      }
    },
    {
      $sort : {
        case : 1
      }
    }
  ]).exec()
    .then((residents) => {
      console.log(residents);
      res.render('reports/referring_parties', { residents })
    })
    .catch((err) => {
      throw err
    })
})
 


module.exports = router;
