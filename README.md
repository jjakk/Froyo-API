# Froyo API
This is the official API for Froyo. The API can be used to automate any interactions with the social network that you would traditionally make through Froyo's mobile the app.
## Users
| GET | POST | PUT | DELETE |
|-----|------|-----|--------|
|   `/users`  |      |     |        |
### Query users
GET `/users`
### Get a user by ID
GET `/users/<user_ID>`
### Get all of a user's followers and who their following
GET `/users/<user_ID>/connections`
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
