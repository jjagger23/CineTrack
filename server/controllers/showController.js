const Show = require("../models/Show");

const TVMAZE_SOURCE = "tvmaze";
const TVMAZE_URL = "https://api.tvmaze.com/shows";
const TVMAZE_SEARCH_URL = "https://api.tvmaze.com/search/shows";
const DEFAULT_EXTERNAL_LIMIT = 120;

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const mapTvMazeShow = item => {
  const year = item?.premiered ? Number(String(item.premiered).slice(0, 4)) : undefined;

  return {
    externalSource: TVMAZE_SOURCE,
    externalId: String(item?.id || ""),
    title: item?.name?.trim(),
    type: "TV Show",
    genre: Array.isArray(item?.genres) ? item.genres.filter(Boolean) : [],
    releaseYear: Number.isFinite(year) ? year : undefined,
    description: stripHtml(item?.summary || "") || "No description available.",
    posterUrl: item?.image?.original || item?.image?.medium || "",
  };
};

const fetchJsonWithTimeout = async url => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`External API error: ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchExternalShows = async () => {
  const page = Number(process.env.TVMAZE_PAGE || 0);
  const limit = Number(process.env.EXTERNAL_SHOW_LIMIT || DEFAULT_EXTERNAL_LIMIT);
  const data = await fetchJsonWithTimeout(`${TVMAZE_URL}?page=${page}`);
  if (!Array.isArray(data)) return [];

  return data
    .slice(0, limit)
    .map(mapTvMazeShow)
    .filter(show => show.externalId && show.title);
};

const fetchExternalSearchResults = async query => {
  const data = await fetchJsonWithTimeout(`${TVMAZE_SEARCH_URL}?q=${encodeURIComponent(query)}`);
  if (!Array.isArray(data)) return [];

  return data
    .map(result => mapTvMazeShow(result?.show))
    .filter(show => show.externalId && show.title);
};

const upsertExternalShows = async externalShows => {
  if (!externalShows.length) return [];

  const operations = externalShows.map(show => ({
    updateOne: {
      filter: { externalSource: show.externalSource, externalId: show.externalId },
      update: { $set: show },
      upsert: true,
    },
  }));

  await Show.bulkWrite(operations, { ordered: false });

  const ids = externalShows.map(show => show.externalId);
  return await Show.find({
    externalSource: TVMAZE_SOURCE,
    externalId: { $in: ids },
  }).sort({ createdAt: -1 });
};

const seedCatalogFromExternalSource = async () => {
  const existingCount = await Show.estimatedDocumentCount();
  if (existingCount > 0) return;

  const externalShows = await fetchExternalShows();
  if (!externalShows.length) return;
  await upsertExternalShows(externalShows);
};

exports.getShows = async (req, res) => {
  try {
    let shows = await Show.find().sort({ createdAt: -1 });

    if (shows.length === 0) {
      try {
        await seedCatalogFromExternalSource();
        shows = await Show.find().sort({ createdAt: -1 });
      } catch (syncError) {
        console.error("External show sync failed:", syncError.message);
      }
    }

    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchExternalShows = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const externalShows = await fetchExternalSearchResults(query);
    const syncedShows = await upsertExternalShows(externalShows);
    res.json(syncedShows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json({ message: "Show deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
