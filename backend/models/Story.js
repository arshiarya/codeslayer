// In-memory Story model to replace Mongoose usage
let _stories = [];
let _storyId = 1;

class Query {
  constructor(results) { this._results = results || []; }
  sort(key) {
    const k = (typeof key === 'string') ? key : Object.keys(key)[0];
    const desc = String(k).startsWith('-');
    const field = desc ? k.slice(1) : k;
    this._results = this._results.slice().sort((a,b)=>{
      const av = a[field]; const bv = b[field];
      return desc ? (bv - av) : (av - bv);
    });
    return this;
  }
  populate() { return this; }
  limit(n) { this._results = this._results.slice(0, n); return this; }
  async exec(){ return this._results; }
  then(resolve){ return Promise.resolve(this._results).then(resolve); }
}

function applyUpdate(doc, update) {
  if (!doc) return null;
  if (update.$inc) {
    for (const k in update.$inc) doc[k] = (doc[k] || 0) + update.$inc[k];
  }
  if (update.$push) {
    for (const k in update.$push) {
      doc[k] = doc[k] || [];
      doc[k].push(update.$push[k]);
    }
  }
  return doc;
}

class Story {
  constructor(obj={}) { Object.assign(this, obj); }
  async save(){ if(!this._id) this._id = String(_storyId++); this.createdAt = this.createdAt || new Date(); _stories.push(this); return this; }
  static find(filter={}){ let res = _stories.slice(); if (filter.flags && filter.flags.$lt !== undefined) res = res.filter(s => (s.flags||0) < filter.flags.$lt); return new Query(res); }
  static async findById(id){ return _stories.find(s=>s._id==id) || null; }
  static async findByIdAndUpdate(id, update, options={}){ const idx = _stories.findIndex(s=>s._id==id); if(idx===-1) return null; const updated = applyUpdate(_stories[idx], update); return options && options.new? updated : _stories[idx]; }
  static async findByIdAndDelete(id){ const idx = _stories.findIndex(s=>s._id==id); if(idx===-1) return null; return _stories.splice(idx,1)[0]; }
  static async distinct(field, filter={}){ // return unique values for field
    let res = _stories.slice(); if (filter.flags && filter.flags.$lt !== undefined) res = res.filter(s => (s.flags||0) < filter.flags.$lt);
    const vals = [...new Set(res.map(r=>r[field]))]; return new Query(vals);
  }
}

export default Story;