// In-memory ChatMessage model to replace Mongoose usage
let _messages = [];
let _msgId = 1;

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
  async exec(){ return this._results; }
  then(resolve){ return Promise.resolve(this._results).then(resolve); }
}

function applyUpdate(doc, update) {
  if (!doc) return null;
  if (update.$inc) {
    for (const k in update.$inc) {
      doc[k] = (doc[k] || 0) + update.$inc[k];
    }
  }
  if (update.$push) {
    for (const k in update.$push) {
      doc[k] = doc[k] || [];
      doc[k].push(update.$push[k]);
    }
  }
  return doc;
}

class ChatMessage {
  constructor(obj={}) { Object.assign(this, obj); }
  async save() {
    if (!this._id) this._id = String(_msgId++);
    this.likes = this.likes || 0;
    this.flags = this.flags || 0;
    this.replies = this.replies || [];
    this.createdAt = this.createdAt || new Date();
    _messages.push(this);
    return this;
  }
  static find(filter={}){
    let res = _messages.slice();
    if (filter.flags && filter.flags.$lt !== undefined) {
      res = res.filter(m => (m.flags || 0) < filter.flags.$lt);
    }
    return new Query(res);
  }
  static async findByIdAndUpdate(id, update, options={}){
    const idx = _messages.findIndex(m=>m._id==id || m._id===id);
    if (idx===-1) return null;
    const updated = applyUpdate(_messages[idx], update);
    if (options && options.new) return updated;
    return _messages[idx];
  }
  static async findByIdAndDelete(id){
    const idx = _messages.findIndex(m=>m._id==id || m._id===id);
    if (idx===-1) return null;
    const removed = _messages.splice(idx,1)[0];
    return removed;
  }
  static async findById(id){ return _messages.find(m=>m._id==id || m._id===id) || null; }
}

export default ChatMessage;