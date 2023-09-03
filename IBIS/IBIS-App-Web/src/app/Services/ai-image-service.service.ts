import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiImageServiceService {
  apiUrl = 'https://api.openai.com/v1/images/generations';
  constructor(private http: HttpClient) { }


  generateImage(prompt: string, model: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + "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"); //generate key https://platform.openai.com/
    const body = {
      'model': model,
      'prompt': prompt,
      'num_images': 1,
      'size': '512x512',
      'response_format': 'url'
    };
    return this.http.post(this.apiUrl, body, { headers: headers });
  }
}


//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