# Froyo API
This is the official API for Froyo. The API can be used to automate any interactions with the social network that you would traditionally make through Froyo's mobile the app.
## API Endpoint
All request are relative to the URL `https://froyo.social`
<br>
So, for example `/users` would refer to `https://froyo.social/users`
## Users
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Query users | `/users` | GET | { query: { userId (optional), text (optional) } } | User |
| Get user by id | `/users/<user_ID>` | GET | {} | User |
| Get user's followers and who their following | `/users/<user_ID>/connections` | GET | {} | { followers, followees } |
| Get if a user is following another user by ID | `/<follower_ID>/following/<followee_ID>` | GET | {} | boolean |
| Create an account | `/users` | POST | { email, username, dob, first_name, last_name, password } | message |
| Update your account information | `/users` | PUT | { email, username, dob, first_name, last_name, description } |  message |
| Delete your account | `/users` | DELETE | {} | message |
## Authentication
| Operation | URL | Method | Request Body | Returns |
|--|--|--|--|--|
| Login | `/auth/login` | POST | { email, password } | Authentication Token |
| Check if a parameter (username, or email) is valid | `/auth/validateParameter/<parameter_type>/<value>` | GET | {} | message |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
## Posts
## Comments
