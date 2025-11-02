// Minimal in-memory User model to replace Mongoose
let _users = [];
let _userId = 1;

class User {
  constructor(obj={}) { Object.assign(this, obj); }
  async save(){ if(!this._id) this._id = String(_userId++); this.updatedAt = new Date(); _users.push(this); return this; }
  static async find(query = {}, fields){
    // Support simple {_id: { $in: [...] }}
    if (query._id && query._id.$in) {
      const ids = query._id.$in.map(String);
      return _users.filter(u => ids.includes(String(u._id))).map(u => ({ _id: u._id, avatarUrl: u.avatarUrl }));
    }
    return _users.slice();
  }
  static async findById(id){ return _users.find(u => String(u._id) === String(id)) || null; }
}

export default User;