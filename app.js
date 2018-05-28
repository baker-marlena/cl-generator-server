const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const queries = require('./queries')

const app = express();

app.use(cors());
app.use(bodyParser.json());

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

app.get('/list', checkAuthToken, (req, res, next) => {
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

app.post('/add', checkAuthToken, (req, res, next) => {
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
                console.log(itemTag);
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

app.listen(process.env.PORT || 3000);
