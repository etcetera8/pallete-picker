const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static('public'));
app.locals.title = 'Pallete Picker';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000`); 
})