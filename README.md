# Froyo API
## API Endpoint
All request are relative to the URL `https://froyo.social`
<br>
So, for example `/users` would refer to `https://froyo.social/users`
## Requests
### Users
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Query users | `/users` | GET | { query: { userId (optional), text (optional) } } | User |
| Get user by id | `/users/<user_ID>` | GET | None | User |
| Get user's followers and who their following | `/users/<user_ID>/connections` | GET | None | { followers, followees } |
| Get if a user is following another user by ID | `/<follower_ID>/following/<followee_ID>` | GET | None | Boolean |
| Create an account | `/users` | POST | { email, username, dob, first_name, last_name, password } | Message |
| Update your account information | `/users` | PUT | { email, username, dob, first_name, last_name, description } |  Message |
| Delete your account | `/users` | DELETE | None | Message |
### Authentication
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Check if a parameter (username, or email) is valid | `/auth/validateParameter/<parameter_type>/<value>` | GET | None | Message |
| Get reset password page with token | `/auth/reset/:token` | GET | None | HTML |
| Login | `/auth/login` | POST | { email, password } | Authentication Token |
| Request password reset email | `/auth/resetPassword` | PUT | { email } | Message |
| Reset password with token | `/auth/resetPassword/<reset_token>` | PUT | { password, confirmPassword } | Message |
### Content (Posts & Comments)
Because posts and comments are mostly similar you can request both at the same time using `/content` instead of `/posts` or `/comments`. Any command that starts with `/content` can be replaced with `/posts` or `/comments` to target that specific content type.
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Query content | `/content` | GET | None | Content |
| Get content by ID | `/content/<content_ID>` | GET | None | Content |
| Get content's comments | `/content/<content_ID>/comments` | GET | None | Array of Comments |
| Like content by ID | `/content/<content_ID>/like` | PUT | None | Content |
| Dislike content by ID | `/content/<content_ID>/dislike` | PUT | None | Content |
| Delete content by ID | `/content/<content_ID>` | DELETE | None | Message |
### Posts
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Create a new post | `/posts` | POST | { text } | Message |
| Edit a post | `/posts/<post_ID>` | PUT | { text } | Message |
### Comments
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Create a new comment | `/comments` | POST | { text, parent_id } | Message |
| Edit a comment | `/comments/<comment_ID>` | PUT | { text } | Message |
### Chats (In Development)
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Create a new chat | `/chats` | POST | { title (optional), members, expiration (optional) } | Chat |
| Update a chat | `/chats/<chat_ID>` | PUT | { title (optional), members } | Chat |
| Get a chat | `/chats/<chat_ID>` | GET | None | Chat |
| Send a message in a chat | `/chats/<chat_ID>/messages` | POST | { text } | ChatMessage |
| Update a message in a chat | `/chats/<chat_ID>/messages/<message_ID>` | PUT | { text } | ChatMessage |
| Get a message in a chat | `/chats/<chat_ID>/messages/<message_ID>` | GET | None | ChatMessage |
### Images
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Get an image by S3 bucket key | `/images/<bucket_key>` | GET | None | Image |
### Feed
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Get your account's personal feed | `/feed` | GET | None | Array of Posts |
