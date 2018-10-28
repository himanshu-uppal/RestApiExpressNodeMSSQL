/*
GET /api/articles ?tag, ?author, ?favorited, ?limit, ?offset
GET /api/articles/feed
GET /api/articles/:slug
POST /api/articles
PUT /api/articles/:slug
DELETE /api/articles/:slug
POST /api/articles/:slug/comments
GET /api/articles/:slug/comments
DELETE /api/articles/:slug/comments/:id

*/

const {Router} = require('express')

const router = Router()