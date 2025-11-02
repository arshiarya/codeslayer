// Lightweight in-memory Announcement model to replace Mongoose usage
// Note: This keeps announcements available in-memory after removing MongoDB.

let _announcements = [];
let _idCounter = 1;

class Query {
  constructor(results) {
    this._results = results || [];
  }
  sort(key) {
    // Support 'date' or '-date'
    const k = (typeof key === 'string') ? key : Object.keys(key)[0];
    const desc = String(k).startsWith('-');
    const field = desc ? k.slice(1) : k;
    this._results = this._results.slice().sort((a, b) => {
      return desc ? (b[field] - a[field]) : (a[field] - b[field]);
    });
    return this;
  }
  async exec() { return this._results; }
  then(resolve) { return Promise.resolve(this._results).then(resolve); }
}

class Announcement {
  constructor(obj = {}) {
    Object.assign(this, obj);
  }
  async save() {
    if (!this._id) this._id = String(_idCounter++);
    if (!this.date) this.date = new Date();
    _announcements.push(this);
    return this;
  }
  static find(filter = {}) {
    // Support simple filter by date: { date: { $gte: today } }
    let results = _announcements.slice();
    if (filter && filter.date && filter.date.$gte) {
      const g = new Date(filter.date.$gte);
      results = results.filter(a => new Date(a.date) >= g);
    }
    return new Query(results);
  }
}

export default Announcement;