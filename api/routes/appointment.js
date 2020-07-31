const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Appointment = require('../models/appointment');

router.post('/', (req,res,next)=>{
    const appointment = new Appointment({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        time: req.body.time,
        title: req.body.title
    });
    appointment.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message:"appointment added",
            createdService: {
                name: result.name,
                email: result.email,
                time: result.time,
                title: result.title,
                _id: result._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/appointment/' + result._id
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
    
});

router.get('/', (req, res, next)=>{
    Appointment.find()
    .select( 'name email time title _id' )
    .exec()
    .then(docs=>{
        const response = {
            count: docs.length,
            appointments: docs.map(doc=>{
                return{
                    name: doc.name,
                    email: doc.email,
                    time: doc.time,
                    title: doc.title,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/appointment/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
});

router.get('/:appointmentId', (req, res, next)=>{
    const id = req.params.appointmentId;
    Appointment.findById(id)
    .exec()
    .then(doc=>{
        console.log("doc:",doc);
        if(doc){
        res.status(200).json({
            appointment: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/appointment'
            }
        });
        } else{
            res.status(404).json({message:"not a valid id"});
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
    
});

router.patch('/:appointmentId',(req, res, next)=>{
    const id = req.params.appointmentId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Appointment.update({ _id: id},{ $set: updateOps})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: "appointment updated",
            request: {
                type: 'GET',
                url: 'http://localhost:3000/appointment/' + id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
});

router.delete('/:appointmentId', (req, res, next)=>{
    const id = req.params.appointmentId
    Appointment.remove({_id: id})
    .exec()
    .then((result=>{
       console.log("appointment deleted");
        res.status(200).json({
            message: "appointment deleted",
            request: {
                type: 'POST',
                url: 'http://localhost:3000/appointment'
            }
        });
    }))
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    })
});


module.exports = router;