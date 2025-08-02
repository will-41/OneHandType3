declare module 'replit-auth' {
  import { RequestHandler } from 'express';
  
  interface ReplitAuthOptions {
    isOwner?: (req: any) => boolean;
  }
  
  function replitAuth(options?: ReplitAuthOptions): RequestHandler;
  
  export default replitAuth;
}
