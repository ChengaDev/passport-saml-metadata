const assert = require('assert');
const fs = require('fs');
const path = require('path');
const fetch = require('../src/fetch');

const backupStore = new Map();

const url = 'https://cdn.rawgit.com/compwright/passport-saml-metadata/master/test/metadata.xml';
const metadata = fs.readFileSync(path.join(__dirname, 'data', 'metadata.xml')).toString();

describe('fetch()', () => {
  it('loads', () => {
    assert.equal(typeof fetch, 'function');
  });

  it('fetches metadata XML from URL', (done) => {
    fetch({ url, timeout: 1000, backupStore })
      .then((xml) => {
        assert.equal(xml, metadata);
        assert.ok(backupStore.has(url));
        done();
      })
      .catch(done);
  });

  it('fetches metadata XML from backupStore', (done) => {
    fetch({ url, timeout: 10, backupStore })
      .then((xml) => {
        assert.equal(xml, metadata);
        done();
      })
      .catch(done);
  });

  it('fails with short timeout and empty backupStore', (done) => {
    fetch({ url, timeout: 10, backupStore: new Map() })
      .then(() => {
        assert.fail('Request should not succeed');
      })
      .catch((err) => {
        assert.ok(err);
        done();
      });
  });
});
