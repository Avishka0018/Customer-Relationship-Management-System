import Lead from "../models/Lead.js";

export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ msg: "Lead not found" });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!lead) return res.status(404).json({ msg: "Lead not found" });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) return res.status(404).json({ msg: "Lead not found" });

    res.json({ msg: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ msg: "Lead not found" });

    lead.notes = lead.notes || [];
    lead.notes.push(req.body);

    await lead.save();

    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const leads = await Lead.find();

    const totalLeads = leads.length;

    /* ---------- STATUS ---------- */
    const newLeads = leads.filter(l => l.status === "New").length;
    const qualifiedLeads = leads.filter(l => l.status === "Qualified").length;
    const wonLeads = leads.filter(l => l.status === "Won").length;
    const lostLeads = leads.filter(l => l.status === "Lost").length;

    /* ---------- DEAL VALUES ---------- */
    const totalDealValue = leads.reduce(
      (sum, l) => sum + (l.value || 0),
      0
    );

    const wonDealValue = leads.reduce(
      (sum, l) =>
        l.status === "Won" ? sum + (l.value || 0) : sum,
      0
    );

    /* ---------- 🔥 DYNAMIC SOURCES (FIXED) ---------- */
    const sourceMap = {};

    leads.forEach((lead) => {
      const key = lead.source || "Unknown";
      sourceMap[key] = (sourceMap[key] || 0) + 1;
    });

    const sources = Object.entries(sourceMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .filter(s => s.value > 0)
      .sort((a, b) => b.value - a.value);

    /* ---------- RECENT LEADS ---------- */
    const recentLeads = leads
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    /* ---------- METRICS ---------- */
    const conversionRate =
      totalLeads > 0
        ? ((wonLeads / totalLeads) * 100).toFixed(2)
        : 0;

    const avgDealValue =
      totalLeads > 0
        ? (totalDealValue / totalLeads).toFixed(2)
        : 0;

    const winRate =
      totalLeads > 0
        ? ((wonLeads / totalLeads) * 100).toFixed(2)
        : 0;

    /* ---------- RESPONSE ---------- */
    res.json({
      totalLeads,

      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,

      totalDealValue,
      wonDealValue,

      sources, 

      recentLeads,

      conversionRate,
      avgDealValue,
      winRate,
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};