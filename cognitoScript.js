const { exec } = require('child_process');
const {
  Parser,
  transforms: { unwind, flatten },
} = require('json2csv');
const fs = require('fs');

const jsonToCsvWriter = (csv) => {
  if (err) console.log('error converting', err);

  fs.writeFile('./users.csv', csv, (err) => {
    if (err) console.log('error writing');
    else console.log('saved');
  });
};

// Just change necessary fields
// npm install
// npm start
exec(
  'aws --region <region> cognito-idp list-users\
  --user-pool-id <pool id> --output\
  json > <output path>',
  (err, data) => {
    if (err) console.log(err);
    else {
      try {
        const file = require('./users.json').Users;
        const fields = [
          'Username',
          'Attributes.Name',
          'UserCreateDate',
          'UserLastModifiedDate',
          'Enabled',
          'UserStatus',
        ];
        const transforms = [unwind({ paths: ['Attributes'] })];
        const json2csvParser = new Parser({
          fields,
          transforms,
          flatten: true,
        });
        const csv = json2csvParser.parse(file);

        jsonToCsvWriter(csv);
      } catch (err) {
        console.log('error parsing', err);
      }
    }
  }
);
