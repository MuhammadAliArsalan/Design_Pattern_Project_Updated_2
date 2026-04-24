/**
 * REPOSITORY PATTERN — BaseRepository
 *
 * Provides generic CRUD operations that every concrete repository
 * inherits.  Controllers depend on the repository interface, never on
 * Mongoose directly — making the data layer swappable and the
 * controllers unit-testable without a real DB.
 */

class BaseRepository {
  /**
   * @param {import('mongoose').Model} model  Mongoose model to operate on
   */
  constructor(model) {
    this._model = model;
  }

  // ── Read ──────────────────────────────────────────────────────────

  async findById(id, populateOptions = null) {
    let query = this._model.findById(id);
    if (populateOptions) query = query.populate(populateOptions);
    return query.exec();
  }

  async findOne(filter, populateOptions = null) {
    let query = this._model.findOne(filter);
    if (populateOptions) query = query.populate(populateOptions);
    return query.exec();
  }

  async findAll(filter = {}, projection = {}, populateOptions = null, sortOptions = null) {
    let query = this._model.find(filter, projection);
    if (populateOptions) query = query.populate(populateOptions);
    if (sortOptions)     query = query.sort(sortOptions);
    return query.exec();
  }

  // ── Write ─────────────────────────────────────────────────────────

  async create(data) {
    return this._model.create(data);
  }

  async updateById(id, update, options = { new: true }) {
    return this._model.findByIdAndUpdate(id, update, options);
  }

  async updateOne(filter, update, options = { new: true }) {
    return this._model.findOneAndUpdate(filter, update, options);
  }

  async deleteById(id) {
    return this._model.findByIdAndDelete(id);
  }

  async deleteOne(filter) {
    return this._model.findOneAndDelete(filter);
  }

  // ── Utility ───────────────────────────────────────────────────────

  async exists(filter) {
    const doc = await this._model.findOne(filter).select('_id').lean();
    return !!doc;
  }

  async count(filter = {}) {
    return this._model.countDocuments(filter);
  }
}

module.exports = BaseRepository;
