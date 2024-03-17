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

var express = require("express");
var cors = require("cors");
var app = express();
var dotenv = require("dotenv");

const path = require("path");

var multer = require("multer");

var bodyParser = require("body-parser");
var jsonParser = require("body-parser").json();

const mysql = require("mysql2");

dotenv.config();

let pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000, // Increase connect timeout as needed
});

pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err);
});

// Log when a connection is created
pool.on('connection', (connection) => {
  console.log('New connection created:', connection.threadId);
});

// Log when a connection is released
pool.on('release', (connection) => {
  console.log('Connection released:', connection.threadId);
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
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(jsonParser);

app.get('/', (req, res)=>{
  res.send("Connected to web server")
})

// api path

app.post("/login", (req, res, next) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    login(conn, req, res, next);
    conn.release();
  });
});

app.post("/upcoming-event", (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    upComing(conn, req, res);
    conn.release();
  });
});

app.post("/getfiles", (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    getfiles(conn, req, res);
    conn.release();
  });
});

app.post("/getWishlist", (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    getWishlist(conn, req, res);
    conn.release();
  });
});

app.post("/manageWishList", (req, res) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    manageWishList(conn, req, res);
    conn.release();
  });
});

app.post("/fetchprv", (req, res, next) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    fetchprv(conn, req, res);
    conn.release();
  });
});

app.post("/fetchType", (req, res, next) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    fetchType(conn, req, res);
    conn.release();
  });
});

app.post("/fetchSearchResult", (req, res, next) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    fetchSearchResult(conn, req, res);
    conn.release();
  });
});

app.post("/fetchCoDetails", (req, res, next) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    fetchCoDetails(conn, req, res);
    conn.release();
  });
});

app.post("/editCo", (req, res, next) => {
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    editCo(conn, req, res);
    conn.release();
  });
});

app.post("/updateUser", (req, res, next) => {
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    updateUser(conn, req, res);
    conn.release();
  });
});

app.post("/resetPassword", (req, res, next) => {
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    resetPassword(conn, req, res);
    conn.release();
  });
});

app.post("/docsManage", (req, res, next) => {
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    docsManage(conn, req, res);
    conn.release();
  });
});

app.post("/manageTime", (req, res, next) => {
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    manageTime(conn, req, res);
    conn.release();
  });
});

app.post("/fetchMinor", (req, res) => {
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    fetchMinor(conn, req, res);
    conn.release();
  });
});

app.post("/studentquery", (req, res) => {
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    studentquery(conn, req, res);
    conn.release();
  });
});

app.post("/uploadStudentCSV", upload.single("studentCSV"), (req, res) => {
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    uploadStudentCSV(conn, req, res)
    conn.release();
  });
});

app.post(
  "/uploadCompanyData",
  (req, res, next) => {
    upload.fields([
      { name: 'companyName', maxCount: 1 },
      { name: 'companyContacts', maxCount: 1 },
      { name: 'comments', maxCount: 1 },
      { name: 'interns', maxCount: 1}
    ])(req, res, err => {
      if (err instanceof multer.MulterError) {
        // Handle multer error
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // Handle other errors
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // No errors, proceed to next middleware
      next();
    });
  },
  (req, res) => {
    try {
      const uploadedFields = Object.keys(req.files);

      if (uploadedFields.length !== 1) {
        return res.status(400).json({ error: "Exactly one file should be uploaded" });
      }

      const fieldName = uploadedFields[0];
      const filePath = req.files[fieldName][0].path;

      pool.getConnection(function(err, conn) {
        if (err) {
          console.error('Error getting MySQL connection from pool:', err);
          return next(err);
        }
        uploadCompanyData(conn, fieldName, filePath, res);
        conn.release();
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.post('/manageStudent', (req, res)=>{
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    manageStudent(conn, req, res)
    conn.release();
  });
})

app.post('/manageCompany', (req, res)=>{
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    manageCompany(conn, req, res)
    conn.release();
  });
})

app.post('/manageContact', (req, res)=>{
    pool.getConnection(function(err, conn) {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      return next(err);
    }
    manageContact(conn, req, res)
    conn.release();
  });
})

app.listen(process.env.PORT, function () {
  console.log(`CORS-enabled web server listening on port ${process.env.PORT}`);
});
