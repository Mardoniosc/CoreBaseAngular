const proxy = [
    {
      context: '/api',
      target: 'https://services.labtecnisys.com.br',
      pathRewrite: {'^/api' : ''}
    }
  ];

  module.exports = proxy;
