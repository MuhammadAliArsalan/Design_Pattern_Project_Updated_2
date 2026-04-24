/**
 * OBSERVER PATTERN — EventManager
 *
 * A generic pub/sub hub.  Any part of the system can:
 *   • subscribe(event, observer)  — register an observer
 *   • unsubscribe(event, observer)
 *   • notify(event, data)         — broadcast to all subscribers
 *
 * This decouples the payment controller from email-sending and
 * progress-tracking logic.  Adding a new side-effect (e.g. a push
 * notification) requires zero changes to the payment controller.
 */

class EventManager {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._listeners = new Map();
  }

  subscribe(event, observer) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(observer);
    console.log(`👂 Observer subscribed to "${event}"`);
  }

  unsubscribe(event, observer) {
    this._listeners.get(event)?.delete(observer);
  }

  /**
   * Fires all observers for the event, in parallel.
   * Errors inside individual observers are caught and logged so one
   * failing observer never prevents the others from running.
   */
  async notify(event, data) {
    const observers = this._listeners.get(event);
    if (!observers || observers.size === 0) return;

    console.log(`📣 Notifying ${observers.size} observer(s) for "${event}"`);

    await Promise.all(
      [...observers].map(async (observer) => {
        try {
          await observer(data);
        } catch (err) {
          console.error(`❌ Observer error on event "${event}":`, err.message);
        }
      })
    );
  }
}

// Export a single shared instance so the whole app uses the same bus
const eventManager = new EventManager();
module.exports = eventManager;
