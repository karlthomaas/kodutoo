const cookieParser = require("cookie-parser");
const express = require('express');
const cors = require('cors') 

const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken")

const { v4: uuidv4 } = require('uuid');
const db = require("./db")

dotenv.config();
const app = express();
const port = process.env.PORT; 

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cors(corsOptions)); // accept requests from front end
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser()); // parse cookies


app.get("/api/get-user", (req, res) => {
  const cookies = req.cookies;
  const userAgent = req.headers["user-agent"];

  try {
    if (!cookies["session"]) {
      throw new Error("No cookie")
    }

    const session_id = cookies["session"];
    const decoded = jwt.verify(session_id, process.env.JWT_SECRET);

    if (!decoded){
      throw new Error("Invalid session")
    }

    if (decoded.user_agent !== userAgent) {
      throw new Error("Invalid user agent")
    }

    db.all("SELECT * FROM users WHERE user_id = ?", [decoded.user_id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(200).send({ data: row });
    });

  } catch (err) {
    console.log(err);
    res.status(401).send({ data: null });
  }
});

app.post("/api/save-user", (req, res) => {
  let user_id;
  const data = req.body;
  const cookies = req.cookies;
  const userAgent = req.headers["user-agent"];
  const { name, sectors } = data;

  if (!name || !sectors) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try{
    if (!cookies["session"]) {
      throw new Error("No cookie")
    }

     const session_id = cookies["session"];
     const decoded = jwt.verify(session_id, process.env.JWT_SECRET);
 
     if (!decoded){
       throw new Error("Invalid session")
     }
 
     if (decoded.user_agent !== userAgent) {
       throw new Error("Invalid user agent")
     }

     user_id = decoded.user_id;
     
    db.get("DELETE FROM users WHERE user_id = ?", [user_id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
    });
    
    
  } catch (err) {
      // If there is no cookie or the cookie is invalid, create a new user:
      user_id = uuidv4();
      const session_id = jwt.sign({ user_id, user_agent: userAgent}, process.env.JWT_SECRET, { expiresIn: "3h" })
      res.cookie("session", session_id, { maxAge: 24 * 60 * 60 * 1000 , httpOnly: true });
    }
  
  // Adds each sector to the database
  sectors.forEach((sector) => {
    db.run(
      "INSERT INTO users (user_id, name, sector) VALUES (?, ?, ?)",
      [user_id, name, sector],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      }
    );
  });
  
  return res.status(200).send({ message: "User saved successfully" });
});

app.post("/api/populate-sectors", (req, res) => {
  db.serialize(function () {
    const data = req.body;

    db.run("DELETE FROM categories", (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
    });

    for (const category in data) {
      // Iterate over all Categories
      db.run("INSERT INTO categories (category, subcategory, sector) VALUES (?, ?, ?)", [category, "", ""], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });

      for (const subCategory in data[category]["subCategory"]) {

        let hasChildren = 1 ? data[category]["subCategory"][subCategory]["sectors"].length > 0 : 0;
        
         // Add Subcategory to database
         db.run(
          "INSERT INTO categories (category, subcategory, sector, children) VALUES (?, ?, ?, ?)",
          [category, subCategory, "", hasChildren],
          function (err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          }
        );

        // Iterate over all Subcategories
        const sector = data[category]["subCategory"][subCategory]["sectors"];
        
        if (sector.length > 0) {
          // If there are sectors, iterate over them and insert them into the database
          sector.forEach((sector) => {
            db.run(
              "INSERT INTO categories (category, subcategory, sector) VALUES (?, ?, ?)",
              [category, subCategory, sector],
              function (err) {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }
              }
            );
          });
        }
      }
    }
  });

  res.status(200).send({ message: "Date inserted successfully" });
});


app.get('/api/get-sectors', (req, res) => {
    db.serialize(function() {
        db.all("SELECT * FROM categories", (err, rows) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
            res.status(200).send({ data: rows });
          });
    });

});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});