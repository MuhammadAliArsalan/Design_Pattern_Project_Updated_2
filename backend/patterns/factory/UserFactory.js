/**
 * FACTORY PATTERN — UserFactory
 *
 * Encapsulates the creation logic for different user account types
 * (Student, Instructor, Admin).  Controllers call the factory instead
 * of hard-coding the "approved" flag and default-image logic.
 *
 * Adding a new account type only requires a change here — controllers
 * stay untouched.
 */

const User = require('../../models/user');
const Profile = require('../../models/profile');
const bcrypt = require('bcrypt');

class UserFactory {
  /**
   * Creates a blank additional-details (Profile) document and returns
   * its _id so the caller can link it to the User.
   */
  static async _createProfile() {
    return Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
  }

  /**
   * Centralised password hashing so the salt rounds are defined once.
   */
  static async _hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  /**
   * Returns a default avatar URL using DiceBear.
   */
  static _defaultAvatar(firstName, lastName) {
    return `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
  }

  // ── Core factory method ────────────────────────────────────────────

  /**
   * @param {'Student'|'Instructor'|'Admin'} accountType
   * @param {object} data  – { firstName, lastName, email, password, contactNumber }
   * @returns  Newly created User document
   */
  static async createUser(accountType, data) {
    const { firstName, lastName, email, password, contactNumber } = data;

    const hashedPassword = await UserFactory._hashPassword(password);
    const profileDetails = await UserFactory._createProfile();

    const config = UserFactory._getAccountConfig(accountType);

    return User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
      accountType,
      additionalDetails: profileDetails._id,
      approved: config.approved,
      image: UserFactory._defaultAvatar(firstName, lastName),
    });
  }

  /**
   * Returns account-type-specific configuration.
   * Instructors require admin approval; students and admins are auto-approved.
   */
  static _getAccountConfig(accountType) {
    const configs = {
      Student:    { approved: true },
      Instructor: { approved: false },  // requires admin approval
      Admin:      { approved: true },
    };

    const config = configs[accountType];
    if (!config) {
      throw new Error(`Unknown accountType: "${accountType}". ` +
        `Valid types are: ${Object.keys(configs).join(', ')}`);
    }
    return config;
  }
}

module.exports = UserFactory;
