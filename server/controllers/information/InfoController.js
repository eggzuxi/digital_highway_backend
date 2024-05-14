const asyncHandler = require("express-async-handler");
const health = require("../../models/healthModel");
const culture = require("../../models/cultureModel");
const career = require("../../models/careerModel");
const finance = require("../../models/financeModel");
const welfare = require("../../models/welfareModel");

const getHealthPage = asyncHandler(async(req, res) => {
  const posts = await health.find();
  res.json(posts)
  // res.render("healthInfo", {posts:posts});
})

const getCulturePage = asyncHandler(async(req, res) => {
  const posts = await culture.find();
  res.json(posts)
  // res.render("culInfo", {posts:posts});
})

const getFinancePage = asyncHandler(async(req, res) => {
  const posts = await finance.find();
  res.json(posts)
  // res.render("finInfo", {posts:posts});
})

const getCareerPage = asyncHandler(async(req, res) => {
  const posts = await career.find();
  res.json(posts)
  // res.render("carInfo", {posts:posts});
})

const getWelfarePage = asyncHandler(async(req, res) => {
  const posts = await welfare.find();
  res.json(posts)
  // res.render("welInfo", {posts:posts});
})

module.exports = {getHealthPage, getCulturePage, getFinancePage, getCareerPage, getWelfarePage};