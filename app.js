var express = require("express");
var cors = require("cors");
var app = express();
var dotenv = require("dotenv");
const fs = require("fs");

const path = require("path");

var multer = require("multer");

var bodyParser = require("body-parser");
var jsonParser = require("body-parser").json();

const mysql = require("mysql2");

dotenv.config();

// const sslOptions = {
//   ca: fs.readFileSync(process.env.CA_PER),
//   // cert: fs.readFileSync('/path/to/client-cert.pem'),
//   // key: fs.readFileSync('/path/to/client-key.pem'),
// };

const conn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT,
  // ssl: sslOptions
});

conn.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database!");
  connection.release();
});

// multer config

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/"); // Destination folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({ storage: storage });

const corsOptions = {
  origin: "*", // Allow all origins temporarily
  credentials: true,
};

app.use(cors(corsOptions));

app.use(jsonParser);

// api import

const { login } = require("./api/login");
const { upComing } = require("./api/up-coming");
const { getfiles } = require("./api/getfiles");
const { getWishlist } = require("./api/getWishlist");
const { manageWishList } = require("./api/manageWishList");
const {
  fetchprv,
  fetchType,
  fetchSearchResult,
  fetchCoDetails,
  fetchMinor,
} = require("./api/fetches");
const { editCo } = require("./api/editCo");
const { updateUser } = require("./api/updateUser");
const { resetPassword } = require("./api/resetPassword");
const { docsManage } = require("./api/docsManage");
const { manageTime } = require("./api/manageTime");
const { studentquery } = require("./api/studentquery");
const { uploadCompanyData } = require("./api/uploadCompanyData");
const { uploadStudentCSV } = require("./api/uploadSudentCSV");
const { manageStudent } = require("./api/manageStudent");
const { manageCompany } = require("./api/manageCompany");
const { manageContact } = require("./api/ManageContact");
const { getData } = require("./api/getData");

app.get("/", (req, res) => {
  res.send("Connected to web server");
});

app.get("/users", (req, res, next) => {
  let query = "SELECT username FROM users";
  conn.query(query, (err, result) => {
    if (err) {
      return res.json({ status: "error", msg: err });
    } else {
      return res.json({ status: "founded", result });
    }
  });
});

// api path

app.post("/login", (req, res, next) => {
  login(conn, req, res, next);
});

app.post("/upcoming-event", (req, res) => {
  upComing(conn, req, res);
});

app.post("/getfiles", (req, res) => {
  getfiles(conn, req, res);
});

app.post("/getWishlist", (req, res) => {
  getWishlist(conn, req, res);
});

app.post("/manageWishList", (req, res) => {
  manageWishList(conn, req, res);
});

app.post("/fetchprv", (req, res, next) => {
  fetchprv(conn, req, res);
});

app.post("/fetchType", (req, res, next) => {
  fetchType(conn, req, res);
});

app.post("/fetchSearchResult", (req, res, next) => {
  fetchSearchResult(conn, req, res);
});

app.post("/fetchCoDetails", (req, res, next) => {
  fetchCoDetails(conn, req, res);
});

app.post("/editCo", (req, res, next) => {
  editCo(conn, req, res);
});

app.post("/updateUser", (req, res, next) => {
  updateUser(conn, req, res);
});

app.post("/resetPassword", (req, res, next) => {
  resetPassword(conn, req, res);
});

app.post("/docsManage", (req, res, next) => {
  docsManage(conn, req, res);
});

app.post("/manageTime", (req, res, next) => {
  manageTime(conn, req, res);
});

app.post("/fetchMinor", (req, res) => {
  fetchMinor(conn, req, res);
});

app.post("/studentquery", (req, res) => {
  studentquery(conn, req, res);
});

app.post("/uploadStudentCSV", upload.single("studentCSV"), (req, res) => {
  uploadStudentCSV(conn, req, res);
});

app.post(
  "/uploadCompanyData",
  (req, res, next) => {
    upload.fields([
      { name: "companyName", maxCount: 1 },
      { name: "companyContacts", maxCount: 1 },
      { name: "comments", maxCount: 1 },
      { name: "interns", maxCount: 1 },
    ])(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle multer error
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // Handle other errors
        return res.status(500).json({ error: "Internal Server Error" });
      }
      // No errors, proceed to next middleware
      next();
    });
  },
  (req, res) => {
    try {
      const uploadedFields = Object.keys(req.files);

      if (uploadedFields.length !== 1) {
        return res
          .status(400)
          .json({ error: "Exactly one file should be uploaded" });
      }

      const fieldName = uploadedFields[0];
      const filePath = req.files[fieldName][0].path;

      uploadCompanyData(conn, fieldName, filePath, res);
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.post("/manageStudent", (req, res) => {
  manageStudent(conn, req, res);
});

app.post("/manageCompany", (req, res) => {
  manageCompany(conn, req, res);
});

app.post("/manageContact", (req, res) => {
  manageContact(conn, req, res);
});

app.get("/data", (req, res) => {
  getData(conn, req, res);
});

app.listen(process.env.PORT, function () {
  console.log(`CORS-enabled web server listening on port ${process.env.PORT}`);
});
