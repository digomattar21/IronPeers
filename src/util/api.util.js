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
      }
        throw JSON.stringify(error.response.data.message)
      },
    );
  }

  async login(){

  }

  async signup(){

  }

  async signUpWithGoogle(payload){
      try {
        
        let req = await this.api.post('/auth/signupwithgoogle', payload)
        console.log(req)
        return req

      } catch (error) {
        throw error
      }
  }

  
}

export default new Api();
