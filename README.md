# Froyo API
This is the official API for Froyo. The API can be used to automate any interactions with the social network that you would traditionally make through Froyo's mobile the app.
## Users
The User is designed at follows
| Operation | URL | Method | Returns |
|--|--|--|--|
| Query users | `/users` | GET | User |
| Get user by id | `/users/<user_ID>` | GET | User |
| Get user's followers and who their following | `/users/<user_ID>/connections` | GET | { followers, followees } |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
### Get if a user is following another user by ID
GET `/<follower_ID>/following/<followee_ID>`
### Create an account
POST `/users`
### Update your account information
PUT `/users`
### Delete your account
DELETE `/users`
## Authentication
## Posts
## Comments
