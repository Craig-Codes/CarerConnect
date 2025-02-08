// Query only searches for one entry, exiting early as email is unique
export const findUserQuery = ` SELECT *
FROM public."person" AS p
WHERE p.email = $1
LIMIT 1;`;

// Query adds a new user to the database
export const insertUser = `INSERT INTO public."person" (username, email, password, is_admin)
VALUES ($1, $2, $3, $4)
RETURNING username, email, is_admin;`;

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

// Query retrieves each thread belonging to a particular category (by category id)
// COUNT is used to count the number of posts associated with a thread
// JOIN with category table to get category id and title
export const findThreadsByCategory = `SELECT 
    t.id, 
    t.title AS thread_title, 
    t.created_at, 
    COUNT(p.id) AS post_count,
    c.id AS category_id,
    c.title AS category_title
FROM 
    thread t
LEFT JOIN 
    post p ON t.id = p.thread_id
LEFT JOIN
    category c ON t.category_id = c.id
WHERE 
    t.category_id = $1
GROUP BY 
    t.id, t.title, t.created_at, c.id, c.title;`;

// Query retrives the details of a particular thread
export const findThreadByCategory = `SELECT 
    t.id, 
    t.title AS thread_title, 
    t.created_at, 
    COUNT(p.id) AS post_count
FROM 
    thread t
LEFT JOIN 
    post p ON t.id = p.thread_id
WHERE 
    t.category_id = $1
GROUP BY 
    t.id, t.title, t.created_at;`;

// Query retrives the details of a particular thread
export const findThreadById = `SELECT 
    t.id, 
    t.title, 
    t.created_at
FROM 
    thread t
WHERE 
    t.id = $1`;

// Query retrieves all posts belonging to a thread
export const findPostsByThread = `SELECT * FROM post WHERE thread_id = $1;`;

export const deleteThreadById = `DELETE FROM thread
WHERE id = $1;`;

export const deletePostById = `DELETE FROM post
WHERE id = $1;`;

export const deletePostByIdAndUser = `DELETE FROM post
WHERE id = $1 AND user_id = $2;`;

export const insertThread = `INSERT INTO thread (category_id, user_id, title)
VALUES ($1, $2, $3);`;

export const insertPost = `INSERT INTO post (thread_id, user_id, content)
VALUES ($1, $2, $3);`;

export const editThreadTitle = `UPDATE thread
SET title = $2
WHERE id = $1`;

export const editThreadByIdAndUser = `UPDATE thread
SET title = $3
WHERE id = $1
AND user_id = $2`;

export const editPostContent = `UPDATE post
SET content = $2
WHERE id = $1`;

export const editPostByIdAndUser = `UPDATE post
SET content = $3
WHERE id = $1
AND user_id = $2`;

// Select everythin in the events table, and an aggregated list of subscribers for the event
// Group by event.id allows the aggregation in the count, grouping results by each unique id
// Join the tables based on matching event ids in the subscription table
// Where clause ensures only future events are shown
// Order by orders the events by the closest date first
export const findAllEvents = `
  SELECT 
    event.*,
    COUNT(subscription.id) AS subscriber_count
  FROM event
  LEFT JOIN subscription ON event.id = subscription.event_id
  WHERE event.event_date > CURRENT_TIMESTAMP
  GROUP BY event.id
  ORDER BY event.event_date ASC;
`;

export const findAllEventsOnline = `
  SELECT 
    event.*,
    COUNT(subscription.id) AS subscriber_count
  FROM event
  LEFT JOIN subscription ON event.id = subscription.event_id
  WHERE event.event_date > CURRENT_TIMESTAMP
  AND event.is_online = true
  GROUP BY event.id
  ORDER BY event.event_date ASC;
`;

export const findAllEventsOffline = `
SELECT 
  event.*,
  COUNT(subscription.id) AS subscriber_count
FROM event
LEFT JOIN subscription ON event.id = subscription.event_id
WHERE event.event_date > CURRENT_TIMESTAMP
AND event.is_online = false
GROUP BY event.id
ORDER BY event.event_date ASC;
`;

// Sub query is used to count each events total subscribers
// Not only the current user as a subscriber, stopping the count from always being 1
export const findUserEventSubscriptions = `
  SELECT 
    event.*,
    (SELECT COUNT(*) FROM subscription WHERE subscription.event_id = event.id) AS subscriber_count
FROM event
LEFT JOIN subscription ON event.id = subscription.event_id
WHERE event.event_date > CURRENT_TIMESTAMP 
AND subscription.user_id = $1
GROUP BY event.id
ORDER BY event.event_date ASC;
`;

export const deleteEventById = `DELETE FROM event
WHERE id = $1;`;

export const removeEventSubscription = `DELETE FROM
subscription WHERE event_id = $1
AND user_id = $2;`;

// Return clause used to ensure we get the event id which can then be used to subscribe the creator to their event automatically
export const insertEvent = `INSERT INTO event (user_id, title, description, event_date, is_online, location, max_attendees)
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`;

export const getNumberOfEventSubscribersById = `SELECT COUNT(event_id) FROM subscription
WHERE event_id = $1;`;

export const getEventSubscribersById = `
  SELECT user_id FROM subscription
  WHERE event_id = $1;
`;

export const getEventMaxAttendeesById = `SELECT max_attendees FROM event
WHERE id = $1; `;

export const subscribeToEventById = `INSERT INTO subscription (event_id, user_id)
VALUES ($1, $2);`;

export const getEventUserId = `SELECT user_id 
FROM event
WHERE id = $1;`;

export const updateEventById = `UPDATE event
SET title=$2, description=$3
WHERE id=$1;`;
