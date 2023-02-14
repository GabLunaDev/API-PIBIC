const jwt = require('jsonwebtoken');
const dotenv = require("dotenv/config");

const unauthenticatedRoutes = ["/api/login"]

var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser())

module.exports = async (req, res, next) => {

  try {

    const token = req.headers["x-access-token"]

    if (!token) {
      return res.status(400).json({ valid: false, error: "Token não identificado." })

    } else {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          return res.status(401).json({ valid: false, error: "Invalid token" })
        } else {
          req.auth = {
            ...decoded
          }


          next();
        }
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ valid: false, error: "exception", req: req.body })
  }
};
