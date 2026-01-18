function jsonSafeParse(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch (e) {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) try { return JSON.parse(m[0]); } catch (e2) {}
  }
  return null;
}
module.exports = jsonSafeParse;
