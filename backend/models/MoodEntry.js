// MoodEntry model removed (project uses PostgreSQL for mood tracking).
// This file keeps a minimal in-memory placeholder in case code imports it.

let _entries = [];
let _id = 1;

class MoodEntry {
  constructor(obj={}) { Object.assign(this, obj); }
  async save() {
    if (!this._id) this._id = String(_id++);
    this.createdAt = new Date();
    _entries.push(this);
    return this;
  }
  static async find(filter={}){ return _entries.slice(); }
}

export default MoodEntry;