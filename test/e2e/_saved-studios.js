  let paramount = {
    name: 'Paramount',
    address: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    }
  };

  let laika = {
    name: 'Laika',
    address: {
      city: 'Portland',
      state: 'OR',
      country: 'USA'
    }
  };

  function saveStudio(studio) {
    return request.post('/api/studios')
      .send(studio)
      .then(res => res.body);
  }

  // module.exports = savedStudios;