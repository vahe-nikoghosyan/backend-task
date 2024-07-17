import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ReqresService {
  private readonly apiUrl = 'https://reqres.in/api';

  async createUser(name: string): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/users`, {
      name,
    });
    return response.data;
  }

  async getUser(userId: string): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/users/${userId}`);
    return response.data.data;
  }
}
