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

// Query retrieves each catergory with a title, description, number of threads, and number of posts
// Thread count is DISTINCT as we only want to count the unique threads (as each post is joined to a thread causing duplicates)
// Left Join creates a row whenever the right hand table matches a row on the left table:
// - Each time a thread has a category (first join)
// - Each time a tread has a post (second join)
// This is then grouped up per category
export const findCategoriesWithThreadAndPostCount = `SELECT 
    c.id,
    c.title AS category_title,
    c.description AS category_description,
    COUNT(DISTINCT t.id) AS thread_count,
    COUNT(p.id) AS post_count
FROM 
    category c
LEFT JOIN 
    thread t ON c.id = t.category_id
LEFT JOIN 
    post p ON t.id = p.thread_id
GROUP BY 
    c.id;`;
