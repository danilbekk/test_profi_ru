const validUrl = require("valid-url");
const httpStatus = require("http-status");
const randomstring = require("randomstring");
const { Router } = require("express");
const Url = require("../models/Url.model");

const router = Router();

router.post("/addUrl", async (req, res) => {
  const siteUrl = `${req.protocol}://${req.hostname}`;

  let { slug } = req.body;
  const { url } = req.body;

  if (!validUrl.isUri(url)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: "URL не является валидным",
    });
  }

  if (!/^[\w\d._-]{3,64}$/.test(slug)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: "Допустимые символы для сокращения URL [0-9, a-z, A-Z, -,_]",
    });
  }

  if (!slug) {
    slug = randomstring.generate({
      length: 10,
      charset: "alphanumeric",
    });
  }

  try {
    const candidate = await Url.findOne({ url });

    if (candidate) {
      return res.status(httpStatus.OK).json({
        status: "success",
        message: "Этот URL ранее сокращался",
        slug: candidate.slug,
        url: `${siteUrl}:3000/${candidate.slug}`,
      });
    }

    const createdUrl = await Url.create({ url, slug });

    return res.status(httpStatus.OK).json({
      status: "success",
      slug: createdUrl.slug,
      url: `${siteUrl}:3000/${createdUrl.slug}`,
    });
  } catch (e) {
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json({
      error: e.message,
    });
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const candidate = await Url.findOne({ slug });

    if (!candidate) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: "Такой URL не найден",
      });
    }

    return res.status(httpStatus.FOUND).redirect(candidate.url);
  } catch (e) {
    return res.status(httpStatus.SERVICE_UNAVAILABLE).json({
      error: e.message,
    });
  }
});

module.exports = router;
