const Patient = require('../models/patient');
const Carers = require('../models/carers');

module.exports.get = (req, res)=>{
  Patient.where({'deviceid': req.params.id}).fetch().then((model)=>{
    var watching = null
    var rel = {user_username: req.user.username, patient_deviceid: model.attributes.deviceid}
    //Checking for match on watching
    Carers.where(rel).fetch().then((assoc, watching)=>{
      if(assoc){
        watching = true
      } else {
        watching = false
      }
      return watching
    }).then((wat)=>{
      //verifying and sending
      model.attributes.isWatching = wat
      res.send(model.attributes)
    })
  }).catch((err)=>{
    console.log(err);
    res.status(404).send('It doesnt exist')
  })
}

module.exports.search = (req, res)=>{
  const q = req.query.query
  Patient.where('fullname', 'LIKE', '%'+q+'%').fetchAll().then((result)=>{
    const toSend = result.toJSON()
    res.send(toSend)
  }).catch((err)=>{
    console.log('nothing');
  })
}
