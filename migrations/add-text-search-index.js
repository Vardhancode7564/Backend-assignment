/**
 * Migration: Add text index for full-text search on contacts
 * 
 * This migration adds a MongoDB text index on first_name, last_name,
 * and email fields to support efficient text-based searching.
 */

module.exports = {
  async up(db) {
    // Text index for full-text search capability
    await db.collection("contacts").createIndex(
      { first_name: "text", last_name: "text", email: "text" },
      { name: "idx_contact_text_search", weights: { first_name: 3, last_name: 2, email: 1 } }
    );

    console.log("✅ Migration UP: Added text search index on contacts");
  },

  async down(db) {
    await db.collection("contacts").dropIndex("idx_contact_text_search").catch(() => {});

    console.log("✅ Migration DOWN: Removed text search index from contacts");
  },
};
