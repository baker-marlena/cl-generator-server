const express = require('express')
const router = express.Router()
const OktaJwtVerifier = require('@okta/jwt-verifier');
const queries = require('../queries')

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-593134.oktapreview.com/oauth2/default',
  assertClaims: {
    aud: 'api://default'
  }
});

function checkAuthToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}

router.get('/list', checkAuthToken, (req, res, next) => {
  const userEmail = req.jwt.claims.sub
  queries.getListByUser(userEmail)
  .then(list =>{
    let promises = list.map(item => {
      return queries.getItemTags(item.id)
      .then(tags => {
        item.tags = []
        tags.forEach(tag => {
          item.tags.push(tag.text)
        })
        return item
      })
    })
    Promise.all(promises)
    .then(list => {
      queries.getTagsByUser(userEmail)
      .then(tagList => {
        let uniqueTags = []
        tagList.map(tag => {
          if(!uniqueTags.find(el => {
            return el === tag.text
          })) {
            uniqueTags.push(tag.text)
          }
        })
        res.send({data: {
          list: list,
          tags: uniqueTags
        }})
      })
    })
  })
})

router.get('/:id', checkAuthToken, (req, res, next) => {
  const userEmail = req.jwt.claims.sub
  const itemId = req.params.id
  queries.getUserEmailByItemId(itemId)
  .then(user => {
    if(user[0].email === userEmail){
      queries.getItemById(itemId)
      .then(item => {
        queries.getItemTags(itemId)
        .then(tags => {
          item[0].tags = tags
          res.send({data: item[0]})
        })
      })
    } else {
      res.status(401);
      return next('Unauthorized')
    }
  })
})

router.post('/add', checkAuthToken, (req, res, next) => {
  const userEmail = req.jwt.claims.sub
  queries.getUserIdByEmail(userEmail)
  .then(id => {
    item = {
      useraccount_id: id[0].id,
      text: req.body.text,
      type: req.body.type
    }
    queries.createItem(item)
    .then(itemResponse => {
      let tagIds = req.body.tags.map(tag => {
        return queries.checkTag(tag)
        .then(tagResult => {
          if(tagResult.length === 0){
            return queries.createTag(tag)
            .then(tagInfo => {
              let entry = {
                tag_id: tagInfo.id,
                item_id: itemResponse.id
              }
              return queries.createItemTag(entry)
              .then(itemTag => {
                return true
              })
            })
          } else {
            let entry = {
              tag_id: tagResult[0].id,
              item_id: itemResponse.id
            }
            return queries.createItemTag(entry)
            .then(itemTag => {
              console.log(itemTag)
              return false
            })

          }
        })
      })
      Promise.all(tagIds)
      .then(finalResponse => {
        res.send({message: "Success!"})
      })
    })
  })
})

router.put('/:id', checkAuthToken, (req, res, next) => {
  const userEmail = req.jwt.claims.sub
  const itemId = req.params.id
  queries.getUserEmailByItemId(itemId)
  .then(user => {
    if(user[0].email === userEmail){
      let item = {
        type: req.body.type,
        text: req.body.text
      }
      queries.updateItem(item)
      .then(itemResponse => {
        queries.getItemTags(itemId)
        .then(tags => {
          let tagsText = tags.map(tag => tag.text)
          let tagsRemoved = tagsText.filter(tag => {
            return !req.body.tags.find(el => tag === el)
          })
          let tagsAdded = req.body.tags.filter(topic => {
            return !tagsText.find(el => topic === el)
          })
          let promises = tagsAdded.map(tag => {
            return queries.createTag(tag)
            .then(tagInfo => {
              console.log('new tag', tagInfo);
              let entry = {
                tag_id: tagInfo.id,
                item_id: itemId
              }
              return queries.createItemTag(entry)
              .then(itemTag => {
                console.log('join', itemTag);
                return true
              })
            })
          })
          tagsRemoved.forEach(tag => {
            promises.push(queries.deleteTag(tag))
          })
          Promise.all(promises)
          .then(response => {
            console.log('promise all', response);
            res.send({Message: 'Success!'})
          })
        })
      })
    }
  })
})

router.delete('/delete/:id', checkAuthToken, (req, res, next) => {
  const userEmail = req.jwt.claims.sub
  const itemId = req.params.id
  queries.getUserEmailByItemId(itemId)
  .then(user => {
    if(user[0].email === userEmail){
      queries.deleteItem(itemId)
      .then(response => {
        res.send({message: 'Success!'})
      })
    } else {
      res.status(401)
      return next('Unauthorized')
    }
  })
})

module.exports = router
