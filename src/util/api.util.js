import axios from 'axios';

class Api {
  constructor() {
    this.api = axios.create({
      // baseURL: 'https://betmaker-api.herokuapp.com',
      baseURL:'http://localhost:3080'
    });

    this.api.interceptors.request.use(config => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        config.headers.Authorization = `Bearer ${token}`;
    }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
         if (error.response.data.message!=='"Token inválido ou expirado"' && error.response.data.message!=="Token inválido ou expirado" && error.response.data.message!=='"req sem token' && error.response.data.message!=="req sem token"){
          throw JSON.stringify(error.response.data.message)
         }
      }
        
      },
    );
  }

  async login(payload){
    try {
      let request  = await this.api.post('/auth/login', payload);
      console.log('req', request);
      localStorage.setItem('token', request.data.token);
      return request
    } catch (error) {
      console.log(error);
    }
  }

  async signup(payload){
    let request = await this.api.post('/auth/signup', payload);
    console.log(request)
    localStorage.setItem('token', request.data.token);
    return request.data.token;
  }

  async confirmCode(payload) {
    try {
      let req = await this.api.post('/auth/confirm', payload);
      return req;
    } catch (error) {
      console.log(error);
    }
  }

  async signout(){

  }

  async signUpWithGoogle(payload){
      try {
        
        let req = await this.api.post('/auth/signupwithgoogle', payload);
        req.data.token && localStorage.setItem('token', req.data.token)
        return req

      } catch (error) {
        throw error
      }
  }

  async addGlobalChannel(payload){
    try {
      let req = await this.api.post('/channels/createglobal', payload)
      return req
    } catch (error) {
      throw error
    }
  }

  async bookMarkMessage(payload){
    try {
      let req = await this.api.post('/channels/bookmarkmessage', payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async getChannelBookMarkedMessages(channelId){
    try {
      let req = await this.api.get(`/channels/getbookmarkedmessages/${channelId}`);
      return req.data;
    } catch (error) {
      throw error
    }

  }

  async addUserBookMark(payload) {
    try {
      let req = await this.api.post('/user/adduserbookmark', payload);
      console.log(req)
      return req
    } catch (error) {
      throw error
    }
  }

  async getUserBookmarks(email){
    try {
      let req = await this.api.post('/user/getuserbookmarks', {email: email})
      return req.data
    } catch (error) {
      throw error
    }
  }

  async logout (){
    try{
      localStorage.removeItem('token')
      return true
    }catch(err){
      console.log(err.message)
    }
  }

  async pinMessage(payload){

    try {
      let req = await this.api.post('/channel/pinmessage', payload)
      return req
    } catch (error) {
      throw error
    }

  }

  async getPinnedMessages(channelId){
    try { 
      let req = await this.api.get(`/channels/getpinnedmessages/${channelId}`);
      return req
    } catch (error) {
      throw error
    }

  }

  
}

export default new Api();
