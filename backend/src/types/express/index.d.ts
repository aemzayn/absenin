type User = {
  id: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
