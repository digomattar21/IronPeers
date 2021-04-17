import axios from "axios";

class Api {
  constructor() {
    this.api = axios.create({
      // baseURL: 'https://betmaker-api.herokuapp.com',
      baseURL: "http://localhost:3080",
    });

    this.api.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          if (
            error.response.data.message !== '"Token inválido ou expirado"' &&
            error.response.data.message !== "Token inválido ou expirado" &&
            error.response.data.message !== '"req sem token' &&
            error.response.data.message !== "req sem token" 
          ){
            throw JSON.stringify(error.response.data.message);
          }else{
            console.log(error.response.data.message)
          }
        }
      }
    );
  }

  async login(payload) {
    try {
      let request = await this.api.post("/auth/login", payload);
      console.log("req", request);
      localStorage.setItem("token", request.data.token);
      return request;
    } catch (error) {
      throw error;
    }
  }

  async signup(payload) {
    try {
      let request = await this.api.post("/auth/signup", payload);
      localStorage.setItem("token", request.data.token);
      return request.data.token;
    } catch (err) {
      throw err;
    }
  }

  async confirmCode(payload) {
    try {
      let req = await this.api.post("/auth/confirm", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async signout() {

  }

  async signUpWithGoogle(payload) {
    try {
      let req = await this.api.post("/auth/signupwithgoogle", payload);
      req.data.token && localStorage.setItem("token", req.data.token);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getUserInfo(){
    try{
      let req = await this.api.get('/user/getinfo')
      return req
    }catch(err){
      console.log(err)
    }
  }

  async addGlobalChannel(payload) {
    try {
      let req = await this.api.post("/channels/createglobal", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async addPrivateChannel(payload) {
    try {
      let req = await this.api.post("/channels/createprivate", payload);
      return req
    } catch (error) {
      throw error;
    }
  }

  async getPrivateChannelPinnedMessages(channelId) {
    try {
      let req = await this.api.get(`/channels/private/getpinnedmessages/${channelId}`);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async bookMarkMessage(payload) {
    try {
      let req = await this.api.post("/channels/bookmarkmessage", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async bookMarkMessage(payload) {
    try {
      let req = await this.api.post("/channels/private/bookmarkmessage", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }


  async getChannelBookMarkedMessages(channelId) {
    try {
      let req = await this.api.get(
        `/channels/getbookmarkedmessages/${channelId}`
      );
      return req.data;
    } catch (error) {
      throw error;
    }
  }

  async addUserBookMark(payload) {
    try {
      let req = await this.api.post("/user/adduserbookmark", payload);
      console.log(req);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getUserBookmarks(email) {
    try {
      let req = await this.api.post("/user/getuserbookmarks", { email: email });
      return req.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      localStorage.removeItem("token");
      return true;
    } catch (err) {
      throw err;
    }
  }

  async pinMessage(payload) {
    try {
      let req = await this.api.post("/channel/pinmessage", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }
  async pinPrivateMessage(payload) {
    try {
      let req = await this.api.post("/channel/private/pinmessage", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }
  

  async getPinnedMessages(channelId) {
    try {
      let req = await this.api.get(`/channels/getpinnedmessages/${channelId}`);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getChannelMembersLength(channelId){
    try {
      let req = await this.api.get(`/channels/getchannelmemberslength/${channelId}`);
      return req;
    } catch (error) {
      throw error;
    }
  };

  async userJoinChannel(payload){
    try {
        let req = await this.api.post('/user/joinchannel', payload);
        console.log(req);
        return req

    } catch (error) {
      throw error
    }
  }

  async getUserChannels(payload){
    try {
      let req = await this.api.post('/user/getuserchannels',payload)
      return req
    } catch (error) {
      throw error
    }
  }

  async setFavoriteChannel(payload){
    try {
      let req = await this.api.post('/user/setfavoritechannel', payload);
      return req
    } catch (error) {
      throw error
    }
  }


}

export default new Api();
