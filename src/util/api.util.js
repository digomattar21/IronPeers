import axios from "axios";
import { auth } from "../firebase";

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://ironpeersapi.herokuapp.com',
      // baseURL: 'http://localhost:3080'
    });

    this.api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        config.headers ={
          Authorization: `Bearer ${token}`
        };
        console.log(token)
        return config;
    });

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // auth.signOut()
          // window.location='/'
          throw JSON.stringify(error.response.data.message);
          // console.log(error)
        }
      }
    );
  }


  async signUpWithEmail(payload){
    try {
      let req = await this.api.post('/auth/signup/email', payload);
      req.data && localStorage.setItem('token', req.data.token)
      return req
    } catch (error) {
      throw error
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

  async setToken(payload){
    try {
      let req = await this.api.post('/private/signin/email', payload);
      localStorage.setItem("token", req.data.token)
      return req
    } catch (error) {
      throw error
    }
  }

  

  async signUpWithGoogle(payload) {
    try {
      let req = await this.api.post("/auth/signup/google", payload);
      console.log(req)
      console.log(req.data.token)
      localStorage.setItem("token", req.data.token);
      return req;
    } catch (error) {
      console.log('erro', error)
      throw error;
    }
  }

  async getUserInfo(){
    try{
      let req = await this.api.get('/private/user/getinfo')
      return req
    }catch(err){
      console.log(err)
    }
  }

  async addGlobalChannel(payload) {
    try {
      let req = await this.api.post("/private/channels/createglobal", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async addPrivateChannel(payload) {
    try {
      let req = await this.api.post("/private/channels/createprivate", payload);
      return req
    } catch (error) {
      throw error;
    }
  }

  async getPrivateChannelPinnedMessages(payload) {
    try {
      let req = await this.api.post(`/private/channels/private/getpinnedmessages`, payload);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async bookMarkMessage(payload) {
    try {
      let req = await this.api.post("/private/channels/bookmarkmessage", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async bookMarkPrivateMessage(payload) {
    try {
      let req = await this.api.post("/private/channels/private/bookmarkmessage", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }


  async getChannelBookMarkedMessages(channelId) {
    try {
      let req = await this.api.get(
        `/private/channels/getbookmarkedmessages/${channelId}`
      );
      return req.data;
    } catch (error) {
      throw error;
    }
  }

  async addUserBookMark(payload) {
    try {
      let req = await this.api.post("/private/user/adduserbookmark", payload);
      console.log(req);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async addPrivateUserBookMark(payload){
    try {
      let req = await this.api.post("/private/user/adduserprivatebookmark", payload);
      console.log(req);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getUserBookmarks(email) {
    try {
      let req = await this.api.post("/private/user/getuserbookmarks", { email: email });
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
      let req = await this.api.post("/private/channel/pinmessage", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }
  async pinPrivateMessage(payload) {
    try {
      let req = await this.api.post("/private/channel/private/pinmessage", payload);
      return req;
    } catch (error) {
      throw error;
    }
  }
  

  async getPinnedMessages(channelId) {
    try {
      let req = await this.api.get(`/private/channels/getpinnedmessages/${channelId}`);
      return req;
    } catch (error) {
      throw error;
    }
  }

  async getChannelMembersLength(channelId){
    try {
      let req = await this.api.get(`/private/channels/getchannelmemberslength/${channelId}`);
      return req;
    } catch (error) {
      throw error;
    }
  };

  async getPrivateChannelMembersLength(channelId){
    try {
      let req = await this.api.get(`/private/channels/private/getchannelmemberslength/${channelId}`);
      return req;
    } catch (error) {
      throw error;
    }
  };

  async userJoinChannel(payload){
    try {
        let req = await this.api.post('/private/user/joinchannel', payload);
        console.log(req);
        return req

    } catch (error) {
      throw error
    }
  }

  async getUserChannels(payload){
    try {
      let req = await this.api.post('/private/user/getuserchannels',payload)
      return req
    } catch (error) {
      throw error
    }
  }

  async setFavoriteChannel(payload){
    try {
      let req = await this.api.post('/private/user/setfavoritechannel', payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async sendPrivateChannelInvite(payload) {

    try {
      let req = await this.api.post('/private/user/sendprivatechannelinvite', payload);
      return req

    } catch (error) {
      throw error;
    }

  }

  async getUserInboxInfo(payload){
    try {
        let req = await this.api.post('/private/user/inbox/getinfo', payload)
        return req
    } catch (error) {
      throw error
    }
  }

  async getInviteInfo(payload){
    try {
      let req = await this.api.post('/private/user/invites/getinfo', payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async userJoinPrivateChannel(payload){
    try {
      let req = await this.api.post('/private/user/channel/private/joinprivatechannel', payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async deleteInvite(payload){
    try {
      return await this.api.post('/private/user/invite/deleteone', payload);
    } catch (error) {
      throw error
    }
  }

  async setUnreadFalse(payload){
    try {
      let req = await this.api.post('/private/user/inbox/sethasunreadfalse', payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async removeBookmarkedMessage(payload){
    try {
      let req = await this.api.post('/private/user/removebookmarkedmessage', payload);
      console.log(req)
      return req
    } catch (error) {
      throw error
    }
  }

  async getChannelMembers(payload){
    try {
      let req = await this.api.post('/private/channel/getmembers',payload);
      console.log(req)
      return req
    } catch (error) {
      throw error
    }
  }

  async getMemberInfo(payload){
    try {
      let req = await this.api.post('/private/channel/getmembersinfo',payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async searchForUser(payload){
    try {
      let req = await this.api.post('/private/directmessage/searchforuser',payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async addNewDm(payload){
    try {
      let req = await this.api.post('/private/directmessage/createnew', payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async sendDmRequest(payload){
    try {
      let req = await this.api.post('/private/directmessage/senddmrequest', payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async checkDelete(payload) {
    try {
      let req = await this.api.post('/private/channel/checkdeletemessage', payload)
      return req
    } catch (error) {
      throw error
    }
  }

  async getUserProfile(payload){
    try {
      let req = await this.api.post('/private/user/getprofile', payload)
      return req
    } catch (error) {
      throw error
    }

  }

  async addNewAbility(payload){
    try {
      let req = await this.api.post('/private/user/profile/addnewability', payload)
      return req
    } catch (error) {
      throw error
    }
  }

  async deleteUserAbility(payload){
    try {
      let req = await this.api.post('/private/user/profile/deleteability', payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async getUserEmail(payload){
    try {
      let req = await this.api.post('/private/user/getemail', payload);
      return req
    } catch (error) {
      throw error
    }
  }

  async setNewBio(payload){
    try {
        let req = await this.api.post('/private/user/profile/setnewbio', payload);
        return req
    } catch (error) {
      throw error
    }
  }

  async mainSearch(payload){
    try{
      let req = await this.api.post('/private/mainsearch', payload);
      return req
    }catch(err){
      throw err
    }
  }

}

export default new Api();
