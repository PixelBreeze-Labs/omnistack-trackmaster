export interface CreateOmniStackUserData {
    name: string;
    surname: string;
    email: string;
    password: string;
    external_ids?: string[];
  }
  
  export interface OmniStackUserResponse {
    id: string;
    email: string;
    name: string;
    surname: string;
    status: string;
    external_ids: string[];
  }
  