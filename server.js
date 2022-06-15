var express = require('express');
var bodyParser = require('body-parser');
require('dotenv').config();
var cors = require('cors');
var upload = require('express-fileupload');
var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(upload());
app.use(bodyParser.urlencoded({ extended: true }))

var test = require('./routes/test');
var auth = require('./routes/auth');
var user = require('./routes/user');
var district = require('./routes/district');
var stream = require('./routes/stream');
var paperType = require('./routes/paperType');
var language = require('./routes/language');
var userType = require('./routes/userType');
var subject = require('./routes/subject');
var paper = require('./routes/paper');
var question = require('./routes/question');
var marks = require('./routes/marks');
var excelSheet = require('./routes/excelSheet');
var newQuestion = require('./routes/newQuestion');
var questionType = require('./routes/questionType');
var options = require('./routes/options');
var leaderBoard = require('./routes/leaderBoard');
var teacher = require('./routes/teacher');
var timeBasedPaper = require('./routes/timeBasedPaper');
var examMarks = require('./routes/examMarks');

app.use('/test', test);
app.use('/auth', auth);
app.use('/user', user);
app.use('/district', district);
app.use('/stream', stream);
app.use('/paperType', paperType);
app.use('/language', language);
app.use('/userType', userType);
app.use('/subject', subject);
app.use('/paper', paper);
app.use('/question', question);
app.use('/marks', marks);
app.use('/excelSheet', excelSheet);
app.use('/newQuestion', newQuestion);
app.use('/questionType', questionType);
app.use('/options', options);
app.use('/leaderBoard', leaderBoard);
app.use('/teacher', teacher);
app.use('/timeBasedPaper', timeBasedPaper);
app.use('/examMarks', examMarks);

app.listen(process.env.PORT, () => { console.log('server start at port ' + process.env.PORT) });