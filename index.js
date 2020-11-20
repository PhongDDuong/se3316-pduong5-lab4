const express = require('express');
var router = express.Router();
const data = require("./Lab3-timetable-data.json");//json file containing courses
const Storage = require('node-storage');//backend storage
const Joi = require('joi');
const app = express();

app.use(express.json());

var store = new Storage('schedule');

const port = process.env.Port || 3000;//port number

app.use(express.static('static/frontend'));

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});


//makes courses with json file
var newData = JSON.stringify(data)
const courses = JSON.parse(newData);

//frontend
app.use('/', express.static('static'));

//console log for requests
app.use(function (req, res, next) {
  console.log(`${req.method} request for ${req.url}`);
  next();
})

//get all schedules
app.get('/api/schedule', (req, res) => {
  const result = [];

  for(schedule in store.store) {
    result.push(schedule);
  }
  console.log(result);
  res.send(result);
});

//get courses of a schedule when given a name
app.get('/api/schedule/:id', (req, res) => {
  const result = [];
  result.push(store.get(req.params.id))
  res.send(result);
});

//add course to schedule
app.post('/api/schedule/create', function (req, res) {
  const { error } = validateSchedule(req.body); //result.error
  if(error) return res.status(400).send(result.error.details[0].message);
  
  const schedule = {
    schedule: req.body.schedule,
    subject: req.body.subject,
    catalog_nbr: req.body.catalog_nbr,
  }
  var existing = false;

  for(item in store.store) {
    if(req.body.schedule == item){
      existing = true;
    }
  }

  if(!existing){
    store.put(schedule.schedule,schedule);
    res.send(schedule);
  }
})

//add course to schedule
app.post('/api/schedule/', function (req, res) {
  const { error } = validateSchedule(req.body); //result.error
  if(error) return res.status(400).send(result.error.details[0].message);
  
  
  if(store.get(req.body.schedule).subject!==" "){
    var schedule = {
      schedule: req.body.schedule,
      subject: store.get(req.body.schedule).subject+","+req.body.subject,
      catalog_nbr: store.get(req.body.schedule).catalog_nbr+","+req.body.catalog_nbr,
    }
  }
  else{
    var schedule = {
      schedule: req.body.schedule,
      subject: req.body.subject,
      catalog_nbr: req.body.catalog_nbr,
    }
  }

  //courses.push(course);
  store.put(schedule.schedule,schedule);
  res.send(schedule);
})



//delete all schedules
app.delete('/api/schedule/all', function (req, res) {
  for(schedule in store.store) {
    store.remove(schedule);
  }
  res.send("deleted");
});

//delete a schedule when given its name in url
app.delete('/api/schedule/:id', function (req, res) {
  store.remove(req.params.id);
  res.send("deleted");
});

//delete a schedule when given its name
app.delete('/api/schedule/', function (req, res) {
  const { error } = validateInput(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);

  store.remove(req.body.input);

  res.send("deleted");
});

//get all courses
router.get('/', (req, res) => {
  var queryParameter = req.query;
  var results = [];

  //used in get courses when given paramters in a query
  if(Object.keys(queryParameter).length==0){
    res.send(courses);
  }
  else if(Object.keys(queryParameter).length==1){
    for(course of courses){
      if(course.subject.toLowerCase().includes(queryParameter.subject.toLowerCase())){
        results.push(course);
      }
    }
    res.send(results);
  }

  else if(Object.keys(queryParameter).length==2){
    for(course of courses){
      if(course.subject.toLowerCase().includes(queryParameter.subject.toLowerCase())&& course.catalog_nbr.toString().toLowerCase().includes(queryParameter.catalog_nbr.toLowerCase())){
        results.push(course);
      }
    }
    res.send(results);
  }

  else if(Object.keys(queryParameter).length==3){
    for(course of courses){
      if(course.subject.toLowerCase().includes(queryParameter.subject.toLowerCase()) && course.catalog_nbr.toString().toLowerCase().includes(queryParameter.catalog_nbr.toLowerCase()) && course.course_info[0].ssr_component.toLowerCase().includes(queryParameter.ssr_component.toLowerCase())){
        results.push(course);
      }
    }
    res.send(results);
  }

});


//get one course using id
router.get('/:id', function (req, res) {

  const course = courses.find(c => c.catalog_nbr.toString() === req.params.id);
  if(!course) return res.status(404).send('Course not found');
  
  //courses.filter(course => course.subject.indexOf(req.params.id) !== -1);
  res.send(course);
});


//used for input sanitization
function validateSchedule(schedule){
  const schema = {
    schedule: Joi.string().required().min(1).max(20).regex(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/ , { invert: true }),
    subject: Joi.string().required().regex(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/ , { invert: true }),
    catalog_nbr: Joi.string().required().regex(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/ , { invert: true }),
  };

  return result = Joi.validate(schedule, schema);
}

//input validation
function validateInput(course){
  const schema = {
    input: Joi.string().alphanum().min(1).max(20).required().regex(/[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/ , { invert: true })
  };

  return result = Joi.validate(course, schema);
}

//router
app.use('/api/courses', router);


//port listener
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//unused methods
/*
//add new course
router.post('/', function (req, res) {
  const { error } = validateCourse(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);
  
  const course = {
    id: courses.length + 1, 
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
})


//put method using id
router.put('/:id', function (req, res) {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course){
    const course = {
      id: parseInt(req.params.id), 
      name: req.body.name
    }
    courses.push(course);
    res.send(course);
    return;
  }
  
  const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); //result.error

  if(error) return res.status(400).send(result.error.details[0].message);

  course.name = req.body.name;
  res.send(course);
})

//delete method using id
router.delete('/:id', function (req, res) {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('Course not found');
  
  const index = courses.indexOf(course);
  courses.splice(index,1);

  res.send(course);
});*/