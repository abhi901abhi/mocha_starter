const assert = require('assert');
const transposeOperations = require('./transposeOperations.js');
const data = require('./data.json')

data.forEach((item, index) => {
    it(`test${index + 1}`, () => {
        assert.equal(transposeOperations
            .transposer(
                item.input.sku,
                item.input.requisition,
                item.input.legalEntitySetting
            ),
            item.output);
    });
});
