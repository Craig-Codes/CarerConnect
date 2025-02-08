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
  pgm.createTable("person", {
    id: "id",
    username: {
      type: "varchar(50)",
      unique: true,
      notNull: true,
    },
    email: {
      type: "varchar(75)",
      unique: true,
      notNull: true,
    },
    password: {
      // bcrpyt hash is always 60 characters long
      type: "varchar(75)",
      notNull: true,
    },
    is_admin: {
      type: "boolean",
      notNull: true,
    },
  });

  //user
  pgm.sql(`
    INSERT INTO person (username, email, password, is_admin) VALUES 
    ('Frank Castle', 'user1@example.com', '$2a$10$6iEheK9tIZaibXoEVhS48.EqPdfqT2oSWrD8UIA8gWs6pgCVvxOI6',  false),
    ('Craig Adam', 'user2@example.com', '$2a$10$3ZEjOVx2g6CREp9ozUfhoup20fNZbH.OzvVFLqW/0lr2ulE2gi8XC',  true),
    ('Natasha Romanov', 'user3@example.com', '$2a$10$0CBdAO24WOO092IlZyD3suhk/gIT2dZ9XNXKOoEVlQinRfM6tKOaC',  true),
    ('Peter Parker', 'user4@example.com', '$2a$10$2O0pVD3G12kSV4s2B.Ji4uQOADC4N77KPyhqHSGC9Qwzva1MJOJh6', false),
    ('Wade Wilson', 'user5@example.com', '$2a$10$ga6PHySPk0pmE46HWI0HaeSHl.CdfH.oF4MMPv/3CsAydh/OUzl52',  true),
    ('Nick Fury', 'user6@example.com', '$2a$10$4q1F8LJnO5Xs/vp0JqLCY.ZKIQgz1hz9wbFh5TJxA0ZcXYao5pyXy',  true),
    ('Tony Stark', 'user7@example.com', '$2a$10$JWp82Y0q8BQfW8zIh8ui6eW3nDMHqASV5KuLgLu4uOrJZZiqlnzgq',  false),
    ('Steve Rogers', 'user8@example.com', '$2a$10$2.cLs61XXGYuzg9awH8dSenLf5GQG2nrbeYWDYpDqymXmv4Zi58VW',  false)
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
