const jwt = require('jsonwebtoken');
const messages = require("../models/responseMessages");

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
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
          return res.status(401).json({ valid: false, error: messages._ERROR_UNAUTHENTICATED_TOKEN })
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
