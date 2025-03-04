/**
 * https://salsita.github.io/node-pg-migrate/getting-started
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Create event table
  pgm.createTable("event", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: '"person"(id)',
      onDelete: "CASCADE", // Delete all events related to the user if the user is deleted
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "varchar(255)",
      notNull: true,
    },
    event_date: {
      type: "timestamp",
      notNull: true,
    },
    is_online: {
      type: "boolean",
      notNull: true,
    },
    location: {
      type: "varchar(255)",
    },
    max_attendees: {
      type: "integer",
      notNull: true,
    },
  });

  // Create subscription table
  pgm.createTable("subscription", {
    id: "id",
    event_id: {
      type: "integer",
      notNull: true,
      references: '"event"(id)',
      onDelete: "CASCADE", // Delete all subscriptions related to the event if the event is deleted
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: '"person"(id)',
      onDelete: "CASCADE", // Delete all subscriptions related to the user if the user is deleted
    },
  });

  // Insert seed data for events
  pgm.sql(`
    INSERT INTO event (user_id, title, description, event_date, is_online, location, max_attendees) VALUES
    (1, 'Online Mental Health Bootcamp', 'Time to get started on making ourselves more mentally robust - together!', '2026-02-15 09:00:00', true, 'https://meet.google.com/akf-nioa-vny', 15),
    (2, 'Local Carer Meetup', 'A meetup for carers in the Stafford Area.', '2026-02-20 18:00:00', false, 'Community Hall', 10),
    (3, 'Virtual Health Seminar', 'Full of useful health advise, with a guest speaker!', '2026-02-25 14:00:00', true, 'https://meet.google.com/akf-nioa-vny', 100),
    (4, 'Coffee Morning', 'Lets get to know each other and get out of the house.', '2026-03-01 10:00:00', false, 'Central Park', 20),
    (5, 'Virtual Coffee Morning', 'It would be great to meet a few more virtual faces.', '2026-03-05 16:00:00', true, 'https://meet.google.com/akf-nioa-vny', 12);

    -- Insert seed data for subscriptions (2 per event, user IDs 1-9)
    INSERT INTO subscription (event_id, user_id) VALUES
    (1, 1), (1, 2), 
    (2, 3), (2, 4), 
    (3, 5), (3, 6), 
    (4, 7), (4, 8), 
    (5, 3), (5, 1); 
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("subscription");
  pgm.dropTable("event");
};
