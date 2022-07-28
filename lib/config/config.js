const $CONFIG = {  
  baseUrl : '/',
  startPage : '/app/dashboard',
  loginUrl : '/login',
  authMethod: 'autenticarUsuarioNavegador',  
  userToken : sessionStorage.getItem('accessToken'),
  permissionMatrix : sessionStorage.getItem('permissionMatrix'),
}