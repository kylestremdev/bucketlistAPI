var express   = require("express"),
    mongoose  = require("mongoose"),
    bP        = require("body-parser"),
    app       = express();

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/bucketlistAPI");

var TaskSchema = mongoose.Schema({
  objective: {
    type: String,
    required: [true, "Must have a task"],
    validate: {
      validator: function(v) {
        return v.length > 3;
      },
      message: 'Task must be greater than 3 characters'
    }
  }
}, {timestamps: true});

var Task = mongoose.model("Task", TaskSchema);

app.use(bP.urlencoded({extended:true}));
app.use(bP.json());

app.get("/", function (req, res) {
  res.send("Hello");
});

app.get("/tasks", function (req, res) {
  Task.find({}).exec()
  .then(function (tasks) {
    return res.json(tasks);
  }, function (err) {
    return res.status(400).send(err);
  });
});

app.post("/tasks", function (req, res) {
  var newTask = new Task({
    objective: req.body.objective
  });

  newTask.save().then(function (newtask) {
    return res.sendStatus(200);
  }, function (err) {
    return res.status(400).send(err);
  });
});

app.post("/tasks/:task_id", function (req, res) {
  Task.findById(req.params.task_id).exec()
  .then(function (task) {
    task.objective = req.body.objective;

    task.save()
    .then(function (saved_task) {
      return res.sendStatus(200);
    }, function (err) {
      return res.status(400).send(err);
    })
  })
})

app.get("/tasks/:task_id/delete", function (req, res) {
  Task.findById(req.params.task_id).remove().exec()
  .then(function () {
    return res.sendStatus(200);
  }, function (err) {
    return res.status(400).send(err);
  });
});

app.listen(8000, function () {
  console.log("Server running on port 8000");
});
