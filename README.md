# Froyo API
This is the official API for Froyo. This API can be used to automate any interactions with the social network that you would traditionally make through the mobile the app.
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
| Get if a user is following another user by ID | `/<follower_ID>/following/<followee_ID>` | GET | None | boolean |
| Create an account | `/users` | POST | { email, username, dob, first_name, last_name, password } | message |
| Update your account information | `/users` | PUT | { email, username, dob, first_name, last_name, description } |  message |
| Delete your account | `/users` | DELETE | None | message |
### Authentication
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Check if a parameter (username, or email) is valid | `/auth/validateParameter/<parameter_type>/<value>` | GET | None | message |
| Get reset password page with token | `/reset/:token` | GET | None | HTML |
| Login | `/auth/login` | POST | { email, password } | Authentication Token |
| Request password reset email | `/resetPassword` | PUT | { email } | message |
| Reset password with token | `/resetPassword/<reset_token>` | PUT | { password, confirmPassword } | message |
### Content (Posts & Comments)
Because posts and comments are mostly similar you can request both at the same time using `/content` instead of `/posts` or `/comments`. Any command that starts with `/content` can be replaced with `/posts` or `/comments` to target that specific content type.
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Query content | `/content` | GET | None | Content |
| Get content by ID | `/content/<content_ID>` | GET | None | Content |
| Get content's comments | `/content/<content_ID>/comments` | GET | None | Array of Comments |
| Like content by ID | `/content/<content_ID>/like` | PUT | None | Content |
| Dislike content by ID | `/content/<content_ID>/dislike` | PUT | None | Content |
| Delete content by ID | `/content/<content_ID>` | DELETE | None | message |
### Posts
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Create a new post | `/posts` | POST | { text } | message |
| Edit a post | `/posts/<post_ID>` | PUT | { text } | message |
### Comments
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Create a new comment | `/comments` | POST | { text, parent_id } | message |
| Edit a comment | `/comments/<comment_ID>` | PUT | { text } | message |
### Images
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Get an image by S3 bucket key | `/images/<bucket_key>` | GET | None | Image |
### Feed
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Get your account's personal feed | `/feed` | GET | None | Array of Posts |
