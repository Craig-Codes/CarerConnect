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
  // Create category table
  pgm.createTable("category", {
    id: "id",
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "varchar(255)",
    },
  });

  // Create thread table
  pgm.createTable("thread", {
    id: "id",
    category_id: {
      type: "integer",
      notNull: true,
      references: '"category"(id)',
      onDelete: "CASCADE", // Delete all threads relating to the category if category is deleted
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: '"person"(id)',
      onDelete: "CASCADE", // Delete all threads relating to the person if person is deleted
    },
    title: {
      type: "varchar(255)",
      unique: true,
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Create post table
  pgm.createTable("post", {
    id: "id",
    thread_id: {
      type: "integer",
      notNull: true,
      references: '"thread"(id)',
      onDelete: "CASCADE", // Delete all posts relting to the thread if the tread is deleted
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: '"person"(id)',
      onDelete: "CASCADE", // Delete all posts relating to the person if the person is deleted
    },
    content: {
      type: "varchar(255)",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  // Insert seed data
  pgm.sql(`
    INSERT INTO category (title, description) VALUES
    ('General Discussion', 'Talk about anything here'),
    ('Health and Well-being', 'Support for the mental and physical health of carers'),
    ('Support and Encouragement', 'A place for emotional support and positive reinforcement'),
    ('Legal and Financial Matters', 'Navigate the legal and financial side of caregiving'),
    ('Technology for Carers', 'Discover and discuss tech tools that make caregiving easier'),
    ('Training and Resources', 'Share training opportunities and helpful resources');

    INSERT INTO thread (category_id, user_id, title, created_at) VALUES
    (1, 1, 'How Do You Manage Day-to-Day Caregiving Tasks?', current_timestamp),
    (1, 2, 'The Most Unexpected Moments of Being a Carer', current_timestamp),
    (1, 3, 'How Did You Start Your Caregiving Journey?', current_timestamp),
    (1, 1, 'What Surprised You Most About Being a Carer?', current_timestamp),
    (1, 1, 'Balancing Life and Caregiving: Whats Your Strategy?', current_timestamp),
    (2, 4, 'Dealing with Caregiver Burnout: Tips and Coping Strategies', current_timestamp),
    (2, 5, 'How Do You Stay Physically Active While Caring?', current_timestamp),
    (2, 6, 'Mental Health Challenges: How Do You Look After Yourself?', current_timestamp),
    (2, 6, 'Finding Time for Self-Care, What Works for You?', current_timestamp),
    (2, 4, 'Managing Stress: Techniques That Have Helped You', current_timestamp),
    (3, 7, 'What Keeps You Going Through Tough Days?', current_timestamp),
    (3, 8, 'A Safe Space to Share Your Feelings', current_timestamp),
    (3, 1, 'How Do You Stay Positive Despite the Challenges?', current_timestamp);

    INSERT INTO post (thread_id, user_id, content, created_at) VALUES
    (1, 2, 'I find using a calendar is vital. My partner has so many appointments and medications, following a calender keeps me on track.', current_timestamp),
    (1, 3, 'As someone also struggling with this, I would love to hear everyones ideas!', current_timestamp),
    (1, 4, 'Looking forward to discussions.', current_timestamp),
    (2, 5, 'Hi everyone!', current_timestamp),
    (2, 6, 'This is difficult to answer, but I think for me, making connections with so many other wonderful carers was unexpected when I began this journey.', current_timestamp),
    (2, 7, 'Looking for biography recommendations.', current_timestamp),
    (3, 8, 'My mom had a nasty fall aged 80. The costs began spiralling to keep her in her own home with support, so I decided to take on the extra responsibilities. It has been really hard, but so rewarding and we have become much closer.', current_timestamp),
    (3, 1, 'My wife has a chronic illness which makes it hard for her to get around.', current_timestamp);
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("post");
  pgm.dropTable("thread");
  pgm.dropTable("category");
};
