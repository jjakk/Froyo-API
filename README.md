# Froyo API
This is the official API for Froyo. The API can be used to automate any interactions with the social network that you would traditionally make through Froyo's mobile the app.
## API Endpoint
All request are relative to the URL `https://froyo.social`
<br>
So, for example `/users` would refer to `https://froyo.social/users`
## Requests
### Users
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Query users | `/users` | GET | { query: { userId (optional), text (optional) } } | User |
| Get user by id | `/users/<user_ID>` | GET | {} | User |
| Get user's followers and who their following | `/users/<user_ID>/connections` | GET | {} | { followers, followees } |
| Get if a user is following another user by ID | `/<follower_ID>/following/<followee_ID>` | GET | {} | boolean |
| Create an account | `/users` | POST | { email, username, dob, first_name, last_name, password } | message |
| Update your account information | `/users` | PUT | { email, username, dob, first_name, last_name, description } |  message |
| Delete your account | `/users` | DELETE | {} | message |
### Authentication
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Check if a parameter (username, or email) is valid | `/auth/validateParameter/<parameter_type>/<value>` | GET | {} | message |
| Get reset password page with token | `/reset/:token` | GET | {} | HTML |
| Login | `/auth/login` | POST | { email, password } | Authentication Token |
| Request password reset email | `/resetPassword` | PUT | { email } | message |
| Reset password with token | `/resetPassword/<reset_token>` | PUT | { password, confirmPassword } | message |
### Content (Posts & Comments)
Because posts and comments are mostly similar you can request both at the same time using `/content` instead of `/posts` or `/comments`. Any command that starts with `/content` can be replaced with `/posts` or `/comments` to target that specific content type.
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Query content | `/content` | GET | {} | Post or Comment |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
