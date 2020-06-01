const express = require("express");
//const requiredata = require("./data/requiredata");
//const requireid = require("requireid");
const server = express();

server.get("/", (req, res) => {
  res.json({ api: "up and running" });
  res.send("server is returning data");
});

const port = 8000;

server.listen(port, ()=> console.log(`\n == API on port ${port} == \n`))

server.use(express.json());

server.post("/api/users", (req, res) => {
  const Usermaker = req.body;
  requiredata
    .insert(Usermaker)
    .then((add) => {
      if (add.name === "" || add.bio === "") {
        res
          .status(400)
          .json({ success: false, message: "name and bio required" });
      } else {
        const madeUser = {
          id: requireid.generate(),
          name: add.name,
          bio: add.bio,
        };

        res.status(201).json({ success: true, message: "User created" });
      }
    })

    .catch((err) =>
      res
        .status(500)
        .json({ success: false, errorMessage: "error Usermaker failed", err })
    );
});

server.get("/api/users", (req, res) => {
  requiredata
    .find()
    .then((getUser) => {
      res.status(200).json(getUser);
    })

    .catch((err) =>
      res
        .status(500)
        .json({ success: false, errorMessage: "error getUser failed" })
    );
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  requiredata
    .findById(id)
    .then((getID) => {
      if (getID) {
        console.log(getID);
        res.status(200).json(getID);
      } else {
        res
          .status(404)
          .json({ success: false, errorMessage: "user does not exist" });
      }
    })
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, errorMessage: "error getID failed" })
    );
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  requiredata
    .remove(id)
    .then((deleted) => {
      if (deleted) {
        res.status(200).json(deleted);
      } else {
        res
          .status(404)
          .json({ success: false, errorMessage: "user does not exist" });
      }
    })
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, errorMessage: "error deleted failed" })
    );
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const userDetails = req.body;

  requiredata
    .update(id, userDetails)

    .then((updated) => {
      if (updated) {
        res.status(200).json(userDetails);
      } else if (!userDetails.name || !userDetails.bio) {
        res
          .status(400)
          .json({ success: false, errorMessage: "name and bio info missing" });
      } else {
        res
          .status(404)
          .json({ success: false, errorMessage: "user does not exist" });
      }
    })
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, errorMessage: "error updated failed" })
    );
});