let expect = require('expect');

let {generateMessage} = require('./message');

describe('Generate Message', () => {
  it("Should generate correct message object", ()=>{
    let from = "Text",
        text = "randomtext",
        message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number'); // datum till nummer
    expect(message).toMatchObject({from, text})

  });
});
