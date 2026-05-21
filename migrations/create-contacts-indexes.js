/**
 * Migration: Create contacts collection with indexes
 * 
 * This migration sets up the initial contacts collection with
 * proper indexes for optimized querying and unique constraints.
 */

module.exports = {
  async up(db) {
    // Create the contacts collection
    await db.createCollection("contacts");

    // Index: Unique active email constraint
    // Ensures no two active (non-deleted) contacts share the same email
    await db.collection("contacts").createIndex(
      { email: 1, status: 1, is_deleted: 1 },
      { 
        name: "unique_active_email",
        partialFilterExpression: { 
          status: "Active", 
          is_deleted: false 
        },
        unique: true 
      }
    );

    // Index: Optimized search by name (case-insensitive)
    await db.collection("contacts").createIndex(
      { first_name: 1, last_name: 1 },
      { name: "idx_contact_name" }
    );

    // Index: Status filter + soft delete filter (frequently used together)
    await db.collection("contacts").createIndex(
      { is_deleted: 1, status: 1 },
      { name: "idx_deleted_status" }
    );

    // Index: Sorting by createdAt (default sort field)
    await db.collection("contacts").createIndex(
      { createdAt: -1 },
      { name: "idx_created_at_desc" }
    );

    console.log("✅ Migration UP: Created contacts collection with indexes");
  },

  async down(db) {
    // Drop all custom indexes
    await db.collection("contacts").dropIndex("unique_active_email").catch(() => {});
    await db.collection("contacts").dropIndex("idx_contact_name").catch(() => {});
    await db.collection("contacts").dropIndex("idx_deleted_status").catch(() => {});
    await db.collection("contacts").dropIndex("idx_created_at_desc").catch(() => {});

    // Drop the collection
    await db.collection("contacts").drop().catch(() => {});

    console.log("✅ Migration DOWN: Dropped contacts collection and indexes");
  },
};
