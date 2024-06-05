const express = require('express');
const router = express.Router();
const {getHealthPage, getCulturePage, getFinancePage, getCareerPage, getWelfarePage, bookmark} = require("../../controllers/information/InfoController")

router.route("/health") //informations뒤에 /health 이 붙을 때
  .get(getHealthPage)

router.route("/culture")//informations뒤에 /culture이 붙을 때
  .get(getCulturePage)

router.route("/finance")//informations뒤에 /finance가 붙을 때
  .get(getFinancePage)

router.route("/career")//informations 뒤에 /career가 붙을 때
  .get(getCareerPage)

router.route("/welfare")//informations 뒤에 /welfare가 붙을 때
  .get(getWelfarePage)

router.route("/bookmark")//즐겨찾기
  .put(bookmark)

module.exports = router;