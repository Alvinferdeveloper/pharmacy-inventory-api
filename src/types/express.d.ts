declare global {
  namespace Express {
    interface User {
      idUser: number;
      identification: string;
      name: string;
      roles: string[];
      mustChangePassword: boolean;
      email: string;
      phone: string;
    }

    interface Request {
      user: User; // así tipas req.user
    }
  }
}

// Make this file a module so TypeScript includes the global augmentation reliably
export {};