import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");

const initializeData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({
        isMaintenanceMode: false,
        isHighDemandMode: false,
        theme: "light",
        serviceableLocations: ["110001", "10001", "75001"],
        queries: [],
      })
    );
  } else {
    // Ensure new fields exist even if file was already created
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    let updated = false;
    if (data.theme === undefined) {
      data.theme = "light";
      updated = true;
    }
    if (data.queries === undefined) {
      data.queries = [];
      updated = true;
    }
    if (updated) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
  }
};

initializeData();

export const getSettings = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.status(200).json({
      isMaintenanceMode: data.isMaintenanceMode,
      isHighDemandMode: data.isHighDemandMode,
      theme: data.theme,
      serviceableLocations: data.serviceableLocations,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const updateSettings = (req, res) => {
  try {
    const { isMaintenanceMode, isHighDemandMode, theme } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (isMaintenanceMode !== undefined) data.isMaintenanceMode = isMaintenanceMode;
    if (isHighDemandMode !== undefined) data.isHighDemandMode = isHighDemandMode;
    if (theme !== undefined) data.theme = theme;
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).json({ message: "Settings updated", data });
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

export const addLocation = (req, res) => {
  try {
    const { pincode } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (pincode && !data.serviceableLocations.includes(pincode)) {
      data.serviceableLocations.push(pincode);
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
    res.status(200).json({ message: "Location added", serviceableLocations: data.serviceableLocations });
  } catch (err) {
    res.status(500).json({ error: "Failed to add location" });
  }
};

export const removeLocation = (req, res) => {
  try {
    const { pincode } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    data.serviceableLocations = data.serviceableLocations.filter(p => p !== pincode);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).json({ message: "Location removed", serviceableLocations: data.serviceableLocations });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove location" });
  }
};

export const getQueries = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.status(200).json(data.queries || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch queries" });
  }
};

export const createQuery = (req, res) => {
  try {
    const { email, message, category } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required" });
    }
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const newQuery = {
      id: Date.now().toString(),
      email,
      message,
      category: category || "General Help",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    if (!data.queries) data.queries = [];
    data.queries.push(newQuery);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newQuery);
  } catch (err) {
    res.status(500).json({ error: "Failed to save query" });
  }
};

export const resolveQuery = (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (!data.queries) data.queries = [];
    const query = data.queries.find(q => q.id === id);
    if (query) {
      query.status = "Resolved";
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.status(200).json(query);
    } else {
      res.status(404).json({ error: "Query not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to resolve query" });
  }
};
