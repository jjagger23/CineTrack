const Genre = require("../models/Genre");

exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGenre = async (req, res) => {
  try {
    const genre = await Genre.create(req.body);
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    res.json({ message: "Genre deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};