const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const http = require("http");
var parseUrl = require("body-parser");
let alert = require("alert");
// var popup = require('popups')
const app = express();
app.use(express.json());
app.set("view engine", "ejs");
var mysql = require("mysql2");
const { encode } = require("punycode");
var path = require("path");
app.use(express.static(path.join(__dirname, "public")));
let encodeUrl = parseUrl.urlencoded({ extended: false });

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekey",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false,
  })
);

app.use(cookieParser());

var con = mysql.createConnection({
  host: "cloudbasedattendance.civhlecdo3ay.ap-south-1.rds.amazonaws.com",
  user: "roshan", // my username
  password: "Nepal123", // my password
  database: "cloudbasedattendance",
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/HomePage/index.html");
});
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/RegistrationForm/register.html");
});

app.post("/Student_register", encodeUrl, (req, res) => {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var gender = req.body.gender;
  var email = req.body.email;
  var phone = req.body.phone;
  var usn = req.body.usn;
  var sem = req.body.sem;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  console.log(firstName);
  con.connect(function (err) {
    if (err) {
      console.log(err);
    }
    // checking user already registered or no
    // con.query(`SELECT * FROM student WHERE email = '${email}' AND password  = '${password}'`, function(err, result){
    con.query(
      `SELECT * FROM student WHERE email = '${email}' `,
      function (err, result) {
        if (err) {
          console.log(err);
        }
        if (Object.keys(result).length > 0) {
          res.sendFile(__dirname + "/RegistrationForm/failReg.html");
        } else {
          //creating user page in userPage function
          function userPage() {
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.user = {
              firstname: firstName,
              lastname: lastName,
              gender: gender,
              email: email,
              phone: phone,
              usn: usn,
              sem: sem,
              password: password,
              confirmpassword: confirmPassword,
            };

            res.sendFile(
              __dirname + "/FaceAuthentication/FaceRegister/index.html"
            );
          }

          var sql = `INSERT INTO student (firstname, lastname, gender, email, phone, usn, sem, password, confirmpassword) VALUES 
                ('${firstName}', '${lastName}', '${gender}', '${email}', '${phone}', '${usn}', '${sem}', '${password}', '${confirmPassword}')`;

          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              // using userPage function for creating user page
              userPage();
            }
          });
        }
      }
    );
  });
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/LoginForm/login.html");
});
app.get("/ForgetPassword", (req, res) => {
  res.sendFile(__dirname + "/LoginForm/forget.html");
});

app.get("/studentprofile", (req, res) => {
  res.sendFile(__dirname + "/Profile/Studentprofile.html");
});

app.get("/teacherprofile", (req, res) => {
  res.sendFile(__dirname + "/Profile/Teacherprofile.html");
});

app.post("/Teacher_register", encodeUrl, (req, res) => {
  var T_firstName = req.body.T_firstName;
  var T_lastName = req.body.T_lastName;
  var T_email = req.body.T_email;
  var T_phone = req.body.T_phone;
  var T_faculty = req.body.T_faculty;
  var T_password = req.body.T_password;
  var T_confirmPassword = req.body.T_confirmPassword;

  console.log(T_firstName);
  con.connect(function (err) {
    if (err) {
      console.log(err);
    }
    // checking user already registered or no
    con.query(
      `SELECT * FROM teacher WHERE T_email = '${T_email}' `,
      function (err, result) {
        if (err) {
          console.log(err);
        }
        if (Object.keys(result).length > 0) {
          res.sendFile(__dirname + "/RegistrationForm/failReg.html");
        } else {
          //creating user page in userPage function
          function Teacher_userPage() {
            // We create a session for the dashboard (Teacher) page and save the user data to this session:
            req.session.user = {
              T_firstname: T_firstName,
              T_lastname: T_lastName,
              T_email: T_email,
              T_faculty: T_faculty,
              T_phone: T_phone,
              T_password: T_password,
              T_confirmpassword: T_confirmPassword,
            };

      



            res.sendFile(
              __dirname + "/LoginForm/login.html"
            );




          }

          var sql = `INSERT INTO teacher (T_firstname, T_lastname, T_email, T_phone, T_faculty, T_password, T_confirmpassword) VALUES 
                ('${T_firstName}', '${T_lastName}',  '${T_email}', '${T_phone}', '${T_faculty}',  '${T_password}', '${T_confirmPassword}')`;

          console.log(req.body.T_email);
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              // using userPage function for creating user page
              Teacher_userPage();
            }
          });
        }
      }
    );
  });
});

app.post("/session", encodeUrl, (req, res) => {
  var subjectcode = req.body.subjectcode;
  var subjectname = req.body.subjectname;
  var sessiontime = req.body.sessiontime;

  console.log(req.body.subjectcode);

  var sql = `INSERT INTO session_db ( subject_code,subject_name, session_time) VALUES 
                    ('${subjectcode}','${subjectname}', '${sessiontime}')`;

  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
   
      console.log("Session created successfully.");

    }
  });
});

app.post("/profile", encodeUrl, (req, res) => {
  var Email = req.body.email;
  var Password = req.body.password;

  con.connect(function (err) {
    if (err) {
      console.log(err);
    }

    con.query(
      `SELECT * FROM teacher WHERE T_email = '${Email}' AND T_password = '${Password}'`,
      function (err, result) {
        if (err) {
          console.log(err);
        }

        function teacherUserPage() {
          // We create a session for the dashboard (user page) page and save the user data to this session:
          req.session.user = {
            firstname: result[0].T_firstname,
            lastname: result[0].T_lastname,
            role: "teacher",
          };

          res.render(__dirname + "/views/TeacherProfile.ejs", {
            Teacher_name:
              req.session.user.firstname + " " + req.session.user.lastname,
          });
        }

        if (Object.keys(result).length > 0) {
          teacherUserPage();
        } else {
          con.query(
            `SELECT * FROM student WHERE email = '${Email}' AND password = '${Password}'`,
            function (err, result) {
              if (err) {
                console.log(err);
              }

              function studentUserPage() {
                // We create a session for the dashboard (user page) page and save the user data to this session:
                req.session.user = {
                  firstname: result[0].firstname,
                  lastname: result[0].lastname,
                  usn: result[0].usn,
                  sem: result[0].sem,
                };

                var s_name =
                  req.session.user.firstname + " " + req.session.user.lastname;
                var s_usn = req.session.user.usn;
                var s_sem = req.session.user.sem;

                res.redirect("/verify");

                app.post("/verify", (req, res) => {
                  con.connect(function (err) {
                    if (err) {
                      console.log(err);
                    }
                
                    con.query(
                      "SELECT * FROM session_db ORDER BY id DESC LIMIT 3",
                      function (err, results, fields) {
                        if (err) {
                          console.log(err);
                        }
                        const row = results[0];
                        const subjectCode1 = row.subject_code;
                        const subjectName1 = row.subject_name;
                        const sessionTime1 = row.session_time;
                
                        const row2 = results[1];
                        const subjectCode2 = row2.subject_code;
                        const subjectName2 = row2.subject_name;
                        const sessionTime2 = row2.session_time;
                


                        const row3 = results[2];
                        const subjectCode3 = row3.subject_code;
                        const subjectName3 = row3.subject_name;
                        const sessionTime3 = row3.session_time;

                        const s_name =
                          req.session.user.firstname + " " + req.session.user.lastname;
                        const s_usn = req.session.user.usn;
                        const s_sem = req.session.user.sem;
                
                        con.query(
                          "INSERT INTO student_attendance (Name, Usn, Sem, SubjectCode, SubjectName, SessionTime) VALUES ( ?, ?, ?, ?, ?, ?)",
                          [s_name, s_usn, s_sem, subjectCode1, subjectName1, sessionTime1],
                          function (err, results, fields) {
                            if (err) {
                              console.log(err);
                            }
                            res.render(__dirname + "/views/StudentProfile.ejs", {
                              name: s_name,
                              usn: s_usn,
                              sem: s_sem,
                              sub_code1: subjectCode1,
                              sub_name1: subjectName1,
                              sess_time1: sessionTime1,
                              sub_code2: subjectCode2,
                              sub_name2: subjectName2,
                              sess_time2: sessionTime2,
                              sub_code3: subjectCode3,
                              sub_name3: subjectName3,
                              sess_time3: sessionTime3,
                            });
                          }
                        );
                      }
                    );
                  });
                });
                

                
           
           
              }

        
              if (Object.keys(result).length > 0) {
                studentUserPage();
              } else {
                res.sendFile(__dirname + "/LoginForm/failLog.html");
              }
            }
          );
        }
      }
    );
  });
});

app.get("/verify", (req, res) => {
  res.sendFile(__dirname + "/FaceAuthentication/FaceVerify/index.html");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});