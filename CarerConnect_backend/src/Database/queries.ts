// Query only searches for one entry, exiting early as email is unique
export const findUserQuery = ` SELECT *
FROM public."person" AS p
WHERE p.email = $1
LIMIT 1;`;

// Query adds a new user to the database
export const addUser = `INSERT INTO public."person" (username, email, password, is_admin)
VALUES ($1, $2, $3, $4)
RETURNING username, email, is_admin;`;

// Query retrieves posts for a specific thread, returning username, content, and created_at for each post
// NOT TESTED YET!!! Works in pgAdmin
export const getPosts = `SELECT person.username, post.content, post.created_at
FROM post
INNER JOIN person ON post.user_id=person.id
WHERE post.thread_id=$1;`;
