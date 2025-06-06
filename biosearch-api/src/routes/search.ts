import express from 'express'
import { mongo } from '../services/mongo'

const router = express.Router()

// Endpoint principal: /search?q=term&page=1&limit=10
router.get('/', async (req, res) => {
  const q = req.query.q?.toString() || ''
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  try {
    const results = await mongo.collection('documents').aggregate([
      {
        $search: {
          index: 'default',
          compound: {
            should: [
              { text: { query: q, path: 'title', score: { boost: { value: 3 } } } },
              { text: { query: q, path: 'abstract' } },
              { text: { query: q, path: 'authors' } },
              { text: { query: q, path: 'entities' } }
            ]
          },
          highlight: { path: ['title', 'abstract'] }
        }
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          title: 1,
          abstract: 1,
          rel_date: 1,
          authors: 1,
          categories: 1,
          score: { $meta: 'searchScore' },
          highlights: { $meta: 'searchHighlights' }
        }
      }
    ]).toArray()

    res.json({ results, page, limit })
  } catch (err) {
    console.error('Error en /search:', err)
    res.status(500).json({ error: 'Error en búsqueda' })
  }
})

// Endpoint opcional: /search/facets
router.get('/facets', async (req, res) => {
  try {
    const result = await mongo.collection('documents').aggregate([
      {
        $searchMeta: {
          index: 'default',
          facet: {
            operator: {
              compound: {
                should: [
                  { exists: { path: 'categories' } },
                  { exists: { path: 'rel_date' } },
                  { exists: { path: 'entities' } }
                ]
              }
            },
            facets: {
              categoriesFacet: { type: 'string', path: 'categories' },
              dateFacet: {
                type: 'date',
                path: 'rel_date',
                boundaries: ['2020-01-01', '2021-01-01', '2022-01-01'],
                default: 'Other'
              },
              entitiesFacet: { type: 'string', path: 'entities' }
            }
          }
        }
      }
    ]).toArray()

    res.json(result[0])
  } catch (err) {
    console.error('Error en /search/facets:', err)
    res.status(500).json({ error: 'Error obteniendo facets' })
  }
})

export default router
