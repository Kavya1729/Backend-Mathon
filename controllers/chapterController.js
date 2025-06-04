const Chapter = require("../models/Chapter");
const getRedisClient = require("../config/redis");


exports.getChapters = async (req, res) => {
  try {
    const {
      class: cls,
      unit,
      subject,
      status,
      weakChapters,
      page = 1,
      limit = 10,
    } = req.query;
    const query = {};

    if (cls) query.class = cls;
    if (unit) query.unit = unit;
    if (subject) query.subject = subject;
    if (status) query.status = status;
    if (weakChapters === "true") query.isWeakChapter = true;

    const total = await Chapter.countDocuments(query);
    const chapters = await Chapter.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ total, chapters });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getChaptersById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    res.json({ chapter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.uploadChapters = async (req, res) => {
  try {
    const chaptersData = req.body;

    if (!Array.isArray(chaptersData)) {
      return res.status(400).json({ message: "JSON data should be an array" });
    }

    const successful = [];
    const failed = [];

    for (const chapter of chaptersData) {
      try {
        const newChapter = new Chapter(chapter);
        await newChapter.validate();
        successful.push(newChapter);
      } catch (error) {
        failed.push({
          chapter,
          error: error.message,
        });
      }
    }

    if (successful.length > 0) {
      await Chapter.insertMany(successful);
      const redisClient = await getRedisClient(); 
      await redisClient.del("chapters");
    }

    res.status(200).json({
      message: "Chapters uploaded successfully",
      added: successful.length,
      failed,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
